---
title: Apache POI Excel 导入导出
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - Apache POI
  - Excel
  - 文件处理
description: 速查 Apache POI 的 WorkbookFactory、SXSSFWorkbook、导入校验、日期公式和资源释放边界。
---

# Apache POI Excel 导入导出

## 学习目标

- 能用 `WorkbookFactory` 读取 `.xls`/`.xlsx`，按行读取并把单元格转换为明确的领域值。
- 能用 `SXSSFWorkbook` 流式导出大文件，控制窗口、临时文件和最终资源释放。
- 能用注解列映射、日期/公式判断和行级校验组织导入导出，并清楚处理失败边界。

## 核心知识点

### 专业术语

- **Workbook**：Excel 工作簿抽象；`HSSFWorkbook` 面向旧式 `.xls`，`XSSFWorkbook` 面向 `.xlsx`，`WorkbookFactory` 可按输入判断格式。
- **Sheet、Row、Cell**：工作表、行和单元格的层级对象；读取时要区分空行、空单元格和不同 `CellType`。
- **`WorkbookFactory`**：Apache POI 提供的工厂方法，适合从 `File`、`InputStream` 创建兼容的 Workbook。
- **`SXSSFWorkbook`**：基于 XSSF 的流式写出实现，只在内存保留有限窗口，其余行落到临时文件。
- **注解列映射**：用 `@ExcelColumn` 等元数据把列序号或列名映射到 DTO 字段，避免业务代码散落魔法下标。
- **公式与日期**：Excel 日期通常是数值格式，公式单元格保存公式和缓存结果；要分别使用 `DateUtil.isCellDateFormatted` 和 `FormulaEvaluator` 判断/计算。

### 白话解释与边界

POI 处理的是文件格式，不负责请求授权、业务唯一性或数据库事务。导入链路通常是“限制文件大小和扩展名 → 创建 Workbook → 读取表头 → 逐行类型转换 → 行级校验 → 汇总错误 → 事务性写入”。不要把任何单元格直接拼接进 SQL，也不要因为某一行失败就悄悄跳过而不返回行号。

`WorkbookFactory.create(InputStream)` 需要可读输入流并可能建立较大的内存结构；流用完后应和 Workbook 一起关闭。对于大表导出，`SXSSFWorkbook` 的窗口决定内存上限，但临时 XML 文件仍会占磁盘；导出结束必须 `close()` 并调用 `dispose()` 清理临时文件。SXSSF 适合写出，不是任意大表随机读取的替代品。

Excel 日期没有独立的“日期对象”存储，常见实现是数字加日期格式；读取时先判断日期格式，再按协议转换为 `LocalDate`/`Instant`。公式读取可选择公式文本、缓存结果或用 `FormulaEvaluator` 重新计算，但重新计算并不保证第三方函数和外部链接都可用。导入校验失败应返回稳定的行号、列名和公开原因，不能输出完整原始行或内部堆栈。

## 常用用法

### WorkbookFactory：读取 xlsx 或 xls

用途：用于按输入格式创建 `Workbook`，统一读取 `.xls` 和 `.xlsx`，并让输入流与工作簿在同一资源边界内关闭。

```java
import java.io.InputStream;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

String firstCell(InputStream input) throws Exception {
    try (InputStream in = input; Workbook workbook = WorkbookFactory.create(in)) {
        String value = workbook.getSheetAt(0).getRow(0).getCell(0).getStringCellValue();
        System.out.println("cell=" + value);
        return value;
    }
}

// 输出：cell=header
```

生产入口要先检查文件大小、扩展名、读取超时和临时目录配额；`WorkbookFactory` 的成功只表示文件格式可解析，不代表表头、列数和每行数据都正确。读取完后必须关闭 Workbook，不能把它缓存到请求之外。

### SXSSFWorkbook：流式导出大表

用途：用于在内存只保留固定行窗口的情况下导出大表，避免把全部行和单元格对象积累在堆中。

```java
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

void exportRows(int count) throws Exception {
    SXSSFWorkbook workbook = new SXSSFWorkbook(100);
    try (workbook) {
        var sheet = workbook.createSheet("data");
        for (int i = 0; i < count; i++) {
            sheet.createRow(i).createCell(0).setCellValue("row-" + i);
        }
        System.out.println("rows=" + count);
        // 输出：rows=2
    } finally {
        workbook.dispose();
    }
}
```

窗口大小越大，随机访问尚未刷出的行越方便但内存越高；`flushRows` 后旧行不能再读取。`close()` 关闭工作簿资源，`dispose()` 删除 SXSSF 临时文件，两者都要覆盖成功和异常分支。输出 HTTP 响应时还应设置文件名和异常处理，不能把生成中的半文件标记为成功。

### 注解列映射：声明字段到列

用途：用于把 Excel 表头或列序号声明在 DTO 字段上，让导入器集中处理列映射、缺列和类型转换。

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
@interface ExcelColumn { int index(); }

record UserRow(
    @ExcelColumn(index = 0) String name,
    @ExcelColumn(index = 1) int age) {}

System.out.println("mapping=name:0,age:1");
// 输出：mapping=name:0,age:1
```

映射器要检测重复列、缺少必填列、未知列和空值，不应只按字段声明顺序盲读。注解只是元数据，真正的日期、数字、长度和业务唯一性校验仍要在导入服务中执行，错误应携带行号和列名。

### importExcel/exportExcel：分离导入和导出入口

用途：用于把输入校验、行转换与写出响应分成两个明确入口，方便分别限制大小、权限、事务和失败返回。

```java
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

List<String> importExcel(InputStream input) throws Exception {
    List<String> rows = new ArrayList<>();
    try (var workbook = org.apache.poi.ss.usermodel.WorkbookFactory.create(input)) {
        var sheet = workbook.getSheetAt(0);
        for (var row : sheet) {
            String value = row.getCell(0).getStringCellValue();
            if (value.isBlank()) throw new IllegalArgumentException("row validation failed");
            rows.add(value);
        }
    }
    return rows;
}

byte[] exportExcel(List<String> values) {
    System.out.println("exported=" + values.size());
    return new byte[0];
}

// 输出：exported=2
```

示例中的 `exportExcel` 只展示接口边界，真实实现应写入 `SXSSFWorkbook` 和受控输出流。导入中一行校验失败要决定“整批拒绝”还是“返回逐行错误”，不能默默丢弃；持久化写入还要和事务策略对齐。

## 不常用但需要知道

### 大文件：按行处理并限制内存

用途：用于处理行数较多的导入导出，避免 `readAllBytes`、整表缓存和无上限的错误集合造成内存或磁盘压力。

```java
int accepted = 0;
int errorCount = 0;
for (int rowNumber = 1; rowNumber <= 2; rowNumber++) {
    boolean valid = rowNumber == 1;
    if (valid) accepted++;
    else errorCount++;
}
System.out.println("accepted=" + accepted + ",errors=" + errorCount);
// 输出：accepted=1,errors=1
```

大文件策略要限制单行长度、总错误条数、最大处理时间和临时目录容量；导入错误达到上限即可停止并说明“还有更多错误”。SXSSF 解决写出内存窗口，不会自动限制上传大小、公式计算时间或读取端的资源消耗。

### 日期/公式：区分单元格类型并评估公式

用途：用于读取 Excel 日期和公式单元格，避免把日期序列号当普通数字，也避免把公式文本误当最终值。

```java
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;

String read(Cell cell, FormulaEvaluator evaluator) {
    if (DateUtil.isCellDateFormatted(cell)) return "date";
    if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.FORMULA) {
        return evaluator.evaluate(cell).formatAsString();
    }
    return cell.toString();
}

System.out.println("value=date/formula");
// 输出：value=date/formula
```

日期转换要明确时区和协议格式；`LocalDateTime` 不能凭空恢复原始时区。公式重新计算可能受未加载的外部链接和不支持函数影响，导入规则应说明接受缓存结果还是只接受静态值，失败时返回可定位的单元格地址。

### 资源释放：关闭输入流、Workbook 与临时文件

用途：用于把输入流、Workbook、输出流和临时路径放进可验证的生命周期，避免文件句柄泄漏和磁盘残留。

```java
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.poi.ss.usermodel.Workbook;

void readOnce(InputStream input, Path temp) throws Exception {
    try (InputStream in = input; Workbook workbook = org.apache.poi.ss.usermodel.WorkbookFactory.create(in)) {
        System.out.println("workbook=" + workbook.getNumberOfSheets());
        // 输出：workbook=1
    } finally {
        Files.deleteIfExists(temp);
    }
}
```

`try-with-resources` 会按逆序关闭资源，并把关闭异常作为 suppressed exception 处理；临时文件清理要覆盖解析失败、响应取消和业务校验失败。若要把 Workbook 传给异步任务，必须重新设计所有权，不能在方法返回后继续使用已关闭对象。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：收集导入行、错误和导出数据时查 List 的容量与遍历。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：按表头、列名和错误坐标组织映射时查 Map 的键值选择。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：规范化表头、单元格文本和文件名时查字符串边界。

## 简单案例

```java
import java.util.ArrayList;
import java.util.List;

record ImportResult(List<String> accepted, List<String> errors) {}

ImportResult validateRows(List<String> values) {
    List<String> accepted = new ArrayList<>();
    List<String> errors = new ArrayList<>();
    for (int i = 0; i < values.size(); i++) {
        String value = values.get(i);
        if (value == null || value.isBlank()) {
            errors.add("row=" + (i + 1) + ":required");
        } else {
            accepted.add(value.trim());
        }
    }
    return new ImportResult(accepted, errors);
}

System.out.println(validateRows(List.of("Ann", "")));
// 输出：ImportResult[accepted=[Ann], errors=[row=2:required]]
```

完整导入还要在方法外用 `WorkbookFactory` 创建 Workbook，在每行转换后调用该校验，并按事务策略决定是否写库；导出则用 `SXSSFWorkbook` 和流式响应。案例明确展示了一行成功、一行失败，不能用“跳过坏行”掩盖数据一致性问题。

## 易混点

- `WorkbookFactory` 统一创建读取对象，`SXSSFWorkbook` 主要用于大表流式写出；二者不是同一种内存策略。
- SXSSF 的窗口限制内存但产生临时文件，必须同时 `close()` 和 `dispose()`，不能只关输入流。
- Excel 日期通常是数值加格式，公式既有公式文本又可能有缓存值，必须按协议决定读取方式。
- 注解列映射只解决列到字段的定位，不自动完成类型、长度、唯一性或权限校验。
- 导入校验失败应返回行列位置和公开原因；不能把异常堆栈或整行敏感数据直接回传。
- 大文件按行处理仍要限制输入大小、行长度、错误数量和临时磁盘，流式并不等于无限资源。

## 课后小问

1. 为什么读取 Excel 后仍要校验每行，而不能只检查 WorkbookFactory 创建成功？
答案：工厂成功只说明文件格式可解析，表头、类型、必填项和业务规则仍可能错误。
解析：行级校验需要给出行号和列名，并明确整批拒绝或部分接受；格式解析与业务验证是两个边界。

2. `SXSSFWorkbook` 关闭后为什么还要关注 `dispose()`？
答案：`close()` 结束工作簿资源，`dispose()` 负责删除 SXSSF 生成的临时文件。
解析：只关闭 Workbook 可能留下临时 XML 文件，长时间导出会耗尽磁盘；成功、异常和取消都要清理。

3. Excel 日期和公式为什么不能直接按字符串读取？
答案：日期常以带格式的数值存储，公式单元格还包含公式文本与缓存计算结果。
解析：用 `DateUtil.isCellDateFormatted` 和 `FormulaEvaluator` 明确判断，时区、外部链接和不支持函数要有失败策略。

## 本节小结

- `WorkbookFactory` 适合按输入格式读取，`SXSSFWorkbook` 适合控制窗口的流式导出。
- 导入要按表头、类型、日期/公式和业务约束逐行校验，并返回可定位的失败结果。
- 注解列映射把列位置声明化，但不替代校验、授权和事务策略。
- Workbook、输入输出流和 SXSSF 临时文件必须在成功、异常和取消路径释放。
- 大文件处理要同时限制堆内存、处理时间、错误集合和临时磁盘。

## 快速回顾

- 会用 `WorkbookFactory.create` 读取 `.xls`/`.xlsx` 并关闭 Workbook。
- 会用 `SXSSFWorkbook` 导出大表，理解窗口、`close()` 与 `dispose()` 的区别。
- 会用 `DateUtil.isCellDateFormatted` 和 `FormulaEvaluator` 处理日期与公式。
- 能按行校验导入数据，并给出成功与失败的稳定行列信息。
