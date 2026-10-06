---
title: MyBatis 生产边界
date: 2026-10-05
category: Java后端工程
tags: [Java, MyBatis, MyBatis-Plus, SQL]
description: 以复杂映射、动态 SQL、批处理和缓存边界组织 ORM 生产实践。
---

# MyBatis 生产边界

## 学习目标

- 能检查 JOIN 映射、动态 SQL 和生成键的真实行为。
- 能区分批次执行、事务提交、分页和缓存，不把框架便利误认为一致性保证。
- 能对插件、TypeHandler 和包装器输入进行受控验证。

## 核心知识点

resultMap 把行转换为对象图，association 表示单对象，collection 表示集合，discriminator 按列值选择映射。动态 SQL 只负责生成 SQL 文本，不负责授权。一级缓存属于 SqlSession，二级缓存属于 Mapper namespace；它们都不是数据库外部写入的自动订阅机制。

本文基线 JDK 20、MyBatis 3.5.x、MyBatis-Plus 3.5.x；Spring 示例沿 Boot 3.4 / Framework 6.2，使用匹配的 MyBatis-Spring 3.x 与 `mybatis-plus-spring-boot3-starter`。3.5.9+ 分页插件需要按官方说明引入 `mybatis-plus-jsqlparser`；不要同时注册 PageHelper 与 MP 分页。依赖由 BOM/版本管理锁定，下面 Java 方法体片段需配置真实 SqlSessionFactory 或测试 fixture。依据：[Mapper XML](https://mybatis.org/mybatis-3/sqlmap-xml.html)、[动态 SQL](https://mybatis.org/mybatis-3/dynamic-sql.html)、[Java API](https://mybatis.org/mybatis-3/java-api.html)、[MP 分页](https://baomidou.com/en/plugins/pagination/)。SQL、索引、锁的事实源是[MySQL 8](/courses/java/11-MySQL-8/09-事务MVCC隔离级别与锁)，此处只讨论映射层。

## 常用用法

以下原生 XML 片段放入 Mapper 文件；Java 验证见后面的 parse/BoundSql 小节。示例订单对象图是 Map，字段别名固定，方便把映射验证与实体构造器问题分开。

### `resultMap`：定义根对象身份

用途：用于将结果列显式映射到对象属性，并以主键定义多行中的同一对象。

```xml
<!-- 初始状态：查询列 o_id=7、o_state=PAID；目标类型为 HashMap。 -->
<resultMap id="orderBase" type="java.util.HashMap">
  <id property="id" column="o_id"/>
  <result property="state" column="o_state"/>
</resultMap>
<!-- 关键变化：两列映射为 id/state，id=7 的重复根行可合并。 -->
<!-- 结果：固定输入生成 {id:7,state:PAID}；用真实查询断言属性。 -->
```

### `association`：映射单个关联对象

用途：用于把同一结果行中的买家字段映射为订单的一个 buyer 对象。

```xml
<!-- 初始状态：父 resultMap 已定义订单 7；JOIN 列 b_id=3、b_name=Alice。 -->
<association property="buyer" javaType="java.util.HashMap" notNullColumn="b_id">
  <id property="id" column="b_id"/>
  <result property="name" column="b_name"/>
</association>
<!-- 关键变化：买家列组合成 buyer，b_id 为 NULL 时不创建空对象。 -->
<!-- 结果：buyer={id:3,name:Alice}；LEFT JOIN 无匹配时 buyer 为 null。 -->
```

### `collection`：合并一对多明细

用途：用于把多个 JOIN 行合并成同一订单下的明细集合，避免重复根对象。

```xml
<!-- 初始状态：订单 7 的两行具有 l_id=11/12、l_sku=book/pen。 -->
<collection property="lines" javaType="java.util.ArrayList" ofType="java.util.HashMap" notNullColumn="l_id">
  <id property="id" column="l_id"/>
  <result property="sku" column="l_sku"/>
</collection>
<!-- 关键变化：相同 o_id 根身份合并，两个不同 l_id 产生两条 lines。 -->
<!-- 结果：lines.size=2；测试必须同时检查根订单数为 1。 -->
```

### `discriminator`：按状态选择映射

用途：用于根据数据库状态列选择明确的结果映射，支持不同类别的字段布局。

```xml
<!-- 初始状态：o_state=CANCELLED；同 namespace 已定义 cancelled resultMap。 -->
<discriminator javaType="String" column="o_state">
  <case value="CANCELLED" resultMap="cancelled"/>
</discriminator>
<!-- 关键变化：CANCELLED 分支选择 cancelled，其他值保留原 resultMap。 -->
<!-- 结果：取消订单只包含 cancelled 显式定义的字段，不自动继承原关联。 -->
```

### `choose`：选取互斥条件

用途：用于在多个候选筛选条件中只使用第一个匹配分支，明确没有输入时的默认范围。

```xml
<!-- 初始状态：state=PAID；片段位于 where 中，值通过 #{} 绑定。 -->
<choose>
  <when test="state != null">AND state=#{state}</when>
  <otherwise>AND state='PAID'</otherwise>
</choose>
<!-- 关键变化：非空 state 生成参数占位符，不采用 otherwise 字面量。 -->
<!-- 结果：BoundSql 含一个 state 参数；state=null 才走固定 PAID 默认分支。 -->
```

### `where`：处理条件前缀

用途：用于在存在条件时追加 WHERE 并去掉首个 AND/OR，避免手工拼接出无效 SQL。

```xml
<!-- 初始状态：id=7；放在 SELECT id FROM orders 后，查询仍须业务约束。 -->
<where>
  <if test="id != null">AND id=#{id}</if>
</where>
<!-- 关键变化：AND id 转为 WHERE id；空条件不产生 WHERE。 -->
<!-- 结果：id=7 时 SQL 为 SELECT id FROM orders WHERE id=?。 -->
```

空条件并不会自动产生 `WHERE 1=0`，而可能扩大范围；调用层必须拒绝不允许的空筛选，尤其写入不能使用这种可省略的主键条件。

### `trim`：定制动态片段边界

用途：用于显式规定前缀与需要删除的连接词，适合标准 where/set 之外的 SQL 组合。

```xml
<!-- 初始状态：id=7，trim 的 prefixOverrides 包含 AND 后的空格。 -->
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  <if test="id != null">AND id=#{id}</if>
</trim>
<!-- 关键变化：非空内容移除开头 AND 后追加 WHERE。 -->
<!-- 结果：生成 WHERE id=?；空内容不输出前缀。 -->
```

### `set`：移除更新字段尾逗号

用途：用于生成 UPDATE 的字段列表，减少多个可选字段导致的逗号错误。

```xml
<!-- 初始状态：state=CANCELLED，id=7；调用层已拒绝所有字段为空的更新。 -->
<update id="changeState">
  <!-- 风险：UPDATE 仅限已授权主键 WHERE 范围，拒绝空更新并检查影响行数。 -->
  UPDATE orders
  <set><if test="state != null">state=#{state},</if></set>
  WHERE id=#{id}
</update>
<!-- 关键变化：set 删除尾逗号，主键 WHERE 不随字段输入被省略。 -->
<!-- 结果：生成 UPDATE orders SET state=? WHERE id=?；应检查影响行数=1。 -->
```

这里只验证 SQL 形状；写入前检查租户/权限、主键和影响行数，禁止省略 WHERE 扩大到全表。set 不验证业务状态转移或保护并发更新。

### `foreach`：绑定集合中的每一个值

用途：用于在已确认非空的集合上生成 IN 占位符，避免拼接用户输入。

```xml
<!-- 初始状态：ids=[7,8]；调用层或 choose 分支已处理 null/空集合。 -->
<foreach collection="ids" item="id" open="(" separator="," close=")">
  #{id}
</foreach>
<!-- 关键变化：两个元素生成 (?,?)，每个 id 都是独立绑定参数。 -->
<!-- 结果：参数映射数量为 2；不是文本 7,8 直接拼接到 SQL。 -->
```

### `selectKey`：读取同一连接的生成键

用途：用于在没有采用 JDBC useGeneratedKeys 的映射中明确生成键读取时机与目标属性。

```xml
<!-- 初始状态：可变 Map 参数含 state=PAID；orders.id 为 AUTO_INCREMENT。 -->
<insert id="insertWithKey" parameterType="map">
  INSERT INTO orders(state) VALUES(#{state})
  <selectKey keyProperty="id" resultType="long" order="AFTER">
    SELECT LAST_INSERT_ID()
  </selectKey>
</insert>
<!-- 关键变化：插入后在同一事务连接读取生成键，写回参数 Map 的 id。 -->
<!-- 结果：id 等于这个插入的实际生成键；不按 MAX(id)+1 猜测。 -->
```

这个 MySQL 示例避免跨连接读取；单行可以直接使用 JDBC useGeneratedKeys，BATCH 中 selectKey 的执行/键分配时机要按真实驱动和执行器测试，不能推广为通用批量键方案。

### `XMLMapperBuilder.parse`：验证复杂 resultMap

用途：用于在连接数据库前解析 Mapper 文件，及早发现映射引用、重复 ID 和类型错误。

```java
// 初始状态：src/test/resources/OrderMapper.xml 是下方 Mapper，类名用 java.util.Map 便于独立解析。
org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
try (java.io.InputStream stream = java.nio.file.Files.newInputStream(
        java.nio.file.Path.of("src/test/resources/OrderMapper.xml"))) {
    org.apache.ibatis.builder.xml.XMLMapperBuilder parser = new org.apache.ibatis.builder.xml.XMLMapperBuilder(
        stream, configuration, "OrderMapper.xml", configuration.getSqlFragments());
    parser.parse();
    // 关键变化：文件中的订单对象图映射进入 configuration，尚未执行查询。
    org.junit.jupiter.api.Assertions.assertTrue(configuration.hasResultMap("lesson.OrderMapper.order"));
    // 结果：resultMap 可解析；行合并与 SQL 正确性还需真实 MySQL 测试。
}
```

对应完整文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lesson.OrderMapper">
  <resultMap id="order" type="java.util.HashMap">
    <id property="id" column="o_id"/>
    <result property="state" column="o_state"/>
    <association property="buyer" javaType="java.util.HashMap" notNullColumn="b_id">
      <id property="id" column="b_id"/>
      <result property="name" column="b_name"/>
    </association>
    <collection property="lines" javaType="java.util.ArrayList" ofType="java.util.HashMap" notNullColumn="l_id">
      <id property="id" column="l_id"/>
      <result property="sku" column="l_sku"/>
    </collection>
    <discriminator javaType="String" column="o_state">
      <case value="CANCELLED" resultMap="cancelled"/>
    </discriminator>
  </resultMap>
  <resultMap id="cancelled" type="java.util.HashMap">
    <id property="id" column="o_id"/>
    <result property="state" column="o_state"/>
  </resultMap>
  <select id="find" resultMap="order">
    SELECT o.id o_id,o.state o_state,b.id b_id,b.name b_name,l.id l_id,l.sku l_sku
    FROM orders o LEFT JOIN buyers b ON b.id=o.buyer_id
    LEFT JOIN order_lines l ON l.order_id=o.id WHERE o.id=#{id}
  </select>
</mapper>
```

具体测试 fixture 为订单 7、买家 3 和行 11/12，预期一张订单、一个 buyer、两条 lines。Map 没有可反射的 lines 属性类型，collection 必须明确 `javaType="java.util.ArrayList"`；只有 `ofType` 不足以确定容器类型。每层 `<id>` 负责身份合并；遗漏它可能导致重复对象和额外开销。LEFT JOIN 没有明细时 `notNullColumn` 避免创建空子对象。discriminator 的 cancelled 映射故意只含 id/state，不会自动继承 order 的 buyer/lines；业务需要这些字段应显式定义。

### `Configuration.getMappedStatement`：核对动态 SQL 与参数

用途：用于检查 Mapper 渲染出的 SQL 和参数映射，防止空条件、空集合或输入拼接改变查询范围。

```java
// 初始状态：configuration 已解析下方 SearchMapper.xml，测试参数只请求 PAID 状态和 ID 7/8。
org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
try (java.io.InputStream stream = java.nio.file.Files.newInputStream(java.nio.file.Path.of("src/test/resources/SearchMapper.xml"))) {
    new org.apache.ibatis.builder.xml.XMLMapperBuilder(stream, configuration, "SearchMapper.xml", configuration.getSqlFragments()).parse();
}
java.util.Map<String, Object> parameters = java.util.Map.of("state", "PAID", "ids", java.util.List.of(7L, 8L));
org.apache.ibatis.mapping.BoundSql bound = configuration.getMappedStatement("lesson.SearchMapper.search").getBoundSql(parameters);
// 关键变化：where/foreach 根据固定参数产生条件与三个占位符，没有拼入 PAID 文本。
org.junit.jupiter.api.Assertions.assertEquals(3, bound.getParameterMappings().size());
org.junit.jupiter.api.Assertions.assertFalse(bound.getSql().contains("PAID"));
// 结果：state 和两个 ID 经 #{...} 绑定；仍应执行真实查询验证行结果。
```

对应 Mapper 的查询部分（补上上节相同 XML 声明和 DOCTYPE）：

```xml
<mapper namespace="lesson.SearchMapper">
  <select id="search" resultType="map">
    SELECT id,state FROM orders
    <where>
      <choose>
        <when test="state != null">AND state=#{state}</when>
        <otherwise>AND state='PAID'</otherwise>
      </choose>
      <choose>
        <when test="ids != null and ids.size() > 0">
          AND id IN <foreach collection="ids" item="id" open="(" separator="," close=")">#{id}</foreach>
        </when>
        <otherwise>AND 1=0</otherwise>
      </choose>
    </where>
    ORDER BY id
  </select>
</mapper>
```

`where` 去掉开头 AND/OR，`trim prefix="WHERE" prefixOverrides="AND |OR "` 可表达同类规则；`set` 删除更新字段最后的逗号。空集合语义必须业务定义：此例返回空而非查询全部。更新使用 `set` 之前要求至少一个可写字段，且 WHERE 固定主键/租户范围。`#{}` 绑定值；`${}` 原样替换，排序列只能由服务端白名单选出常量，绝不能接受请求里的 SQL 片段。租户、权限条件不能只依赖“前端已经过滤”。

### `SqlSession.flushStatements`：执行批次但不误认为提交

用途：用于把 BATCH 缓冲的语句发送到数据库，并检查计数后决定提交或回滚。

```java
// 初始状态：factory 已配置隔离 MySQL，lesson.Writer.insert 为明确的测试插入映射。
org.apache.ibatis.session.SqlSessionFactory factory = testFactory;
try (org.apache.ibatis.session.SqlSession session = factory.openSession(org.apache.ibatis.session.ExecutorType.BATCH, false)) {
    session.insert("lesson.Writer.insert", java.util.Map.of("id", 701L, "state", "PAID"));
    session.insert("lesson.Writer.insert", java.util.Map.of("id", 702L, "state", "PAID"));
    java.util.List<org.apache.ibatis.executor.BatchResult> batches = session.flushStatements();
    // 关键变化：两次写入已发送到事务连接；尚未 commit，对外未承诺持久化。
    org.junit.jupiter.api.Assertions.assertFalse(batches.isEmpty());
    session.rollback();
    // 结果：本例主动回滚；另一个连接必须查不到 701/702，不能把非空 batches 当提交成功。
}
```

`testFactory` 是测试 fixture 提供的变量。BATCH 的 insert 返回值不等于受影响行数；查看 BatchResult 和 JDBC `SUCCESS_NO_INFO`/`EXECUTE_FAILED`，失败可能部分执行。回滚必须处理异常并保留根因；批量生成键应实测驱动，不按连续 ID 猜测。映射 `useGeneratedKeys="true" keyProperty="id"` 使用 JDBC 生成键；`selectKey order="BEFORE|AFTER"` 是另一方案，不能用并发不安全的 MAX(id)+1。参见[JDBC 批量](/courses/java/11-MySQL-8/12-Java-JDBC与MyBatis衔接)。Spring 管理的 Mapper 应由同一事务资源和匹配的 BATCH SqlSessionTemplate 驱动，不能手工 commit Spring 管理 session。

### `SqlSession.clearCache`：识别一级缓存边界

用途：用于清除当前 SqlSession 的查询缓存，以便在同一 session 内显式重新读取。

```java
// 初始状态：factory 对应测试数据库；selectOne lesson.OrderMapper.find 的订单 7 存在。
org.apache.ibatis.session.SqlSessionFactory factory = testFactory;
try (org.apache.ibatis.session.SqlSession session = factory.openSession()) {
    Object first = session.selectOne("lesson.OrderMapper.find", java.util.Map.of("id", 7L));
    session.clearCache();
    // 关键变化：当前 session 的一级缓存被清除；数据库隔离快照并未因此改变。
    Object second = session.selectOne("lesson.OrderMapper.find", java.util.Map.of("id", 7L));
    org.junit.jupiter.api.Assertions.assertNotNull(first);
    org.junit.jupiter.api.Assertions.assertNotNull(second);
    // 结果：两次均返回订单；用 SQL 日志/查询计数确认重新执行，而不是断言对象引用不同。
}
```

一级缓存默认 SESSION，`localCacheScope=STATEMENT` 可限制为语句范围；更新、提交、回滚和关闭也影响缓存。二级缓存需要 Mapper `<cache/>` 等配置，在事务完成时传播并按 namespace 失效，多个 namespace 联表或外部写入可能导致陈旧结果；高一致性业务通常禁用二级缓存并显式设计缓存。缓存对象不要随意修改后再复用。

### `PaginationInnerInterceptor`：分页数据库行

用途：用于让 MyBatis-Plus 按页执行有限查询，并把分页行为纳入可测试配置。

```java
// 初始状态：MySQL 8.0，分页大小教学上限为 100，插件在配置中只注册一次。
com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor pagination =
    new com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor(com.baomidou.mybatisplus.annotation.DbType.MYSQL);
pagination.setMaxLimit(100L);
com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor plugins =
    new com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor();
plugins.addInnerInterceptor(pagination);
// 关键变化：配置集合增加分页插件；最终 SQL、count 和 JOIN 优化必须在真实查询中观察。
org.junit.jupiter.api.Assertions.assertEquals(1, plugins.getInterceptors().size());
// 结果：插件数量为 1；请求层仍须验证页码/大小和排序白名单。
```

多插件组合通常把分页放最后，按官方版本规则确认。JOIN 一对多直接分页的是行，不是聚合根；先分页查订单 ID，再一次批量查详情，避免残缺 collection。懒加载嵌套查询每张订单再查一次明细会产生 N+1；用 SQL 计数测量，改 JOIN 或批量 IN，不能只看响应时间。大 offset 改用唯一稳定排序的游标分页，count 不等于事务快照。

### `LambdaQueryWrapper`：受控构建条件

用途：用于以实体方法引用构造条件，避免把外部输入直接当列名或 SQL 片段。

```java
// 初始状态：实体 User 拥有 id/state getter；请求 state 只能来自业务允许值。
class User {
    private Long id;
    private String state;
    public Long getId() { return id; }
    public String getState() { return state; }
}
com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<User> wrapper =
    new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
wrapper.eq(User::getState, "ACTIVE").orderByAsc(User::getId);
// 关键变化：只接受固定字段与 ACTIVE 参数，包装器不携带任意外部 SQL。
org.junit.jupiter.api.Assertions.assertFalse(wrapper.isEmptyOfWhere());
// 结果：存在 WHERE 条件；完整列解析需 MP 实体元数据和 Mapper 测试。
```

`${}`、`last`、`apply`、`inSql` 都可能接受 SQL 文本；不能因为调用的是 Wrapper 就允许用户直接传入。Wrapper 是可变对象，不在多请求/多线程间复用；删除/更新必须独立检查主键、租户和影响行数。

### `OptimisticLockerInnerInterceptor`：检查版本冲突

用途：用于在更新带版本字段的实体时追加版本条件，发现并发修改而非静默覆盖。

```java
// 初始状态：工程实体用 @Version 标记 version，数据库行 id=7/version=2。
com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor optimistic =
    new com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor();
com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor plugins =
    new com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor();
plugins.addInnerInterceptor(optimistic);
// 关键变化：更新拦截器被注册；两份 version=2 的更新应只有第一份影响 1 行。
org.junit.jupiter.api.Assertions.assertEquals(1, plugins.getInterceptors().size());
// 结果：配置注册可验证；冲突测试必须检查第二次影响 0 行并转成业务冲突。
```

插件依赖受支持的方法与实体参数规则，任意自定义 SQL 不会自动安全；`update(entity, wrapper)` 的 wrapper 不应复用。乐观锁不替代唯一约束，也不意味着可以无限自动重试。依据：[MP 乐观锁](https://baomidou.com/en/plugins/optimistic-locker/)。

### `BaseTypeHandler`：明确类型转换和 NULL

用途：用于把 Java 状态枚举映射为数据库字符串，并在 NULL 读取时保留空值语义。

```java
// 初始状态：数据库 state 保存 PAID/CANCELLED；SQL NULL 对应 Java null。
enum OrderState { PAID, CANCELLED }
class StateHandler extends org.apache.ibatis.type.BaseTypeHandler<OrderState> {
    public void setNonNullParameter(java.sql.PreparedStatement ps, int i, OrderState value, org.apache.ibatis.type.JdbcType type) throws java.sql.SQLException { ps.setString(i, value.name()); }
    public OrderState getNullableResult(java.sql.ResultSet rs, String column) throws java.sql.SQLException { return decode(rs.getString(column)); }
    public OrderState getNullableResult(java.sql.ResultSet rs, int column) throws java.sql.SQLException { return decode(rs.getString(column)); }
    public OrderState getNullableResult(java.sql.CallableStatement cs, int column) throws java.sql.SQLException { return decode(cs.getString(column)); }
    static OrderState decode(String value) { return value == null ? null : OrderState.valueOf(value); }
}
// 关键变化：PAID 可逆转换，未知数据库值明确失败而非悄悄变成 PAID。
org.junit.jupiter.api.Assertions.assertNull(StateHandler.decode(null));
org.junit.jupiter.api.Assertions.assertEquals(OrderState.PAID, StateHandler.decode("PAID"));
// 结果：两个解码分支确定；还需注册 handler 并执行 JDBC 读写验证。
```

### `@Intercepts`：限制插件的拦截范围

用途：用于声明 MyBatis 插件只拦截指定签名，避免把所有调用当作 SQL 执行入口。

```java
// 初始状态：教学插件只计数 StatementHandler.prepare，不打印 SQL 或参数。
@org.apache.ibatis.plugin.Intercepts(@org.apache.ibatis.plugin.Signature(
    type=org.apache.ibatis.executor.statement.StatementHandler.class,
    method="prepare", args={java.sql.Connection.class, Integer.class}))
class PrepareCounter implements org.apache.ibatis.plugin.Interceptor {
    final java.util.concurrent.atomic.AtomicInteger calls = new java.util.concurrent.atomic.AtomicInteger();
    public Object intercept(org.apache.ibatis.plugin.Invocation invocation) throws Throwable {
        calls.incrementAndGet();
        // 关键变化：每次真实 prepare 增加计数，然后保留原调用和异常传播。
        return invocation.proceed();
    }
}
// 结果：执行两条未缓存查询应观测 calls=2；缓存命中和批处理不能简单按方法数推算。
```

插件顺序、缓存与执行器会改变拦截次数。生产 SQL 日志应脱敏、限长、采样，密码/令牌不能输出；查慢 SQL 应记录语句标识、耗时和行数，避免拼接完整参数。用 Testcontainers 对映射、空集合、并发版本、缓存失效、批次失败和插件组合建立回归。

## 易混点

解析 XML 通过只是静态证据，不验证 JOIN 数据；flush 不是 commit；clearCache 不更新隔离快照；SQL 分页不是对象图分页。Wrapper、插件、缓存都不会自动承担授权和一致性职责。

## 课后小问

1. JOIN 两条明细为什么需要子对象 id？答案：定义身份。解析：映射器才能合并同一订单并去重明细。
2. 为什么空 ids 不应直接省略 IN？答案：可能扩大为全表查询。解析：业务规定空结果或拒绝请求。
3. 乐观锁第二次更新返回 0 怎么处理？答案：报告冲突并重读。解析：不能把 0 当成功或盲目覆盖最新值。

## 本节小结

ORM 的生产能力取决于生成 SQL、映射身份、事务资源和真实测试。显式边界比增加插件更能减少误用。

## 快速回顾

先查 SQL/映射 → 固定参数和空集合 → 区分 flush/commit → 验证分页对象完整性 → 限制缓存与插件 → 白名单/脱敏 → 真实 MySQL 回归。
