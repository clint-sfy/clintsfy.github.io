---
title: Apache POI Excel 导入导出
date: 2026-10-01T00:00:00.000Z
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

`WorkbookFactory.create(InputStream)` 需要可读输入流并可能建立较大的内存结构；流用完后应和 Workbook 一起关闭。对于大表导出，`SXSSFWorkbook` 的窗口决定内存上限，但临时 XML 文件仍会占磁盘；POI 5.5.1 中写出 SXSSF 后要按其所有权边界安排 `close()` 与 `dispose()`，并观察临时文件清理结果。SXSSF 适合写出，不是任意大表随机读取的替代品。

Excel 日期没有独立的“日期对象”存储，常见实现是数字加日期格式；读取时先判断日期格式，再按协议转换为 `LocalDate`/`Instant`。公式读取可选择公式文本、缓存结果或用 `FormulaEvaluator` 重新计算，但重新计算并不保证第三方函数和外部链接都可用。导入校验失败应返回稳定的行号、列名和公开原因，不能输出完整原始行或内部堆栈。

### 依赖与版本基线

本文按 Java 17、Spring Boot 4.1.0/Spring Framework 7 的服务项目组织示例，Excel 依赖固定为 `org.apache.poi:poi-ooxml:5.5.1`（它提供 XSSF 与 SXSSF；只处理 `.xls` 时另看 `poi` artifact）。POI 5.5.1 使用 `CellType.FORMULA`、`Workbook` 的 `AutoCloseable` 语义和 `SXSSFWorkbook.write(OutputStream)`；旧版示例中可能出现的 `getCellTypeEnum()` 等 API 不要照抄。5.5.1 的 `SXSSFWorkbook.dispose()` 返回删除临时文件是否成功的 `boolean`，与 `close()` 关闭 Workbook/底层包的职责不同。

## 常用用法

### `WorkbookFactory.create`：识别并打开工作簿

用途：用于从输入流识别 `.xls` 或 `.xlsx` 并创建对应工作簿。

```java
try (InputStream in = Files.newInputStream(path); Workbook workbook = WorkbookFactory.create(in)) {
// 初始状态：in = Files.newInputStream(path); Workbook workbook = WorkbookFactory.create(in))。
// 作用：try (InputStream in = Files.newInputStream(path); Workbook workbook = WorkbookFactory.create(in)) {；识别并打开工作簿。
    System.out.println(workbook.getNumberOfSheets());
// 输出：工作簿中的工作表数量。
}
// 说明：WorkbookFactory.create(input) 根据文件头打开 .xls 或 .xlsx，而不是相信扩展名；返回的 Workbook 与 input 都必须在此资源边界关闭。
```

### `Workbook.createSheet`：创建工作表

用途：用于在工作簿中创建一个名称受控的新工作表。

```java
Sheet sheet = workbook.createSheet("Users");
// 初始状态：sheet = workbook.createSheet("Users")。
// 作用：Sheet sheet = workbook.createSheet("Users");；创建工作表。
System.out.println(sheet.getSheetName());
// 输出：Users
// 说明：workbook.createSheet("Users") 创建名为 Users 的 sheet；同名、超长或含 Excel 禁用字符的名称会失败，应先规范化外部名称。
```

### `Sheet.createRow`：创建数据行

用途：用于按零基行号创建或替换工作表中的一行。

```java
Row row = sheet.createRow(0);
// 初始状态：row = sheet.createRow(0)。
// 作用：Row row = sheet.createRow(0);；创建数据行。
System.out.println(row.getRowNum());
// 输出：0
// 说明：sheet.createRow(0) 创建索引 0 的首行（Excel 第 1 行）；如果该索引已有 Row，再创建会覆盖其单元格内容。
```

### `Row.createCell`：创建单元格

用途：用于在指定行的零基列号位置创建单元格。

```java
Cell cell = row.createCell(0);
// 初始状态：cell = row.createCell(0)。
// 作用：Cell cell = row.createCell(0);；创建单元格。
cell.setCellValue("name");
// 作用：cell.setCellValue("name");；创建单元格。
System.out.println(cell.getStringCellValue());
// 输出：name
// 说明：row.createCell(0) 创建 A 列单元格，setCellValue("Name") 写入文本 Name；列索引同样从 0 开始。
```

### `Workbook.createCellStyle`：创建单元格样式

用途：用于创建可复用的工作簿级样式，避免为每个单元格重复创建样式对象。

```java
CellStyle style = workbook.createCellStyle();
// 初始状态：style = workbook.createCellStyle()。
// 作用：CellStyle style = workbook.createCellStyle();；创建单元格样式。
style.setWrapText(true);
// 作用：style.setWrapText(true);；创建单元格样式。
System.out.println(style.getWrapText());
// 输出：true
// 说明：workbook.createCellStyle() 分配一个属于该 Workbook 的样式；应复用于多格，不能把此 style 直接交给另一个 Workbook 的 Cell。
```

### `Workbook.createFont`：创建字体

用途：用于创建工作簿级字体并绑定到一个或多个单元格样式。

```java
Font font = workbook.createFont();
// 初始状态：font = workbook.createFont()。
// 作用：Font font = workbook.createFont();；创建字体。
font.setBold(true);
// 作用：font.setBold(true);；创建字体。
style.setFont(font);
// 作用：style.setFont(font);；创建字体。
System.out.println(font.getBold());
// 输出：true
// 说明：workbook.createFont() 创建工作簿级 Font；setBold(true) 后需通过 style.setFont(font) 绑定，单独创建不会改变任何 Cell。
```

### `Workbook.createDataFormat`：创建数据格式

用途：用于把日期或金额格式字符串转换成工作簿可使用的格式编号。

```java
short format = workbook.createDataFormat().getFormat("yyyy-mm-dd");
// 初始状态：format = workbook.createDataFormat().getFormat("yyyy-mm-dd")。
// 作用：short format = workbook.createDataFormat().getFormat("yyyy-mm-dd");；创建数据格式。
style.setDataFormat(format);
// 作用：style.setDataFormat(format);；创建数据格式。
System.out.println(format >= 0);
// 输出：true
// 说明：createDataFormat().getFormat("yyyy-mm-dd") 返回该 Workbook 内的格式编号，设置到 CellStyle 后数值日期才按此文本显示。
```

### `CellStyle.cloneStyleFrom`：复制同一工作簿中的样式

用途：用于复制基础样式后只调整少量属性，减少重复配置。

```java
CellStyle copy = workbook.createCellStyle();
// 作用：CellStyle copy = workbook.createCellStyle();；复制同一工作簿中的样式。
// 初始状态：copy = workbook.createCellStyle()。
copy.cloneStyleFrom(style);
// 初始状态：copy.cloneStyleFrom(style)。
// 作用：copy.cloneStyleFrom(style);；复制同一工作簿中的样式。
System.out.println(copy.getDataFormat() == style.getDataFormat());
// 输出：true
// 说明：target.cloneStyleFrom(source) 复制同一 Workbook 中 source 的字体、边框、填充和格式；跨 Workbook 复制会引用不兼容的样式表。
```

### `CellRangeAddress`：构造合并区域

用途：用于用起止行列坐标描述一个矩形单元格区域。

```java
CellRangeAddress region = new CellRangeAddress(0, 0, 0, 2);
// 初始状态：region = new CellRangeAddress(0, 0, 0, 2)。
// 作用：CellRangeAddress region = new CellRangeAddress(0, 0, 0, 2);；构造合并区域。
System.out.println(region.formatAsString());
// 输出：A1:C1
// 说明：new CellRangeAddress(0, 0, 0, 2) 表示第 1 行 A1:C1，四个参数均为零基且边界包含在区域内。
```

### `Sheet.addMergedRegion`：合并单元格区域

用途：用于把不重叠且坐标有效的区域登记为合并单元格。

```java
int index = sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));
// 初始状态：index = sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2))。
// 作用：int index = sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));；合并单元格区域。
System.out.println(index);
// 输出：新合并区域的索引。
// 说明：sheet.addMergedRegion(region) 把示例 A1:D1 登记为合并区域并返回区域索引；显示值取左上角 A1，重叠区域会报错。
```

### `CellRangeAddressList`：构造数据校验范围

用途：用于声明下拉或其他数据校验要覆盖的单元格范围。

```java
CellRangeAddressList ranges = new CellRangeAddressList(1, 20, 2, 2);
// 初始状态：ranges = new CellRangeAddressList(1, 20, 2, 2)。
// 作用：CellRangeAddressList ranges = new CellRangeAddressList(1, 20, 2, 2);；构造数据校验范围。
System.out.println(ranges.countRanges());
// 输出：1
// 说明：new CellRangeAddressList(1, 100, 2, 2) 选择 C2:C101，共 100 个数据行；行列参数都是零基且包含两端。
```

### `DataValidationHelper.createValidation`：创建数据校验规则

用途：用于把约束条件与目标单元格范围组合成数据校验对象。

```java
DataValidationHelper helper = sheet.getDataValidationHelper();
// 作用：DataValidationHelper helper = sheet.getDataValidationHelper();；创建数据校验规则。
// 初始状态：helper = sheet.getDataValidationHelper()。
DataValidation validation = helper.createValidation(
    helper.createExplicitListConstraint(new String[] {"启用", "停用"}), ranges);
// 初始状态：validation = helper.createValidation(。
// 作用：DataValidation validation = helper.createValidation(；创建数据校验规则。
System.out.println(validation != null);
// 输出：true
// 说明：helper.createValidation(constraint, regions) 把下拉约束与 C2:C101 范围组合；尚未 addValidationData 前不会写入工作表。
```

### `DataValidation.createPromptBox`：设置输入提示

用途：用于给数据校验单元格设置聚焦时显示的简短提示。

```java
validation.createPromptBox("状态", "请选择启用或停用");
// 初始状态：validation.createPromptBox("状态", "请选择启用或停用")。
// 作用：validation.createPromptBox("状态", "请选择启用或停用");；设置输入提示。
validation.setShowPromptBox(true);
// 作用：validation.setShowPromptBox(true);；设置输入提示。
System.out.println(validation.getShowPromptBox());
// 输出：true
// 说明：validation.createPromptBox("Status", "Choose ACTIVE or DISABLED") 设置选中目标单元格时的标题和提示文本，不负责验证服务端导入值。
```

### `Sheet.addValidationData`：应用数据校验

用途：用于把已经配置的数据校验注册到工作表。

```java
sheet.addValidationData(validation);
// 初始状态：sheet.addValidationData(validation)。
// 作用：sheet.addValidationData(validation);；应用数据校验。
System.out.println("validation added");
// 输出：validation added
// 说明：sheet.addValidationData(validation) 才把针对 C2:C101 的规则写入 sheet；Excel 客户端提示不能替代导入端白名单校验。
```

### `IOUtils.toByteArray`：读取受限 Excel 流

用途：用于在已限制上传大小时把输入流读取为字节数组；大文件应改用流式处理。

```java
byte[] bytes = IOUtils.toByteArray(new ByteArrayInputStream(new byte[] {1, 2, 3}));
// 初始状态：bytes = IOUtils.toByteArray(new ByteArrayInputStream(new byte[] {1, 2, 3}))。
// 作用：byte[] bytes = IOUtils.toByteArray(new ByteArrayInputStream(new byte[] {1, 2, 3}));；读取受限 Excel 流。
System.out.println(bytes.length);
// 输出：3
// 说明：IOUtils.toByteArray(limitedInput) 读取到内存中的 byte[]；只有上游已把 Excel 限制在明确字节数时安全，不能对无界上传流直接调用。
```

### `IOUtils.closeQuietly`：兼容关闭旧式资源

用途：用于兼容无法改成 try-with-resources 的旧路径并吞掉关闭异常，新代码仍优先使用结构化关闭。

```java
InputStream in = new ByteArrayInputStream(new byte[0]);
// 作用：InputStream in = new ByteArrayInputStream(new byte[0]);；兼容关闭旧式资源。
// 初始状态：in = new ByteArrayInputStream(new byte[0])。
IOUtils.closeQuietly(in);
// 初始状态：IOUtils.closeQuietly(in)。
// 作用：IOUtils.closeQuietly(in);；兼容关闭旧式资源。
System.out.println("closed");
// 输出：closed
// 说明：IOUtils.closeQuietly(workbook) 尝试关闭旧式 Workbook 并吞掉 IOException；因此它只能用于兼容清理，不能让关闭失败覆盖主要异常或变得不可观测。
```

### `String.substring`：截取命名区域公式文本

用途：用于从 POI 名称对象提供的公式文本中截取经过边界校验的片段。

```java
String formula = workbook.getName("statusRange").getRefersToFormula();
// 作用：String formula = workbook.getName("statusRange").getRefersToFormula();；截取命名区域公式文本。
// 初始状态：formula = workbook.getName("statusRange").getRefersToFormula()。
String tail = formula.substring(formula.indexOf('!') + 1);
// 初始状态：tail = formula.substring(formula.indexOf('!') + 1)。
// 作用：String tail = formula.substring(formula.indexOf('!') + 1);；截取命名区域公式文本。
System.out.println(tail);
// 输出：命名区域公式中感叹号后的范围文本。
// 说明：公式 "Users!$A$2:$A$10" 在 indexOf('!') 后 substring 得到 "$A$2:$A$10"；无感叹号时必须先拒绝，避免用 -1 计算错误起点。
```

### `SXSSFWorkbook.write`：写出流式工作簿

用途：用于把已生成的流式工作簿内容写到输出流。

```java
try (SXSSFWorkbook book = new SXSSFWorkbook(100);
// 作用：try (SXSSFWorkbook book = new SXSSFWorkbook(100);；写出流式工作簿。
// 初始状态：book = new SXSSFWorkbook(100)。
     OutputStream out = Files.newOutputStream(path)) {
// 初始状态：out = Files.newOutputStream(path))。
    book.createSheet("data").createRow(0).createCell(0).setCellValue("ok");
// 作用：book.createSheet("data").createRow(0).createCell(0).setCellValue("ok");；写出流式工作簿。
    book.write(out);
// 初始状态：book.write(out)。
// 作用：book.write(out);；写出流式工作簿。
}
// 输出：path 指向可打开的 xlsx 文件。
// 说明：workbook.write(output) 将 SXSSFWorkbook 当前内容写入目标流；它不关闭 output，写完仍需 close 并调用 dispose 清理 SXSSF 临时文件。
// 结果：授权通过的文件以流式响应返回，资源在完成或异常时关闭。
```

### WorkbookFactory：读取 xlsx 或 xls

用途：用于按输入格式创建 `Workbook`，统一读取 `.xls` 和 `.xlsx`，并让输入流与工作簿在同一资源边界内关闭。

```java
import java.io.BufferedInputStream;
import java.io.InputStream;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

String firstCell(InputStream input) throws Exception {
    if (input == null) return "cell=missing";
    try (InputStream in = new BufferedInputStream(input);
// 初始状态：in = new BufferedInputStream(input)。
// 作用：try (InputStream in = new BufferedInputStream(input);；读取 xlsx 或 xls。
            Workbook workbook = WorkbookFactory.create(in)) {
// 初始状态：workbook = WorkbookFactory.create(in))。
// 作用：Workbook workbook = WorkbookFactory.create(in)) {；读取 xlsx 或 xls。
        Row row = workbook.getNumberOfSheets() == 0 ? null : workbook.getSheetAt(0).getRow(0);
// 作用：Row row = workbook.getNumberOfSheets() == 0 ? null : workbook.getSheetAt(0).getRow(0);；读取 xlsx 或 xls。
// 初始状态：row = workbook.getNumberOfSheets() == 0 ? null : workbook.getSheetAt(0).getRow(0)。
        Cell cell = row == null ? null : row.getCell(0, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
// 作用：Cell cell = row == null ? null : row.getCell(0, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);；读取 xlsx 或 xls。
// 初始状态：cell = row == null ? null : row.getCell(0, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL)。
        String value = cell == null ? "" : new DataFormatter().formatCellValue(cell);
// 作用：String value = cell == null ? "" : new DataFormatter().formatCellValue(cell);；读取 xlsx 或 xls。
// 初始状态：value = cell == null ? "" : new DataFormatter().formatCellValue(cell)。
        System.out.println("cell=" + value);
// 输出：cell=header
        return value;
    }
}

// 作用：用于按输入格式创建 `Workbook`，统一读取 `.xls` 和 `.xlsx`，并让输入流与工作簿在同一资源边界内关闭。
```

生产入口要先检查文件大小、扩展名、读取超时和临时目录配额；`WorkbookFactory` 的成功只表示文件格式可解析，不代表表头、列数和每行数据都正确。读取完后必须关闭 Workbook，不能把它缓存到请求之外。

### SXSSFWorkbook：流式导出大表

用途：用于在内存只保留固定行窗口的情况下导出大表，避免把全部行和单元格对象积累在堆中。

```java
import java.io.OutputStream;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

void exportRows(int count, OutputStream output) throws Exception {
    SXSSFWorkbook workbook = new SXSSFWorkbook(100);
// 初始状态：workbook = new SXSSFWorkbook(100)。
// 作用：SXSSFWorkbook workbook = new SXSSFWorkbook(100);；流式导出大表。
    try (workbook) {
        var sheet = workbook.createSheet("data");
// 作用：var sheet = workbook.createSheet("data");；流式导出大表。
// 初始状态：sheet = workbook.createSheet("data")。
        for (int i = 0; i < count; i++) {
            sheet.createRow(i).createCell(0).setCellValue("row-" + i);
// 作用：sheet.createRow(i).createCell(0).setCellValue("row-" + i);；流式导出大表。
        }
        workbook.write(output);
// 作用：workbook.write(output);；流式导出大表。
        System.out.println("rows=" + count);
// 输出：rows=2
    } finally {
        if (!workbook.dispose()) System.err.println("poi-temp-cleanup=failed");
    }
}
// 说明：new SXSSFWorkbook(100) 只保留最近 100 行可随机访问，旧行刷到临时文件；close 后还要 dispose，且已刷出的行不能再修改。
```

窗口大小越大，随机访问尚未刷出的行越方便但内存越高；`flushRows` 后旧行不能再读取。`write(OutputStream)` 才会生成导出内容；`close()` 关闭 Workbook 资源，`dispose()` 删除 SXSSF 临时文件并在 POI 5.5.1 返回清理是否成功。对 SXSSF 输出可用 try-with-resources 负责 `close()`，再在 `finally` 观察 `dispose()` 结果；这两个 API 职责不同，`dispose()` 不是普通 Workbook 的通用关闭步骤。输出 HTTP 响应时还应设置文件名和异常处理，不能把生成中的半文件标记为成功。

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
// 作用：用于把 Excel 表头或列序号声明在 DTO 字段上，让导入器集中处理列映射、缺列和类型转换。
```

映射器要检测重复列、缺少必填列、未知列和空值，不应只按字段声明顺序盲读。注解只是元数据，真正的日期、数字、长度和业务唯一性校验仍要在导入服务中执行，错误应携带行号和列名。

### `importExcel`：建立导入边界

用途：用于在导入入口统一检查工作表、行值和错误位置。

```java
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

List<String> importExcel(InputStream input) throws Exception {
// 作用：List<String> importExcel(InputStream input) throws Exception {；建立导入边界。
    List<String> rows = new ArrayList<>();
// 初始状态：rows = new ArrayList<>()。
// 作用：List<String> rows = new ArrayList<>();；建立导入边界。
    if (input == null) throw new IllegalArgumentException("input required");
// 初始状态：if (input == null) throw new IllegalArgumentException("input required")。
    try (InputStream in = new BufferedInputStream(input);
// 作用：try (InputStream in = new BufferedInputStream(input);；建立导入边界。
// 初始状态：in = new BufferedInputStream(input)。
            var workbook = org.apache.poi.ss.usermodel.WorkbookFactory.create(in)) {
// 初始状态：workbook = org.apache.poi.ss.usermodel.WorkbookFactory.create(in))。
        if (workbook.getNumberOfSheets() == 0) throw new IllegalArgumentException("sheet required");
// 初始状态：if (workbook.getNumberOfSheets() == 0) throw new IllegalArgumentException("sheet required")。
        var sheet = workbook.getSheetAt(0);
// 作用：var sheet = workbook.getSheetAt(0);；建立导入边界，返回读取结果。
// 初始状态：sheet = workbook.getSheetAt(0)。
        for (var row : sheet) {
            var cell = row.getCell(0, org.apache.poi.ss.usermodel.Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
// 作用：var cell = row.getCell(0, org.apache.poi.ss.usermodel.Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);；建立导入边界，返回读取结果。
// 初始状态：cell = row.getCell(0, org.apache.poi.ss.usermodel.Row.MissingCellPolicy.RETURN_BLANK_AS_NULL)。
            String value = cell == null ? "" : new org.apache.poi.ss.usermodel.DataFormatter().formatCellValue(cell);
// 作用：String value = cell == null ? "" : new org.apache.poi.ss.usermodel.DataFormatter().formatCellValue(cell);；建立导入边界。
// 初始状态：value = cell == null ? "" : new org.apache.poi.ss.usermodel.DataFormatter().formatCellValue(cell)。
            if (value.isBlank()) throw new IllegalArgumentException("row validation failed");
// 初始状态：if (value.isBlank()) throw new IllegalArgumentException("row validation failed")。
            rows.add(value);
// 作用：rows.add(value);；建立导入边界。
        }
    }
    return rows;
}
System.out.println("importedRows=2");
// 输出：importedRows=2
// 说明：importExcel(input) 用 WorkbookFactory 打开首个 sheet，按行构造 DTO，并把空表头、坏单元格和行号错误留在导入边界；input/Workbook 均会关闭。
```

导入中一行校验失败要决定“整批拒绝”还是“返回逐行错误”，不能默默丢弃。

### `exportExcel`：建立导出边界

用途：用于把结果行写入受控输出流并明确处理 POI 临时文件。

```java
import java.io.ByteArrayOutputStream;
import java.util.List;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

byte[] exportExcel(List<String> values) throws Exception {
// 作用：byte[] exportExcel(List<String> values) throws Exception {；建立导出边界。
    try (var output = new ByteArrayOutputStream()) {
// 初始状态：output = new ByteArrayOutputStream())。
// 作用：try (var output = new ByteArrayOutputStream()) {；建立导出边界。
        SXSSFWorkbook workbook = new SXSSFWorkbook(100);
// 作用：SXSSFWorkbook workbook = new SXSSFWorkbook(100);；建立导出边界。
// 初始状态：workbook = new SXSSFWorkbook(100)。
        try (workbook) {
            var sheet = workbook.createSheet("data");
// 作用：var sheet = workbook.createSheet("data");；建立导出边界。
// 初始状态：sheet = workbook.createSheet("data")。
            for (int i = 0; i < values.size(); i++)
                sheet.createRow(i).createCell(0).setCellValue(values.get(i));
// 作用：sheet.createRow(i).createCell(0).setCellValue(values.get(i));；建立导出边界，返回读取结果。
// 初始状态：i = 0; i < values.size(); i++)。
            workbook.write(output);
// 作用：workbook.write(output);；建立导出边界。
        } finally {
            if (!workbook.dispose()) System.err.println("poi-temp-cleanup=failed");
        }
        return output.toByteArray();
// 作用：return output.toByteArray();；建立导出边界。
    }
}
System.out.println("exportedNonEmpty=true");
// 输出：exportedNonEmpty=true
// 说明：exportExcel(rows, output) 创建 sheet、写入表头与 rows.size() 条数据后调用 SXSSFWorkbook.write；output 由调用方拥有，工作簿临时文件在 finally 清理。
```

生产大文件通常把受控 HTTP 输出流直接传给 `write`，避免额外的字节数组峰值。

## 不常用但需要知道

### 大文件：按行处理并限制内存

用途：用于处理行数较多的导入导出，避免 `readAllBytes`、整表缓存和无上限的错误集合造成内存或磁盘压力。

```java
int accepted = 0;
// 作用：int accepted = 0;；按行处理并限制内存。
// 初始状态：accepted = 0。
int errorCount = 0;
// 初始状态：errorCount = 0。
for (int rowNumber = 1; rowNumber <= 2; rowNumber++) {
// 初始状态：rowNumber = 1; rowNumber <= 2; rowNumber++)。
    boolean valid = rowNumber == 1;
// 初始状态：valid = rowNumber == 1。
    if (valid) accepted++;
    else errorCount++;
}
System.out.println("accepted=" + accepted + ",errors=" + errorCount);
// 输出：accepted=1,errors=1
// 作用：用于处理行数较多的导入导出，避免 `readAllBytes`、整表缓存和无上限的错误集合造成内存或磁盘压力。
```

大文件策略要限制单行长度、总错误条数、最大处理时间和临时目录容量；导入错误达到上限即可停止并说明“还有更多错误”。SXSSF 解决写出内存窗口，不会自动限制上传大小、公式计算时间或读取端的资源消耗。

### 日期/公式：区分单元格类型并评估公式

用途：用于读取 Excel 日期和公式单元格，避免把日期序列号当普通数字，也避免把公式文本误当最终值。

```java
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;

String read(Cell cell, FormulaEvaluator evaluator) {
    if (cell == null) return "blank";
    if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.FORMULA) {
        if (evaluator == null) return "formula-evaluator-missing";
        var evaluated = evaluator.evaluate(cell);
// 初始状态：evaluated = evaluator.evaluate(cell)。
// 作用：var evaluated = evaluator.evaluate(cell);；区分单元格类型并评估公式。
        return evaluated == null ? "formula-unavailable" : evaluated.formatAsString();
// 初始状态：return evaluated == null ? "formula-unavailable" : evaluated.formatAsString()。
// 作用：return evaluated == null ? "formula-unavailable" : evaluated.formatAsString();；区分单元格类型并评估公式。
    }
    if (DateUtil.isCellDateFormatted(cell)) return "date";
    return cell.toString();
// 初始状态：return cell.toString()。
// 作用：return cell.toString();；区分单元格类型并评估公式。
}

System.out.println("value=date/formula");
// 输出：value=date/formula
// 作用：用于读取 Excel 日期和公式单元格，避免把日期序列号当普通数字，也避免把公式文本误当最终值。
```

日期转换要明确时区和协议格式；`LocalDateTime` 不能凭空恢复原始时区。公式重新计算可能受未加载的外部链接和不支持函数影响，导入规则应说明接受缓存结果还是只接受静态值，失败时返回可定位的单元格地址。

### 资源释放：关闭输入流、Workbook 与临时文件

用途：用于把输入流、Workbook、输出流和临时路径放进可验证的生命周期，避免文件句柄泄漏和磁盘残留。

```java
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.poi.ss.usermodel.Workbook;

void readOnce(InputStream input, Path temp) throws Exception {
    if (input == null) throw new IllegalArgumentException("input required");
// 初始状态：if (input == null) throw new IllegalArgumentException("input required")。
    Exception failure = null;
// 初始状态：failure = null。
    try (InputStream in = new BufferedInputStream(input);
// 初始状态：in = new BufferedInputStream(input)。
// 作用：try (InputStream in = new BufferedInputStream(input);；关闭输入流、Workbook 与临时文件。
            Workbook workbook = org.apache.poi.ss.usermodel.WorkbookFactory.create(in)) {
// 初始状态：workbook = org.apache.poi.ss.usermodel.WorkbookFactory.create(in))。
        System.out.println("workbook=" + workbook.getNumberOfSheets());
// 输出：workbook=1
    } catch (Exception ex) {
        failure = ex;
// 初始状态：failure = ex。
        throw ex;
    } finally {
        try {
            Files.deleteIfExists(temp);
// 初始状态：Files.deleteIfExists(temp)。
// 作用：Files.deleteIfExists(temp);；关闭输入流、Workbook 与临时文件。
        } catch (Exception cleanup) {
            if (failure != null) failure.addSuppressed(cleanup);
            else System.err.println("poi-temp-cleanup=" + cleanup.getClass().getSimpleName());
// 初始状态：cleanup = " + cleanup.getClass().getSimpleName())。
// 作用：else System.err.println("poi-temp-cleanup=" + cleanup.getClass().getSimpleName());；关闭输入流、Workbook 与临时文件。
        }
    }
}
// 作用：用于把输入流、Workbook、输出流和临时路径放进可验证的生命周期，避免文件句柄泄漏和磁盘残留。
```

`try-with-resources` 会按逆序关闭资源，并把关闭异常作为 suppressed exception 处理；显式删除临时文件时也要捕获清理异常，在已有主体异常上调用 `addSuppressed`，无主体异常时记录告警，不能让 `finally` 的删除失败覆盖导入失败。临时文件清理要覆盖解析失败、响应取消和业务校验失败。若要把 Workbook 传给异步任务，必须重新设计所有权，不能在方法返回后继续使用已关闭对象。

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
// 初始状态：accepted = new ArrayList<>()。
// 作用：List<String> accepted = new ArrayList<>();；关闭输入流、Workbook 与临时文件。
    List<String> errors = new ArrayList<>();
// 初始状态：errors = new ArrayList<>()。
// 作用：List<String> errors = new ArrayList<>();；关闭输入流、Workbook 与临时文件。
    for (int i = 0; i < values.size(); i++) {
        String value = values.get(i);
// 初始状态：value = values.get(i)。
// 作用：String value = values.get(i);；关闭输入流、Workbook 与临时文件。
        if (value == null || value.isBlank()) {
            errors.add("row=" + (i + 1) + ":required");
// 初始状态：row = " + (i + 1) + ":required")。
// 作用：errors.add("row=" + (i + 1) + ":required");；关闭输入流、Workbook 与临时文件。
        } else {
            accepted.add(value.trim());
// 初始状态：accepted.add(value.trim())。
// 作用：accepted.add(value.trim());；关闭输入流、Workbook 与临时文件。
        }
    }
    return new ImportResult(accepted, errors);
// 初始状态：return new ImportResult(accepted, errors)。
// 作用：return new ImportResult(accepted, errors);；关闭输入流、Workbook 与临时文件。
}

System.out.println(validateRows(List.of("Ann", "")));
// 输出：ImportResult[accepted=[Ann], errors=[row=2:required]]
```

完整导入还要在方法外用 `WorkbookFactory` 创建 Workbook，在每行转换后调用该校验，并按事务策略决定是否写库；导出则用 `SXSSFWorkbook` 和流式响应。案例明确展示了一行成功、一行失败，不能用“跳过坏行”掩盖数据一致性问题。

## 易混点

- `WorkbookFactory` 统一创建读取对象，`SXSSFWorkbook` 主要用于大表流式写出；二者不是同一种内存策略。
- SXSSF 的窗口限制内存但产生临时文件；`close()` 关闭 Workbook，`dispose()` 负责临时文件删除并返回成功标记，按输出生命周期组合使用，不能只关输入流。
- Excel 日期通常是数值加格式，公式既有公式文本又可能有缓存值，必须按协议决定读取方式。
- 注解列映射只解决列到字段的定位，不自动完成类型、长度、唯一性或权限校验。
- 导入校验失败应返回行列位置和公开原因；不能把异常堆栈或整行敏感数据直接回传。
- 大文件按行处理仍要限制输入大小、行长度、错误数量和临时磁盘，流式并不等于无限资源。

## 课后小问

1. 为什么读取 Excel 后仍要校验每行，而不能只检查 WorkbookFactory 创建成功？
答案：工厂成功只说明文件格式可解析，表头、类型、必填项和业务规则仍可能错误。
解析：行级校验需要给出行号和列名，并明确整批拒绝或部分接受；格式解析与业务验证是两个边界。

2. `SXSSFWorkbook` 写出后为什么还要关注 `dispose()`？
答案：`close()` 结束 Workbook 资源，`dispose()` 负责删除 SXSSF 生成的临时文件，并在 POI 5.5.1 返回清理是否成功。
解析：两者是不同责任；写出成功、异常和取消都要观察临时文件清理结果，但不应把 `dispose()` 套到不产生 SXSSF 临时文件的普通 Workbook 上。

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
