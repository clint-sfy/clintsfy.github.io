import{_ as c}from"./chunks/ArticleMetadata.59a467b2.js";import{_ as t,v as p,b as r,t as i,O as d,F as l,L as y,R as h,M as g,C as b,B as u}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const x=JSON.parse('{"title":"C语言基础概述","description":"","frontmatter":{"title":"C语言基础概述","author":"阿源","date":"2023/01/01 11:15","categories":["C基础快速入门"],"tags":["C","C基础"]},"headers":[],"relativePath":"courses/c/01-C语言基础/01-C语言基础概述.md","filePath":"courses/c/01-C语言基础/01-C语言基础概述.md","lastUpdated":1695348718000}'),A={name:"courses/c/01-C语言基础/01-C语言基础概述.md"},m=l("h1",{id:"c语言基础",tabindex:"-1"},[y("C语言基础 "),l("a",{class:"header-anchor",href:"#c语言基础","aria-label":'Permalink to "C语言基础"'},"​")],-1),C=h(`<h2 id="_1、c语言的关键字" tabindex="-1"><strong>1、C语言的关键字</strong> <a class="header-anchor" href="#_1、c语言的关键字" aria-label="Permalink to &quot;**1、C语言的关键字**&quot;">​</a></h2><h3 id="_1、数据类型相关的关键字12" tabindex="-1">1、数据类型相关的关键字12 <a class="header-anchor" href="#_1、数据类型相关的关键字12" aria-label="Permalink to &quot;1、数据类型相关的关键字12&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">char 、short、int 、long 、 float、double、</span></span>
<span class="line"><span style="color:#adbac7;">struct、union、enum 、signed、unsigned、void</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">char 、short、int 、long 、 float、double、</span></span>
<span class="line"><span style="color:#24292e;">struct、union、enum 、signed、unsigned、void</span></span></code></pre></div><p>计算机最小的存储单位为 二进制</p><p>计算机最小的分配单位为 字节</p><p>二进制：没位只能存放0或1 b</p><p>8位二进制位 == 1字节 B</p><p>1B == 8b1KB = 1024B 1MB = 1024KB 1GB = 1024MB</p><p>1TB = 1024GB 1PB = 1024TB 1EB = 1024PB</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">char 字符类型 1字节</span></span>
<span class="line"><span style="color:#adbac7;">short 短整型 2字节</span></span>
<span class="line"><span style="color:#adbac7;">int 整型 4字节</span></span>
<span class="line"><span style="color:#adbac7;">long 长整型 4字节</span></span>
<span class="line"><span style="color:#adbac7;">float 单精度浮点数 4字节</span></span>
<span class="line"><span style="color:#adbac7;">double 双精度浮点数 8字节</span></span>
<span class="line"><span style="color:#adbac7;">struct 结构体 union 共用体 enum枚举 signed有符号数 unsigned无符号数</span></span>
<span class="line"><span style="color:#adbac7;">void 空类型</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">char 字符类型 1字节</span></span>
<span class="line"><span style="color:#24292e;">short 短整型 2字节</span></span>
<span class="line"><span style="color:#24292e;">int 整型 4字节</span></span>
<span class="line"><span style="color:#24292e;">long 长整型 4字节</span></span>
<span class="line"><span style="color:#24292e;">float 单精度浮点数 4字节</span></span>
<span class="line"><span style="color:#24292e;">double 双精度浮点数 8字节</span></span>
<span class="line"><span style="color:#24292e;">struct 结构体 union 共用体 enum枚举 signed有符号数 unsigned无符号数</span></span>
<span class="line"><span style="color:#24292e;">void 空类型</span></span></code></pre></div><h3 id="_2、存储相关关键字5" tabindex="-1"><strong>2、存储相关关键字5</strong> <a class="header-anchor" href="#_2、存储相关关键字5" aria-label="Permalink to &quot;**2、存储相关关键字5**&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">register、static、const、auto、extern</span></span>
<span class="line"><span style="color:#adbac7;">register寄存器变量</span></span>
<span class="line"><span style="color:#adbac7;">static 静态变量</span></span>
<span class="line"><span style="color:#adbac7;">const只读变量</span></span>
<span class="line"><span style="color:#adbac7;">auto 自动变量</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">register、static、const、auto、extern</span></span>
<span class="line"><span style="color:#24292e;">register寄存器变量</span></span>
<span class="line"><span style="color:#24292e;">static 静态变量</span></span>
<span class="line"><span style="color:#24292e;">const只读变量</span></span>
<span class="line"><span style="color:#24292e;">auto 自动变量</span></span></code></pre></div><h3 id="_3、控制语句相关的关键字11" tabindex="-1"><strong>3、控制语句相关的关键字11</strong> <a class="header-anchor" href="#_3、控制语句相关的关键字11" aria-label="Permalink to &quot;**3、控制语句相关的关键字11**&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">if 、else 、break、continue、for 、while、do、switch case goto、default</span></span>
<span class="line"><span style="color:#adbac7;">if else switch case default条件控制语句</span></span>
<span class="line"><span style="color:#adbac7;">for while break continue goto 循环控制语句</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">if 、else 、break、continue、for 、while、do、switch case goto、default</span></span>
<span class="line"><span style="color:#24292e;">if else switch case default条件控制语句</span></span>
<span class="line"><span style="color:#24292e;">for while break continue goto 循环控制语句</span></span></code></pre></div><h3 id="_4、其他关键字3" tabindex="-1"><strong>4、其他关键字3</strong> <a class="header-anchor" href="#_4、其他关键字3" aria-label="Permalink to &quot;**4、其他关键字3**&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">sizeof、typedef、volatile</span></span>
<span class="line"><span style="color:#adbac7;">sizeof测量类型的大小</span></span>
<span class="line"><span style="color:#adbac7;">typedef给类型取别名</span></span>
<span class="line"><span style="color:#adbac7;">volatile防止编译器优化</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">sizeof、typedef、volatile</span></span>
<span class="line"><span style="color:#24292e;">sizeof测量类型的大小</span></span>
<span class="line"><span style="color:#24292e;">typedef给类型取别名</span></span>
<span class="line"><span style="color:#24292e;">volatile防止编译器优化</span></span></code></pre></div><h2 id="_2、数据类型关键字" tabindex="-1"><strong>2、数据类型关键字</strong> <a class="header-anchor" href="#_2、数据类型关键字" aria-label="Permalink to &quot;**2、数据类型关键字**&quot;">​</a></h2><h3 id="_1、常量和变量" tabindex="-1"><strong>1、常量和变量</strong> <a class="header-anchor" href="#_1、常量和变量" aria-label="Permalink to &quot;**1、常量和变量**&quot;">​</a></h3><p>常量：既见既所得 它的值不能修改</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">&#39;a&#39; &#39;1&#39; 10 &quot;hello&quot; 3.14f 3.14</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">&#39;a&#39; &#39;1&#39; 10 &quot;hello&quot; 3.14f 3.14</span></span></code></pre></div><img decoding="async" src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c1.png" width="50%"><p>变量：系统会自动根据变量的类型大小 为变量开辟内存空间</p><p>变量的值 可以被修改</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> num</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//系统无法给num开辟空间（无法判断void的大小） 所以定义失败</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> num</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//系统无法给num开辟空间（无法判断void的大小） 所以定义失败</span></span></code></pre></div><p>记住：变量名的 命名规则</p><p>变量由字母、数值、下划线组成 不能以数值开头。不能是关键字</p><h3 id="_2、整型" tabindex="-1"><strong>2、整型</strong> <a class="header-anchor" href="#_2、整型" aria-label="Permalink to &quot;**2、整型**&quot;">​</a></h3><p><strong>整型常量：10</strong></p><p><strong>变量的初始化：</strong></p><p>定义变量的时候 给变量赋值 叫初始化。</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//是初始化</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> data;</span></span>
<span class="line"><span style="color:#ADBAC7;">data</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;"> //不是初始化</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//是初始化</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> data;</span></span>
<span class="line"><span style="color:#24292E;">data</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span><span style="color:#6A737D;"> //不是初始化</span></span></code></pre></div><p><strong>变量的使用：读（取值） 写（赋值）</strong></p><p><strong>变量的声明：先使用 后定义 必须事先对变量进行声明</strong></p><p><strong>获取键盘输入：scanf获取键盘输入函数</strong></p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">format</span><span style="color:#ADBAC7;">, ...);</span></span>
<span class="line"><span style="color:#ADBAC7;">format：获取数据的格式</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">format</span><span style="color:#24292E;">, ...);</span></span>
<span class="line"><span style="color:#24292E;">format：获取数据的格式</span></span></code></pre></div><h3 id="_3、字符类型-char" tabindex="-1"><strong>3、字符类型 char</strong> <a class="header-anchor" href="#_3、字符类型-char" aria-label="Permalink to &quot;**3、字符类型 char**&quot;">​</a></h3><p>字符常量 &#39;a&#39; &#39;0&#39; &#39;2&#39;</p><p>单引号 只能作用一个字符，转义字符除外</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">A:</span><span style="color:#96D0FF;">&#39;a&#39;</span><span style="color:#ADBAC7;"> B:</span><span style="color:#96D0FF;">&#39;#&#39;</span><span style="color:#ADBAC7;"> C:</span><span style="color:#96D0FF;">&#39;12&#39;</span><span style="color:#ADBAC7;">错误 D:</span><span style="color:#96D0FF;">&#39;2&#39;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">A:</span><span style="color:#032F62;">&#39;a&#39;</span><span style="color:#24292E;"> B:</span><span style="color:#032F62;">&#39;#&#39;</span><span style="color:#24292E;"> C:</span><span style="color:#032F62;">&#39;12&#39;</span><span style="color:#24292E;">错误 D:</span><span style="color:#032F62;">&#39;2&#39;</span></span></code></pre></div><p>单引号：</p><p>第一个作用：&#39;a&#39; 描述a为字符</p><p>第二个作用：取字符的ASCII值</p><img decoding="async" src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c2.png" width="70%"><p>printf %c 输出的是字符</p><p>printf %d输出的是字符的ASCII值</p><p><strong>字符的大小写转换：</strong></p><p>键盘输入一个字符，如果是大写 就转换成小写 如果是小写就转换成大写</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#96D0FF;">&#39;a&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">97</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;b&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">98</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;c&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">99</span><span style="color:#ADBAC7;"> ...... </span><span style="color:#96D0FF;">&#39;z&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">122</span></span>
<span class="line"><span style="color:#96D0FF;">&#39;A&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">65</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;B&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">66</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;c&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">67</span><span style="color:#ADBAC7;"> ...... </span><span style="color:#96D0FF;">&#39;z&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">90</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> ch </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;a&#39;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">ch </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ch‐(</span><span style="color:#96D0FF;">&#39;a&#39;</span><span style="color:#ADBAC7;">‐</span><span style="color:#96D0FF;">&#39;A&#39;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> ch </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;A&#39;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">ch </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ch</span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;a&#39;</span><span style="color:#ADBAC7;">‐</span><span style="color:#96D0FF;">&#39;A&#39;</span><span style="color:#ADBAC7;">);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#032F62;">&#39;a&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">97</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;b&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">98</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;c&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">99</span><span style="color:#24292E;"> ...... </span><span style="color:#032F62;">&#39;z&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">122</span></span>
<span class="line"><span style="color:#032F62;">&#39;A&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">65</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;B&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">66</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;c&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">67</span><span style="color:#24292E;"> ...... </span><span style="color:#032F62;">&#39;z&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">90</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">char</span><span style="color:#24292E;"> ch </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;a&#39;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">ch </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ch‐(</span><span style="color:#032F62;">&#39;a&#39;</span><span style="color:#24292E;">‐</span><span style="color:#032F62;">&#39;A&#39;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">char</span><span style="color:#24292E;"> ch </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;A&#39;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">ch </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ch</span><span style="color:#D73A49;">+</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;a&#39;</span><span style="color:#24292E;">‐</span><span style="color:#032F62;">&#39;A&#39;</span><span style="color:#24292E;">);</span></span></code></pre></div><h3 id="_4、实型-浮点数" tabindex="-1"><strong>4、实型（浮点数）</strong> <a class="header-anchor" href="#_4、实型-浮点数" aria-label="Permalink to &quot;**4、实型（浮点数）**&quot;">​</a></h3><p>单精度浮点数（float） 双精度浮点数double</p><p><strong>1、实型常量 3.14 3.14f</strong></p><p>不以f结尾的实型常量为double类型</p><p>以f结尾的实型常量为float类型</p><p>指数形式： 123e3 代表 123*10 的三次方 123e-3</p><p><strong>2、实型变量</strong></p><p>float型:占4字节，7位有效数字,指数-37到38 3333.33333 double型:占8字节，16 位有效数字,指数-307到308</p><h2 id="_3、有符号数和无符号数" tabindex="-1"><strong>3、有符号数和无符号数</strong> <a class="header-anchor" href="#_3、有符号数和无符号数" aria-label="Permalink to &quot;**3、有符号数和无符号数**&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">有符号数：</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">数据二进制的最高位为符号位 其他位为数据位。</span></span>
<span class="line"><span style="color:#adbac7;">最高位为1 表示负数</span></span>
<span class="line"><span style="color:#adbac7;">最高位为0 表示正数</span></span>
<span class="line"><span style="color:#adbac7;">以一字节为例：xddd dddd</span></span>
<span class="line"><span style="color:#adbac7;">1111 1111~1000 0000~0000 0000~0111 1111</span></span>
<span class="line"><span style="color:#adbac7;">-127 ~-0 ~+0 ~+127</span></span>
<span class="line"><span style="color:#adbac7;">将-0看成-128</span></span>
<span class="line"><span style="color:#adbac7;">-128~127</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">//方式一：默认方式(推荐)</span></span>
<span class="line"><span style="color:#adbac7;">int num;//num为有符号数</span></span>
<span class="line"><span style="color:#adbac7;">//方式二：使用关键字signed显示说明</span></span>
<span class="line"><span style="color:#adbac7;">signed int num;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">%d 输出有符号int</span></span>
<span class="line"><span style="color:#adbac7;">%hd输出有符号short</span></span>
<span class="line"><span style="color:#adbac7;">%ld输出有符号long</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">有符号数：</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">数据二进制的最高位为符号位 其他位为数据位。</span></span>
<span class="line"><span style="color:#24292e;">最高位为1 表示负数</span></span>
<span class="line"><span style="color:#24292e;">最高位为0 表示正数</span></span>
<span class="line"><span style="color:#24292e;">以一字节为例：xddd dddd</span></span>
<span class="line"><span style="color:#24292e;">1111 1111~1000 0000~0000 0000~0111 1111</span></span>
<span class="line"><span style="color:#24292e;">-127 ~-0 ~+0 ~+127</span></span>
<span class="line"><span style="color:#24292e;">将-0看成-128</span></span>
<span class="line"><span style="color:#24292e;">-128~127</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">//方式一：默认方式(推荐)</span></span>
<span class="line"><span style="color:#24292e;">int num;//num为有符号数</span></span>
<span class="line"><span style="color:#24292e;">//方式二：使用关键字signed显示说明</span></span>
<span class="line"><span style="color:#24292e;">signed int num;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">%d 输出有符号int</span></span>
<span class="line"><span style="color:#24292e;">%hd输出有符号short</span></span>
<span class="line"><span style="color:#24292e;">%ld输出有符号long</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">无符号数</span></span>
<span class="line"><span style="color:#adbac7;">没有符号位 所有二进制位都是数据位</span></span>
<span class="line"><span style="color:#adbac7;">0000 0000 ~1111 1111</span></span>
<span class="line"><span style="color:#adbac7;">0 ~ 255</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">unsigned int num;</span></span>
<span class="line"><span style="color:#adbac7;">%u 输出无符号unsigned int</span></span>
<span class="line"><span style="color:#adbac7;">%hu 输出无符号unsigned short</span></span>
<span class="line"><span style="color:#adbac7;">%lu 输出无符号unsigned long</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">无符号数</span></span>
<span class="line"><span style="color:#24292e;">没有符号位 所有二进制位都是数据位</span></span>
<span class="line"><span style="color:#24292e;">0000 0000 ~1111 1111</span></span>
<span class="line"><span style="color:#24292e;">0 ~ 255</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">unsigned int num;</span></span>
<span class="line"><span style="color:#24292e;">%u 输出无符号unsigned int</span></span>
<span class="line"><span style="color:#24292e;">%hu 输出无符号unsigned short</span></span>
<span class="line"><span style="color:#24292e;">%lu 输出无符号unsigned long</span></span></code></pre></div><h2 id="_4、二进制、八进制、十进制、十六机制" tabindex="-1"><strong>4、二进制、八进制、十进制、十六机制</strong> <a class="header-anchor" href="#_4、二进制、八进制、十进制、十六机制" aria-label="Permalink to &quot;**4、二进制、八进制、十进制、十六机制**&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">二进制：0~1</span></span>
<span class="line"><span style="color:#adbac7;">c语言 不能直接输出二进制</span></span>
<span class="line"><span style="color:#adbac7;">八进制：0~7</span></span>
<span class="line"><span style="color:#adbac7;">八进制：以0开头 0123 %o 输出八进制 不区分正负数</span></span>
<span class="line"><span style="color:#adbac7;">十进制：0~9</span></span>
<span class="line"><span style="color:#adbac7;">十进制：123 %d %ld %hd %u %lu %hu</span></span>
<span class="line"><span style="color:#adbac7;">十六进制：0~9 a~f</span></span>
<span class="line"><span style="color:#adbac7;">十六进制：以0x12 %x 输出十六进制 不区分正负数</span></span>
<span class="line"><span style="color:#adbac7;">n进制：0~n-1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">二进制：0~1</span></span>
<span class="line"><span style="color:#24292e;">c语言 不能直接输出二进制</span></span>
<span class="line"><span style="color:#24292e;">八进制：0~7</span></span>
<span class="line"><span style="color:#24292e;">八进制：以0开头 0123 %o 输出八进制 不区分正负数</span></span>
<span class="line"><span style="color:#24292e;">十进制：0~9</span></span>
<span class="line"><span style="color:#24292e;">十进制：123 %d %ld %hd %u %lu %hu</span></span>
<span class="line"><span style="color:#24292e;">十六进制：0~9 a~f</span></span>
<span class="line"><span style="color:#24292e;">十六进制：以0x12 %x 输出十六进制 不区分正负数</span></span>
<span class="line"><span style="color:#24292e;">n进制：0~n-1</span></span></code></pre></div><h2 id="_5、原码、反码、补码" tabindex="-1"><strong>5、原码、反码、补码</strong> <a class="header-anchor" href="#_5、原码、反码、补码" aria-label="Permalink to &quot;**5、原码、反码、补码**&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">计算机存储的是数据的补码。</span></span>
<span class="line"><span style="color:#adbac7;">原码：数据的二进制形式</span></span>
<span class="line"><span style="color:#adbac7;">123:原码0111 1011</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">无符号数：</span></span>
<span class="line"><span style="color:#adbac7;">补码==反码==原码</span></span>
<span class="line"><span style="color:#adbac7;">123原码：0111 1011</span></span>
<span class="line"><span style="color:#adbac7;">123反码：0111 1011</span></span>
<span class="line"><span style="color:#adbac7;">123补码：0111 1011</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">有符号数：</span></span>
<span class="line"><span style="color:#adbac7;">正数：</span></span>
<span class="line"><span style="color:#adbac7;">补码==反码==原码</span></span>
<span class="line"><span style="color:#adbac7;">+123原码：0111 1011</span></span>
<span class="line"><span style="color:#adbac7;">+123反码：0111 1011</span></span>
<span class="line"><span style="color:#adbac7;">+123补码：0111 1011</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">负数：</span></span>
<span class="line"><span style="color:#adbac7;">反码==原码符号位不变 其他位按位取反。</span></span>
<span class="line"><span style="color:#adbac7;">补码==反码+1</span></span>
<span class="line"><span style="color:#adbac7;">-123原码：1111 1011</span></span>
<span class="line"><span style="color:#adbac7;">-123反码：1000 0100</span></span>
<span class="line"><span style="color:#adbac7;">-123补码：1000 0101</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">负数在计算机以补码的方式存储</span></span>
<span class="line"><span style="color:#adbac7;">非负数在计算机以原码的方式存储</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">计算机存储的是数据的补码。</span></span>
<span class="line"><span style="color:#24292e;">原码：数据的二进制形式</span></span>
<span class="line"><span style="color:#24292e;">123:原码0111 1011</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">无符号数：</span></span>
<span class="line"><span style="color:#24292e;">补码==反码==原码</span></span>
<span class="line"><span style="color:#24292e;">123原码：0111 1011</span></span>
<span class="line"><span style="color:#24292e;">123反码：0111 1011</span></span>
<span class="line"><span style="color:#24292e;">123补码：0111 1011</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">有符号数：</span></span>
<span class="line"><span style="color:#24292e;">正数：</span></span>
<span class="line"><span style="color:#24292e;">补码==反码==原码</span></span>
<span class="line"><span style="color:#24292e;">+123原码：0111 1011</span></span>
<span class="line"><span style="color:#24292e;">+123反码：0111 1011</span></span>
<span class="line"><span style="color:#24292e;">+123补码：0111 1011</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">负数：</span></span>
<span class="line"><span style="color:#24292e;">反码==原码符号位不变 其他位按位取反。</span></span>
<span class="line"><span style="color:#24292e;">补码==反码+1</span></span>
<span class="line"><span style="color:#24292e;">-123原码：1111 1011</span></span>
<span class="line"><span style="color:#24292e;">-123反码：1000 0100</span></span>
<span class="line"><span style="color:#24292e;">-123补码：1000 0101</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">负数在计算机以补码的方式存储</span></span>
<span class="line"><span style="color:#24292e;">非负数在计算机以原码的方式存储</span></span></code></pre></div><h2 id="_6、计算机对数据的存储" tabindex="-1"><strong>6、计算机对数据的存储</strong> <a class="header-anchor" href="#_6、计算机对数据的存储" aria-label="Permalink to &quot;**6、计算机对数据的存储**&quot;">​</a></h2><p>负数在计算机以补码的方式存储</p><p>非负数在计算机以原码的方式存储</p><p>八进制数 以原码存储</p><p>十六进制 以原码存储</p><h2 id="_7、计算机对数据的取" tabindex="-1"><strong>7、计算机对数据的取</strong> <a class="header-anchor" href="#_7、计算机对数据的取" aria-label="Permalink to &quot;**7、计算机对数据的取**&quot;">​</a></h2><p>如果是对 无符号变量 进行取值：</p><p>不管是有符号提取(%d %hd %ld) 还是无符号提取(%u %hu %lu %o %x) 都是输出<strong>内存的原样数据</strong>。（16进制转化的10进制数）</p><p><img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c3.png" alt=""></p><p>·</p><p>如果是对 有符号变量 进行取值：（16进制输出的时候要补位）</p><p>系统会去看内存的最高位，如果最高位为0 表明正数， （有符号或无符号输出）都是内存原样 输出</p><p><img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c4.png" alt=""></p><p>​ 系统会去看内存的最高位，如果最高位为1 表明负数， 无符号输出（%u %lu %hu %o%x）都是 内存原样 输出, 有符号输出（%d %hd %ld），将内存数据求补码（得到原码）输出。</p><p><img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c5.png" alt=""></p><p><img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c6.png" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">总结：</span></span>
<span class="line"><span style="color:#adbac7;">有符号数、并有符号提取、且内存最高位为1 将内存数据 求补码 输出 ，其他数据提取都是内存原样输出。</span></span>
<span class="line"><span style="color:#adbac7;">对无符号数据 提取 都是内存原样输出</span></span>
<span class="line"><span style="color:#adbac7;">对有符号数据 无符号提取 是内存原样输出</span></span>
<span class="line"><span style="color:#adbac7;">对有符号数、内存最高位为0 有符号提取 是内存原样输出</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">总结：</span></span>
<span class="line"><span style="color:#24292e;">有符号数、并有符号提取、且内存最高位为1 将内存数据 求补码 输出 ，其他数据提取都是内存原样输出。</span></span>
<span class="line"><span style="color:#24292e;">对无符号数据 提取 都是内存原样输出</span></span>
<span class="line"><span style="color:#24292e;">对有符号数据 无符号提取 是内存原样输出</span></span>
<span class="line"><span style="color:#24292e;">对有符号数、内存最高位为0 有符号提取 是内存原样输出</span></span></code></pre></div><h2 id="_8、其他关键字" tabindex="-1"><strong>8、其他关键字</strong> <a class="header-anchor" href="#_8、其他关键字" aria-label="Permalink to &quot;**8、其他关键字**&quot;">​</a></h2><p><strong>1、const修饰变量为只读</strong></p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">//const修饰num为只读变量本质是变量</span></span>
<span class="line"><span style="color:#768390;">//只读变量只能初始化不能被赋值</span></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num</span></span>
<span class="line"><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//error.</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//const修饰num为只读变量本质是变量</span></span>
<span class="line"><span style="color:#6A737D;">//只读变量只能初始化不能被赋值</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num</span></span>
<span class="line"><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//error.</span></span></code></pre></div><p><strong>2、register修饰寄存器变量</strong></p><p>如果变量 别高频繁使用 会自动将变量存储在寄存器中 目的：提高访问效率</p><p>如果用户想将变量 直接放入寄存器中 可以加register修饰</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test03</span><span style="color:#ADBAC7;"> (){</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//将num放入寄存器中提高访问效率num也叫寄存器变量</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">register</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//不能对寄存器变量取地址&amp;num是错误的</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">num;</span><span style="color:#768390;"> //&amp;取的是内存地址而num可能在寄存器中所以取地址失败</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//register修饰的变量只是尽量放入寄存器中。</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test03</span><span style="color:#24292E;"> (){</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//将num放入寄存器中提高访问效率num也叫寄存器变量</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">register</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//不能对寄存器变量取地址&amp;num是错误的</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">num;</span><span style="color:#6A737D;"> //&amp;取的是内存地址而num可能在寄存器中所以取地址失败</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//register修饰的变量只是尽量放入寄存器中。</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p><strong>3、volatile关键字</strong></p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">volatile</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//对num的访问 必须从内存访问</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">volatile</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//对num的访问 必须从内存访问</span></span></code></pre></div><p><strong>4、sizeof测量类型的大小</strong></p><p><strong>5、typedef给已有的类型重新取个别名</strong></p><p>不能创建新类型。</p><p>将长且复杂的类型名 取一个短小的名称。</p><p>typedef作用的步骤：</p><p>1、先用 已有的类型 定义一个普通的变量</p><p>2、用别名 替换 变量名</p><p>3、在整个表达式最前方 加typedef</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">typedef</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MY_ARRAY</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">MY_ARRAY arr;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">typedef</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">POINTER;</span><span style="color:#768390;">//POINTER == int *</span></span>
<span class="line"><span style="color:#ADBAC7;">POINTER p;</span><span style="color:#768390;">//int *p;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">typedef</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">MY_ARRAY</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">MY_ARRAY arr;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">typedef</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">POINTER;</span><span style="color:#6A737D;">//POINTER == int *</span></span>
<span class="line"><span style="color:#24292E;">POINTER p;</span><span style="color:#6A737D;">//int *p;</span></span></code></pre></div><h2 id="_9、转义字符" tabindex="-1"><strong>9、转义字符</strong> <a class="header-anchor" href="#_9、转义字符" aria-label="Permalink to &quot;**9、转义字符**&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">1 &#39;\\0&#39; == ASCII 为0</span></span>
<span class="line"><span style="color:#adbac7;">2 &#39;\\n&#39; == 换行符</span></span>
<span class="line"><span style="color:#adbac7;">3 &#39;\\t&#39; == tab缩进符</span></span>
<span class="line"><span style="color:#adbac7;">4 &#39;\\r&#39; ==回到行首符号</span></span>
<span class="line"><span style="color:#adbac7;">5 &#39;\\a&#39; ==发出警报</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">1 &#39;\\0&#39; == ASCII 为0</span></span>
<span class="line"><span style="color:#24292e;">2 &#39;\\n&#39; == 换行符</span></span>
<span class="line"><span style="color:#24292e;">3 &#39;\\t&#39; == tab缩进符</span></span>
<span class="line"><span style="color:#24292e;">4 &#39;\\r&#39; ==回到行首符号</span></span>
<span class="line"><span style="color:#24292e;">5 &#39;\\a&#39; ==发出警报</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">&#39;\\ddd&#39; 每个d的范围必须是0~7 3个d表示最多识别3位八进制数据</span></span>
<span class="line"><span style="color:#adbac7;">以下字符描述正确的是__A__</span></span>
<span class="line"><span style="color:#adbac7;">1 A：&#39;\\123&#39; B:&#39;\\18&#39; C:&#39;\\1234&#39; D:&#39;\\183&#39;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">&#39;\\ddd&#39; 每个d的范围必须是0~7 3个d表示最多识别3位八进制数据</span></span>
<span class="line"><span style="color:#24292e;">以下字符描述正确的是__A__</span></span>
<span class="line"><span style="color:#24292e;">1 A：&#39;\\123&#39; B:&#39;\\18&#39; C:&#39;\\1234&#39; D:&#39;\\183&#39;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">&#39;\\xhh&#39; 每个h的范围0~9 a~f 2个h表示最多识别2位十六进制</span></span>
<span class="line"><span style="color:#adbac7;">以下字符描述正确的是__BD___</span></span>
<span class="line"><span style="color:#adbac7;">1 A:&#39;\\af&#39; B:&#39;\\123&#39; C:&#39;\\x3df&#39; D:&#39;\\xab&#39;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">&#39;\\xhh&#39; 每个h的范围0~9 a~f 2个h表示最多识别2位十六进制</span></span>
<span class="line"><span style="color:#24292e;">以下字符描述正确的是__BD___</span></span>
<span class="line"><span style="color:#24292e;">1 A:&#39;\\af&#39; B:&#39;\\123&#39; C:&#39;\\x3df&#39; D:&#39;\\xab&#39;</span></span></code></pre></div><h2 id="_10、类型转换" tabindex="-1"><strong>10、类型转换</strong> <a class="header-anchor" href="#_10、类型转换" aria-label="Permalink to &quot;**10、类型转换**&quot;">​</a></h2><p>不同类型数据之间进行混合运算时必然涉及到类型的转换问题。</p><p>自动类型转换：保证精度不丢失 将小的类型 转成 大类型</p><p><img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c7.png" alt=""></p><h2 id="_11、运算符" tabindex="-1"><strong>11、运算符</strong> <a class="header-anchor" href="#_11、运算符" aria-label="Permalink to &quot;**11、运算符**&quot;">​</a></h2><p><img src="https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/c8.png" alt=""></p><h3 id="算数运算符" tabindex="-1">算数运算符 <a class="header-anchor" href="#算数运算符" aria-label="Permalink to &quot;算数运算符&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">+ ‐ * / % += ‐= *= /= %=</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">+ ‐ * / % += ‐= *= /= %=</span></span></code></pre></div><h3 id="关系运算符" tabindex="-1"><strong>关系运算符</strong> <a class="header-anchor" href="#关系运算符" aria-label="Permalink to &quot;**关系运算符**&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">（＞、＜、==、&gt;=、&lt;=、!= ）</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">（＞、＜、==、&gt;=、&lt;=、!= ）</span></span></code></pre></div><h3 id="逻辑运算符" tabindex="-1"><strong>逻辑运算符</strong> <a class="header-anchor" href="#逻辑运算符" aria-label="Permalink to &quot;**逻辑运算符**&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">&amp;&amp;逻辑与：</span></span>
<span class="line"><span style="color:#adbac7;">A &amp;&amp; B A为真 且 B为真 整个表达式结果才为真。</span></span>
<span class="line"><span style="color:#adbac7;">A &amp;&amp; B A或B只要有一个为假 整个表达式结果才为假。</span></span>
<span class="line"><span style="color:#adbac7;">注意：逻辑与&amp;&amp;的短路特性：</span></span>
<span class="line"><span style="color:#adbac7;">如果A为假 整个表达式为假， 那么B的真假决定不了整个表达式的结果，所以不</span></span>
<span class="line"><span style="color:#adbac7;">会再判断B的真假，就叫“短路特性</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">||逻辑或：</span></span>
<span class="line"><span style="color:#adbac7;">A || B A和B只要有一个为真 整个表达式结果为真。</span></span>
<span class="line"><span style="color:#adbac7;">A || B A和B同时假 整个表达式结果为假。</span></span>
<span class="line"><span style="color:#adbac7;">注意逻辑或||的短路特性：</span></span>
<span class="line"><span style="color:#adbac7;">如果A为真 整个表达式为真， 那么B的真假决定不了整个表达式的结果，所以不</span></span>
<span class="line"><span style="color:#adbac7;">会再判断B的真假，就叫“短路特性”</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">！逻辑非：</span></span>
<span class="line"><span style="color:#adbac7;">!真 == 假 ！假==真</span></span>
<span class="line"><span style="color:#adbac7;">在c语言中 除了0为假 其他都为真</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">&amp;&amp;逻辑与：</span></span>
<span class="line"><span style="color:#24292e;">A &amp;&amp; B A为真 且 B为真 整个表达式结果才为真。</span></span>
<span class="line"><span style="color:#24292e;">A &amp;&amp; B A或B只要有一个为假 整个表达式结果才为假。</span></span>
<span class="line"><span style="color:#24292e;">注意：逻辑与&amp;&amp;的短路特性：</span></span>
<span class="line"><span style="color:#24292e;">如果A为假 整个表达式为假， 那么B的真假决定不了整个表达式的结果，所以不</span></span>
<span class="line"><span style="color:#24292e;">会再判断B的真假，就叫“短路特性</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">||逻辑或：</span></span>
<span class="line"><span style="color:#24292e;">A || B A和B只要有一个为真 整个表达式结果为真。</span></span>
<span class="line"><span style="color:#24292e;">A || B A和B同时假 整个表达式结果为假。</span></span>
<span class="line"><span style="color:#24292e;">注意逻辑或||的短路特性：</span></span>
<span class="line"><span style="color:#24292e;">如果A为真 整个表达式为真， 那么B的真假决定不了整个表达式的结果，所以不</span></span>
<span class="line"><span style="color:#24292e;">会再判断B的真假，就叫“短路特性”</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">！逻辑非：</span></span>
<span class="line"><span style="color:#24292e;">!真 == 假 ！假==真</span></span>
<span class="line"><span style="color:#24292e;">在c语言中 除了0为假 其他都为真</span></span></code></pre></div><h3 id="产生随机数" tabindex="-1"><strong>产生随机数</strong> <a class="header-anchor" href="#产生随机数" aria-label="Permalink to &quot;**产生随机数**&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">srand(time(NULL))</span></span>
<span class="line"><span style="color:#adbac7;">num = rand()</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">srand(time(NULL))</span></span>
<span class="line"><span style="color:#24292e;">num = rand()</span></span></code></pre></div><h3 id="位运算-二进制位运算" tabindex="-1"><strong>位运算（二进制位运算）</strong> <a class="header-anchor" href="#位运算-二进制位运算" aria-label="Permalink to &quot;**位运算（二进制位运算）**&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">1、&amp; 按位与</span></span>
<span class="line"><span style="color:#adbac7;">语法：全1为1 有0为0</span></span>
<span class="line"><span style="color:#adbac7;">特点：和1相与保持不变 和0相与为0</span></span>
<span class="line"><span style="color:#adbac7;">场景: 将指定位 清0</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">1、&amp; 按位与</span></span>
<span class="line"><span style="color:#24292e;">语法：全1为1 有0为0</span></span>
<span class="line"><span style="color:#24292e;">特点：和1相与保持不变 和0相与为0</span></span>
<span class="line"><span style="color:#24292e;">场景: 将指定位 清0</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">2、| 按位或</span></span>
<span class="line"><span style="color:#adbac7;">语法：有1为1 全0为0</span></span>
<span class="line"><span style="color:#adbac7;">特点：和1或置1， 和0或 保持不变</span></span>
<span class="line"><span style="color:#adbac7;">场景：将指定位 置1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">2、| 按位或</span></span>
<span class="line"><span style="color:#24292e;">语法：有1为1 全0为0</span></span>
<span class="line"><span style="color:#24292e;">特点：和1或置1， 和0或 保持不变</span></span>
<span class="line"><span style="color:#24292e;">场景：将指定位 置1</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">3、~按位取反</span></span>
<span class="line"><span style="color:#adbac7;">语法：0变1 1变0</span></span>
<span class="line"><span style="color:#adbac7;">~1100 0011 == 0011 1100</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">3、~按位取反</span></span>
<span class="line"><span style="color:#24292e;">语法：0变1 1变0</span></span>
<span class="line"><span style="color:#24292e;">~1100 0011 == 0011 1100</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">4、^ 按位异或</span></span>
<span class="line"><span style="color:#adbac7;">语法：相同为0 不同为1</span></span>
<span class="line"><span style="color:#adbac7;">特点：和1异或取反 和0异或保持不变</span></span>
<span class="line"><span style="color:#adbac7;">场景：将指定位 发生翻转</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">4、^ 按位异或</span></span>
<span class="line"><span style="color:#24292e;">语法：相同为0 不同为1</span></span>
<span class="line"><span style="color:#24292e;">特点：和1异或取反 和0异或保持不变</span></span>
<span class="line"><span style="color:#24292e;">场景：将指定位 发生翻转</span></span></code></pre></div><h3 id="移位" tabindex="-1">移位 <a class="header-anchor" href="#移位" aria-label="Permalink to &quot;移位&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">左移&lt;&lt;:左边丢弃 右边补0</span></span>
<span class="line"><span style="color:#adbac7;">右移&gt;&gt;:右边丢弃 左边补0（补1）</span></span>
<span class="line"><span style="color:#adbac7;">算术右移、逻辑右移 都是编译器决定，用户无法确定</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">无符号数：右边丢弃 左边补0</span></span>
<span class="line"><span style="color:#adbac7;">有符号数：</span></span>
<span class="line"><span style="color:#adbac7;">正数：右边丢弃 左边补0</span></span>
<span class="line"><span style="color:#adbac7;">负数：右边丢弃 左边补0（逻辑右移）</span></span>
<span class="line"><span style="color:#adbac7;">负数：右边丢弃 左边补1（算术右移）</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">左移&lt;&lt;:左边丢弃 右边补0</span></span>
<span class="line"><span style="color:#24292e;">右移&gt;&gt;:右边丢弃 左边补0（补1）</span></span>
<span class="line"><span style="color:#24292e;">算术右移、逻辑右移 都是编译器决定，用户无法确定</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">无符号数：右边丢弃 左边补0</span></span>
<span class="line"><span style="color:#24292e;">有符号数：</span></span>
<span class="line"><span style="color:#24292e;">正数：右边丢弃 左边补0</span></span>
<span class="line"><span style="color:#24292e;">负数：右边丢弃 左边补0（逻辑右移）</span></span>
<span class="line"><span style="color:#24292e;">负数：右边丢弃 左边补1（算术右移）</span></span></code></pre></div><h3 id="三目运算符" tabindex="-1"><strong>三目运算符</strong> <a class="header-anchor" href="#三目运算符" aria-label="Permalink to &quot;**三目运算符**&quot;">​</a></h3><p>？：---&gt; 表达式1 ？ 值1:值2</p><p>如果表达式1为真 整个表达式的值为值1</p><p>如果表达式1为假 整个表达式的值为值2</p><h3 id="逗号运算符" tabindex="-1"><strong>逗号运算符</strong> <a class="header-anchor" href="#逗号运算符" aria-label="Permalink to &quot;**逗号运算符**&quot;">​</a></h3><h2 id="_12、自增自减运算符" tabindex="-1">12、<strong>自增自减运算符</strong> <a class="header-anchor" href="#_12、自增自减运算符" aria-label="Permalink to &quot;12、**自增自减运算符**&quot;">​</a></h2><h2 id="_13、if控制语句" tabindex="-1">13、<strong>if控制语句</strong> <a class="header-anchor" href="#_13、if控制语句" aria-label="Permalink to &quot;13、**if控制语句**&quot;">​</a></h2><h2 id="_14、switch选择语句" tabindex="-1"><strong>14、switch选择语句</strong> <a class="header-anchor" href="#_14、switch选择语句" aria-label="Permalink to &quot;**14、switch选择语句**&quot;">​</a></h2><h2 id="_15、for循环语句" tabindex="-1"><strong>15、for循环语句</strong> <a class="header-anchor" href="#_15、for循环语句" aria-label="Permalink to &quot;**15、for循环语句**&quot;">​</a></h2><h2 id="_16、【while循环语句" tabindex="-1">16、<strong>【while循环语句</strong> <a class="header-anchor" href="#_16、【while循环语句" aria-label="Permalink to &quot;16、**【while循环语句**&quot;">​</a></h2>`,133);function v(s,D,k,B,F,f){const e=c,o=g("ClientOnly");return p(),r("div",null,[m,i(o,null,{default:d(()=>{var a,n;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((n=s.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(p(),b(e,{key:0,article:s.$frontmatter},null,8,["article"])):u("",!0)]}),_:1}),C])}const P=t(A,[["render",v]]);export{x as __pageData,P as default};
