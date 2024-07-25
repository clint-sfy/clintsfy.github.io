---
title: FreeRTOS任务相关API
author: 阿源
date: 2024/05/01 16:30
categories:
 - FreeRTOS
tags:
 - FreeRTOS

---

# FreeRTOS任务相关API

 ![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240430203312.png)

## 1. 任务创建和删除API函数

### 1.1 xTaskCreate()  

此函数用于使用**动态的方式创建任务**，任务的任务控制块以及任务的栈空间所需的内存，均由 FreeRTOS **从 FreeRTOS 管理的堆中分配**。

若使用此函数，需要在 FreeRTOSConfig.h 文件中将宏 configSUPPORT_DYNAMIC_ALLOCATION 配置为 1。

此函数创建的任务会立刻进入就绪态，由任务调度器调度运行。  

<img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240430203430.png" style="zoom:50%;" />

任务栈栈顶，在任务切换时的任务上下文保存、任务恢复息息相关

每个任务都有属于自己的任务控制块，类似身份证

### 1.2 xTaskCreateStatic()

此函数用于使用**静态的方式创建任务**，任务的任务控制块以及任务的栈空间所需的内存，需要由**用户分配提供** 

若使用此函数 ，需要在FreeRTOSConfig.h 文件中将宏configSUPPORT_STATIC_ALLOCATION配置为 1。

此函数创建的任务会立刻进入就绪态，由任务调度器调度运行。  

<img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240430203809.png" style="zoom:50%;" />

### 1.3 vTaskDelete()  

此函数用于**删除已被创建的任务**，被删除的任务将被从就绪态任务列表、阻塞态任务列表、挂起态任务列表和事件列表中移除

当**传入的参数为NULL**，则代表**删除任务自身**（当前正在运行的任务)

要注意的是，**空闲任务**会负责释放**被删除任务**中由**系统分配的内存**（动态），但是由用户在任务删除前申请的内存（静态）， 则需要由用户在任务被删除前**提前释放**，否则**将导致内存泄露**。（静态创建的要提前释放）

若使用此函数，需要在 FreeRTOSConfig.h文件中将宏 INCLUDE_vTaskDelete配置为1。  

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240430204457.png)

## 2. 实验：任务创建和删除（动态方法）

start_task用来创建其他三个任务

```c
/* START_TASK 任务 配置
 * 包括: 任务句柄 任务优先级 堆栈大小 创建任务
 */
#define START_TASK_PRIO 1                   /* 任务优先级 */
#define START_STK_SIZE  128                 /* 任务堆栈大小 */
TaskHandle_t            StartTask_Handler;  /* 任务句柄 */
void start_task(void *pvParameters);        /* 任务函数 */

/* TASK1 任务 配置
 * 包括: 任务句柄 任务优先级 堆栈大小 创建任务
 */
#define TASK1_PRIO      2                   /* 任务优先级 */
#define TASK1_STK_SIZE  128                 /* 任务堆栈大小 */
TaskHandle_t            Task1Task_Handler;  /* 任务句柄 */
void task1(void *pvParameters);             /* 任务函数 */
```

### 2.1 入口函数

```c
void freertos_demo(void)
{
    lcd_show_string(10, 10, 220, 32, 32, "STM32", RED);
    lcd_show_string(10, 47, 220, 24, 24, "Task Create & Del", RED);
    lcd_show_string(10, 76, 220, 16, 16, "ATOM@ALIENTEK", RED);
    
    lcd_draw_rectangle(5, 110, 115, 314, BLACK);
    lcd_draw_rectangle(125, 110, 234, 314, BLACK);
    lcd_draw_line(5, 130, 115, 130, BLACK);
    lcd_draw_line(125, 130, 234, 130, BLACK);
    lcd_show_string(15, 111, 110, 16, 16, "Task1: 000", BLUE);
    lcd_show_string(135, 111, 110, 16, 16, "Task2: 000", BLUE);
    
    xTaskCreate((TaskFunction_t )start_task,            /* 任务函数 */
                (const char*    )"start_task",          /* 任务名称 */
                (uint16_t       )START_STK_SIZE,        /* 任务堆栈大小 */
                (void*          )NULL,                  /* 传入给任务函数的参数 */
                (UBaseType_t    )START_TASK_PRIO,       /* 任务优先级 */
                (TaskHandle_t*  )&StartTask_Handler);   /* 任务句柄 */
    vTaskStartScheduler();
}
```

```c
void start_task(void *pvParameters)
{
    taskENTER_CRITICAL();           /* 进入临界区 */
    /* 创建任务1 */
    xTaskCreate((TaskFunction_t )task1,                 /* 任务函数 */
                (const char*    )"task1",               /* 任务名称 */
                (uint16_t       )TASK1_STK_SIZE,        /* 任务堆栈大小 */
                (void*          )NULL,                  /* 传入给任务函数的参数 */
                (UBaseType_t    )TASK1_PRIO,            /* 任务优先级 */
                (TaskHandle_t*  )&Task1Task_Handler);   /* 任务句柄 */
    /* 创建任务2 */
    xTaskCreate((TaskFunction_t )task2,                 /* 任务函数 */
                (const char*    )"task2",               /* 任务名称 */
                (uint16_t       )TASK2_STK_SIZE,        /* 任务堆栈大小 */
                (void*          )NULL,                  /* 传入给任务函数的参数 */
                (UBaseType_t    )TASK2_PRIO,            /* 任务优先级 */
                (TaskHandle_t*  )&Task2Task_Handler);   /* 任务句柄 */
    /* 创建任务3 */
    xTaskCreate((TaskFunction_t )task3,                 /* 任务函数 */
                (const char*    )"task3",               /* 任务名称 */
                (uint16_t       )TASK3_STK_SIZE,        /* 任务堆栈大小 */
                (void*          )NULL,                  /* 传入给任务函数的参数 */
                (UBaseType_t    )TASK3_PRIO,            /* 任务优先级 */
                (TaskHandle_t*  )&Task3Task_Handler);   /* 任务句柄 */
    vTaskDelete(StartTask_Handler); /* 删除开始任务 */
    taskEXIT_CRITICAL();            /* 退出临界区 */
}
```

### 2.2 任务一

```c
void task1(void *pvParameters)
{
    uint32_t task1_num = 0;
    
    while (1)
    {
        lcd_fill(6, 131, 114, 313, lcd_discolor[++task1_num % 11]);
        lcd_show_xnum(71, 111, task1_num, 3, 16, 0x80, BLUE);
        
        vTaskDelay(500);
    }
}
```

### 2.3 任务二

```c
void task2(void *pvParameters)
{
    uint32_t task2_num = 0;
    
    while (1)
    {
        lcd_fill(126, 131, 233, 313, lcd_discolor[11 - (++task2_num % 11)]);
        lcd_show_xnum(191, 111, task2_num, 3, 16, 0x80, BLUE);
        
        vTaskDelay(500);
    }
}
```

### 2.4 任务三

```c
void task3(void *pvParameters)
{
    uint8_t key = 0;
    
    while (1)
    {
        key = key_scan(0);
        
        switch (key)
        {
            case KEY0_PRES:                     /* 删除任务1 */
            {
                if (Task1Task_Handler != NULL)
                {
                    vTaskDelete(Task1Task_Handler);
                    Task1Task_Handler = NULL;
                }
                break;
            }
            case KEY1_PRES:                     /* 删除任务2 */
            {
                if (Task2Task_Handler != NULL)
                {
                    vTaskDelete(Task2Task_Handler);
                    Task2Task_Handler = NULL;
                }
                break;
            }
            default:
            {
                break;
            }
        }
        
        vTaskDelay(10);
    }
}
```

## 3. 函数详解

### 3.1 任务创建和删除

<img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240501162151.png" style="zoom: 50%;" />

- 1、寄存器xPSR被初始为0x01000000，其中bit24被置1，表示使用Thumb指令

- 2、寄存器PC被初始化为任务函数指针vTask_A，这样当某次任务切换后，任务A获得CPU控制权，任务函数vTask_A被出栈到PC寄存器，之后会执行任务A的代码

- 3、LR寄存器初始化为函数指针prvTaskExitError，这是由移植层提供的一个出错处理函数。

- 4、子函数的调用通过寄存器R0~R3传递参数，创建任务时，我们传入的参数被保存到R0中，用来向任务传递参数

### 3.2 初始化

调用prvInitialiseNewTask初始化任务控制块中的成员

<img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240501143806.png" style="zoom: 67%;" />

调用prvAddNewTaskToReadyList添加新创建任务到就绪列表中

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240501144028.png)

### 3.3 删除任务源码

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240501143230.png)

## 4. 实验任务创建和删除（静态方法）

```c
configMINIMAL_STACK_SIZE  在那个FreeRTOSConfig.h里去找，这个默认是128
```

```c
static StackType_t  IdleTaskStack[configMINIMAL_STACK_SIZE];        /* 空闲任务任务堆栈 */
static StaticTask_t IdleTaskTCB;                                    /* 空闲任务控制块 */
static StackType_t  TimerTaskStack[configTIMER_TASK_STACK_DEPTH];   /* 定时器服务任务堆栈 */
static StaticTask_t TimerTaskTCB;                                   /* 定时器服务任务控制块 */
```

### 4.1 手动分配内存的函数

空闲任务内存分配

```c
/**
 * @brief       获取空闲任务地任务堆栈和任务控制块内存，因为本例程使用的
                静态内存，因此空闲任务的任务堆栈和任务控制块的内存就应该
                有用户来提供，FreeRTOS提供了接口函数vApplicationGetIdleTaskMemory()
                实现此函数即可。
 * @param       ppxIdleTaskTCBBuffer:任务控制块内存
                ppxIdleTaskStackBuffer:任务堆栈内存
                pulIdleTaskStackSize:任务堆栈大小
 * @retval      无
 */
void vApplicationGetIdleTaskMemory(StaticTask_t **ppxIdleTaskTCBBuffer, 
                                   StackType_t  **ppxIdleTaskStackBuffer, 
                                   uint32_t     *pulIdleTaskStackSize)
{
    *ppxIdleTaskTCBBuffer   = &IdleTaskTCB;  // 任务控制块的地址
    *ppxIdleTaskStackBuffer = IdleTaskStack; // 自己定义的数组大小
    *pulIdleTaskStackSize   =  ; //空闲任务堆栈大小
}
```

软件定时器任务分配

```c
/**
 * @brief       获取定时器服务任务的任务堆栈和任务控制块内存
 * @param       ppxTimerTaskTCBBuffer:任务控制块内存
                ppxTimerTaskStackBuffer:任务堆栈内存
                pulTimerTaskStackSize:任务堆栈大小
 * @retval      无
 */
void vApplicationGetTimerTaskMemory(StaticTask_t **ppxTimerTaskTCBBuffer,
                                    StackType_t  **ppxTimerTaskStackBuffer,
                                    uint32_t     *pulTimerTaskStackSize)
{
    *ppxTimerTaskTCBBuffer  = &TimerTaskTCB;
    *ppxTimerTaskStackBuffer= TimerTaskStack;
    *pulTimerTaskStackSize  = configTIMER_TASK_STACK_DEPTH;
}
```

### 4.2 任务配置

```c
/* START_TASK 任务 配置
 * 包括: 任务句柄 任务优先级 堆栈大小 创建任务
 */
#define START_TASK_PRIO 1                   /* 任务优先级 */
#define START_STK_SIZE  128                 /* 任务堆栈大小 */
StackType_t StartTaskStack[START_STK_SIZE]; /* 任务堆栈 */
StaticTask_t            StartTaskTCB;       /* 任务控制块 */
TaskHandle_t            StartTask_Handler;  /* 任务句柄 */
void start_task(void *pvParameters);        /* 任务函数 */

/* TASK1 任务 配置
 * 包括: 任务句柄 任务优先级 堆栈大小 创建任务
 */
#define TASK1_PRIO      2                   /* 任务优先级 */
#define TASK1_STK_SIZE  128                 /* 任务堆栈大小 */
StackType_t Task1TaskStack[TASK1_STK_SIZE]; /* 任务堆栈 */
StaticTask_t            Task1TaskTCB;       /* 任务控制块 */
TaskHandle_t            Task1Task_Handler;  /* 任务句柄 */
void task1(void *pvParameters);             /* 任务函数 */

/* TASK2 任务 配置
 * 包括: 任务句柄 任务优先级 堆栈大小 创建任务
 */
#define TASK2_PRIO      3                   /* 任务优先级 */
#define TASK2_STK_SIZE  128                 /* 任务堆栈大小 */
StackType_t Task2TaskStack[TASK2_STK_SIZE]; /* 任务堆栈 */
StaticTask_t            Task2TaskTCB;       /* 任务控制块 */
TaskHandle_t            Task2Task_Handler;  /* 任务句柄 */
void task2(void *pvParameters);             /* 任务函数 */
```

## 5. 任务挂起和恢复函数

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240501160618.png)

### 5.1 vTaskSuspend()  

此函数用于挂起任务，若使用此函数，需要在FreeRTOSConfig.h文件中将宏INCLUDE_vTaskSuspend 配置为 1。 

无论优先级如何，被挂起的任务都将不再被执行，直到任务被恢复。

此函数并不支持嵌套，不论使用此函数重复挂起任务多少次，只需调用一次恢复任务的函数，那么任务就不再被挂起。  

### 5.2 vTaskResume()  

此函数用于在任务中恢复被挂起的任务， 若使用此函数，需要在 FreeRTOSConfig.h 文件中将宏 INCLUDE_vTaskSuspend 配置为 1。

不论一个任务被函数 vTaskSuspend()挂起多少次，只需要使用函数 vTakResume()恢复一次，就可以继续运行。   

### 5.3 xTaskResumeFromISR()  

此函数用于在中断中恢复被挂起的任务， 若使用此函数，需要在 FreeRTOSConfig.h 文件中将宏 INCLUDE_xTaskResumeFromISR 配置为 1。

不论一个任务被函数 vTaskSuspend()挂起多少次，只需要使用函数 vTakResumeFromISR()恢复一次，就可以继续运行。  

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/stm32/freertos/20240501160932.png)

## 6. 实验：任务挂起和恢复

只用修改任务三即可

```c
void task3(void *pvParameters)
{
    uint8_t key = 0;
    
    while (1)
    {
        key = key_scan(0);
        
        switch (key)
        {
            case KEY0_PRES:                     /* 挂起任务1 */
            {
                vTaskSuspend(Task1Task_Handler);
                break;
            }
            case KEY1_PRES:                     /* 恢复任务1 */
            {
                vTaskResume(Task1Task_Handler);
                break;
            }
            default:
            {
                break;
            }
        }
        
        vTaskDelay(10);
    }
}
```

https://www.freertos.org/RTOS-Cortex-M3-M4.html

建议将所有优先级位分配为抢占优先级位，不保留任何优先级位作为子优先级位。任何其他配置都会使configMAX_SYSCALL_INTERRUPT_PRIORITY 设置与分配给各个外设中断的优先级之间的直接关系变得复杂。

大多数系统默认为所需的配置，但 STM32 驱动程序库除外。如果您使用带有 STM32 驱动程序库的 STM32，请在 RTOS 启动之前通过调用 `NVIC_PriorityGroupConfig( NVIC_PriorityGroup_4 );` **确保将所有优先级位分配为抢占优先级位**。

以“FromISR”结尾的 FreeRTOS 函数是中断安全的，但即使这些函数也无法从逻辑优先级高于configMAX_SYSCALL_INTERRUPT_PRIORITY 定义的优先级的中断调用（configMAX_SYSCALL_INTERRUPT_PRIORITY 在FreeRTOSConfig.h 头文件中定义）。因此，任何使用 RTOS API 函数的中断服务例程都必须手动将其优先级设置为在数值上等于或大于configMAX_SYSCALL_INTERRUPT_PRIORITY 设置的值。这可确保中断的逻辑优先级等于或小于configMAX_SYSCALL_INTERRUPT_PRIORITY 设置。

```c
HAL_NVIC_SetPriority(KEY2_INT_IRQn,5,0);
```

