---
title: 枚举、record 与 sealed 类型
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - record
  - sealed
  - 枚举
description: 学习现代 Java 的数据载体、受限继承和模式匹配基础。
---

# 枚举、record 与 sealed 类型

## 学习目标

- 使用 record 表达不可变数据载体，理解其自动生成成员。
- 使用 sealed、non-sealed、final 限制继承层次。
- 结合模式匹配和穷尽性检查表达领域状态。

## 核心知识点

`record User(String id, String name)` 自动提供 private final 组件、访问器、规范构造器、`equals/hashCode/toString`；复杂校验可写紧凑构造器，但组件引用本身仍可能指向可变对象。sealed 类或接口通过 `permits` 声明直接子类型，子类必须是 final、sealed 或 non-sealed。record 不能继承普通类，但可以实现接口。现代 switch 的模式匹配能减少类型判断，编译器可利用 sealed 层次检查分支完整性。

## 实践任务

用 sealed 接口建模支付结果：`Success`、`RetryableFailure`、`Rejected`；用 record 保存不可变字段，校验金额和错误码，再写一个把结果转换成用户提示的模式匹配方法。

## 易错点

- 把 record 当作深不可变对象，忽略 List、Map 等组件的可变性。
- sealed 子类型不完整，导致编译器无法推断穷尽分支。
- 业务对象需要生命周期和复杂行为时仍强行使用 record。
- 为兼容旧编译目标使用了当前 JDK 不支持的语法特性。

## 复习清单

- [ ] 能说明 record 的生成成员和不可变边界。
- [ ] 能设计一个 sealed 类型层次并解释扩展点。
- [ ] 能用模式匹配代替安全的类型分支。

