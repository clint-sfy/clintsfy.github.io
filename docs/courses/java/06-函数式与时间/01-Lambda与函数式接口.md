---
title: Lambda 与函数式接口
date: 2026-09-22
category: Java系统补习
tags:
  - Java
  - Lambda
  - 函数式编程
description: 使用 Lambda、方法引用和函数式接口表达可组合的行为。
---

# Lambda 与函数式接口

## 学习目标

- 识别函数式接口并使用 `Predicate`、`Function`、`Consumer`、`Supplier`。
- 掌握 Lambda 参数、返回值、捕获变量和方法引用语法。
- 理解闭包、有效 final、组合操作与可读性边界。

## 核心知识点

函数式接口只有一个抽象方法，可用 `@FunctionalInterface` 声明意图；default/static 方法不影响这一条件。Lambda 捕获的局部变量必须是 final 或 effectively final，实例字段则按对象生命周期访问。方法引用适合表达已有操作，复杂分支应恢复为命名方法。谓词可用 `and/or/negate` 组合，函数可用 `compose/andThen` 组合。不要为了“函数式”把有副作用的流程隐藏在链式表达式中。

## 实践任务

实现可配置的商品过滤器：按库存、价格、关键字组合 Predicate，并用 Function 映射展示对象；提供 Lambda、匿名类和方法引用三种写法，比较可读性。

## 易错点

- 修改 Lambda 捕获的局部变量，编译器会拒绝。
- 把有副作用的 Consumer 并行执行，产生竞态或不可预测顺序。
- 忽略泛型推断导致 Lambda 参数类型不清晰。
- 传递 null 函数式接口后才在调用处触发空指针。

## 复习清单

- [ ] 能写出四类常用函数式接口。
- [ ] 能解释 effective final 和方法引用绑定时机。
- [ ] 能判断一段 Lambda 是否应提取为命名方法。

