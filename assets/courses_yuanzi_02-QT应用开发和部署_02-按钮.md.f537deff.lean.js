import{_ as t}from"./chunks/ArticleMetadata.59a467b2.js";import{_ as c,v as l,b as r,t as y,O as i,F as p,L as B,R as A,M as C,C as D,B as d}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const W=JSON.parse('{"title":"按钮","description":"","frontmatter":{"title":"按钮","author":"阿源","date":"2023/08/02 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/02-QT应用开发和部署/02-按钮.md","filePath":"courses/yuanzi/02-QT应用开发和部署/02-按钮.md","lastUpdated":1695461708000}'),u={name:"courses/yuanzi/02-QT应用开发和部署/02-按钮.md"},F=p("h1",{id:"正点原子qt之按钮",tabindex:"-1"},[B("正点原子QT之按钮 "),p("a",{class:"header-anchor",href:"#正点原子qt之按钮","aria-label":'Permalink to "正点原子QT之按钮"'},"​")],-1),h=A(`<h2 id="_4-按钮" tabindex="-1">4. 按钮 <a class="header-anchor" href="#_4-按钮" aria-label="Permalink to &quot;4. 按钮&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">（1） QPushButton:下压按钮</span></span>
<span class="line"><span style="color:#adbac7;">（2） QToolButton:工具按钮</span></span>
<span class="line"><span style="color:#adbac7;">（3） QRadioButton:选择按钮</span></span>
<span class="line"><span style="color:#adbac7;">（4） QCheckBox:检查框</span></span>
<span class="line"><span style="color:#adbac7;">（5） QCommandLinkButton:命令链接按钮</span></span>
<span class="line"><span style="color:#adbac7;">（6） QDialogButtonBox:对话框按钮</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">（1） QPushButton:下压按钮</span></span>
<span class="line"><span style="color:#24292e;">（2） QToolButton:工具按钮</span></span>
<span class="line"><span style="color:#24292e;">（3） QRadioButton:选择按钮</span></span>
<span class="line"><span style="color:#24292e;">（4） QCheckBox:检查框</span></span>
<span class="line"><span style="color:#24292e;">（5） QCommandLinkButton:命令链接按钮</span></span>
<span class="line"><span style="color:#24292e;">（6） QDialogButtonBox:对话框按钮</span></span></code></pre></div><h3 id="_4-1-qpushbutton-下压按钮" tabindex="-1">4.1. QPushButton:下压按钮 <a class="header-anchor" href="#_4-1-qpushbutton-下压按钮" aria-label="Permalink to &quot;4.1. QPushButton:下压按钮&quot;">​</a></h3><p>QPushButton 继承 QAbstractButton 类，被 QCommandLinkButton 继承。通常用于执行命令 或触发事件。</p><h3 id="案例-通过单击不同的按钮-改变窗口的颜色" tabindex="-1">案例：通过单击不同的按钮，改变窗口的颜色 <a class="header-anchor" href="#案例-通过单击不同的按钮-改变窗口的颜色" aria-label="Permalink to &quot;案例：通过单击不同的按钮，改变窗口的颜色&quot;">​</a></h3><p>例 04_qpushbutton 窗口换肤（难度：简单），通过单击不同的按钮，改变窗口的颜色。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#768390;">/* 引入QPushButton类 */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QPushButton&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QMainWindow</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QWidget</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">parent</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">nullptr</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~MainWindow</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#768390;">    /* 声明一个QPushButton对象pushButton1 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPushButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pushButton1;</span></span>
<span class="line"><span style="color:#768390;">    /* 声明一个QPushButton对象pushButton2 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPushButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pushButton2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">private slots:</span></span>
<span class="line"><span style="color:#768390;">    /* 声明对象pushButton1的槽函数 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">pushButton1_Clicked</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 声明对象pushButton2的槽函数 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">pushButton2_Clicked</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // MAINWINDOW_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#6A737D;">/* 引入QPushButton类 */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QPushButton&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QMainWindow</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">parent</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nullptr</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~MainWindow</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 声明一个QPushButton对象pushButton1 */</span></span>
<span class="line"><span style="color:#24292E;">    QPushButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pushButton1;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 声明一个QPushButton对象pushButton2 */</span></span>
<span class="line"><span style="color:#24292E;">    QPushButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pushButton2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">private slots:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 声明对象pushButton1的槽函数 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">pushButton1_Clicked</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 声明对象pushButton2的槽函数 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">pushButton2_Clicked</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // MAINWINDOW_H</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置宽高为800×480,位置在0, 0。（0, 0）代表原点，Qt默认最左上角的点为原点 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化两个按钮对象，并设置其显示文本为窗口皮肤1和窗口皮肤2 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;窗口皮肤1&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;窗口皮肤2&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设定两个QPushButton对象的位置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton1-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">80</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton2-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">80</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton1, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">pushButton1_Clicked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton2, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">pushButton2_Clicked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 槽函数的实现 */</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushButton1_Clicked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗口的样式1 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setStyleSheet</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;QMainWindow { background-color: rgba(255, 245, 238, 100%); }&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 槽函数的实现 */</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushButton2_Clicked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗口的样式2 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setStyleSheet</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;QMainWindow { background-color: rgba(238, 122, 233, 100%); }&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置宽高为800×480,位置在0, 0。（0, 0）代表原点，Qt默认最左上角的点为原点 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化两个按钮对象，并设置其显示文本为窗口皮肤1和窗口皮肤2 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;窗口皮肤1&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;窗口皮肤2&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设定两个QPushButton对象的位置 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton1-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">80</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton2-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">400</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">80</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton1, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">pushButton1_Clicked</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton2, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">pushButton2_Clicked</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 槽函数的实现 */</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushButton1_Clicked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗口的样式1 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setStyleSheet</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;QMainWindow { background-color: rgba(255, 245, 238, 100%); }&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 槽函数的实现 */</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushButton2_Clicked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗口的样式2 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setStyleSheet</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;QMainWindow { background-color: rgba(238, 122, 233, 100%); }&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_4-2-qtoolbutton-工具按钮" tabindex="-1">4.2. QToolButton:工具按钮 <a class="header-anchor" href="#_4-2-qtoolbutton-工具按钮" aria-label="Permalink to &quot;4.2. QToolButton:工具按钮&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">工具按钮（QToolButton）区别于普通按钮（QPushButton）的一点是，工具按钮（QToolButton）可以带图标。这里区别下图标和按钮的背景图片是不一样的。</span></span>
<span class="line"><span style="color:#adbac7;">通常我们在 QToolBar 这种工具条（工具栏）上设置不同的按钮，如果这些按钮还带图标和文本，那么 QToolButton 是个不错的选择。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">工具按钮（QToolButton）区别于普通按钮（QPushButton）的一点是，工具按钮（QToolButton）可以带图标。这里区别下图标和按钮的背景图片是不一样的。</span></span>
<span class="line"><span style="color:#24292e;">通常我们在 QToolBar 这种工具条（工具栏）上设置不同的按钮，如果这些按钮还带图标和文本，那么 QToolButton 是个不错的选择。</span></span></code></pre></div><p>QToolButton 继承 QAbstractButton 类。是一种用于命令或者选项的可以快速访问的按钮， 通常在 ToolBar 里面。工具按钮通常显示的是图标，而不是文本标签。 ToolButton 支持自动浮 起。在自动浮起模式中，按钮只有在鼠标指向它的时候才绘制三维的框架。</p><h3 id="案例-自定义工具栏" tabindex="-1">案例：自定义工具栏 <a class="header-anchor" href="#案例-自定义工具栏" aria-label="Permalink to &quot;案例：自定义工具栏&quot;">​</a></h3><p>例 05_qtoolbutton 自定义工具栏（难度：简单）。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#768390;">/* 引入QToolButton类 */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QToolButton&gt;</span></span>
<span class="line"><span style="color:#768390;">/* 引入QToolBar类 */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QToolBar&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QMainWindow</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QWidget</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">parent</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">nullptr</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~MainWindow</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#768390;">    /* 声明一个QToolButton对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QToolButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">toolButton;</span></span>
<span class="line"><span style="color:#768390;">    /* 声明一个QToolBar对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QToolBar </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">toolBar;</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // MAINWINDOW_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#6A737D;">/* 引入QToolButton类 */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QToolButton&gt;</span></span>
<span class="line"><span style="color:#6A737D;">/* 引入QToolBar类 */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QToolBar&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QMainWindow</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">parent</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nullptr</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~MainWindow</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 声明一个QToolButton对象 */</span></span>
<span class="line"><span style="color:#24292E;">    QToolButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">toolButton;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 声明一个QToolBar对象 */</span></span>
<span class="line"><span style="color:#24292E;">    QToolBar </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">toolBar;</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // MAINWINDOW_H</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QApplication&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QStyle&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体的位置和大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化QToolBar对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolBar </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QToolBar</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置toolBar的位置和大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolBar-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化QStyle类对象，用于设置风格，调用系统类自带的图标 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStyle </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">style </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QApplication</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">style</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 使用Qt自带的标准图标，可以在帮助文档里搜索QStyle::StandardPixmap */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QIcon icon </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> style-&gt;</span><span style="color:#DCBDFB;">standardIcon</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QStyle</span><span style="color:#ADBAC7;">::SP_TitleBarContextHelpButton);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化QToolButton对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QToolButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置图标 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolButton-&gt;</span><span style="color:#DCBDFB;">setIcon</span><span style="color:#ADBAC7;">(icon);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置要显示的文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolButton-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;帮助&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 调用setToolButtonStyle()方法，设置toolButoon的样式，设置为文本置于图标下方 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolButton-&gt;</span><span style="color:#DCBDFB;">setToolButtonStyle</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::ToolButtonTextUnderIcon);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 最后将toolButton添加到ToolBar里 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolBar-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(toolButton);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QApplication&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QStyle&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体的位置和大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化QToolBar对象 */</span></span>
<span class="line"><span style="color:#24292E;">    toolBar </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QToolBar</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置toolBar的位置和大小 */</span></span>
<span class="line"><span style="color:#24292E;">    toolBar-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化QStyle类对象，用于设置风格，调用系统类自带的图标 */</span></span>
<span class="line"><span style="color:#24292E;">    QStyle </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">style </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QApplication</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 使用Qt自带的标准图标，可以在帮助文档里搜索QStyle::StandardPixmap */</span></span>
<span class="line"><span style="color:#24292E;">    QIcon icon </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> style-&gt;</span><span style="color:#6F42C1;">standardIcon</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QStyle</span><span style="color:#24292E;">::SP_TitleBarContextHelpButton);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化QToolButton对象 */</span></span>
<span class="line"><span style="color:#24292E;">    toolButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QToolButton</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置图标 */</span></span>
<span class="line"><span style="color:#24292E;">    toolButton-&gt;</span><span style="color:#6F42C1;">setIcon</span><span style="color:#24292E;">(icon);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置要显示的文本 */</span></span>
<span class="line"><span style="color:#24292E;">    toolButton-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;帮助&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 调用setToolButtonStyle()方法，设置toolButoon的样式，设置为文本置于图标下方 */</span></span>
<span class="line"><span style="color:#24292E;">    toolButton-&gt;</span><span style="color:#6F42C1;">setToolButtonStyle</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::ToolButtonTextUnderIcon);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 最后将toolButton添加到ToolBar里 */</span></span>
<span class="line"><span style="color:#24292E;">    toolBar-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(toolButton);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_4-3-qradiobutton-选择按钮" tabindex="-1">4.3. QRadioButton:选择按钮 <a class="header-anchor" href="#_4-3-qradiobutton-选择按钮" aria-label="Permalink to &quot;4.3. QRadioButton:选择按钮&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QRadioButton 部件提供了一个带有文本标签的单选框（单选按钮）。</span></span>
<span class="line"><span style="color:#adbac7;">QRadioButton 是一个可以切换选中（checked）或未选中（unchecked）状态的选项按钮。</span></span>
<span class="line"><span style="color:#adbac7;">单选框通常呈现给用户一个“多选一”的选择。也就是说，在一组单选框中，一次只能选中一个单选框。默认在同一个父对象下，初始化后点击它们是互斥状态。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QRadioButton 部件提供了一个带有文本标签的单选框（单选按钮）。</span></span>
<span class="line"><span style="color:#24292e;">QRadioButton 是一个可以切换选中（checked）或未选中（unchecked）状态的选项按钮。</span></span>
<span class="line"><span style="color:#24292e;">单选框通常呈现给用户一个“多选一”的选择。也就是说，在一组单选框中，一次只能选中一个单选框。默认在同一个父对象下，初始化后点击它们是互斥状态。</span></span></code></pre></div><p>QRadioButton 继承 QAbstractButton 类。 RadioButton 单选按钮（单选框）通常成组出现，用于提供两个或多个互斥选项。</p><h3 id="案例-仿手机开关效果" tabindex="-1">案例: 仿手机开关效果 <a class="header-anchor" href="#案例-仿手机开关效果" aria-label="Permalink to &quot;案例: 仿手机开关效果&quot;">​</a></h3><p>例 06_radiobutton 仿手机开关效果（难度：中等）</p><h4 id="资源文件" tabindex="-1">资源文件 <a class="header-anchor" href="#资源文件" aria-label="Permalink to &quot;资源文件&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">&lt;RCC&gt;</span></span>
<span class="line"><span style="color:#adbac7;">    &lt;qresource prefix=&quot;/&quot;&gt;</span></span>
<span class="line"><span style="color:#adbac7;">        &lt;file&gt;images/switch_off.png&lt;/file&gt;</span></span>
<span class="line"><span style="color:#adbac7;">        &lt;file&gt;images/switch_on.png&lt;/file&gt;</span></span>
<span class="line"><span style="color:#adbac7;">        &lt;file&gt;style.qss&lt;/file&gt;</span></span>
<span class="line"><span style="color:#adbac7;">    &lt;/qresource&gt;</span></span>
<span class="line"><span style="color:#adbac7;">&lt;/RCC&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">&lt;RCC&gt;</span></span>
<span class="line"><span style="color:#24292e;">    &lt;qresource prefix=&quot;/&quot;&gt;</span></span>
<span class="line"><span style="color:#24292e;">        &lt;file&gt;images/switch_off.png&lt;/file&gt;</span></span>
<span class="line"><span style="color:#24292e;">        &lt;file&gt;images/switch_on.png&lt;/file&gt;</span></span>
<span class="line"><span style="color:#24292e;">        &lt;file&gt;style.qss&lt;/file&gt;</span></span>
<span class="line"><span style="color:#24292e;">    &lt;/qresource&gt;</span></span>
<span class="line"><span style="color:#24292e;">&lt;/RCC&gt;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QRadioButton{</span></span>
<span class="line"><span style="color:#adbac7;">    spacing: 2px;</span></span>
<span class="line"><span style="color:#adbac7;">    color: white;</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">QRadioButton::indicator {</span></span>
<span class="line"><span style="color:#adbac7;">    width: 45px;</span></span>
<span class="line"><span style="color:#adbac7;">    height: 30px;</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">QRadioButton::indicator:unchecked {</span></span>
<span class="line"><span style="color:#adbac7;">    image: url(:/images/switch_off.png);</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">QRadioButton::indicator:checked {</span></span>
<span class="line"><span style="color:#adbac7;">    image: url(:/images/switch_on.png);</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QRadioButton{</span></span>
<span class="line"><span style="color:#24292e;">    spacing: 2px;</span></span>
<span class="line"><span style="color:#24292e;">    color: white;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">QRadioButton::indicator {</span></span>
<span class="line"><span style="color:#24292e;">    width: 45px;</span></span>
<span class="line"><span style="color:#24292e;">    height: 30px;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">QRadioButton::indicator:unchecked {</span></span>
<span class="line"><span style="color:#24292e;">    image: url(:/images/switch_off.png);</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">QRadioButton::indicator:checked {</span></span>
<span class="line"><span style="color:#24292e;">    image: url(:/images/switch_on.png);</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h4 id="main" tabindex="-1">main <a class="header-anchor" href="#main" aria-label="Permalink to &quot;main&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QApplication&gt;</span></span>
<span class="line"><span style="color:#768390;">/* 引入QFile */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QFile&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">  QApplication </span><span style="color:#DCBDFB;">a</span><span style="color:#ADBAC7;">(argc, argv);</span></span>
<span class="line"><span style="color:#768390;">  /* 指定文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">  QFile </span><span style="color:#DCBDFB;">file</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;:/style.qss&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">  /* 判断文件是否存在 */</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (file.</span><span style="color:#DCBDFB;">exists</span><span style="color:#ADBAC7;">() ) {</span></span>
<span class="line"><span style="color:#768390;">      /* 以只读的方式打开 */</span></span>
<span class="line"><span style="color:#ADBAC7;">      file.</span><span style="color:#DCBDFB;">open</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QFile</span><span style="color:#ADBAC7;">::ReadOnly);</span></span>
<span class="line"><span style="color:#768390;">      /* 以字符串的方式保存读出的结果 */</span></span>
<span class="line"><span style="color:#ADBAC7;">      QString styleSheet </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLatin1String</span><span style="color:#ADBAC7;">(file.</span><span style="color:#DCBDFB;">readAll</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"><span style="color:#768390;">      /* 设置全局样式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">      qApp-&gt;</span><span style="color:#DCBDFB;">setStyleSheet</span><span style="color:#ADBAC7;">(styleSheet);</span></span>
<span class="line"><span style="color:#768390;">      /* 关闭文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">      file.</span><span style="color:#DCBDFB;">close</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"><span style="color:#ADBAC7;">  MainWindow w;</span></span>
<span class="line"><span style="color:#ADBAC7;">  w.</span><span style="color:#DCBDFB;">show</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> a.</span><span style="color:#DCBDFB;">exec</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QApplication&gt;</span></span>
<span class="line"><span style="color:#6A737D;">/* 引入QFile */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QFile&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  QApplication </span><span style="color:#6F42C1;">a</span><span style="color:#24292E;">(argc, argv);</span></span>
<span class="line"><span style="color:#6A737D;">  /* 指定文件 */</span></span>
<span class="line"><span style="color:#24292E;">  QFile </span><span style="color:#6F42C1;">file</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;:/style.qss&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">  /* 判断文件是否存在 */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (file.</span><span style="color:#6F42C1;">exists</span><span style="color:#24292E;">() ) {</span></span>
<span class="line"><span style="color:#6A737D;">      /* 以只读的方式打开 */</span></span>
<span class="line"><span style="color:#24292E;">      file.</span><span style="color:#6F42C1;">open</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QFile</span><span style="color:#24292E;">::ReadOnly);</span></span>
<span class="line"><span style="color:#6A737D;">      /* 以字符串的方式保存读出的结果 */</span></span>
<span class="line"><span style="color:#24292E;">      QString styleSheet </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLatin1String</span><span style="color:#24292E;">(file.</span><span style="color:#6F42C1;">readAll</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#6A737D;">      /* 设置全局样式 */</span></span>
<span class="line"><span style="color:#24292E;">      qApp-&gt;</span><span style="color:#6F42C1;">setStyleSheet</span><span style="color:#24292E;">(styleSheet);</span></span>
<span class="line"><span style="color:#6A737D;">      /* 关闭文件 */</span></span>
<span class="line"><span style="color:#24292E;">      file.</span><span style="color:#6F42C1;">close</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  MainWindow w;</span></span>
<span class="line"><span style="color:#24292E;">  w.</span><span style="color:#6F42C1;">show</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> a.</span><span style="color:#6F42C1;">exec</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 主窗体设置位置和显示的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setStyleSheet</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;QMainWindow {background-color: rgba(200, 50, 100, 100%);}&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QRadioButton</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QRadioButton</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置两个QRadioButton的位置和显示大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton1-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton2-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置两个QRadioButton的显示文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton1-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;开关一&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton2-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;开关二&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置初始状态，radioButton1的Checked为false,另一个为true*/</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton1-&gt;</span><span style="color:#DCBDFB;">setChecked</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    radioButton2-&gt;</span><span style="color:#DCBDFB;">setChecked</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 主窗体设置位置和显示的大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setStyleSheet</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;QMainWindow {background-color: rgba(200, 50, 100, 100%);}&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#24292E;">    radioButton1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QRadioButton</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    radioButton2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QRadioButton</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置两个QRadioButton的位置和显示大小 */</span></span>
<span class="line"><span style="color:#24292E;">    radioButton1-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    radioButton2-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">400</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置两个QRadioButton的显示文本 */</span></span>
<span class="line"><span style="color:#24292E;">    radioButton1-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;开关一&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    radioButton2-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;开关二&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置初始状态，radioButton1的Checked为false,另一个为true*/</span></span>
<span class="line"><span style="color:#24292E;">    radioButton1-&gt;</span><span style="color:#6F42C1;">setChecked</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    radioButton2-&gt;</span><span style="color:#6F42C1;">setChecked</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_4-4-qcheckbox-检查框" tabindex="-1">4.4. QCheckBox:检查框 <a class="header-anchor" href="#_4-4-qcheckbox-检查框" aria-label="Permalink to &quot;4.4. QCheckBox:检查框&quot;">​</a></h3><p>QCheckBox 继承 QAbstractButton。复选按钮（复选框）与 RadioButton 的区别是选择模式， 单选按钮提供多选一，复选按钮提供多选多</p><h3 id="案例-三态选择框" tabindex="-1">案例：三态选择框 <a class="header-anchor" href="#案例-三态选择框" aria-label="Permalink to &quot;案例：三态选择框&quot;">​</a></h3><p>例 07_qcheckbox，三态选择框（难度：简单）。使用一个 QCheckBox，用户通过点击可改变当选择框的状态。 选中，半选，未选中</p><h4 id="样式" tabindex="-1">样式 <a class="header-anchor" href="#样式" aria-label="Permalink to &quot;样式&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QCheckBox{</span></span>
<span class="line"><span style="color:#adbac7;">        spacing: 5px;</span></span>
<span class="line"><span style="color:#adbac7;">        color: white;</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">QCheckBox::indicator {</span></span>
<span class="line"><span style="color:#adbac7;">        width: 50px;</span></span>
<span class="line"><span style="color:#adbac7;">        height: 50px;</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">QCheckBox::indicator:enabled:unchecked {</span></span>
<span class="line"><span style="color:#adbac7;">        image: url(:/images/unchecked.png);</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">QCheckBox::indicator:enabled:checked {</span></span>
<span class="line"><span style="color:#adbac7;">        image: url(:/images/checked.png);</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">QCheckBox::indicator:enabled:indeterminate {</span></span>
<span class="line"><span style="color:#adbac7;">        image: url(:/images/indeterminate.png);</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QCheckBox{</span></span>
<span class="line"><span style="color:#24292e;">        spacing: 5px;</span></span>
<span class="line"><span style="color:#24292e;">        color: white;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">QCheckBox::indicator {</span></span>
<span class="line"><span style="color:#24292e;">        width: 50px;</span></span>
<span class="line"><span style="color:#24292e;">        height: 50px;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">QCheckBox::indicator:enabled:unchecked {</span></span>
<span class="line"><span style="color:#24292e;">        image: url(:/images/unchecked.png);</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">QCheckBox::indicator:enabled:checked {</span></span>
<span class="line"><span style="color:#24292e;">        image: url(:/images/checked.png);</span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">QCheckBox::indicator:enabled:indeterminate {</span></span>
<span class="line"><span style="color:#24292e;">        image: url(:/images/indeterminate.png);</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h4 id="main-1" tabindex="-1">main <a class="header-anchor" href="#main-1" aria-label="Permalink to &quot;main&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 主窗体设置位置和显示的大小及背景颜色 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setStyleSheet</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;QMainWindow {background-color: rgba(100, 100, 100, 100%);}&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    checkBox </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QCheckBox</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置QCheckBox位置和显示大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    checkBox-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">350</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">250</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 初始化三态复选框的状态为Checked */</span></span>
<span class="line"><span style="color:#ADBAC7;">    checkBox-&gt;</span><span style="color:#DCBDFB;">setCheckState</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::Checked);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置显示的文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    checkBox-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;初始化为Checked状态&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 开启三态模式，必须开启，否则只有两种状态，即Checked和Unchecked */</span></span>
<span class="line"><span style="color:#ADBAC7;">    checkBox-&gt;</span><span style="color:#DCBDFB;">setTristate</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 连接checkBox的信号stateChanged(int)，与我们定义的槽checkBoxStateChanged(int)连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(checkBox, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">stateChanged</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">checkBoxStateChanged</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 槽函数的实现 */</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">checkBoxStateChanged</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">state</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 判断checkBox的state状态，设置checkBox的文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">switch</span><span style="color:#ADBAC7;"> (state) {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">case</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::Checked:</span></span>
<span class="line"><span style="color:#768390;">        /* 选中状态 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        checkBox-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;Checked状态&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">case</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::Unchecked:</span></span>
<span class="line"><span style="color:#768390;">        /* 未选中状态 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        checkBox-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;Unchecked状态&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">case</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::PartiallyChecked:</span></span>
<span class="line"><span style="color:#768390;">        /* 半选状态 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        checkBox-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;PartiallyChecked状态&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">default</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 主窗体设置位置和显示的大小及背景颜色 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setStyleSheet</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;QMainWindow {background-color: rgba(100, 100, 100, 100%);}&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#24292E;">    checkBox </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QCheckBox</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置QCheckBox位置和显示大小 */</span></span>
<span class="line"><span style="color:#24292E;">    checkBox-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">350</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">250</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 初始化三态复选框的状态为Checked */</span></span>
<span class="line"><span style="color:#24292E;">    checkBox-&gt;</span><span style="color:#6F42C1;">setCheckState</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::Checked);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置显示的文本 */</span></span>
<span class="line"><span style="color:#24292E;">    checkBox-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;初始化为Checked状态&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 开启三态模式，必须开启，否则只有两种状态，即Checked和Unchecked */</span></span>
<span class="line"><span style="color:#24292E;">    checkBox-&gt;</span><span style="color:#6F42C1;">setTristate</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 连接checkBox的信号stateChanged(int)，与我们定义的槽checkBoxStateChanged(int)连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(checkBox, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">stateChanged</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">checkBoxStateChanged</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 槽函数的实现 */</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">checkBoxStateChanged</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">state</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 判断checkBox的state状态，设置checkBox的文本 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">switch</span><span style="color:#24292E;"> (state) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::Checked:</span></span>
<span class="line"><span style="color:#6A737D;">        /* 选中状态 */</span></span>
<span class="line"><span style="color:#24292E;">        checkBox-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Checked状态&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::Unchecked:</span></span>
<span class="line"><span style="color:#6A737D;">        /* 未选中状态 */</span></span>
<span class="line"><span style="color:#24292E;">        checkBox-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Unchecked状态&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::PartiallyChecked:</span></span>
<span class="line"><span style="color:#6A737D;">        /* 半选状态 */</span></span>
<span class="line"><span style="color:#24292E;">        checkBox-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;PartiallyChecked状态&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">default</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_4-5-qcommandlinkbutton-命令链接按钮" tabindex="-1">4.5. QCommandLinkButton:命令链接按钮 <a class="header-anchor" href="#_4-5-qcommandlinkbutton-命令链接按钮" aria-label="Permalink to &quot;4.5. QCommandLinkButton:命令链接按钮&quot;">​</a></h3><p>QCommandLinkButton 控件中文名是“命令链接按钮”。 QCommandLinkButton 继承 QPushButton。 QCommandLinkButton 控件和 RadioButton 相似，都是用于在互斥选项中选择一项。表面上同平面按钮一样，但是 CommandLinkButton 除带有正常的按钮上的文字描述文本外，默认情况下，它也将携带一个箭头图标，表明按下按钮将打开另一个窗口或页面。</p><h3 id="案例-链接窗口" tabindex="-1">案例： 链接窗口 <a class="header-anchor" href="#案例-链接窗口" aria-label="Permalink to &quot;案例： 链接窗口&quot;">​</a></h3><p>例 08_qcommandlinkbutton 链接窗口（难度：简单）。使用一个 QCommandLinkButton，点击打开系统的窗口。</p><p>点击中间的打开/home 目录按钮，结果如下。系统弹出一个窗口，直接打开到/home 目录</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#768390;">/* 引入桌面服务，用来打开系统文件夹对话框 */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDesktopServices&gt;</span></span>
<span class="line"><span style="color:#768390;">/* 引入QUrl */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QUrl&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 主窗体设置位置和显示的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    commandLinkButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QCommandLinkButton</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;打开/home目录&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#96D0FF;">&quot;点击此将调用系统的窗口打开/home目录&quot;</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置QCommandLinkButton位置和显示大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    commandLinkButton-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">250</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">60</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(commandLinkButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">commandLinkButtonClicked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">commandLinkButtonClicked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 调用系统服务打开/home目录 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">QDesktopServices</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">openUrl</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QUrl</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;file:////home/&quot;</span><span style="color:#ADBAC7;">) );</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#6A737D;">/* 引入桌面服务，用来打开系统文件夹对话框 */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDesktopServices&gt;</span></span>
<span class="line"><span style="color:#6A737D;">/* 引入QUrl */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QUrl&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 主窗体设置位置和显示的大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#24292E;">    commandLinkButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QCommandLinkButton</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;打开/home目录&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;点击此将调用系统的窗口打开/home目录&quot;</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置QCommandLinkButton位置和显示大小 */</span></span>
<span class="line"><span style="color:#24292E;">    commandLinkButton-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">250</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">60</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(commandLinkButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">commandLinkButtonClicked</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">commandLinkButtonClicked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 调用系统服务打开/home目录 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">QDesktopServices</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">openUrl</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QUrl</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;file:////home/&quot;</span><span style="color:#24292E;">) );</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_4-6-qdialogbuttonbox-对话框按钮" tabindex="-1">4.6. QDialogButtonBox:对话框按钮 <a class="header-anchor" href="#_4-6-qdialogbuttonbox-对话框按钮" aria-label="Permalink to &quot;4.6. QDialogButtonBox:对话框按钮&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">对话框和消息框通常以符合该平台界面指导原则的布局呈现按钮。不同平台的对话框总是有不同的布局。</span></span>
<span class="line"><span style="color:#adbac7;">QDialogButtonBox 允许开发人员向其添加按钮，并将自动使用适合用户桌面环境的布局。 </span></span>
<span class="line"><span style="color:#adbac7;">也就是说我们可以使用系统的自带的对话框按钮，也可以自己定义对话框按钮。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">对话框和消息框通常以符合该平台界面指导原则的布局呈现按钮。不同平台的对话框总是有不同的布局。</span></span>
<span class="line"><span style="color:#24292e;">QDialogButtonBox 允许开发人员向其添加按钮，并将自动使用适合用户桌面环境的布局。 </span></span>
<span class="line"><span style="color:#24292e;">也就是说我们可以使用系统的自带的对话框按钮，也可以自己定义对话框按钮。</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">button_Box = new QDialogButtonBox(QDialogButtonBox::Ok</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Cancel</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Open</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Save</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Close</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Discard</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Apply</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Reset</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::RestoreDefaults</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::Help</span></span>
<span class="line"><span style="color:#adbac7;">                            | QDialogButtonBox::SaveAll);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">button_Box = new QDialogButtonBox(QDialogButtonBox::Ok</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Cancel</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Open</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Save</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Close</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Discard</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Apply</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Reset</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::RestoreDefaults</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::Help</span></span>
<span class="line"><span style="color:#24292e;">                            | QDialogButtonBox::SaveAll);</span></span></code></pre></div><p>QDialogButtonBox 按 钮 盒 子 （ 按 钮 框 ）， 是 由 QDialogButtonBox 类 包 装 成 的 。QDialogButtonBox 继承 QWidget。常用于对话框里自定义按钮，比如“确定”和“取消” 按钮。</p><h3 id="案例" tabindex="-1">案例： <a class="header-anchor" href="#案例" aria-label="Permalink to &quot;案例：&quot;">​</a></h3><p>例 09_qdialogbuttonbox， 自定义 QDialogButtonBox 里的按钮（难度：简单）。使用一个QDialogButtonBox，在 QDialogButtonBox 添加 Qt 提供的按钮，或者自定义按钮。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#768390;">/* 引入QDebug */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 主窗体设置位置和显示的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化并设置按钮的盒子的大小和位置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    dialogButtonBox </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;">  </span><span style="color:#DCBDFB;">QDialogButtonBox</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    dialogButtonBox-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /*使用Qt的Cancel按钮*/</span></span>
<span class="line"><span style="color:#ADBAC7;">    dialogButtonBox-&gt;</span><span style="color:#DCBDFB;">addButton</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QDialogButtonBox</span><span style="color:#ADBAC7;">::Cancel);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /*将英文&quot;Cancel&quot;按钮设置为中文&quot;取消&quot; */</span></span>
<span class="line"><span style="color:#ADBAC7;">    dialogButtonBox-&gt;</span><span style="color:#DCBDFB;">button</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QDialogButtonBox</span><span style="color:#ADBAC7;">::Cancel)-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;取消&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设定位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">tr</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;自定义&quot;</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将pushButton添加到dialogButtonBox，并设定ButtonRole为ActionRole */</span></span>
<span class="line"><span style="color:#ADBAC7;">    dialogButtonBox-&gt;</span><span style="color:#DCBDFB;">addButton</span><span style="color:#ADBAC7;">(pushButton, </span><span style="color:#F69D50;">QDialogButtonBox</span><span style="color:#ADBAC7;">::ActionRole);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接，带参数QAbstractButton *，用于判断用户点击哪个按键 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(dialogButtonBox, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">(QAbstractButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> )),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">dialogButtonBoxClicked</span><span style="color:#ADBAC7;">(QAbstractButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">dialogButtonBoxClicked</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QAbstractButton</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">button</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 判断点击的对象是否为QDialogButtonBox::Cancel */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(button </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> dialogButtonBox-&gt;</span><span style="color:#DCBDFB;">button</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QDialogButtonBox</span><span style="color:#ADBAC7;">::Cancel)) {</span></span>
<span class="line"><span style="color:#768390;">        /* 打印“单击了取消键” */</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;单击了取消键&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#768390;">        /* 判断点击的对象是否为pushButton */</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(button </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> pushButton) {</span></span>
<span class="line"><span style="color:#768390;">        /* 打印“单击了自定义键” */</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;单击了自定义键&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#6A737D;">/* 引入QDebug */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 主窗体设置位置和显示的大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化并设置按钮的盒子的大小和位置 */</span></span>
<span class="line"><span style="color:#24292E;">    dialogButtonBox </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;">  </span><span style="color:#6F42C1;">QDialogButtonBox</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    dialogButtonBox-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /*使用Qt的Cancel按钮*/</span></span>
<span class="line"><span style="color:#24292E;">    dialogButtonBox-&gt;</span><span style="color:#6F42C1;">addButton</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QDialogButtonBox</span><span style="color:#24292E;">::Cancel);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /*将英文&quot;Cancel&quot;按钮设置为中文&quot;取消&quot; */</span></span>
<span class="line"><span style="color:#24292E;">    dialogButtonBox-&gt;</span><span style="color:#6F42C1;">button</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QDialogButtonBox</span><span style="color:#24292E;">::Cancel)-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;取消&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设定位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">tr</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;自定义&quot;</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将pushButton添加到dialogButtonBox，并设定ButtonRole为ActionRole */</span></span>
<span class="line"><span style="color:#24292E;">    dialogButtonBox-&gt;</span><span style="color:#6F42C1;">addButton</span><span style="color:#24292E;">(pushButton, </span><span style="color:#6F42C1;">QDialogButtonBox</span><span style="color:#24292E;">::ActionRole);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接，带参数QAbstractButton *，用于判断用户点击哪个按键 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(dialogButtonBox, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">(QAbstractButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> )),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">dialogButtonBoxClicked</span><span style="color:#24292E;">(QAbstractButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">dialogButtonBoxClicked</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QAbstractButton</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">button</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 判断点击的对象是否为QDialogButtonBox::Cancel */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(button </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> dialogButtonBox-&gt;</span><span style="color:#6F42C1;">button</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QDialogButtonBox</span><span style="color:#24292E;">::Cancel)) {</span></span>
<span class="line"><span style="color:#6A737D;">        /* 打印“单击了取消键” */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;单击了取消键&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#6A737D;">        /* 判断点击的对象是否为pushButton */</span></span>
<span class="line"><span style="color:#24292E;">    }</span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(button </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> pushButton) {</span></span>
<span class="line"><span style="color:#6A737D;">        /* 打印“单击了自定义键” */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;单击了自定义键&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,47);function E(s,g,Q,k,b,m){const o=t,e=C("ClientOnly");return l(),r("div",null,[F,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),D(o,{key:0,article:s.$frontmatter},null,8,["article"])):d("",!0)]}),_:1}),h])}const v=c(u,[["render",E]]);export{W as __pageData,v as default};
