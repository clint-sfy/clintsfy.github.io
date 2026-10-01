---
title: MyBatis 核心与 MyBatis-Plus 重点
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - MyBatis
  - MyBatis-Plus
  - 持久化
description: 先掌握原生 MyBatis XML、参数绑定与事务边界，再对照 MyBatis-Plus 的 CRUD、Wrapper 和分页取舍。
---

# MyBatis 核心与 MyBatis-Plus 重点

## 学习目标

- 能写出带参数绑定、动态条件和结果映射的原生 MyBatis mapper XML。
- 能说明 Mapper、Service、事务和分页插件各自负责什么，以及批量写入的资源边界。
- 能使用 MyBatis-Plus 的 `BaseMapper`、`IService`、Wrapper 和分页能力，并判断何时保留原生 XML。

## 核心知识点

### 专业术语

- **SqlSession 与 Mapper**：SqlSession 管理一次数据库交互上下文；Mapper 接口把方法声明映射到 XML 或注解 SQL。
- **Mapper XML**：以 `namespace` 和语句 `id` 把 Java 方法连接到 `&lt;select&gt;`、`&lt;insert&gt;` 等 SQL 定义。
- **参数绑定**：`#{}` 使用预编译参数绑定值；`${}` 是文本替换，只能用于经过白名单校验的标识符场景。
- **结果映射（result mapping）**：用 `resultType` 或 `resultMap` 把列名、别名和嵌套对象映射到 Java 类型。
- **MyBatis-Plus（MP）**：建立在 MyBatis 之上的独立扩展，提供 `BaseMapper`、`IService`、Wrapper 和分页插件等约定。

### 白话解释与边界

MyBatis 不是自动替你猜 SQL 的黑盒，而是把 SQL、参数和结果映射组织成可审查的调用。Mapper 负责数据访问，业务事务通常在 Service 边界开启；`#{}` 能把值交给 JDBC 预编译，不能用 `${}` 拼接用户输入。动态 SQL 方便组合条件，但条件分支越多越需要测试空条件、空集合和重复列名。

MyBatis-Plus 减少简单 CRUD 的样板，但它仍然需要正确的表映射、事务配置、分页拦截器和数据库索引。本文把 MP 作为独立扩展知识示例，不能把示例当作某个样本已经采用 MyBatis-Plus 的证据；实际项目应以自己的依赖、版本和团队约束为准。Spring Boot 4.1.0、MyBatis Spring Boot 4.1.0 与 MP 不是同一套版本号，升级时要分别查兼容矩阵。

本文按 JDK 20 的写法组织 Java 片段；代码不依赖 JDK 20 之后的 API。覆盖样本的 Java 基线为 Java 17，框架片段需要容器、数据源和实际数据库才能运行，不能把独立片段当成完整应用配置。

## 常用用法

### XML &lt;select&gt;/&lt;insert&gt;：声明基础 CRUD

用途：用于把查询和写入 SQL 放在可审查的 mapper XML 中，并用 `namespace` 与 Mapper 接口方法建立稳定映射。

```sql
-- XML 元素名称：<select> / <insert>
<mapper namespace="example.UserMapper">
  <select id="findById" resultType="example.User">
    SELECT id, username FROM app_user WHERE id = #{id}
  </select>
  <insert id="insert">
    INSERT INTO app_user(username) VALUES (#{username})
  </insert>
</mapper>
-- 输出：findById(7) 返回一行，insert 返回影响行数 1
```

`id` 应与接口方法名和参数契约一致；SQL 仍应在数据库中用执行计划验证，XML 不是绕过数据库约束的办法。

### #{}：安全参数绑定

用途：用于把用户或业务值作为预编译参数传给 JDBC，避免把值直接拼进 SQL 文本；动态表名不能靠它替换。

```sql
<select id="findActive" resultType="example.User">
  SELECT id, username FROM app_user
  WHERE status = #{status} AND username = #{username}
</select>
-- 输出：status 与 username 作为绑定参数传入，不改变 SQL 结构
```

`${column}` 会做文本替换，只能接收代码控制的白名单，例如 `created_at` 或 `id`；外部输入必须先映射成枚举或固定字典，不能直接透传。

### 动态 &lt;if&gt;/&lt;foreach&gt;：组合条件与批量操作

用途：用于按可选条件拼接查询或生成受控批量语句，并在空集合时避免产生非法 SQL。

```sql
-- 动态元素名称：<if> / <foreach>
<select id="search" resultType="example.User">
  SELECT id, username FROM app_user
  <where>
    <if test="username != null and username != ''">
      username LIKE CONCAT('%', #{username}, '%')
    </if>
    <if test="ids != null and !ids.isEmpty()">
      AND id IN
      <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
      </foreach>
    </if>
  </where>
</select>
-- 输出：有 ids 时生成 IN (?, ?)，空 ids 时不生成 IN ()
```

`&lt;where&gt;` 会处理首个 `AND`，但不会替业务决定空条件是否允许全表查询；写入批量要控制集合大小和事务时长。

### 结果映射：处理列名与嵌套对象

用途：用于把数据库列、别名和嵌套关系明确映射到 Java 对象，避免依赖不稳定的自动命名猜测。

```sql
<resultMap id="userMap" type="example.User">
  <id property="id" column="user_id"/>
  <result property="name" column="user_name"/>
</resultMap>
<select id="find" resultMap="userMap">
  SELECT id AS user_id, username AS user_name FROM app_user WHERE id = #{id}
</select>
-- 输出：列 user_id/user_name 映射到 User.id/name
```

一对多映射需要谨慎处理重复行和分页；如果联表结果复杂，拆成多次查询或在 Service 聚合通常比深层嵌套映射更容易观测。

## 不常用但需要知道

### BaseMapper：复用通用 CRUD

用途：用于让实体 Mapper 获得按主键查询、插入、更新和删除等通用方法，适合表结构与 CRUD 语义稳定的场景。

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

record User(Long id, String username) {}
interface UserMapper extends BaseMapper<User> {}

class UserReader {
    private final UserMapper mapper;

    UserReader(UserMapper mapper) {
        this.mapper = mapper;
    }

    void showName() {
        User user = mapper.selectById(7L);
        System.out.println(user.username());
        // 输出：ann
    }
}
```

`UserMapper` 的实现由 MP 代理生成，`UserReader` 由容器注入 Mapper 后调用。复杂联表、数据库特性或强审计 SQL 仍应回到 XML/注解 SQL，不要为了少写几行而牺牲可读性。

### IService：组织服务层 CRUD

用途：用于把通用 CRUD 入口放在 Service 层，集中事务、权限和领域校验，而不是让控制器直接调用 Mapper。

```java
import com.baomidou.mybatisplus.extension.service.IService;

interface UserService extends IService<User> {}
record User(Long id, String username) {}

class UserFacade {
    private final UserService service;

    UserFacade(UserService service) {
        this.service = service;
    }

    boolean create() {
        boolean saved = service.save(new User(null, "ann"));
        System.out.println(saved);
        // 输出：true
        return saved;
    }
}
```

`UserService` 的实现通常由 `ServiceImpl<UserMapper, User>` 提供；`IService` 不是事务声明本身，写入多个表时仍要在明确的 Service 方法上配置事务，并验证异常、回滚和幂等行为。

### QueryWrapper/LambdaQueryWrapper：表达条件查询

用途：用于组合等值、范围和排序条件；Lambda 版本通过方法引用减少字符串列名拼写错误。

```java
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import java.time.Instant;

record User(String status, Instant createdAt) {}

LambdaQueryWrapper<User> query = new LambdaQueryWrapper<User>()
    .eq(User::status, "ACTIVE")
    .orderByDesc(User::createdAt);
System.out.println(query.getSqlSegment().contains("status"));
// 输出：true
```

Wrapper 只表达 SQL 条件，不自动替代输入校验、索引设计或业务授权；复杂子查询、窗口函数和方言 SQL 要评估 XML 是否更清晰。

### 分页：配合拦截器控制结果集

用途：用于把页码、排序白名单和总数查询封装到分页请求中，避免一次读取不受控的大结果集。

```java
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

class UserPager {
    private final UserMapper mapper;

    UserPager(UserMapper mapper) {
        this.mapper = mapper;
    }

    void show() {
        Page<User> page = new Page<>(2, 20);
        IPage<User> result = mapper.selectPage(page, new QueryWrapper<>());
        System.out.println(result.getCurrent() + "/" + result.getSize());
        // 输出：2/20
    }
}
```

MP 分页需要注册对应拦截器，并限制最大页大小；深分页应考虑 keyset/游标方案。总数查询、排序字段和过滤条件要与数据库索引一起审查。

### 原生 XML 对照：在复杂 SQL 处保留显式查询

用途：用于在联表、窗口函数、数据库方言或性能敏感场景保留完整 SQL，并与 Wrapper 的简单 CRUD 形成可解释对照。

```sql
<select id="findLatest" resultType="example.User">
  SELECT u.id, u.username
  FROM app_user u
  WHERE u.status = #{status}
  ORDER BY u.created_at DESC
  LIMIT #{limit}
</select>
-- 输出：复杂排序和 LIMIT 的 SQL 结构在 XML 中完整可审查
```

选择原生 XML 不表示放弃类型安全：接口参数、`#{}` 绑定、结果映射和测试仍应保持明确。反过来，简单单表 CRUD 用 MP 可降低重复代码，关键是按查询复杂度取舍。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：批量参数和分页结果涉及列表可变性、视图与快照时查边界。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：把列名、聚合结果或动态参数组织成键值映射时查视图和合并语义。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：处理 SQL 标识符白名单、日志和查询文本时查字面与正则边界。
- [JDBC 与事务](/courses/java/11-工程实践/02-JDBC与事务)：理解 MyBatis 底层连接、提交、回滚、隔离级别和资源管理。

## 简单案例

```sql
<select id="findForUpdate" resultMap="userMap">
  SELECT id AS user_id, username AS user_name, balance
  FROM account WHERE id = #{id} FOR UPDATE
</select>
```

```java
import org.springframework.transaction.annotation.Transactional;

class TransferService {
    private final AccountMapper mapper;

    TransferService(AccountMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional
    void transfer(long from, long to, int amount) {
        Account source = mapper.findForUpdate(from);
        Account target = mapper.findForUpdate(to);
        if (source.balance() < amount) {
            throw new IllegalStateException("insufficient balance");
        }
        mapper.debit(from, amount);
        mapper.credit(to, amount);
        System.out.println("transfer=" + from + "->" + to);
        // 输出：transfer=1->2
    }
}
```

框架片段需容器和真实数据源运行：Service 事务包住两次加锁查询与更新，Mapper XML 使用 `#{}` 绑定值；实际系统还要固定锁顺序、校验金额、处理死锁重试和幂等请求。

## 易混点

- `#{}` 是参数绑定，`${}` 是文本替换；后者只能接收白名单标识符，不能放用户输入。
- Mapper 接口只是声明，XML 的 `namespace`、语句 `id` 和方法参数必须一致，容器还要扫描到 Mapper。
- MyBatis 的事务边界通常由 Service 或 Spring 管理，SqlSession 的一次调用不等于完整业务事务。
- MyBatis-Plus 的通用 CRUD 不能覆盖所有联表和方言 SQL；复杂查询保留原生 XML 往往更易审查。
- 分页插件只解决结果集切分，不会自动建立索引，也不能消除深分页和排序不稳定问题。

## 课后小问

1. 为什么查询条件应优先使用 `#{}` 而不是 `${}`？
答案：`#{}` 把值作为预编译参数绑定，`\${}` 会把文本直接替换进 SQL。
解析：文本替换会改变 SQL 结构，外部输入可能造成注入；动态列名等少数场景也必须先经过白名单映射。

2. 什么时候应该保留原生 MyBatis XML 而不是改成 Wrapper？
答案：联表、窗口函数、数据库方言或性能敏感 SQL 需要完整表达和审计时应保留 XML。
解析：简单单表 CRUD 适合 MP 减少样板，复杂查询则要优先考虑 SQL 可读性、执行计划和回归测试。

3. 分页插件能否替代索引设计？
答案：不能，它只切分查询结果，过滤、排序和总数查询仍需要正确索引。
解析：深分页还会扫描并丢弃大量前置行；数据量增长后应评估 keyset 分页或游标，并限制单页大小。

## 本节小结

- Mapper XML 用 `namespace`、语句 `id`、`#{}` 和结果映射把 Java 方法连接到可审查 SQL。
- 动态 `&lt;if&gt;`/`&lt;foreach&gt;` 要处理空条件、空集合、批次大小和全表操作边界。
- MyBatis-Plus 的 `BaseMapper`、`IService`、Wrapper 和分页适合规则 CRUD，但不是所有 SQL 的替代品。
- Service 才是常见业务事务边界；复杂查询、锁和索引要回到数据库执行计划验证。

## 快速回顾

- 能解释 `#{}` 与 `${}` 的参数安全差异。
- 能写出带条件、批量和结果映射的 mapper XML。
- 能在简单 CRUD 与复杂 SQL 之间选择 MP 或原生 XML。
- 能说明分页、事务、锁和连接池不是同一个边界。
