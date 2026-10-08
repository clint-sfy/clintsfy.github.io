---
title: Plugin 注册与生命周期
author: 阿源
date: 2026/10/08
categories: [Agent 开发]
tags: [Plugin, Registration, Lifecycle, Composition]
status: 正文
chapter: 07
---

# Plugin 注册与生命周期

## 学习目标

- 把 Plugin 理解为可组合的生命周期单元，而不是“装了几个 Tool 的文件夹”。
- 还原声明、依赖检查、注册、就绪、失败回滚、禁用和卸载的状态流转。
- 用本地 Host 模拟 disposer 和失败回滚，并建立阅读 Cordis/DeepSeek Harness Plugin 的入口。

## 前置知识

- 已完成 [Skill 发现、匹配、加载与卸载](./03-Skill发现匹配加载与卸载) 和 [Skill 指令、资源与脚本](./04-Skill指令资源与脚本)。
- 已了解第 04 章 Tool Registry、第 05 章 Session 生命周期和第 06 章 MCP 初始化/关闭。
- `Dependency Injection` 与能力容器的细节见[下一篇](./06-Dependency-Injection与能力容器)。

## Plugin 的结构与状态

### Plugin Manifest：声明装配意图

**Plugin Manifest** 描述稳定名称、版本、入口、配置 schema、依赖和能力声明。它用于发现和预检，不应把“声明了能力”当成“能力已经注册或已获授权”。

用途：在加载代码前发现缺少依赖、重复名称和不兼容版本，减少半装配状态。

### Registration：把能力挂进宿主

**Registration** 是 Plugin 在宿主 Context 中创建的具体绑定，例如注册 Service、Tool、Skill Provider、Hook 或配置项。注册应返回 disposer 或 effect，使宿主能精确撤销这一次绑定。

用途：将“包存在”与“本次 composition 已生效”分开，支持 scope、测试和热重载。

### Lifecycle：状态而不是一串回调

**PluginLifecycle** 至少包含 declared、checking、applying、ready、failed、disabled 和 disposed 等可观察状态。实现可以合并状态，但必须能解释当前能力是否可见、是否可调用和谁负责清理。

### Rollback：失败时撤销已成功的部分

当 Plugin 注册了两个 Service 后第三个依赖失败，宿主应按逆序撤销前两个绑定，避免“加载失败但工具仍暴露”。回滚本身也可能失败，需要记录原始错误与清理错误，不能静默吞掉。

### 白话理解：搬入工作室并留下退场清单

Plugin 像一间搬进宿主的工作室：先核对钥匙和水电（依赖），再把设备接上（注册），全部可用后才开门营业（ready）；中途发现设备缺失，就按相反顺序拆走已经接好的设备（rollback）。

## 生命周期数据流

```mermaid
stateDiagram-v2
    [*] --> Declared: 读取 manifest
    Declared --> Checking: 校验配置/版本/权限
    Checking --> Failed: 依赖缺失或策略拒绝
    Checking --> Applying: 检查通过
    Applying --> Applying: 注册 Service/Tool/Skill/Hook
    Applying --> Ready: 所有 effect 成功
    Applying --> RollingBack: 注册失败
    RollingBack --> Failed: 清理完成并记录原因
    Ready --> Disabled: 配置禁用
    Disabled --> Applying: 重新启用
    Ready --> Disposing: unload / scope 结束
    Disabled --> Disposing: unload
    Disposing --> Disposed: disposer 逆序完成
    Failed --> Disposing: 清理部分注册
    Disposed --> [*]

    note right of Applying
      每个注册都要绑定 owner
      和可调用的 disposer
    end note
```

阅读提示：只有 `Ready` 才表示全部注册完成；`Failed` 仍可能需要回滚，`Disabled` 不是 `Disposed`，因为禁用可以保留配置并再次启用。

## 一个带回滚的本地 Host

下面的代码用标准库模拟 Plugin 的注册、失败回滚和卸载。每个安装动作都返回清理函数，故意让第三个动作失败以展示宿主如何撤销已完成的前两步。

```python
from dataclasses import dataclass, field
from typing import Callable


@dataclass
class Host:
    services: list[str] = field(default_factory=list)
    _effects: list[Callable[[], None]] = field(default_factory=list)

    def effect(self, install: Callable[[], Callable[[], None]]) -> None:
        disposer = install()
        self._effects.append(disposer)

    def dispose(self) -> None:
        for disposer in reversed(self._effects):
            disposer()
        self._effects.clear()


def install_plugin(host: Host) -> str:
    host.effect(lambda: (host.services.append("skill"), lambda: host.services.remove("skill"))[1])
    host.effect(lambda: (host.services.append("tool"), lambda: host.services.remove("tool"))[1])

    def failing_install() -> Callable[[], None]:
        raise RuntimeError("missing dependency: audit")

    host.effect(failing_install)
    return "ready"


host = Host()
try:
    install_plugin(host)
except RuntimeError as error:
    print(type(error).__name__, str(error))
    host.dispose()
print(host.services)

host.effect(lambda: (host.services.append("temporary"), lambda: host.services.remove("temporary"))[1])
print(host.services)
host.dispose()
print(host.services)
# 输出：RuntimeError missing dependency: audit
# 输出：[]
# 输出：['temporary']
# 输出：[]
```

示例把回滚调用写在异常处理处；真实 Host 应在一次 composition transaction 中自动执行逆序清理，并为已失败的 disposer 继续记录诊断。

### `apply(ctx)`：声明式入口而非全部语义

许多插件系统用 `apply(ctx)` 或相似函数把能力挂入 Context。这个函数只说明装配入口；真正的生命周期还包括依赖等待、scope、配置变更、错误传播和 dispose。看到 `apply` 不代表它是行业标准 API。

### Enabled/Disabled：配置状态与资源状态分离

禁用通常意味着不再对新调用提供能力，但不一定删除 manifest 或持久化配置。停用时要先阻断新请求，再等待或取消在途任务，最后撤销监听器和服务；重新启用应重新检查依赖和权限。

### Hot Reload：重新装配而不是覆盖全局对象

热重载应通过稳定 ID 区分“同一个 entry 的新代码”和“旧 entry 删除”，先 dispose 旧 effect 再 apply 新实例。直接覆盖全局注册表容易留下旧监听器、缓存和后台任务。

### Plugin Error：失败传播要有策略

必需 Plugin 失败可以阻止 Host 启动；可选 Plugin 失败可以被隔离并继续，但用户应看到能力不可用和原因。无论策略是什么，都不应把半注册状态当成 ready。

## 源码阅读心智模型

### DeepSeek Harness/Cordis：看 composition、effect 和 scope

DeepSeek Harness 用 Cordis 作为组合基础，并把产品功能映射为 Plugin 注册的 Service、Tool、Hook 或事件监听。阅读时先找 profile/config 如何形成 composition，再看 `apply(ctx)` 注册了什么，最后追 `ctx.effect`、`ctx.on` 或对应 disposer 如何在 scope 销毁时清理。

官方 Cordis 教程强调事件监听器和注册都随 Plugin effect 消失，官方组合文档也把“每个注册都是 `ctx.effect`”作为热重载可行的基础。具体 API 以当前仓库为准。

### OpenAI Agents SDK：对照 Runner 装配

OpenAI Agents SDK 的 Agent、Runner、Tool、Guardrail 和 Tracing 可能由应用代码组合，但未必拥有同样的 Plugin 安装生命周期。查找配置创建和 Run 结束清理，确认哪些对象是一次性 Agent 配置、哪些是长期宿主 Service。

### MCP：连接生命周期不等于 Plugin 生命周期

Plugin 可以创建 MCP Client/Server 连接，但 initialize、transport close 和宿主 unload 仍是不同层级。连接断开不一定卸载 Plugin；Plugin 被禁用也不一定删除远端配置。

### 读源码的五个断点

1. Manifest 如何解析和校验？
2. 依赖在 apply 前如何等待或排序？
3. 每次注册的 owner 和 disposer 存在哪里？
4. 一个中途失败会撤销什么，哪些错误会阻止 Host 启动？
5. disable、reload、dispose 是否能处理在途任务和重复监听？

## 易混点

- **安装不等于注册**：包文件存在不代表当前 profile 已经把能力挂入 Context。
- **禁用不等于卸载**：禁用可能保留配置，卸载才撤销注册和清理运行期资源。
- **回调返回成功不等于 Plugin ready**：依赖、所有注册和健康检查都应完成。
- **回滚不等于删除数据**：回滚主要撤销本次注册；外部副作用需要独立对账和补偿。
- **热重载不等于覆盖字典项**：旧 effect、监听器和后台任务必须有明确的 disposer。

## 课后小问

1. 为什么 Plugin 的每个注册都应该返回 disposer？

   **答案**：宿主需要在失败回滚、scope 结束、禁用和热重载时精确撤销自己创建的资源。

   **解析**：没有 disposer，卸载只能清空全局表或依赖约定的名字，容易误删其他 Plugin 或留下事件监听器。effect 句柄把资源所有权和清理顺序绑定起来。

2. Plugin 在第三个 Service 注册失败时，前两个 Service 能否继续对外提供？

   **答案**：默认不应继续；应按必需/可选策略决定是否回滚整个事务，并明确记录部分失败。

   **解析**：若第三个 Service 是必需依赖，半注册状态会导致调用方拿到不完整能力。即使允许部分可用，也必须把状态标为 degraded 而不是 ready。

3. 为什么 Disabled 不等于 Disposed？

   **答案**：禁用可能只是暂时停止新调用并保留配置，稍后可以在重新检查后启用；Disposed 表示实例和其资源已清理。

   **解析**：把两者混合会导致重新启用复用失效对象，或为了暂时禁用而丢失用户配置。状态机应让生命周期和持久化配置分别可观察。

## 本节小结

- Plugin 是拥有配置、依赖、注册和清理的可组合生命周期单元。
- Manifest 预检、apply 注册、ready、rollback、disable 和 dispose 要有清晰状态。
- 每个 effect 绑定 owner 和 disposer，失败按逆序清理，避免半注册能力泄漏。
- 阅读 DeepSeek Harness 时沿 composition → `apply(ctx)` → effect/disposer → scope 销毁追踪。

## 快速回顾

- 能画出 Plugin 从 declared 到 disposed 的状态机。
- 能说明安装、注册、禁用、卸载和回滚的差异。
- 能解释为什么热重载依赖可组合的 effect/disposer。
- 下一篇阅读 [Dependency Injection 与能力容器](./06-Dependency-Injection与能力容器)。
