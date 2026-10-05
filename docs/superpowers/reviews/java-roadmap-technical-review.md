# Java 路线专业准确性审阅记录

本记录把结构/API 标题覆盖与专业准确性分开。自动测试验证文件、真实操作标题、用途、初始状态、关键变化、可观察结果以及风险边界；它们不执行 MySQL，也不证明锁行为或生产性能。下面是 Task 6 实施者在 2026-10-05 对照 MySQL 8.0 Reference Manual 的专业准确性自审证据，不能冒充独立人工专家签字。独立审稿由路线协调者在集成阶段补充。

## Task 6：MySQL 05–10

基线：MySQL 8.0 / InnoDB。users/orders 表与数据继续使用 Task 5；补充 lab_profiles、约束实验表和三行 lab_lock，各自交代一次性创建与具体输入。独立标题共80个：05=14、06=12、07=17、08=11、09=13、10=13。未承诺固定计划、毫秒值、锁视图完整历史或无故障持久性。

### SQL 与 JSON 复核矩阵

| 文章 | 复核的高风险主张与结论 | 精确官方章节 | 自审结果 |
| --- | --- | --- | --- |
| 05 | 普通 NULL 比较为 UNKNOWN，WHERE 仅保留真；NULL不是空字符串 | [5.3.4.6 Working with NULL Values](https://dev.mysql.com/doc/refman/8.0/en/working-with-null.html) | 通过，示例明确NULL/1/1/0/NULL |
| 05 | BETWEEN含端点，IN含NULL可能未知，LIKE转义不等于参数绑定 | [14.4.2 Comparison Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html)、[14.8.1 String Comparison Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html) | 通过，时间改用半开区间 |
| 05 | 未ORDER BY不保证顺序，同值分页需唯一排序键；keyset不能冻结可变排序键 | [15.2.13 SELECT Statement](https://dev.mysql.com/doc/refman/8.0/en/select.html)、[10.2.1.19 LIMIT Query Optimization](https://dev.mysql.com/doc/refman/8.0/en/limit-optimization.html) | 通过，写出复合游标边界与并发限制 |
| 05 | 参数标记用于值，不是任意标识符；动态结构使用白名单 | [15.5 Prepared Statements](https://dev.mysql.com/doc/refman/8.0/en/sql-prepared-statements.html)、[15.5.1 PREPARE Statement](https://dev.mysql.com/doc/refman/8.0/en/prepare.html) | 通过，未提供拼接用户输入SQL示例 |
| 05 | COALESCE取首个非NULL，CONCAT含NULL返回NULL，DATE_FORMAT是展示表达式 | [14.5 Flow Control Functions](https://dev.mysql.com/doc/refman/8.0/en/flow-control-functions.html)、[14.8 String Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/string-functions.html)、[14.7 Date and Time Functions](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html) | 通过，展示与索引过滤分开 |
| 06 | LEFT JOIN的ON过滤允许补行，WHERE右表非空条件会排除补行 | [15.2.13.2 JOIN Clause](https://dev.mysql.com/doc/refman/8.0/en/join.html) | 通过，手推(1,NULL),(2,103)与仅(2,103) |
| 06 | 标量子查询零行为NULL，多行报错；相关查询不承诺每行一次物理执行 | [15.2.15.1 The Subquery as Scalar Operand](https://dev.mysql.com/doc/refman/8.0/en/scalar-subqueries.html)、[15.2.15.7 Correlated Subqueries](https://dev.mysql.com/doc/refman/8.0/en/correlated-subqueries.html) | 通过，未用随机LIMIT 1消除错误 |
| 06 | NOT IN遇到NULL与NOT EXISTS不同，外层可空时不能机械替换 | [14.4.2 Comparison Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html)、[15.2.15.6 Subqueries with EXISTS or NOT EXISTS](https://dev.mysql.com/doc/refman/8.0/en/exists-and-not-exists-subqueries.html) | 通过，具体空集与用户2对照 |
| 06 | UNION去重、ALL保留重复，最终排序独立；INTERSECT/EXCEPT为8.0.31+ | [15.2.18 UNION Clause](https://dev.mysql.com/doc/refman/8.0/en/union.html)、[15.2.8 INTERSECT Clause](https://dev.mysql.com/doc/refman/8.0/en/intersect.html) | 通过，注明小版本 |
| 07 | ONLY_FULL_GROUP_BY检查依赖；COUNT(*)与COUNT(expr)的NULL行为不同 | [14.19.3 MySQL Handling of GROUP BY](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html)、[14.19.1 Aggregate Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html) | 通过，未关闭严格分组模式 |
| 07 | CTE生命周期为语句；递归锚点决定类型，深度默认1000且需终止条件 | [15.2.20 WITH (Common Table Expressions)](https://dev.mysql.com/doc/refman/8.0/en/with.html) | 通过，只生成1到3，不提高生产限制 |
| 07 | ROW_NUMBER/RANK/DENSE_RANK并列规则不同，LAG/LEAD不是聚合帧 | [14.20.1 Window Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html) | 通过，展示1/1/3与1/1/2 |
| 07 | ORDER BY下默认RANGE到当前peer末；ROWS同值先后不定 | [14.20.3 Window Function Frame Specification](https://dev.mysql.com/doc/refman/8.0/en/window-functions-frames.html) | 修正确定输出假设，ROWS同值结果按集合描述；稳定逐行需补唯一键 |
| 07 | JSON_EXTRACT/->返回JSON，->>解引号；缺失SQL NULL与JSON null不同 | [14.17.3 Functions That Search JSON Values](https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html)、[14.17.5 Functions That Return JSON Value Attributes](https://dev.mysql.com/doc/refman/8.0/en/json-attribute-functions.html) | 通过，JSON_TYPE的NULL注明为文本标签 |
| 07 | JSON_SET仅返回新值，SQL字符串true与JSON布尔不同 | [14.17.4 Functions That Modify JSON Values](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html) | 通过，用CAST生成JSON布尔，不承诺缺失深层父路径自动建立 |
| 07 | JSON_ARRAYAGG普通聚合顺序未定义，窗口用法8.0.14+ | [14.19.1 Aggregate Function Descriptions — JSON_ARRAYAGG](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_json-arrayagg) | 通过，未使用其他方言的聚合内ORDER BY |
| 07/08 | JSON文本索引需有界类型，生成列定义与表达式限制明确 | [15.1.20.8 CREATE TABLE and Generated Columns](https://dev.mysql.com/doc/refman/8.0/en/create-table-generated-columns.html)、[15.1.15 CREATE INDEX Statement](https://dev.mysql.com/doc/refman/8.0/en/create-index.html) | 补充ALTER生成列与索引实际例子；JSON操作已有独立H3 |

### 约束与索引复核矩阵

| 文章 | 复核的高风险主张与结论 | 精确官方章节 | 自审结果 |
| --- | --- | --- | --- |
| 08 | DEFAULT与显式NULL不同，UNIQUE可空列允许多个NULL | [15.1.20 CREATE TABLE Statement](https://dev.mysql.com/doc/refman/8.0/en/create-table.html) | 通过，独立实验三行 |
| 08 | CHECK从8.0.16执行；UNKNOWN通过，需NOT NULL | [15.1.20.6 CHECK Constraints](https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html) | 通过，NULL与负数语义分开 |
| 08 | InnoDB FK立即检查、NO ACTION=RESTRICT，CASCADE传播且不触发触发器 | [15.1.20.5 FOREIGN KEY Constraints](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html) | 通过，子列符号兼容，删除级联限定独立表并回滚 |
| 08 | 聚簇叶子完整行，二级键含主键；无主键回退选择有条件 | [17.6.2.1 Clustered and Secondary Indexes](https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html)、[17.6.2.2 The Physical Structure of an InnoDB Index](https://dev.mysql.com/doc/refman/8.0/en/innodb-physical-structure.html) | 通过，未宣称每表必须用户定义主键 |
| 08 | 最左前缀与覆盖不同，范围后列可用于ICP等，不是全部失效 | [10.3.6 Multiple-Column Indexes](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)、[10.2.1.6 Index Condition Pushdown Optimization](https://dev.mysql.com/doc/refman/8.0/en/index-condition-pushdown-optimization.html) | 通过，skip scan等例外与实际计划分开 |
| 08 | 前缀非二进制按字符计，不能覆盖完整列；函数键8.0.13+受生成列规则限制 | [15.1.15 CREATE INDEX Statement](https://dev.mysql.com/doc/refman/8.0/en/create-index.html) | 通过，演示索引明确不作为生产重复添加建议 |
| 08 | 降序键真实存储且有change buffering限制；可见性不取消索引维护或唯一性 | [10.3.13 Descending Indexes](https://dev.mysql.com/doc/refman/8.0/en/descending-indexes.html)、[10.3.12 Invisible Indexes](https://dev.mysql.com/doc/refman/8.0/en/invisible-indexes.html) | 通过，隐藏后恢复，主键不可隐藏 |

### MVCC、锁与故障复核矩阵

| 文章 | 复核的高风险主张与结论 | 精确官方章节 | 自审结果 |
| --- | --- | --- | --- |
| 09 | ACID不能自动实现任意业务不变量，持久性依赖配置与硬件 | [17.2 InnoDB and the ACID Model](https://dev.mysql.com/doc/refman/8.0/en/mysql-acid.html) | 通过，转账仅回滚演练；正式分支需检查行数 |
| 09 | autocommit默认1，从0设1会提交，DDL隐式提交 | [17.7.2.2 autocommit, Commit, and Rollback](https://dev.mysql.com/doc/refman/8.0/en/innodb-autocommit-commit-rollback.html)、[15.3.3 Statements That Cause an Implicit Commit](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html) | 通过，恢复前显式ROLLBACK |
| 09 | RR默认、RC每次新快照、RR首次一致性读建立快照；自己写可见 | [17.7.2.1 Transaction Isolation Levels](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)、[17.7.2.3 Consistent Nonlocking Reads](https://dev.mysql.com/doc/refman/8.0/en/innodb-consistent-read.html) | 通过，100/100/110交错手推，当前读作为替代分支 |
| 09 | 普通START不同于WITH CONSISTENT SNAPSHOT；一次性SET不等于会话默认 | [15.3.1 START TRANSACTION, COMMIT, and ROLLBACK](https://dev.mysql.com/doc/refman/8.0/en/commit.html)、[15.3.7 SET TRANSACTION Statement](https://dev.mysql.com/doc/refman/8.0/en/set-transaction.html) | 通过，不用会话变量证明一次性设置 |
| 09 | SAVEPOINT不是完整事务结束且不能假设释放全部锁 | [15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT](https://dev.mysql.com/doc/refman/8.0/en/savepoint.html) | 通过，最终完整回滚 |
| 09 | 唯一现存键等值锁记录，缺失/范围可锁gap/next-key；IX不等于全表X | [17.7.1 InnoDB Locking](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html)、[17.7.2.4 Locking Reads](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html) | 通过，独立键10/20/30，缺失15可阻塞插入 |
| 09 | RC一般不用gap但外键和重复检查例外，RR快照与当前读防幻机制不同 | [17.7.2.1 Transaction Isolation Levels](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)、[17.7.4 Phantom Rows](https://dev.mysql.com/doc/refman/8.0/en/innodb-next-key-locking.html) | 通过，未说RR消除一切幻读 |
| 09 | 普通读也可持MDL阻塞DDL；data_lock_waits是瞬时等待 | [10.11.4 Metadata Locking](https://dev.mysql.com/doc/refman/8.0/en/metadata-locking.html)、[29.12.13.2 The data_lock_waits Table](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-data-lock-waits-table.html) | 通过，权限与instrument前提明确 |
| 09 | 1213回滚受害事务，1205默认当前语句；重试需完整回滚与业务幂等 | [17.21.5 InnoDB Error Handling](https://dev.mysql.com/doc/refman/8.0/en/innodb-error-handling.html)、[17.7.5.3 How to Minimize and Handle Deadlocks](https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks-handling.html) | 通过，注明配置例外和未知提交结果 |

### 优化器与诊断复核矩阵

| 文章 | 复核的高风险主张与结论 | 精确官方章节 | 自审结果 |
| --- | --- | --- | --- |
| 10 | key与possible_keys、rows/filtered、index与ALL语义不同 | [10.8.2 EXPLAIN Output Format](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html) | 通过，未保证三行表具体路径 |
| 10 | TREE为8.0.16+；ANALYZE为8.0.18+，实际执行且只用TREE；多表UPDATE/DELETE会修改 | [15.8.2 EXPLAIN Statement — Obtaining Information with EXPLAIN ANALYZE](https://dev.mysql.com/doc/refman/8.0/en/explain.html) | 通过，邻接风险警告，区分普通EXPLAIN支持范围 |
| 10 | 实际时间含子迭代器且多循环平均，不可节点时间相加；8.0.32默认格式可配置 | [15.8.2 EXPLAIN Statement](https://dev.mysql.com/doc/refman/8.0/en/explain.html) | 通过，显式传统格式，未固定毫秒 |
| 10 | ANALYZE采样键统计，histogram不是索引且普通ANALYZE不等于自动刷新 | [15.7.3.1 ANALYZE TABLE Statement](https://dev.mysql.com/doc/refman/8.0/en/analyze-table.html) | 通过，资源与生产回归边界明确 |
| 10 | 慢日志受阈值与开关控制，写入在执行完成释放锁后；配置变更有I/O和敏感数据风险 | [7.4.5 The Slow Query Log](https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html) | 通过，只读取5项变量，不写全局SET |
| 10 | 语句摘要按采集配置可缺省，计时皮秒换算；不能代表完整历史 | [29.12.20.3 Statement Summary Tables](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-statement-summary-tables.html) | 通过，输出按实际环境描述 |
| 10 | 函数列条件与原列范围访问不同，但函数索引是有前提例外 | [10.2.1.2 Range Optimization](https://dev.mysql.com/doc/refman/8.0/en/range-optimization.html)、[15.1.15 CREATE INDEX Statement](https://dev.mysql.com/doc/refman/8.0/en/create-index.html) | 通过，对比等价日期条件 |
| 10 | 连接顺序由优化器决定，hash join可用性依版本 | [10.2.1.4 Hash Join Optimization](https://dev.mysql.com/doc/refman/8.0/en/hash-joins.html) | 通过，只要求检查策略不承诺选择 |
| 10 | filesort不必落盘、temporary不必磁盘，Extra不展示全部物化 | [10.2.1.16 ORDER BY Optimization](https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html)、[10.4.4 Internal Temporary Table Use in MySQL](https://dev.mysql.com/doc/refman/8.0/en/internal-temporary-tables.html) | 通过，收益按真实规模复测 |

### 验证范围与待独立审稿

实施者已按种子行手推 SQL 输出，检查每个多会话步骤、回滚边界、版本标注、SQL方言及计划不确定性。当前机器未找到 mysql 客户端；Docker Desktop Linux engine 管道不存在，无法运行隔离 MySQL 容器。本次没有连接或修改已有数据库，不宣称真实 MySQL 执行通过。独立审稿仍需确认这些例子的语法、并发交错可操作性、官方依据与锁边界；运行证据与专业审稿应分别登记。
