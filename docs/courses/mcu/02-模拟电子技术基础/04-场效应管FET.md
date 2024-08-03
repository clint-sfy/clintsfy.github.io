---
title: FET场效应管
author: 阿源
date: 2024/08/02 16:30
categories:
 - 模拟电子技术
tags:
 - 模拟电子技术
 - FET
---

# FET场效应管

## 本章总结

### 关键术语

**共漏(CD)**：漏极接地的一种FET放大器组态。

**共栅(CG)**：栅极接地的一种 FET放大器组态。

**共源(CS)**：源极接地的一种FET放大器组态。

**恒流区**：FET的漏极特性中，漏极电流与漏源电压无关的区域。

**耗尽型**：一种FET，在零栅极电压时导通，并通过栅极电压来关闭。所有JFET和部分MOSFET为耗尽型器件。

**漏极**：场效应管三个电极之一；它是沟道的一端。

**增强型**：沟道由所加的栅极电压产生(或增强)的一种MOSFET。

**场效应管(FET)**：一种电压控制器件，栅极的电压控制流经器件的电流。

**栅极**：场效应管三个电极之一。加到栅极的电压控制漏极电流。

**结型场效应管(JFET)**：一种场效应管。它的pn结工作在反偏状态，以控制沟道中的电流。它是一种耗尽型器件。
**MOSFET**：金属-氧化物半导体场效应管；FET的两种主要类型之一。它利用SiO2。层使栅极与沟道绝缘。MOSFET可工作在耗尽模式或增强模式。

**可变电阻区**：FET漏极特性中，V<sub>DS</sub>较小时，沟道电阻可由栅极电压改变的区域;在此区域中；FET工作状态类似电压控制的电阻。

**夹断电压**：当栅源电压为0时，使得FET漏极电流变为常量的漏源电压值。

**源极**：FET三个电极之一；沟道的一端。

**跨导**：FET的增益；利用漏极电流的小变化除以相应的栅源电压变化计算得到。单位为西门子或姆欧。

### 重要公式

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240802122026.png)

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240802122114.png)

## 4.1 FET的结构

已经知道双极结型晶体管(BJT)是一种电流控制器件，即**基极电流控制集电极电流**。

场效应管(FET)是**电压控制器件**，其中栅极电压来控制流经器件的电流。

场效应管(FET)是以与BJT的原理工作完全不同的一类半导体。在FET中，在称为**源极(Source)**和**漏极(Drain)**的两个电极之间由一条窄导电沟道相连。

该沟道要么由n型材料，要么由p型材料制成。正如名字中的“场效应”指出的那样，沟道的导通由一个电场控制，该电场由施加在第三个电极即**栅极(Gate)**上的电压形成。

在**结型场效应管(或JFET)**中，栅极和沟道之间形成了一个pn结。另一种场效应管称为**金属-氧化物半导体场效应管(MOSFET)**，它利用绝缘的栅极来控制沟道的导通(绝缘栅和MOSFET指同一种器件)。

 ### 本节问题

#### 1.FET的三个电极分别称作什么?

漏极、源极和栅极

#### 2.绝缘栅FET的另一个名字是什么?

MOSFET

#### 3.为什么集成电路中主要采用MOSFET这一类晶体管?

它们比BT占用的面积更小，更容易在IC中制造，而且产生的电路更简单。

#### 4.BJT和FET的主要区别有哪些?

BT由电流控制，FET由电压控制。BT电路具有更高的增益，但输入电阻较小。

## 4.2 JFET特性

### 4.2.1 JFET 工作原理

图4-2a给出了n沟道结型场效应管(JFET)的基本结构。电线连接到n沟道的两端，在图4-2中**漏极位于上端**，**源极位于下端**。

沟道是一个导体：对n沟道JFET而言，电子是载流子；对p沟道JFET而言，空穴是载流子。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240802135155.png)

### 4.2.2 JFET符号

可以看到漏极上的箭头方向，对n沟道而言是“指向里”，对p沟道而言是“指向外”。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240802135627.png)

### 4.2.3 夹断电压和截止电压

当V<sub>GS</sub>=0V时，I<sub>D</sub>变为几乎恒定(图4-5b中曲线上的B点)时，对应的V<sub>DS</sub>的值称为**夹断电压**

在栅极与源极之间连接上一个偏置电压V<sub>GG</sub>，如图4-6a所示。通过调整V<sub>GG</sub>，使V<sub>GS</sub>往负值增大，可以得到如图4-6b所示的一族漏极特性曲线。

注意，随着V<sub>GS</sub>变为更大的负值，I<sub>D</sub>减小，因为沟道变窄。也可以看到对于每一组V<sub>GS</sub>，JFET在小于Vp的V<sub>DS</sub>值下达到夹断状态

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240802141806.png)

使得I<sub>D</sub>的值接近于0的V<sub>GS</sub>称为**截止电压**，记为V<sub>GS（off）</sub>。JFET必须工作在V<sub>GS</sub>=0V和V<sub>GS（off）</sub>之间。

**V<sub>GS（off）</sub>和V<sub>P</sub>始终大小相等，但符号相反**。数据手册通常会给出值

### 4.2.4 跨导曲线

传输曲线：描述电路的一种有用方式是给出输出和输入之间的关系

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803155423.png)

### 4.2.5  JFET输入电阻和电容

已经知道，pn结在反向偏置时具有很高的电阻，而JFET工作时栅源结反向偏置，因此栅极的输入电阻很大。

这是JFET与BJT相比的一个主要优势，因为后者的发射结正向偏置。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803160316.png)

## 本节问题

#### 1. JFET的传输曲线又称为什么?

跨导曲线

#### 2. p沟道JFET的Vcs是正值还是负值?

正

#### 3. JFET的漏极电流是如何控制的?

通过栅源电压

#### 4. 某JFET在夹断点的漏源电压为7V。如果栅源电压为0，则Vp为多少?

7V

#### 5. 某n沟道JFET的Vcs往负值增大，则漏极电流增大还是减小?

减小

#### 6. 在一个p沟道JFET中有Vp=-3V，为使器件截止，则V<sub>GS</sub>值必须为多少?

+3V

## 4.3 JFET偏置

将会看到如何对JFET进行直流偏置。

偏置的目的是选择合适的栅源电压来获得期望的漏源电流。由于栅极反向偏置，因此BJT的偏置方式并不适用于JFET。

### 4.3.1 JFET的自给偏置

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803162847.png)

### 4.3.3 分压式偏置

虽然自给偏置方法在多数情况下令人满意，但可以看出，工作点取决于跨导曲线。

通过在栅极电路上增加分压电路，使得栅极电压为正，可以使偏置更稳定。由于**JFET**一定要在栅源间是**反向偏置的条件下才能工作**，因此要使用一个比一般自给偏置中更大的源极电阻。

### 4.3.4 电流源偏置

这种偏置形式在集成电路中广泛使用，但需要一个额外的晶体管。一个晶体管作为电流源来使Ip保持固定不变，它是一种非常稳定的偏置形式。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803164024.png)

## 4.4 MOSFET特性

金属-氧化物半导体场效应管(MOSFET)是另一种重要的场效应管。

MOSFET和JFET的区别在于它没有pn结结构，而是MOSFET的栅极与沟道之间用非常薄的二氧化硅(SiO2层来相互绝缘。

MOSFET的两种基本类型为：耗尽型(D)和增强型(E)。

### 4.4.1 D-MOSFET

D-MOSFET可以工作在两种模式：**耗尽模式或增强模式**，因此有时又称为耗尽-增强MOSFET。

由于栅极与沟道绝缘，因此栅极电压可正可负。对n沟道D-MOSFET而言，当栅源电压为负时，器件工作在耗尽模式；当栅源**电压为正**时，器件工作在**增强模式**。通常这些器件工作在**耗尽模式**。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803165850.png)

D-MOSFET的电路符号：**指向**衬底的箭头表明是n沟道器件，从**衬底指出**的箭头表明是p沟道器件。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803170247.png)

### 4.4.2 E-MOSFET

这种类型的MOSFET**只能工作在增强模式，没有耗尽模式**。和D-MOSFET的结构不同，它没有物理沟道。在图4-26a中可以看出，衬底完全延伸到SiO2层。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803171215.png)

### 4.4.3 双栅极MOSFET

双栅极MOSFET要么是耗尽型，要么是增强型。

## 4.5 MOSFET偏置

如同BJT和JFET，偏置电路确定合适的直流工作条件，为交流信号提供一个稳定的工作点。

### 4.5.1 D-MOSFET偏置

D-MOSFET在正或负的V<sub>GS</sub>下都能工作。当V<sub>GS</sub>为负时，器件工作在**耗尽模式**；当V<sub>GS</sub>为正时，器件工作在**增强模式**。

D-MOSFET的优点是**在这两种模式下都能工作**，也是唯一一种具有此特性的晶体管。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803173141.png)

### 4.5.2 E-MOSFET偏置

**E-MOSFET的V<sub>GS</sub>必须大于阈值电压V<sub>GS(th)</sub>**。各种BJT偏置电路(除了基极偏置)通过设置合适的值，都能够用于E-MOSFET。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803174021.png)

### 4.5.3 IGBT

IGBT(绝缘栅双极晶体管)是一种具有MOSFET输入特性和BJT输出特性的器件。

IGBT本质上可看做一个电压控制的BJT。由于它具有绝缘栅极而不是基极，因此没有输入电流，并且不会对驱动电路产生负载效应。

IGBT在某些方面优于MOSFET，在另一些方面优于BT。IGBT主要用于高压大电流开关应用中。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/analog/20240803175006.png)