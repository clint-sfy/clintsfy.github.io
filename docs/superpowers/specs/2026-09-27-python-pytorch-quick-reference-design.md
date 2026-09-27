# Python 与 PyTorch 速查笔记设计

## 目标

把现有 Python、NumPy、Pandas、Matplotlib、Seaborn 与 PyTorch 旧笔记整理为适合逐章学习和 API 速查的现代笔记，同时保留既有 URL。

## 范围

- Python 基础：保留 `01-python基础.md`，新增 16 篇专题，共 17 篇。
- Python 进阶：原地重写 NumPy、Pandas、Matplotlib、Seaborn 4 篇。
- PyTorch：保留 `/courses/tangyudi/03-深度学习篇/01-Pytorch`，改为入口；新增 Tensor、Autograd、Dataset/DataLoader、nn.Module、训练、保存推理、GPU/迁移学习 7 篇。
- Python 首页增加 PyTorch 入口，但不复制两份 PyTorch 正文。

## 内容标准

- 基线为 Python 3.11+ 与 PyTorch 2.x；不固定 CUDA 安装命令，指向设备相关选择并给 CPU 可运行示例。
- 每页包含学习目标、核心知识点、常用用法、不常用但需要知道、易混点、课后小问、本节小结、快速回顾。
- 每个 API/用法使用独立小标题，小标题后直接是 fenced `python` 示例。
- 输出必须通过 `print()` 展示，并在下一行使用独立 `# 输出：...`；不混入裸 REPL 输出。
- 禁止 `%matplotlib inline`、`%%writefile`、`%run` 等 Notebook 魔法；废弃 API 必须替换。
- 常用用法解释用途、边界和示例；不常用用法保留可检索标题与最小示例。
- PyTorch 示例使用 `loss.item()`、`next(iter(loader))`、现代 torchvision weights API；训练循环说明 `train/eval`、`no_grad/inference_mode`、设备迁移和保存边界。

## 导航与兼容

- 不重命名现有 Python 与 PyTorch 文件。
- 新页面继续使用数字前缀，依赖现有 VitePress 自动侧栏扫描。
- Python 首页链接到现有 PyTorch 深度学习目录；不复制内容。

## 验证

- 新增 Python/PyTorch 专项 Node 测试：精确路径、frontmatter、结构、API 标题紧邻代码、输出注释、禁止魔法和废弃 API、死链。
- 对 fenced Python 代码做可适用的 `ast.parse`；含占位或外部上下文的片段必须明确标注并由测试合理排除。
- 标准库/NumPy/Pandas 示例在可用环境做 smoke check；PyTorch 未安装时做静态 API 审查并在报告中注明。
- 最终运行全量 `pnpm test`、VitePress build、`git diff --check`，部署并抽查线上与本地页面。
