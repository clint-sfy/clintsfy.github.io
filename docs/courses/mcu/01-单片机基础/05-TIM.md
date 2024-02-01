---
title: 定时器TIM
author: 阿源
date: 2024/02/01 16:30
categories:
 - MCU
tags:
 - MCU
 - TIM
---

# TIM

## 1. 基本介绍

- 定时器可以对输入的时钟进行计数，并在计数值达到设定值时触发中断
- 16位计数器、预分频器、自动重装寄存器的时基单元，在**72MHz**计数时钟下可以实现最大**59.65s**的定时
- 不仅具备基本的定时中断功能，而且还包含内外时钟源选择、输入捕获、输出比较、编码器接口、主从触发模式等多种功能
- 根据复杂度和应用场景分为了**高级定时器**、通用定时器、**基本定时器**三种类型

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为什么在72MHz计数时钟下可以实现最大59.65s的定时?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;72M/65536/65536，得到的是中断频率，然后取倒数，就是59.65秒多，大家可以自己算一下。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;详细解释：在定时器中，预分频器和计数器都是16位的，所以它们的最大值是65535，而不是65536。预分频器的最大值决定了计数时钟的频率，而计数器的最大值决定了定时器的最大计数周期。因此，如果预分频器和计数器的最大值都设置为65535，那么定时器的最大时间就是72MHz/65536/65536，得到的是中断频率，倒数就是中断时间。【最大值是65536，但计数是从0~65535】

### 1.1 定时器类型

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131153130.png)

### 1.2 基本定时器

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其主要特性如下： 16 位自动重载递增计数器， 16 位可编程预分频器，预分频系数 1~65536，用于对计数器时钟频率进行分频，还可以触发 DAC 的同步电路，以及生成中断/DMA 请求。  

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131154716.png)

- 1. 时钟源

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;基本定时器时钟挂载在APB1 总线，所以它的时钟来自于 APB1 总线， 但是基本定时器时钟不是直接由 APB1 总线直接提供，而是先经过一个倍频器。 我们在 sys_stm32_clock_init时钟设置函数已经设置 APB1 总线时钟频率为 36M，APB1 总线的预分频器分频系数是 2， 所以挂载在APB1总线的定时器时钟频率为 72Mhz。  

- 2. 控制器

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;控制器除了控制定时器复位、使能、计数等功能之外，还可以用于触发 DAC 转换。

- 3. 时基单元

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时基单元包括：**计数器寄存器**(TIMx_CNT)、**预分频器寄存器**(TIMx_PSC)、**自动重载寄存器**(TIMx_ARR) 。基本定时器的这三个寄存器都是 16 位有效数字，即可设置值范围是 0~65535。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131155843.png)

预分频寄存器(TIMx_PSC)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预分频可以以系数介于1至65536之间的任意数值对计数器时钟分频，**就是对输入的基淮频率提前进行一个分频的操作**。它是通过一个16位寄存器(TIMx-PSC)的计数实现分频。因为TIMx-PSC控制寄存器具有缓冲,可以在运行过程中改变它的数值,新的预分频数值将在下一个更新事件时起作用。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;假设这个寄存器写0，就是不分频，或者说是1分频，这时候输出频率=输入频率=72MHz；如果预分频器写1，那就是2分频，输出频率=输入频率/2=36MHz,所以预分频器的值和实际的分频系数相差了1，即**实际分频系数=预分频器的值+1**。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131160435.png)

计数器寄存器(TIMx_CNT)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计数器由预分频输出CK_CNT驱动，设置TIMx_CR1寄存器中的**计数器使能位**(CEN)使能计数器计数。这个计数器可以对预分频后的计数时钟进行计数，计数时钟每来一个上升滑，计数器的值就加1。由于这个计数器也是16位的，所以里面的值可以从0一直加到65535，如果再加的话，计数器就会回到0重新开始。所以计数器的值在计时过程中会不断地自增运行，当自增运行到目标值时，产生中断，那就完成了定时的任务，所以现在还需要一个存储目标值的寄存器，那就是自动重装寄存器了。

自动重裝载寄存器(TIMx_ARR)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;自动重装载寄存器是预加载的，每次读写自动重装载寄存器时，实际上是通过读写预加载寄存器实现。根据TIMx CR1寄存器中的**自动重装载预加载使能位**(ARPE)，写入预加载寄存器的内容能够立即或在每次更新事件时，传送到它的影子寄存器。当TIMx CR1寄存器的UDIS位为’0’，则每当计数器达到溢出值时，硬件发出更新事件；软件也可以产生更新事件；关于更新事件的产生，随后会有详细的介绍。

### 1.3 通用定时器

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131161936.png)

#### 1.3.1 时钟源

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预分频器之前，连接的就是基准计数时钟的输入，由于**基本定时器只能选择内部时钟**，所以你可以直接认为时基单元直接连到了输入端，也就是内部时钟CK_INT。内部时钟的来源是RCC_TIMXCLK，这里的频率值一般都是系统的主频72MHz，所以**通向时基单元的计数基准频率就是72M**。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计数器的时钟由内部时钟(CK_INT)提供。TIMx CR1寄存器的CEN位和TIMx EGR寄存器的UG位是实际的控制位, (除了UG位被自动清除外)只能通过软件改变它们。一旦置CEN位为’1’，内部时钟即向预分频器提供时钟。下图示出控制电路和向上计数器在普通模式下，没有预分频器时的操作。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通用定时器时钟可以选择下面四类时钟源之一：

```
1）内部时钟(CK_INT)
2）外部时钟模式 1：外部输入引脚(TIx)， x=1， 2（即只能来自于通道 1 或者通道 2）
3）外部时钟模式 2：外部触发输入(ETR)
4）内部触发输入(ITRx)：使用一个定时器作为另一定时器的预分频器  
```

外部时钟模式 2（ETR）  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;外部时钟模式 2，顾名思义时钟信号来自芯片外部。时钟源进入定时器的流程如下：外部时钟源信号→IO→TIMx_ETR。从 IO 到 TIMx_ETR，就需要我们配置 IO 的复用功能，才能使IO 和定时器相连通。  

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131172239.png)

- 定时器时钟信号首先从 ETR 引脚进来。
- 接着经过**外部触发极性选择器**，由 ETP 位来设置上升沿有效还是下降沿有效，**选择下降沿有效的话**，**信号会经过反相器**。
- 然后经过外部触发预分频器，由 ETPS[1:0]位来设置预分频系数，系数范围： 1、 2、 4、 8。
- 紧接着经过滤波器器，由 ETF[3:0]位来**设置滤波方式**，也可以设置不使用滤波器。 fDTS 由TIMx_CR1 寄存器的 CKD 位设置。
- 最后经过从模式选择器，由 ECE 位和 SMS[2:0]位来选择定时器的时钟源。这里我们介绍的是外部时钟模式 2，直接把 ECE 位置 1 即可。  

内部触发输入（ITRx）  

**内部触发**输入是使用**一个定时器作为另一个定时器的预分频器**，即实现定时器的级联。  

![image-20240131172532735](C:\Users\clint\AppData\Roaming\Typora\typora-user-images\image-20240131172532735.png)

```
TIM1 作为 TIM2 的预分频器，需要完成的配置步骤如下
TIM1_CR2 寄存器的 MMS[2:0]位设置为 010，即 TIM1 的主模式选择为更新
TIM2_SMCR 寄存器的 TS[2:0]位设置为 000，即使用 ITR1 作为内部触发。
TIM2_SMCR 寄存器的 SMS[2:0]位设置为 111，即从模式控制器选择外部时钟模式 1。
TIM1 和 TIM2 的 CEN 位都要置 1，即启动计数器。
```

内部触发的含义：

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131172936.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当从模式定时器为 TIM2 时， **ITR1 表示主模式定时器就是 TIM1**。 这里只是TIM2~5 的内部触发连接情况，其他定时器请查看参考手册的相应章节。  

#### 1.3.2 控制器

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;控制器包括：**从模式控制器**、**编码器接口**和**触发控制器**（TRGO）。从模式控制器可以控制计数器复位、启动、递增/递减、计数。编码器接口针对编码器计数。触发控制器用来提供触发信号给别的外设，比如为其它定时器提供时钟或者为 DAC/ADC 的触发转换提供信号。  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这个是定时器的一个编码器接口，可以读取正交编码器的输出波形。这部分电路可以把内部的一些事件映射到这个TRGO引脚上，比如我们刚才讲基本定时器分析的，将更新事件映射到TRGO，用于触发DAC。这里也是一样，它可以把定时器内部的一些事件映射到这里来，用于触发其它定时器、DAC或者ADC，可见这个触发输出的范围是比基本定时器更广一些的。

#### 1.3.3 时基单元

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时基单元包括：计数器寄存器(TIMx_CNT)、预分频器寄存器(TIMx_PSC)、自动重载寄存器(TIMx_ARR)。  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不同点是：通用定时器的计数模式有三种： **递增计数模式**、 **递减计数模式**和**中心对齐模式**；TIM2 和 TIM5 的计数器是 32 位的。  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;递减模式：来了一个计数脉冲，计数器就减 1，直到计数器寄存器的值减到 0，减到 0 时定时器溢出，由于是递减计数，故而称为定时器下溢  。

#### 1.3.4 输入捕获

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIMx_CH1~ TIMx_CH4 表示定时器的 4 个通道 。IO 端口通过复用功能与这些通道相连。配置好 IO 端口的复用功能后，将需要测量的信号输入到相应的IO 端口，输入捕获部分可以对输入的信号的上升沿，下降沿或者双边沿进行捕获，常见的测量有：测量输入信号的脉冲宽度、测量 PWM 输入信号的频率和占空比等。  

### 1.4 高级定时器




## 2. 定时器中断

### 2.1 理论

这一段的内容主要搞懂定时中断和内外时钟源选择及如何配置。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131175242.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首先中间最重要的还是PSC(Prescaler)**预分频器**、CNT (Counter)**计数器**、ARR (AutoReloadRegister）**自动重装器**这三个寄存器构成的时基单元。下面这里是运行控制，就是控制寄存器的一些，比如启动停止、向上或向下计数等等，我们操作这些寄存器就能控制时基单元的运行了。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;左边是为时基单元提供时钟的部分，这里可以选择RCC提供的内部时钟，也可以选择ETR引脚提供的**外部时钟模式2**。在本小节示例程序里，第一个定时器定时中断就是用的**内部时钟这一路**，第二个定时器外部时钟就是用的**外部时钟模式2**这一路。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当然还可以选择这里的触发输入当做外部时钟，即**外部时钟模式1**，对应的有ETR外部时钟、TTRX其他定时器、TlX输入捕获通道，这些就是定时器的所有可选的时钟源了。最后这里，还有个编码器模式，这一般是编码器独用的模式，普通的时钟用不到这个。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来右边这里，就是计时时间到，产生更新中断后的信号去向。那这里中断信号会先在状态寄存器里置一个中断标志位，这个标志位会通过中断输出控制，到NVIC申请中断。

**为什么会有一个中断输出控制呢？**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因为这个**定时器模块有很多地方都要申请中断**。比如上面图不仅**更新**要申请中断，这里**触发信号**也会申请中断，还有下面的**输入捕获**和**输出比较匹配时**也会申请。**所以这些中断都要经过中断输出控制**，如果需要这个中断，那就允许，如果不需要，那就禁止。简单来说，这个中断输出控制就是一个中断输出的允许位。

### 2.2  代码：定时器定时中断

#### 2.2.1 步骤

- **第一步**，RCC开启时钟，这个基本上每个代码都是第一步。在这里打开时钟后，定时器的基准时钟和整个外设的工作时钟就都会同时打开了

```c
/*开启时钟*/
RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);			//开启TIM2的时钟
```

- **第二步**，选择时基单元的时钟源。对于定时中断，我们就选择内部时钟源

```c
/*配置时钟源*/
TIM_InternalClockConfig(TIM2);		//选择TIM2为内部时钟，若不调用此函数，TIM默认也为内部时钟
```

![image-20240131181908165](C:\Users\clint\AppData\Roaming\Typora\typora-user-images\image-20240131181908165.png)

注：没选择时钟，会默认内部时钟

```
然后最后一个函数，TIM_ETRConfig，这个不是用来选择时钟的,就是单独用来配置ETR引脚的预分频器、极性、滤波器这些参数的
```

- **第三步**，配置时基单元。包括这里的预分频器、自动重装器、计数模式等等，这些参数用一个结构体就可以配置好了

```c
void TIM_TimeBaseInit(TIM_TypeDef* TIMx, TIM_TimeBaseInitTypeDef* TIM_TimeBaseInitStruct)
    
作用：根据TIM_TimeBaseInitStruct中指定的参数初始化TIMx时基单元外设。
```

```c
/*时基单元初始化*/
TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure;				//定义结构体变量
TIM_TimeBaseInitStructure.TIM_ClockDivision = TIM_CKD_DIV1;		//时钟分频，选择不分频，此参数用于配置滤波器时钟，不影响时基单元功能
TIM_TimeBaseInitStructure.TIM_CounterMode = TIM_CounterMode_Up;	//计数器模式，选择向上计数
TIM_TimeBaseInitStructure.TIM_Period = 10000 - 1;				//计数周期，即ARR的值
TIM_TimeBaseInitStructure.TIM_Prescaler = 7200 - 1;				//预分频器，即PSC的值
TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;			//重复计数器，高级定时器才会用到
TIM_TimeBaseInit(TIM2, &TIM_TimeBaseInitStructure);				//将结构体变量交给TIM_TimeBaseInit，配置TIM2的时基单元	
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240131182732.png)

如何确定时间参数？

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201121903.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;假设定时1s，也就是定时频率为1Hz，那我们就可以PSC给一个7200，ARR给一个10000，然后两个参数都再减一个1，因为预分频器和计数器都有1个数的偏差，所以这里要再减个1。然后注意这个PSC和ARR的取值都要在0~65535之间，不要超范围了

- 第四步，配置输出中断控制，允许更新中断输出到NVIC(开启更新中断到NVIC的通路)

```c
void TIM_ITConfig(TIM_TypeDef* TIMx, uint16_t TIM_IT, FunctionalState NewState)
作用：启用或禁用指定的TIM中断。
```

```c
/*中断输出配置*/
TIM_ClearFlag(TIM2, TIM_FLAG_Update);						//清除定时器更新标志位
	
TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE);					//开启TIM2的更新中断
```

- 第五步，配置NVIC，在NMC中打开定时器中断的通道，并分配一个优先级。

```c
/*NVIC中断分组*/
NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);				//配置NVIC为分组2
/*NVIC配置*/
NVIC_InitTypeDef NVIC_InitStructure;						//定义结构体变量
NVIC_InitStructure.NVIC_IRQChannel = TIM2_IRQn;				//选择配置NVIC的TIM2线
NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;				//指定NVIC线路使能
NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 2;	//指定NVIC线路的抢占优先级为2
NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1;			//指定NVIC线路的响应优先级为1
NVIC_Init(&NVIC_InitStructure);       //将结构体变量交给NVIC_Init，配置NVIC外设
```

- 第六步，就是运行控制了。整个模块配置完成后，我们还需要使能一下计数器。

```c
/*TIM使能*/
TIM_Cmd(TIM2, ENABLE);			//使能TIM2，定时器开始运行
```

#### 2.2.2 其他

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样初始化基本上就OK了,接下来，我们再看几个函数,因为在初始化结构体里有很多关键的参数,比如自动重装值和预分频值等等,这些参数可能会在初始化之后还需要更改,如果为了改某个参数还要再调用一次初始化函数，那太麻烦了。所所以这里有一些单独的函数，可以方便地更改这些关键参数。

```c
TIM_PrescalerConfig(TIM_TypeDef* TIMx, uint16_t Prescaler, uint16_t TIM_PSCReloadMode)
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用来单独写预分频值的,看一下参数，Prescaler，就是要写入的预分频值；后面还有个参数，PSCReloadMode，写入的模式。我们上一小节说了，预分频器有一个缓冲器，写入的值是在更新事件发生后才有效的，所以这里有个写入的模式，可以选择是听从安排，在更新事件生效，或者是，在写入后，手动产生一个更新事件，让这个值立刻生效。

```c
TIM_CounterModeConfig(TIM_TypeDef* TIMx, uint16_t TIM_CounterMode);
```

用来**改变计数器的计数模式**,参数CounterMode，选择新的计数器模式。

```c
TIM_ARRPreloadConfig(TIM_TypeDef* TIMx, FunctionalState NewState);
```

**自动重装器预装功能配置**

```c
TIM_SetCounter(TIM_TypeDef* TIMx, uint16_t Counter);
```

**给计数器写入一个值**。如果你想手动给一个计数值，就可以用这个函数

```c
TIM_SetAutoreload(TIM_TypeDef* TIMx, uint16_t Autoreload);
```

**给自动重装器写入一个值**,如果你想手动给一个自动重装值，就可以用这个函数

```c
uint16_t TIM_GetCounter(TIM_TypeDef* TIMx);
```

**获取当前计数器的值**,如果你想看当前计数器计到哪里了，就可以调用一下这个函数,返回值就是当前的计数器的值

```c
uint16_t TIM_GetPrescaler(TIM_TypeDef* TIMx);
```

**获取当前的预分频器的值**

### 2.3 代码：定时器外部时钟

 关于外设GPIO的配置

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里推荐配置是浮空是输入，但是我一般不太喜欢浮空输入平因为一旦悬空，电平就会跳个没完，所以我准备给上拉输入，这也是可以的。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;那什么时候需要用浮空输入呢？就是如果你外部的输入信号功率很小，内部的这个上拉电阻可能会影响到这个输入信号，这时就可以用一下浮空输入，防止影响外部输入的电平。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201124451.png)

```c
/*开启时钟*/
RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);			//开启TIM2的时钟
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);			//开启GPIOA的时钟

/*GPIO初始化*/
GPIO_InitTypeDef GPIO_InitStructure;
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
GPIO_Init(GPIOA, &GPIO_InitStructure);			 //将PA0引脚初始化为上拉输入

/*外部时钟配置*/
TIM_ETRClockMode2Config(TIM2, TIM_ExtTRGPSC_OFF, TIM_ExtTRGPolarity_NonInverted, 0x0F);
//选择外部时钟模式2，时钟从TIM_ETR引脚输入
//注意TIM2的ETR引脚固定为PA0，无法随意更改
//最后一个滤波器参数加到最大0x0F，可滤除时钟信号抖动
```

| 参数                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| TIMx                | 所选择的 TIM 外设                                            |
| TIM_ExtTRGPrescaler | 外部触发预分频                                               |
| ExtTRGFilter        | 外部时钟极性（视频说这里暂时就不用滤波器了，写0x00就行了，但是**根据实测，针对不同的传感器其敏感度不同，会发生噪音，还是写上值比较好**） |

```c
/*时基单元初始化*/
TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure;				//定义结构体变量
TIM_TimeBaseInitStructure.TIM_ClockDivision = TIM_CKD_DIV1;		//时钟分频，选择不分频，此参数用于配置滤波器时钟，不影响时基单元功能
TIM_TimeBaseInitStructure.TIM_CounterMode = TIM_CounterMode_Up;	//计数器模式，选择向上计数
TIM_TimeBaseInitStructure.TIM_Period = 10 - 1;			//计数周期，即ARR的值
TIM_TimeBaseInitStructure.TIM_Prescaler = 1 - 1;		//预分频器，即PSC的值
TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;	//重复计数器，高级定时器才会用到
TIM_TimeBaseInit(TIM2, &TIM_TimeBaseInitStructure);				//将结构体变量交给TIM_TimeBaseInit，配置TIM2的时基单元	

/*中断输出配置*/
TIM_ClearFlag(TIM2, TIM_FLAG_Update);			//清除定时器更新标志位

TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE);		//开启TIM2的更新中断
	
/*NVIC中断分组*/
NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);		//配置NVIC为分组2

/*NVIC配置*/
NVIC_InitTypeDef NVIC_InitStructure;						//定义结构体变量
NVIC_InitStructure.NVIC_IRQChannel = TIM2_IRQn;		//选择配置NVIC的TIM2线
NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;		//指定NVIC线路使能
NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 2;//指定NVIC线路的抢占优先级为2
NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1;	//指定NVIC线路的响应优先级为1
NVIC_Init(&NVIC_InitStructure);		//将结构体变量交给NVIC_Init，配置NVIC外设

/*TIM使能*/
TIM_Cmd(TIM2, ENABLE);			//使能TIM2，定时器开始运行
```

## 3. TIM输出比较

### 3.1 理论

- OC（Output Compare）输出比较
- 输出比较可以通过比较CNT（时基单元的计数器）与CCR寄存器（捕获/比较寄存器）值的关系，来对输出电平进行置1、置0或翻转的操作，用于输出一定频率和占空比的PWM波形
- 每个高级定时器和通用定时器都拥有4个输出比较通道
- 高级定时器的前3个通道额外拥有死区生成和互补输出的功能 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**捕获/比较寄存器**是输入捕获和输出比较共用的，当使用输入捕获时，它就是捕获寄存器；当使用输出比较时，它就是比较寄存器。那在输出比较这里，这块电路会比较CNT和CCR的值，CNT计数自增，CCR是我们给定的一个值，当CNT大于CCR、小于CCR或者等于CCR时，这里输出就会对应的置1、置0、置1、置0，这样就可以输出一个电平不断跳变的PWM波形了。这就是输出比较的基本功能。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201132123.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PWM的频率越快，那它等效模拟的信号就越平稳。不过同时性能开销就越大。一般来说PWM的频客都在几K到几十KHz，这个预率就已经足够快了

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;占空比决定了PWM等效出来的模拟电压的大小，占空比越大，那等效的模拟电压就越趋近于高电平，反之低电平。这个等效关系一般来说是线性的，比如高电平是5V，低电平是OV，那50%占空比就等效于中间电压，就是2.5V。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分辨率：如果可以1.1%、1.2%、1.3%等等这样以0.1%的步距跳变，那它的分辨率就是0.1%。所以这个分辨率就是占空比变化的精细程度。就是高低切换花了时间占Ts比例，最小变换单位

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这种高低电平跳变的数字信号，它是可以等效为中间这个虚线所表示的模拟量的。当这个**上面电平时间长一点**，下面电平时间短一点的时候，那等效的模拟量就**偏向于上面**；当下面电平时间长一点，上面电平时问短一点的时候。等效的模拟量就偏向于下面

使用这个PWM波形，是用来等效地实现一个模拟信号的输出
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**问题：数字输出端口控制LED，按理说LED只能有完全亮和完全灭两种状态，怎么能实现控制亮度大小呢？**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过PWM就可以实现，我们让LED不断点亮、熄灭、点亮、熄灭，当这个点亮、熄灭的频率足够大时，LED就不会闪烁了，而是呈现出一个中等亮度。当我们调控这个点亮和熄灭的时间比例时，就能让LED呈现出不同的亮度级别。对于电机调速也是一样。

#### 3.1.1 输出比较通道

**定时器的输出比较模块是怎么来输出PWM波形的，我们先看一下通用定时器的这个结构。**

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201140633.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在这个图里。左边就是CNT计数器和CCR1第一路的掩获/比较寄存器。它俩进行比较，当CNT>CCR1，或者CNT-CCR1时，就会给这个输出模式控制器传一个信号，然后输出模式控制器就会改变它输出OC1REF的高低电平，然后上面这里还有个ETRF输入，这个是定时器的一个小功能，一般不用，不需要了解。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接着这个REF信号可以前往主模式控制器，你可以把这个REF映的到主楼式的TRGO端出上去，不过REF的主要去向还是下面这一路,

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后就是极性选择，就是选择是不是费把高低电平反转一下。那接着就是输出使能电路了，选择要不要输出。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最后就是OC1引脚，这个引脚就是CH1通道的引脚，在引脚定义表里就可以知道具体是哪个GPIO口了。

#### 3.1.2 输出比较模式

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来我们还需要看一下这个**输出模式控制器**，它具体是怎么工作的。**什么时候给REF高电平，什么时候给REF低电平**。我们看一下下面的这个表，这就是输出比较的8种模式，也就是这个输出模式控制器里面的执行逻辑。这个模式控制器的输入是CNT和CCR的大小关系，输出是REF的高低电平，里面可以选择多种模式来更加灵活地控制REF输出。
![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201140941.png)

- 冻结

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;那这个模式也比较简单，它根本就不管CNT谁大谁小，**直接REF保持不变**、维持上一个状态就行了，这有什么用呢？比如你正在输出PWM波，突然想暂停一会儿输出，就可以设置成这个模式，一但切换为冻结模式后，输出就暂停了，并且高低电平也维持为暂停时刻的状态，保持不变。这就是冻结模式的作用

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这个有效电平和无效电平，一般是高级定时器里面的一个说法，是和关断、刹车这些功能配合表述的，它说的比较严谨，所以叫有效电平和无效电平。在这里为了理解方便，你可以直接认为**置有效电平就是置高电平，置无效电平就是置低电平**.

- 匹配时

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这三个模式都是当CNT与CCR值相等时，执行操作。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这些模式就**可以用做波形输出**了，比如**相等时电平翻转**这个模式，这个**可以方便地输出一个频率可调，占空比始终为50%的PWM波形**。比如你设置CCR为0，那CNT每次更新清0时，就会产生一次CNT=CCR的事件，这就会导致输出电平翻转一次，每更新两次，输出为一个周期，并且高电平和低电平的时间是始终相等的，也就是占空比始终为50%，当你改变定时器更新频率时，输出波形的频率也会随之改变。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;它俩的关系是**输出波形的频率=更新频率/2**，因为更新两次输出才为一个周期。这就是匹配时电平翻转模式的用途。
![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201141614.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;那上面这两个**相等时置高电平和低电平**，感觉**用途并不是很大**，因为它们都只是一次性的，置完高或低电平后，就不管事了，所以这俩模式不适合输出连续变化的波形。如果你想**定时输出一个一次性的信号**，那可以考虑一下下这两个模式。

- 强制为无效电平|有效电平

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你想**暂停波形输出，并且在暂停期间保持低电平或者高电平**，那你就可以设置这两个强制输出模式。

- PWM模式1|2

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;它们可以用于**输出频率和占空比都可调的PWM波形**，也是我们**主要使用的模式**。这个情况比较多，一般我们都**只使用向上计数**，**PWM模式2实际上就是PWM模式1输出的取反**(改变PWM模式1和PWM模式2，就只是改变了REF电平的极性而已），是因为REF输出之后还有一个极性的配置，所以使用PWM模式1的正极性和PWM模式2的反极性最终的输出是一样的。所以使用的话，**我们可以只使用PWM模式1**，并且是向上计数，这一种模式就行了。

**那PWM模式1向上计数是怎么输出频率和占空比都可调的PWM波形的呢？**

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201141953.png)

**PWM的参数是如何计算的**

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201142229.png)

### 3.2 实战：LED呼吸灯

#### 3.2.1 基本步骤

相当于需要在一个周期内，控制波形的占空比，CCR越大，占空比越大

依次将定时器的CCR寄存器设置为0~100，PWM占空比逐渐增大，LED逐渐变亮

依次将定时器的CCR寄存器设置为100~0，PWM占空比逐渐减小，LED逐渐变暗

- 第一步，RCC开启时钟，把我们要用的TIM外设和GPIO外设的时钟打开

```c
/*开启时钟*/
RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);			//开启TIM2的时钟
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);			//开启GPIOA的时钟
```

- 第二步，配置GPIO和时基单元

```c
/*GPIO初始化*/
GPIO_InitTypeDef GPIO_InitStructure;
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;		//GPIO_Pin_15;
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
GPIO_Init(GPIOA, &GPIO_InitStructure);			//将PA0引脚初始化为  复用推挽输出 !!!!
//受外设控制的引脚，均需要配置为复用模式		

/*配置时钟源*/
TIM_InternalClockConfig(TIM2);		//选择TIM2为内部时钟，若不调用此函数，TIM默认也为内部时钟

/*时基单元初始化*/
TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure;				//定义结构体变量
TIM_TimeBaseInitStructure.TIM_ClockDivision = TIM_CKD_DIV1;     //时钟分频，选择不分频，此参数用于配置滤波器时钟，不影响时基单元功能
TIM_TimeBaseInitStructure.TIM_CounterMode = TIM_CounterMode_Up; //计数器模式，选择向上计数
TIM_TimeBaseInitStructure.TIM_Period = 100 - 1;					//计数周期，即ARR的值
TIM_TimeBaseInitStructure.TIM_Prescaler = 720 - 1;				//预分频器，即PSC的值
TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;            //重复计数器，高级定时器才会用到
TIM_TimeBaseInit(TIM2, &TIM_TimeBaseInitStructure);             //将结构体变量交给TIM_TimeBaseInit，配置TIM2的时基单元
```

**为什么选择GPIO为这个模式呢?对于普通的开漏/推挽输出,引脚的控制权是来自于输出数据寄存器的**

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201155347.png)

通过刚才看到引脚定义表，我们就知道了，这里片上外设引脚连接的就是TIM2的CH1通道。所以，只有把GPIO**设置成复用推挽输出**，引脚的控制权才能交给片上外设，**PWM波形才能通过引脚输出**。

- 第三步，配置输出比较单元,里面包括这个CCR的值、输出比较模式、极性选择、输出使能这些参数

```c
void TIM_OCXInit(TIM_TypeDef* TIMx, TIM_OCInitTypeDef* TIM_OCInitStruct)
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIM_OCXInit的X为1、2、3、4，对应4个输出比较单元，或者说输出比较通道。你需要初始化哪个通道，就调用哪个函数。不同的通道对应的GPIO口也是不一样的，所以这里要按照你GPIO口的需求来。这里使用的是PAO口，对应的就是第一个输出比较通道。对于TIM2来说，就是下图对应引脚
![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201154542.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你要使用哪个外设，就只能用对应的引脚，不过，但是虽然它是定死的，STM32还是给了我们一次更改的机会的，这就是重定义，或者叫重映射。比如如果你既要用USART2的TX引脚，又要用TIM2的CH3通道，它俩冲突成，没办法同时用，那我们就可以在这个重映射的列表里找一下，比如这里我们找到了TIM2的CH3，那TIM2的CH3就可以从原来的引脚,换到这里的引脚，这样就**避免了两个外设引脚的冲突**。如果这个重映射的列表里找不到，那外设复用的GPIO就不能挪位置.这就是重映射的功能，**配置重映射是用AFIO来完成的**

```c
/*输出比较初始化*/
TIM_OCInitTypeDef TIM_OCInitStructure;		//定义结构体变量
TIM_OCStructInit(&TIM_OCInitStructure);	 //结构体初始化，若结构体没有完整赋值
//则最好执行此函数，给结构体所有成员都赋一个默认值
//避免结构体初值不确定的问题
TIM_OCInitStructure.TIM_OCMode = TIM_OCMode_PWM1;	//输出比较模式，选择PWM模式1
TIM_OCInitStructure.TIM_OCPolarity = TIM_OCPolarity_High;	//输出极性，选择为高，若选择极性为低，则输出高低电平取反
TIM_OCInitStructure.TIM_OutputState = TIM_OutputState_Enable;	//输出使能
TIM_OCInitStructure.TIM_Pulse = 0;						//初始的CCR值 0X0000 - 0XFFFF
TIM_OC1Init(TIM2, &TIM_OCInitStructure); //将结构体变量交给TIM_OC1Init，配置TIM2的输出比较通道1

/*TIM使能*/
TIM_Cmd(TIM2, ENABLE);			//使能TIM2，定时器开始运行
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201155802.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实际上通用计时器只用到了这些结构体成员，但结构体里面还有些成员是面向高级定时器

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但是如果当你中途想把高级定时器当做通用定时器输出PWM时，那你自然就会把TIM_OCXInit的TIM2改成TIM1。这样的话，这个结构体原本没有用到的成员，现在需要使用，但是对于那些成员并没有赋值，那就会导致高级定时器输出PWM出现一些奇怪的问题最终找到的原因，就是因为这里结构体成员没有配置完整。所以为了避免程序中出现不确定的因素，把结构体所有的成员都配置完整；需要么就先给结构体成员都赋一个初始值，再修改部分的结构体成员，
```c
void TIM_OCStructInit(TIM_OCInitTypeDef* TIM_OCInitStruct) // 有了用武之地。
作用：TIM_OCInitStruct 中的每一个参数按缺省值填入
```

- 第五步，就是运行控制了.启动计数器，这样就能输出PWM了

```c
void TIM_SetCompare1(TIM_TypeDef* TIMx, uint16_t Compare1) // （ 通道1 ）
作用：设置TIMx捕获比较寄存器值（CCR）
```

#### 3.2.2 重点：重映射

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据你所要重映射的引脚，在下图找到所需要的模式，比如：如果我们想把PA0改到PA15，就可以选择这个部分重映射方式1，或者完全重映射。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201160139.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你想让PA15、PB3、PB4这三个引脚**当做GPIO来使用**的话，那就**加一下这里的第一句和第三句**，先打开AFIO时钟，再用AFIO将JTAG复用解除掉，这样就行了；

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你想**重映射定时器**或者**其他外设的复用引脚**，那就**加一下这里的第一句和第二句**，先打开AFIO时钟，再用AFIO重映射外设复用的引脚，这样就行了；

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你重映射的引脚又正好是调试端口，那这三句就都得加上，打开AFIO时钟，重映射引脚，解除调试端口，这样才行。

```c
/*GPIO重映射*/
RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO, ENABLE);	//开启AFIO的时钟，重映射必须先开启AFIO的时钟
GPIO_PinRemapConfig(GPIO_PartialRemap1_TIM2, ENABLE);	//将TIM2的引脚部分重映射，具体的映射方案需查看参考手册
GPIO_PinRemapConfig(GPIO_Remap_SWJ_JTAGDisable, ENABLE); //将JTAG引脚失能，作为普通GPIO引脚使用
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201161148.png)

第一个NoJTRST，就是**解除JTRST引脚的复用**；在引脚定义里看一下，就是**这个NJTRST也就是PB4**。如果使用这个参数，那么这个PB4就变为正常的GPIO口

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/base/20240201161810.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后看第二个参数，JTAGDisable，这个就是**解除JTAG调试端口的复用**，在引脚定义里就是，**PA15、PB3、PB4**这三个端口变回GPIO，上面的PA13和PA14，仍为SWD的调试端口

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最后看第三个参数，SW_Disable，这个参数就是把SWD和JTAG的调试端口全部解除，在引脚定义里，就是这几个引脚(PA13、vSs_2.vDD_2、PA14、PA15、PB3、PB4)全部变成普通的GPIO,没有调试功能了，所以这个参数千万不要随便调用，一但你调用这个参数并且下载程序之后，那么你的调试端口就都没有了,这之后再使用STLINK就下载不进去程序了。这时就只能使用串口下载器下载一个新的没有解除调试端口的程序

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但是PA15在引脚定义图里没有加粗，因为它上电后已经默认复用为了调试端口JTDI，所以如果想让他作为普通的GPIO或者复用定时器的通道。那还需要先关闭调试端回的复用，也是用这个

## 4. TIM输入捕获

