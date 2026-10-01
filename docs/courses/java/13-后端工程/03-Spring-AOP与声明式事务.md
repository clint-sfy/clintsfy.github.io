---
title: Spring AOP 与声明式事务
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - Spring AOP
  - 事务
  - '@Transactional'
description: 速查 Spring 切点、环绕通知、事务传播隔离、回滚规则与自调用边界。
---

# Spring AOP 与声明式事务

## 学习目标

- 能写出 `@Aspect`、`@Pointcut` 和 `@Around` 的最小切面，并正确调用 `proceed`。
- 能按传播行为、隔离级别、只读和回滚规则解释 `@Transactional` 的效果。
- 能识别代理边界、自调用、异步线程和外部 I/O 对事务的一致性影响。

## 核心知识点

### 专业术语

- **AOP（Aspect-Oriented Programming）**：把日志、计时、权限等横切关注点抽成通知，由切点决定织入范围。
- **切点（pointcut）**：描述哪些连接点需要被拦截的表达式，例如按注解或包路径匹配方法。
- **环绕通知（around advice）**：在目标方法前后包裹执行，可决定是否调用 `proceed`、修改参数或转换异常。
- **事务传播（propagation）**：一个事务方法被另一个事务方法调用时，决定加入、挂起还是创建事务。
- **隔离级别（isolation）**：数据库并发读写时控制脏读、不可重复读和幻读的策略；最终受数据库实现约束。

### 白话解释与边界

AOP 代理像门卫：调用从代理入口进入时，门卫可以计时、校验或开启事务；目标对象内部用 `this` 调用则绕过门卫。`proceed` 是环绕通知继续执行目标方法的开关，不调用它就会短路业务。

Spring 声明式事务通常绑定当前线程和数据源资源，事务边界应包住一组数据库写操作。它不是跨服务、跨线程或跨消息系统的全局事务；网络调用、文件写入和外部事件需要单独设计一致性。数据库实际锁和隔离行为仍要回到 JDBC 与数据库文档验证。

## 常用用法

### @Aspect/@Pointcut：声明切点

用途：用于集中匹配一类服务方法，让日志或指标逻辑与业务代码分离；切点应尽量窄且可读。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
class AuditAspect {
    @Pointcut("execution(* com.example.service..*(..))")
    void serviceOperation() {}

    String pointcutName() {
        return "serviceOperation";
    }
}

System.out.println(new AuditAspect().pointcutName());
// 输出：serviceOperation
```

切点表达式写错时可能静默匹配不到目标，也可能范围过宽造成性能和日志噪声。优先按稳定注解或明确包路径匹配，并用一个真实调用验证切面是否进入。

### @Around：包裹目标调用

用途：用于在目标方法前后统一计时、记录结果或转换异常；正常路径必须调用 `proceed` 并保留返回值。

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

@Aspect
class TimingAspect {
    @Around("execution(* com.example.service..*(..))")
    Object time(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.nanoTime();
        Object result = joinPoint.proceed();
        System.out.println("elapsed=" + (System.nanoTime() - start >= 0));
        // 输出：elapsed=true
        return result;
    }
}
```

不要在通知里吞掉目标异常或无条件改写返回类型；异步方法还要确认计时点是提交任务还是任务真正完成。通知中访问参数时注意敏感数据脱敏和大对象开销。

### proceed：继续执行目标方法

用途：用于在环绕通知中决定是否进入目标方法；权限拒绝或短路缓存命中时可以有意识地不调用它。

```java
import org.aspectj.lang.ProceedingJoinPoint;

class Guard {
    Object invoke(ProceedingJoinPoint joinPoint, boolean allowed) throws Throwable {
        if (!allowed) {
            System.out.println("denied");
            // 输出：denied
            return null;
        }
        return joinPoint.proceed();
    }
}
```

短路必须有明确的返回契约；对写操作只因为缓存命中而跳过 `proceed` 可能造成状态不一致。重新抛出异常时要保留原始 cause，避免排障信息被覆盖。

### @Transactional：声明事务边界

用途：用于让一个公开的代理方法在同一事务资源上执行多步数据库操作；方法应放在服务边界而不是每个简单 DAO 调用上。

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class TransferService {
    @Transactional
    public void transfer() {
        System.out.println("debit then credit");
        // 输出：debit then credit
    }
}
```

事务提交通常发生在代理方法正常返回之后；运行时异常默认触发回滚，受检异常需显式配置或由事务管理器策略决定。连接池、事务管理器和数据源必须指向同一业务边界。

### 传播/隔离/回滚/只读：表达事务策略

用途：用于把调用嵌套、并发可见性、异常回滚和读写意图写成可审查的事务配置，而不是依赖默认值。

```java
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

class ReportService {
    @Transactional(
        propagation = Propagation.REQUIRED,
        isolation = Isolation.READ_COMMITTED,
        readOnly = true,
        rollbackFor = IllegalArgumentException.class)
    void loadSummary() {
        System.out.println("read summary");
        // 输出：read summary
    }
}
```

`REQUIRED` 会加入当前事务或创建新事务；`REQUIRES_NEW` 会挂起外层事务并占用额外连接。`readOnly` 是意图和优化提示，不是数据库权限控制；隔离级别和锁行为要与 MySQL 8.0 等实际数据库配置核对。

### 自调用：识别代理绕过

用途：用于定位“注解存在但事务/切面没生效”的问题；同一对象内的 `this` 调用不会重新经过 Spring 代理。

```java
import org.springframework.transaction.annotation.Transactional;

class OrderService {
    void submit() {
        this.writeAudit();
        System.out.println("self call completed");
        // 输出：self call completed
    }

    @Transactional
    void writeAudit() {
        System.out.println("audit");
    }
}
```

把事务方法拆到另一个 Bean 是首选修复；也可以从外部注入代理调用，但不要让业务代码依赖 `AopContext.currentProxy()` 这种隐式约束。私有方法和最终限制也可能无法被代理拦截。

## 不常用但需要知道

### @Order：确定多个通知顺序

用途：用于明确安全、事务、日志等多个切面的先后关系；顺序值越小通常越外层，但要以实际代理组合验证。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.core.annotation.Order;

@Aspect
@Order(1)
class SecurityAspect {
    @Before("execution(* com.example..service..*(..))")
    void check() {
        System.out.println("security-first");
        // 输出：security-first
    }
}
```

多个模块各自声明顺序时容易产生隐式耦合，应集中记录顺序契约。不要假设 `@Order` 能解决事务资源本身的竞态，它只排列拦截器进入和退出的嵌套关系。

### TransactionTemplate：程序化事务

用途：用于事务边界需要由运行时分支决定，或需要明确区分多个事务块时；普通固定服务边界优先 `@Transactional`。

```java
import org.springframework.transaction.support.TransactionTemplate;

class ImportService {
    private final TransactionTemplate template;

    ImportService(TransactionTemplate template) {
        this.template = template;
    }

    String importOne() {
        return template.execute(status -> {
            System.out.println("imported");
            // 输出：imported
            return "ok";
        });
    }
}
```

回调返回 `null` 仍可能是成功事务；需要回滚时调用 `status.setRollbackOnly()` 或抛出符合策略的异常。程序化事务让边界更显式，也让测试和异常分支需要承担更多样板代码。

### 回滚规则：区分异常类型与补偿

用途：用于决定哪些异常触发数据库回滚；回滚只影响当前事务资源，不会自动撤销邮件、远程调用或文件写入。

```java
import org.springframework.transaction.annotation.Transactional;

class BillingService {
    @Transactional(rollbackFor = Exception.class)
    void charge() throws Exception {
        System.out.println("charge in transaction");
        // 输出：charge in transaction
    }
}
```

`noRollbackFor` 会覆盖特定异常的默认行为，规则越多越要写测试验证。跨资源副作用应使用事务事件、可靠消息或补偿流程，不能把数据库回滚当作全局撤销按钮。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：批量事务写入前先确认列表顺序、重复项和视图是否独立。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：按主键聚合写入或统计异常时查 `merge` 和并发单键语义。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：切点、日志和异常消息涉及文本匹配时查字面/正则边界。
- [JDBC 与事务](/courses/java/11-工程实践/02-JDBC与事务)：理解连接、提交、回滚、隔离级别和资源释放的底层边界。

## 简单案例

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

interface Ledger {
    void debit(String account, int amount);
    void credit(String account, int amount);
}

@Service
class PaymentService {
    private final Ledger ledger;

    PaymentService(Ledger ledger) {
        this.ledger = ledger;
    }

    @Transactional(rollbackFor = IllegalStateException.class)
    public void transfer(String from, String to, int amount) {
        ledger.debit(from, amount);
        ledger.credit(to, amount);
        System.out.println("transfer committed");
        // 输出：transfer committed
    }
}
```

示例把两次账户变更放在同一服务代理边界，任一步抛出符合规则的异常都会回滚数据库事务。实际系统还要校验余额、锁顺序、幂等键和死锁重试；不要在事务中执行不可控的远程调用。

## 易混点

- `@Transactional` 写在方法上不等于一定生效，调用必须经过 Spring 代理，且目标方法要符合代理限制。
- `readOnly` 表达读意图，不是禁止写入的安全机制；数据库与驱动可能只提供优化而非强制拒绝。
- `REQUIRES_NEW` 会挂起外层事务并消耗额外连接，不能把它当作免费的“嵌套事务”。
- 默认回滚通常偏向运行时异常；受检异常、`rollbackFor` 与 `noRollbackFor` 要按异常类型验证。
- 数据库回滚不能撤销消息、文件和远程副作用，跨资源场景需要事件、幂等或补偿设计。

## 课后小问

1. 为什么同一个类里的 `this.writeAudit()` 可能没有事务？
答案：它绕过了 Spring 代理，直接调用目标对象的方法，事务拦截器没有机会开启事务。
解析：把方法拆到另一个 Bean 或从外部注入代理后调用，才能使代理边界清晰；同时要确认方法可被代理机制拦截。

2. `readOnly = true` 是否能阻止所有写 SQL？
答案：不能，它主要表达读取意图并给事务管理器和数据库优化机会。
解析：不同驱动和数据库对只读的执行强度不同，真正的权限约束仍需数据库账号和应用层设计。

3. 为什么事务中不建议直接调用慢的远程服务？
答案：远程延迟会让数据库连接和锁长时间占用，增加超时、阻塞和死锁风险。
解析：应缩短事务、使用可靠消息或事务事件，并让远程调用具备幂等和补偿策略。

## 本节小结

- AOP 通过切点和代理织入横切逻辑，环绕通知要明确 `proceed`、异常与返回值。
- `@Transactional` 应放在清晰的服务代理边界，传播、隔离、只读和回滚规则要可验证。
- 自调用、私有/最终方法和跨线程调用都可能越过代理或线程绑定的事务边界。
- 数据库事务只管理已纳入的事务资源，外部副作用需要事件、幂等和补偿设计。

## 快速回顾

- 能写出 `@Aspect`、`@Pointcut`、`@Around` 和 `proceed` 的最小结构。
- 能解释 `REQUIRED`、`REQUIRES_NEW`、隔离级别与回滚规则的区别。
- 能定位自调用导致的事务失效，并选择拆分 Bean 等修复方式。
- 能说明事务与连接池、JDBC、数据库锁及外部 I/O 的边界。

