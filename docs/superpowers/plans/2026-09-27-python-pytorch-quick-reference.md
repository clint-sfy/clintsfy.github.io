# Python 与 PyTorch 速查笔记实施计划

**Goal:** 建成可逐章学习、可按 API 标题检索的 Python 3.11+ 与 PyTorch 2.x 笔记。

**Spec:** `docs/superpowers/specs/2026-09-27-python-pytorch-quick-reference-design.md`

## Global Constraints

- 保留现有 URL，新增页面使用数字前缀。
- 每个 API 标题后直接给 Python 代码；输出注释独立一行。
- 常用/不常用都可检索，不使用 Notebook 魔法、裸输出或废弃 API。
- Python 与第三方库分层，PyTorch 不在 Python 目录复制正文。
- Luna 5.6 极高执行；不可用时使用 Terra 5.6 中等。

### Task 1: 内容质量门槛

- 新增 `tests/python-course-content.test.mjs`。
- 锁定目标路径：Python 基础 17 篇、进阶 4 篇、PyTorch 入口与专题 8 篇。
- 检查结构、代码、输出注释、魔法命令、废弃 API、frontmatter 与死链。
- 在旧内容上运行并保存预期红灯，然后提交测试。

### Task 2: Python 基础 17 篇

- 重写基础入口并新增变量类型、字符串、容器、控制流、函数、模块、异常、文件、OOP、生成器、装饰器、类型提示、标准库、环境和测试专题。
- 常用 API 详细示例，低频 API 独立标题和最小示例。
- 运行专项检查并提交。

### Task 3: NumPy、Pandas 与绘图

- 原地重写 4 个旧 URL，清除错误、旧 API 和 Notebook 魔法。
- NumPy/Pandas 以数据处理速查为主；Matplotlib/Seaborn 保留可复制绘图案例。
- 运行专项检查并提交。

### Task 4: PyTorch 速查

- 原入口改为路线总览；新增 Tensor、Autograd、Dataset/DataLoader、nn.Module、训练、保存推理、GPU/迁移学习 7 篇。
- 使用 PyTorch 2.x 风格和 CPU 可运行案例，GPU 分支安全降级。
- 运行专项检查并提交。

### Task 5: 集成发布

- 合并三组内容，更新测试精确路径与 Python 首页入口。
- 全量测试、build、diff 检查与独立内容审阅。
- 推送 main、等待 GitHub/Vercel、重启本地 4173 并抽查代表页面。
