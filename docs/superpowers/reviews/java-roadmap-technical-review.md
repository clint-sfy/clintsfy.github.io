# Java 路线专业准确性审阅记录

本记录把结构/API 标题覆盖与专业准确性分开。自动测试验证文件、真实操作标题、用途、初始状态、关键变化、可观察结果以及风险边界；它们不执行 MySQL，也不证明锁行为或生产性能。下面是 Task 6–7 实施者在 2026-10-05 对照 MySQL 8.0、Connector/J、JDK 20及MyBatis官方文档的专业准确性自审证据，不能冒充独立人工专家签字。独立审稿由路线协调者在集成阶段补充。

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

## Task 7：MySQL运维与Java边界

基线为MySQL 8.0/InnoDB与JDK 20。文章11有13个操作H3，文章12有6个操作H3，重写JDBC有14个操作H3；权限/恢复命令只用于隔离环境。以下主张可分别对照对应官方章节复核，不以标题覆盖替代专业审阅。

| 文章 | 可独立复核的主张 | 精确官方依据 | 自审证据与限制 |
| --- | --- | --- | --- |
| 11 | user@host是独立身份，真实匹配需CURRENT_USER；host不是数据库名 | [8.2.6 Connection Verification](https://dev.mysql.com/doc/refman/8.0/en/connection-access.html) | 通过，受控来源与代理/DNS边界明确；未跑真实认证 |
| 11 | 认证、REQUIRE SSL、客户端VERIFY_IDENTITY与对象授权各有职责 | [CREATE USER](https://dev.mysql.com/doc/refman/8.0/en/create-user.html)、[Encrypted Connections](https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html) | 通过，随机密码8.0.18+，不包含真实秘密；未做TLS握手 |
| 11 | CREATE/ALTER/DROP USER与GRANT/REVOKE分离，注销不删除业务表或必然终止会话 | [Account Management](https://dev.mysql.com/doc/refman/8.0/en/account-management-statements.html)、[DROP USER](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) | 通过，DEFINER与小版本限制邻接标注；管理员操作未执行 |
| 11 | 角色成员与会话激活不同，默认角色影响后续登录 | [8.2.10 Using Roles](https://dev.mysql.com/doc/refman/8.0/en/roles.html) | 通过，GRANT角色→默认角色→新连接CURRENT_ROLE步骤明确 |
| 11 | SHOW GRANTS用于权限复核，不是完整行为审计 | [SHOW GRANTS](https://dev.mysql.com/doc/refman/8.0/en/show-grants.html) | 通过，补充拒绝测试与托管/插件审计保留、脱敏边界 |
| 11 | single-transaction用于事务表快照，quick流式读取，期间DDL可能破坏一致性 | [6.5.4 mysqldump — Transactional Options](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html#option_mysqldump_single-transaction) | 通过，未宣称无锁；不混入非事务表；导出未执行 |
| 11 | routines/events须选取，单库逻辑备份不包含账号、配置、binlog或密钥 | [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) | 通过，no-tablespaces/GTID OFF只定位独立库演练，按对象授备份权限 |
| 11 | SQL恢复可执行破坏性语句，隔离实例与对象/DEFINER/事件控制不可省略 | [Executing SQL Statements from a Text File](https://dev.mysql.com/doc/refman/8.0/en/mysql-batch-commands.html) | 通过，3307隔离实例、审查SOURCE文件、禁止force忽略错误；恢复未执行 |
| 11 | 完整备份+连续日志及精确事务边界才支持PITR | [9.5 Point-in-Time Recovery](https://dev.mysql.com/doc/refman/8.0/en/point-in-time-recovery.html) | 通过，source-data 8.0.26+、短全局锁与额外权限明确，不提供生产重放命令 |
| 11 | 物理备份需一致工具/停机快照协议与版本、页格式、keyring等条件 | [9.2 Backup Methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html) | 通过，不把在线复制datadir当备份，托管供应商恢复流程单独验证 |
| 11 | 文件校验/行数不能代替结构与应用验证，恢复演练必须记录RPO/RTO | [9.1 Backup and Recovery Types](https://dev.mysql.com/doc/refman/8.0/en/backup-types.html) | 通过，基础订单3/80手推核对；恢复耗时与可用性未实测 |
| 12/JDBC | DriverManager与DataSource分层，DataSource不保证有池，close前须结束事务 | [JDK20 DataSource](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/javax/sql/DataSource.html)、[Connection](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/Connection.html) | 通过，独立物理连接与池代理分开，编译通过，运行未验证 |
| JDBC | URL证书/超时/时区显式配置，PREFERRED不等于服务端身份验证 | [Connector/J URL](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-jdbc-url-format.html)、[Configuration Properties](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-configuration-properties.html) | 通过，毫秒与秒分开，禁止把不安全连接属性当通用修复 |
| JDBC | 参数值绑定不绑定标识符，getInt(NULL)需立即wasNull，键来自同一语句 | [PreparedStatement](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/PreparedStatement.html)、[ResultSet](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/ResultSet.html) | 通过，注入输入与0/true/0/false推导明确，批量生成键不机械推断 |
| JDBC | BatchUpdateException计数可能部分或含失败项，执行批次不等于提交 | [JDK20 BatchUpdateException](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/BatchUpdateException.html)、[Connector/J Implementation Notes](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-implementation-notes.html) | 通过，-2/-3与驱动重写/继续执行分开；真实批失败未执行 |
| JDBC | 未决事务setAutoCommit(true)可提交，回滚/复位失败不能继续复用 | [JDK20 Connection](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/Connection.html) | 通过，失败不设置true，物理连接abort/close，池需专用淘汰API；保存原异常链 |
| JDBC | fetchSize默认非分页，游标需useCursorFetch，MIN_VALUE为驱动扩展 | [Connector/J Implementation Notes](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-implementation-notes.html)、[Performance Extensions](https://dev.mysql.com/doc/connector-j/en/connector-j-connp-props-performance-extensions.html) | 通过，服务端预编译、占连接、消费/关闭及网络预算明确 |
| JDBC | queryTimeout秒、networkTimeout毫秒与池等待各有预算；cancel不证明事务结束 | [JDK20 Statement](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/Statement.html)、[Connection](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/Connection.html) | 通过，三个独立H3；Executor关闭与原超时恢复，取消协作线程前提明确 |
| 12 | MyBatis BATCH先缓冲后flush，计数/键映射需真实驱动测试，Spring需相同事务资源 | [MyBatis Java API](https://mybatis.org/mybatis-3/java-api.html)、[MyBatis-Spring SqlSession](https://mybatis.org/spring/sqlsession.html)、[Transactions](https://mybatis.org/spring/transactions.html) | 通过，两次insert→flush计数2→rollback，复用第14章映射；编译通过，映射执行未验证 |
| 12/14 | TypeHandler负责类型，嵌套查询可能N+1；别名/查询次数/日志脱敏需验证 | [Mapper XML — resultMap and TypeHandler](https://mybatis.org/mybatis-3/sqlmap-xml.html) | 通过，JOIN例固定列名；详细映射仍归第14章 |
| 07补正 | 排名按amount定义peer，外层数值display_order稳定展示甲乙而不改变名次 | [Window Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html) | 通过，RANK与DENSE_RANK均修正，测试保留纯amount窗口排序 |

### Task 7运行证据与独立审稿边界

JDK20编译器`javac --release 20`成功编译JDBC的12个Java方法体片段及桥接文章的5个Java片段，桥接使用本机已缓存的MyBatis3.5.19 jar；没有增加生产依赖。语法检查不代表URL、TLS、映射或驱动运行正确。mysql客户端仍未找到，Docker Linux engine管道不存在，未运行权限、备份、恢复、PITR或JDBC数据库测试；这些状态保留为“未执行”。独立审稿应复核矩阵中的权限匹配、DDL/GTID边界、恢复顺序、批量计数与连接失败状态，运行证据另行记录。

### Task 8：迁移、连接池与多数据源

新增 Flyway 文章含 12 个操作 H3，HikariCP/多数据源文章含 16 个操作 H3；JDBC 文章的网络超时示例同步修正。以下范围依据官方文档，示例依赖版本由项目 BOM/依赖管理固定，不宣称完成真实 MySQL 执行。

| 主题 | 可复核主张 | 官方依据与自审结果 |
| --- | --- | --- |
| Flyway版本迁移 | `V版本__描述` 文件按版本应用；已部署内容不应改写，checksum 用于验证迁移历史 | [Versioned migrations](https://documentation.red-gate.com/flyway/flyway-concepts/migrations/versioned-migrations)、[Validate](https://documentation.red-gate.com/flyway/reference/commands/validate)；通过，示例覆盖 V1→V2 与 history 结果 |
| Repeatable、占位符、回调 | repeatable 变更后重跑且在 pending 版本迁移后执行；callbacks/placeholders 属于迁移机制 | [Repeatable migrations](https://documentation.red-gate.com/fd/repeatable-migrations-273973335.html)、[Placeholders](https://documentation.red-gate.com/flyway/flyway-concepts/migrations/migration-placeholders)、[Callbacks](https://documentation.red-gate.com/flyway/flyway-concepts/callbacks)；通过，示例分开表达文件定义与 migrate 命令 |
| baseline、repair、clean、outOfOrder | baseline 可跳过旧版本，repair 维护 history 而非还原对象，clean 删除配置 schema 对象，out-of-order 改变部署顺序 | [Flyway commands](https://documentation.red-gate.com/flyway/reference/commands)、[Clean](https://documentation.red-gate.com/flyway/reference/commands/clean)、[FAQ](https://documentation.red-gate.com/flyway/reference/usage/frequently-asked-questions)；通过，危险警告紧邻命令；要求克隆核对和人工审批 |
| Liquibase与DDL回退 | changeset/changelog 可表达 change 与 rollback；MySQL DDL 的可回滚性按语句确认，建议 expand-contract 与前向修复 | [Liquibase changesets](https://docs.liquibase.com/concepts/changelogs/changeset.html)、[Rollback](https://docs.liquibase.com/commands/rollback/rollback.html)、[MySQL atomic DDL](https://dev.mysql.com/doc/refman/8.0/en/atomic-ddl.html)、[implicit commits](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)；通过，未宣称通用事务回滚 |
| Hikari配置与观测 | pool size 按数据库总预算及测量；连接借用、验证、idle/max lifetime、keepalive、泄漏阈值均为不同边界 | [HikariCP configuration](https://github.com/brettwooldridge/HikariCP)、[Pool sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing)、[Metrics](https://github.com/brettwooldridge/HikariCP/wiki/Metrics)；通过，示例数值明确为教学值，指标用于诊断而非精确控制 |
| Spring路由与事务 | routing datasource 在获取连接时解析 lookup key；Spring 事务 advisor 与线程绑定连接意味着不能在事务中途切换物理库 | [AbstractRoutingDataSource API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/datasource/lookup/AbstractRoutingDataSource.html)、[事务实现](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html)、[Advisor order](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)；通过，包含 ThreadLocal finally 清理、副本延迟和各库迁移责任 |
| JDBC networkTimeout复位 | 原 timeout getter 位于保护范围；即使 getter 失败也关闭示例 Executor；复位异常附加到原 SQLException，不替代原失败 | [JDK20 Connection](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/Connection.html)；代码路径静态复核通过，当前环境仅有 `javac 1.8.0_221`，未能执行 `--release 20` 编译 |

红测先以缺少 Flyway 页面失败；新增文章、H3/API 格式和严格文章合同测试转绿。全量 `pnpm test` 为 96/96 通过，VitePress build 成功（约 58 秒；存在既有 chunk-size 和语法高亮语言提示）。构建生成的 18 个 `docs/public/courses/java` 兼容页已删除。JDK20 编译与数据库集成执行仍未验证；本机只有 JDK8，未安装或启动数据库。独立审稿应检查迁移命令在锁定 Flyway 版本的参数兼容性、池指标的 Actuator 实际绑定及事务拦截器具体顺序。
