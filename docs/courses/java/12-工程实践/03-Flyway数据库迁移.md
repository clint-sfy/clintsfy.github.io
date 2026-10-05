---
title: Flyway 数据库迁移
date: 2026-10-05
category: Java基础快速入门
tags: [Java, Flyway, 数据库迁移, Liquibase]
description: 用版本化迁移管理数据库演进，理解校验、部署顺序与回滚边界。
---

# Flyway 数据库迁移

## 学习目标

- 用版本化和可重复迁移记录数据库变更，并让环境按相同顺序前进。
- 安全使用校验、基线和修复命令，明确危险操作和 MySQL DDL 限制。
- 选择 CI、应用启动或独立部署工具作为迁移所有者。

## 核心知识点

Flyway 通过迁移文件和 schema history 表记录已应用的版本及校验和。本文以 Flyway 官方稳定文档、MySQL 8.0/InnoDB 为事实基线；具体 CLI、Maven/Gradle 插件或 Java API 版本须由项目依赖管理固定，本文不绑定补丁版本。

数据库对象、列类型和索引语义归[MySQL 表设计](/courses/java/11-MySQL-8/02-表设计与DDL)；这里讨论如何安全发布变更。JDBC 连接生命周期见[JDBC 与事务](/courses/java/12-工程实践/02-JDBC与事务)，Spring 启动与事务见[Spring Boot](/courses/java/14-后端工程/01-Spring-Boot启动与配置)及[Spring 事务](/courses/java/14-后端工程/03-Spring-AOP与声明式事务)。

迁移应按追加式、可审阅脚本管理。MySQL 8.0 的原子 DDL 保证单条支持语句在崩溃恢复时原子，但许多 DDL 仍会隐式提交，多个迁移步骤也不会因此成为一个可整体回滚事务；迁移失败后的修复策略必须按语句和实际执行状态设计。[MySQL atomic DDL](https://dev.mysql.com/doc/refman/8.0/en/atomic-ddl.html)、[implicit commit statements](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)。

## 常用用法

### flyway.migrate：Flyway versioned migration 按版本追加结构变化

用于记录一次性、按顺序执行的结构或数据变更；已在共享环境应用的文件应视为不可变。

```shell
# 初始状态：migrations/ 中有唯一命名的V1、V2文件，受控 MySQL 8.0 实验库已有 schema history。
# 文件：V1__create_account.sql
# 文件：V2__add_status.sql
# 关键变化：migrate按V1、V2顺序应用迁移。
flyway info
flyway migrate
# 输出：info 显示 V1、V2 成功；schema history 对应版本记录成功状态与校验和。
```

SQL 文件名使用 `V版本__描述.sql`，版本需唯一且可排序；团队统一版本格式和目录，避免两个分支提交相同版本。CI 先审阅差异，再针对隔离库验证，再由指定部署步骤执行。

### flyway.migrate：Flyway repeatable migration 重建可替换对象

用于视图、例程等可重复定义；文件校验和变化时会在待执行版本迁移之后重新运行。

```shell
# 初始状态：V1 已创建account(id, status)，R__active_accounts.sql定义active_accounts视图。
# 文件：R__active_accounts.sql，校验和与history中的版本不同。
# 关键变化：migrate先运行待执行V迁移，再重跑变化的R迁移。
flyway migrate
# 输出：info 中 R__active_accounts 显示成功并记录新 checksum。
```

该 repeatable 文件的最小内容如下，文件保存后再次运行 migrate 才会应用：

```sql
CREATE OR REPLACE VIEW active_accounts AS
SELECT id FROM account WHERE status = 'active';
```

可重复迁移没有版本号，不适合承载必须恰好执行一次的非幂等数据修改。MySQL 8.0 的 `CREATE OR REPLACE VIEW` 也应先在目标版本验证。[Flyway repeatable migrations](https://documentation.red-gate.com/fd/repeatable-migrations-273973335.html)。

### flyway.validate：Flyway validate 检查迁移历史一致性

用于部署前发现文件缺失、版本或校验和与已应用记录不一致的情况。

```shell
# 初始状态：V1 已应用，仓库中 V1 与原始文件相同且包含 V2。
flyway validate
flyway info
# 关键变化：validate 对比可用迁移和 history；info 显示 V2 pending。
flyway migrate
# 输出：校验成功后 V2 进入 history；校验失败时部署流水线停止并保留诊断。
```

校验和不匹配常表示已应用迁移被改写，不能通过改文件掩盖差异。先比较提交、环境和 history，再决定恢复原文件或制定新的前向修复。[validate 命令](https://documentation.red-gate.com/flyway/reference/commands/validate)。

### flyway.repair：Flyway repair 有证据地修复 history 元数据

用于已确认的失败迁移或校验记录需要修复时维护 schema history；它不会把数据库对象自动还原到预期状态。

```shell
# 初始状态：隔离测试库的一条 DDL 失败，先保存日志、history 与实际对象快照。
flyway info
# 关键变化：运维人员逐项核对部分 DDL 是否已生效，并确认正确修复步骤。
flyway repair
flyway validate
# 输出：history 元数据重新对齐；数据库对象仍须单独检查并通过迁移验证。
```

**危险：**`repair` 可能移除失败记录并重写 checksum；未调查根因就运行，会丢失有用证据或接受被改写脚本。仅对选定环境执行，备份并记录审阅结果。[repair 命令](https://documentation.red-gate.com/flyway/reference/commands/repair)。

### flyway.baseline：Flyway baseline 接管已有数据库

用于将已有且经盘点的数据库登记为某一版本之前已具备基线状态。

```shell
# 初始状态：只读核对过的现存库与版本 V5 的结构一致，尚无 history 表。
flyway info
# 关键变化：指定 baselineVersion=5 并在目标库执行 baseline。
flyway baseline -baselineVersion=5
flyway info
# 输出：history 标记基线版本；之后 migrate 只应用高于基线的迁移。
```

**危险：**错误基线会跳过必要迁移。先从备份克隆验证结构，核对目标连接和 schema，再由有记录的部署身份执行；谨慎启用 `baselineOnMigrate`，避免把连错库伪装成可接管的空白情形。[baseline 命令](https://documentation.red-gate.com/flyway/reference/commands/baseline)。

### flyway.clean：Flyway clean 仅重置可丢弃实验库

用于销毁隔离开发或测试 schema 中的对象，以便重建干净环境。

```shell
# 初始状态：一次性容器 test_db 内有测试表；先确认 JDBC URL、库名与容器身份。
flyway info
# 关键变化：仅在 CI 临时库执行 clean，随后按仓库迁移重建。
flyway clean
flyway migrate
flyway info
# 输出：对象被删除后按迁移重建；测试断言结构和初始数据恢复。
echo "clean后迁移版本已重新应用"
```

**危险：**`clean` 会删除配置 schema 中的数据库对象，绝不可用于生产。生产配置应禁用 clean，并由凭证/权限和流水线目标校验提供多层保护。[clean 命令](https://documentation.red-gate.com/flyway/reference/commands/clean)。

### flyway.migrate：Flyway outOfOrder 处理迟到版本

用于在高版本已部署后仍需应用较低版本时显式补齐历史空缺。

```shell
# 初始状态：V1 与 V3 已应用；另一个分支提交的 V2 尚未应用。
flyway info
# 关键变化：评估 V2 是否可安全作用于已处于 V3 的库，再决定是否允许 outOfOrder。
flyway migrate -outOfOrder=true
# 输出：V2 history 标为 out of order；现有 V3 不会重新执行。
```

**危险：**打开 `outOfOrder` 会改变环境收敛顺序，迟到脚本必须能适用于当前数据状态。通常优先发布更高版本的前向修复；仅在审批、克隆演练和各环境检查完成后短期启用，并保留记录。[Flyway 排序说明](https://documentation.red-gate.com/flyway/reference/usage/frequently-asked-questions)。

### flyway.migrate：Flyway callbacks 连接迁移生命周期钩子

用于在 `beforeMigrate`、`afterMigrate` 等生命周期边界执行审计或环境校验。

```shell
# 初始状态：callbacks/afterMigrate.sql 仅记录当前 schema 与迁移批次审计信息。
flyway info
flyway migrate
echo "callback audit row recorded"
# 关键变化：迁移完成后执行 afterMigrate callback。
# 输出：部署日志和审计表出现批次记录；回调失败依命令结果处理，不宣称迁移已完整成功。
```

回调可能改变数据库状态，避免隐藏业务 DDL、不可重入操作和泄露凭据的日志；迁移本体仍应清楚表达业务结构变化。[Flyway callbacks](https://documentation.red-gate.com/flyway/flyway-concepts/callbacks)。

### CREATE TABLE：Flyway placeholders 注入受控环境值

用于将少量环境配置代入脚本，同时让同一迁移模板适用于不同环境。

```sql
-- 初始状态：配置将 tenant_schema 显式设置为目标 schema 白名单中的名称。
CREATE TABLE ${tenant_schema}.migration_probe (
  id BIGINT PRIMARY KEY
);
-- 关键变化：Flyway 替换占位符后对选定 schema 建表。
-- 输出：审阅渲染后的 SQL 与目标 schema，测试查询确认 migration_probe 存在。
```

占位符不应来自用户输入，也不应用于掩盖不同环境的结构差异；记录安全配置来源并限制可用值。[Flyway placeholders](https://documentation.red-gate.com/flyway/flyway-concepts/migrations/migration-placeholders)。

### liquibase.update：Liquibase changeset 选择基于变更集的表达

用于偏好显式 changeset 身份、前置条件和多种 changelog 格式的团队；这里仅比较适用边界。

```shell
# 初始状态：changelog.yaml 中changeset add-account-status / team 为account新增status列。
liquibase update --changelog-file=changelog.yaml
# 关键变化：Liquibase将该changeset执行结果记录到DATABASECHANGELOG。
# 输出：查询account列定义并检查DATABASECHANGELOG中的id、author和文件路径。
```

初始状态是 `account` 已存在且尚无该列；运行 Liquibase update 后，changeset 身份写入其 changelog 表，测试查询确认列和值。Flyway 以迁移文件、版本顺序和 checksum 为简洁中心；Liquibase 以 changeset/changelog、前置条件和 change 类型组织，并支持显式 rollback 定义。两者都不能保证 MySQL DDL 可事务回滚；选择需看团队格式、审阅流程和回滚演练能力，不要在同一 schema 对同一变更重复担任所有者。[Liquibase changesets](https://docs.liquibase.com/concepts/changelogs/changeset.html)、[rollback](https://docs.liquibase.com/commands/rollback/rollback.html)。

### ALTER TABLE：MySQL DDL rollback 采用前向恢复策略

用于规划上线失败时怎样恢复兼容，而非依赖数据库事务撤销所有 DDL。

```sql
-- 初始状态：account 表含 name，旧应用仅读写 name。
ALTER TABLE account ADD COLUMN display_name VARCHAR(80) NULL;
-- 关键变化：display_name列从不存在变为存在，旧代码继续工作。
-- 输出：列数为1，可由information_schema检查。
SELECT COUNT(*) FROM information_schema.columns
WHERE table_schema=DATABASE() AND table_name='account' AND column_name='display_name';
-- 后续发布：双写/回填/校验后再切读；确认旧版本退出后才考虑收紧约束或删除旧列。
```

采用 expand-contract：先增加兼容结构，再分阶段回填和切换，最后另批移除旧结构。每步按 MySQL 8.0/InnoDB 的具体 DDL 算法、锁、空间和隐式提交影响预演；备份、恢复点与应用回滚策略一起审阅。对不可逆数据转换，准备补偿或恢复方案，而不是承诺反向脚本必然无损。

### flyway.validate：CI migration ownership 让部署顺序唯一

用于在构建和发布期间只由一个受控身份负责迁移。

```shell
# 初始状态：CI 对隔离 MySQL 8.0 克隆运行 validate 与 migrate，再运行迁移后集成测试。
flyway validate
flyway migrate
flyway info
echo "deployed migration version recorded"
# 关键变化：迁移版本从pending变为success，部署作业使用专用权限应用同一已审阅制品。
# 输出：流水线记录目标环境、迁移版本和结果；应用副本不并发抢做结构变更。
```

可由发布流水线、独立迁移作业或应用启动迁移担任所有者，但需选一个可观测、可审计的策略。多副本同时启动时，依赖工具锁也不能替代部署顺序、超时、权限和失败告警设计；生产应用运行账号与迁移账号应分离。

## 易混点

- checksum 不匹配是需调查的事实，不是提示随手改 migration。
- `repair` 只维护 history，不能撤回已经生效的 MySQL DDL。
- `baseline` 标记既有状态；错误版本可能跳过所需迁移。
- MySQL DDL 的原子性、隐式提交和回滚能力取决于具体语句，不可套用通用事务假设。
- 可编写 rollback 不代表生产回滚安全；先考虑兼容发布和前向修复。

## 课后小问

1. 为什么已部署的版本迁移要保持不变？
答案：共享环境保存的是原文件 checksum 和已执行结果。
解析：修正后续问题应追加新迁移；否则环境间历史无法可靠比较。

2. `repair` 后数据库结构是否自动恢复？
答案：不会。
解析：它修复 schema history 元数据；实际对象需调查、验证并单独前向修复。

3. 哪种发布顺序更容易应对应用回滚？
答案：先扩展兼容结构，再回填和切换，最后单独收缩。
解析：旧、新应用可在过渡阶段共存，结构删除不会过早阻断旧版本。

## 本节小结

- 版本迁移按序追加，可重复迁移用于定义可重建对象。
- validate、baseline、repair 和 clean 的影响不同，危险命令需隔离和审批。
- MySQL DDL 回滚能力要逐语句确认，采用 expand-contract 与前向修复。
- 迁移由唯一、可审计的 CI 或部署所有者执行。

## 快速回顾

- 版本唯一，已应用迁移不可改写。
- checksum 异常先调查；repair 不回滚 DDL。
- clean 只可用于可丢弃环境，baseline 先核对现状。
- 发布顺序与应用兼容窗口共同决定安全回退能力。
