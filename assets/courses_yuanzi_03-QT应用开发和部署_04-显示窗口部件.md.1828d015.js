import{_ as t}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as c,v as l,b as r,E as y,O as i,F as p,L as A,R as C,M as D,C as B,B as F}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const S=JSON.parse('{"title":"显示窗口部件","description":"","frontmatter":{"title":"显示窗口部件","author":"阿源","date":"2023/08/04 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/03-QT应用开发和部署/04-显示窗口部件.md","filePath":"courses/yuanzi/03-QT应用开发和部署/04-显示窗口部件.md","lastUpdated":1691327334000}'),d={name:"courses/yuanzi/03-QT应用开发和部署/04-显示窗口部件.md"},E=p("h1",{id:"正点原子qt之显示窗口部件",tabindex:"-1"},[A("正点原子QT之显示窗口部件 "),p("a",{class:"header-anchor",href:"#正点原子qt之显示窗口部件","aria-label":'Permalink to "正点原子QT之显示窗口部件"'},"​")],-1),u=C(`<h2 id="_6-显示窗口部件" tabindex="-1">6 显示窗口部件 <a class="header-anchor" href="#_6-显示窗口部件" aria-label="Permalink to &quot;6 显示窗口部件&quot;">​</a></h2><h3 id="概述-10个" tabindex="-1">概述 （10个） <a class="header-anchor" href="#概述-10个" aria-label="Permalink to &quot;概述 （10个）&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">（1） Label:标签</span></span>
<span class="line"><span style="color:#adbac7;">（2） Text Browser:文本浏览器</span></span>
<span class="line"><span style="color:#adbac7;">（3） Graphics View:图形视图</span></span>
<span class="line"><span style="color:#adbac7;">（4） Calendar Widget:日历</span></span>
<span class="line"><span style="color:#adbac7;">（5） LCD Number:液晶数字</span></span>
<span class="line"><span style="color:#adbac7;">（6） Progress Bar:进度条</span></span>
<span class="line"><span style="color:#adbac7;">（7） Horizontal Line:水平线</span></span>
<span class="line"><span style="color:#adbac7;">（8） Vertial Line:垂直线</span></span>
<span class="line"><span style="color:#adbac7;">（9） OpenGL Widget:开放式图形库工具</span></span>
<span class="line"><span style="color:#adbac7;">（10） QQuick Widget:嵌入式 QML 工具</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">（1） Label:标签</span></span>
<span class="line"><span style="color:#24292e;">（2） Text Browser:文本浏览器</span></span>
<span class="line"><span style="color:#24292e;">（3） Graphics View:图形视图</span></span>
<span class="line"><span style="color:#24292e;">（4） Calendar Widget:日历</span></span>
<span class="line"><span style="color:#24292e;">（5） LCD Number:液晶数字</span></span>
<span class="line"><span style="color:#24292e;">（6） Progress Bar:进度条</span></span>
<span class="line"><span style="color:#24292e;">（7） Horizontal Line:水平线</span></span>
<span class="line"><span style="color:#24292e;">（8） Vertial Line:垂直线</span></span>
<span class="line"><span style="color:#24292e;">（9） OpenGL Widget:开放式图形库工具</span></span>
<span class="line"><span style="color:#24292e;">（10） QQuick Widget:嵌入式 QML 工具</span></span></code></pre></div><h3 id="_6-1-label-标签" tabindex="-1">6.1 Label:标签 <a class="header-anchor" href="#_6-1-label-标签" aria-label="Permalink to &quot;6.1 Label:标签&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QLabel提供了一种用于文本或图像显示的小部件，在前4.1与4.2某些小节已经出现过 Label控件，只用了它显示文本，其实它还可以用于显示图像。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QLabel提供了一种用于文本或图像显示的小部件，在前4.1与4.2某些小节已经出现过 Label控件，只用了它显示文本，其实它还可以用于显示图像。</span></span></code></pre></div><h3 id="案例-标签显示图像或文本" tabindex="-1">案例：标签显示图像或文本 <a class="header-anchor" href="#案例-标签显示图像或文本" aria-label="Permalink to &quot;案例：标签显示图像或文本&quot;">​</a></h3><p>例 22_qlbel 标签显示图像或文本（难度简单）</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置大小与位置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 使用资源里的文件时格式是  :+前缀+文件路径  */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPixmap </span><span style="color:#DCBDFB;">pixmap</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;:images/openedv.png&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    labelImage </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLabel</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 标签大小为452×132,根据图像的大小来设置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    labelImage-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">180</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">150</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">452</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">132</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置图像 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    labelImage-&gt;</span><span style="color:#DCBDFB;">setPixmap</span><span style="color:#ADBAC7;">(pixmap);</span></span>
<span class="line"><span style="color:#768390;">    /* 开启允许缩放填充 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    labelImage-&gt;</span><span style="color:#DCBDFB;">setScaledContents</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    labelString </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLabel</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    labelString-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;标签演示文本&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    labelString-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置大小与位置 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 使用资源里的文件时格式是  :+前缀+文件路径  */</span></span>
<span class="line"><span style="color:#24292E;">    QPixmap </span><span style="color:#6F42C1;">pixmap</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;:images/openedv.png&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    labelImage </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLabel</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 标签大小为452×132,根据图像的大小来设置 */</span></span>
<span class="line"><span style="color:#24292E;">    labelImage-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">180</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">150</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">452</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">132</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置图像 */</span></span>
<span class="line"><span style="color:#24292E;">    labelImage-&gt;</span><span style="color:#6F42C1;">setPixmap</span><span style="color:#24292E;">(pixmap);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 开启允许缩放填充 */</span></span>
<span class="line"><span style="color:#24292E;">    labelImage-&gt;</span><span style="color:#6F42C1;">setScaledContents</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    labelString </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLabel</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    labelString-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;标签演示文本&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    labelString-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6-2-text-browser-文本浏览器" tabindex="-1">6.2 Text Browser:文本浏览器 <a class="header-anchor" href="#_6-2-text-browser-文本浏览器" aria-label="Permalink to &quot;6.2 Text Browser:文本浏览器&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QTextBrowser 继承 QTextEdit，QTextBrowser 类提供了一个具有超文本导航的文本浏览器。该类扩展了 QTextEdit(在只读模式下)，添加了一些导航功能，以便用户可以跟踪超文本文档中的链接。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QTextBrowser 继承 QTextEdit，QTextBrowser 类提供了一个具有超文本导航的文本浏览器。该类扩展了 QTextEdit(在只读模式下)，添加了一些导航功能，以便用户可以跟踪超文本文档中的链接。</span></span></code></pre></div><h3 id="案例" tabindex="-1">案例： <a class="header-anchor" href="#案例" aria-label="Permalink to &quot;案例：&quot;">​</a></h3><p>例 27_qtextbrowser，简单的文本浏览器（难度：简单），本例设计一个文本浏览器程序，可以打开并显示 txt、 html 等文件。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;ui_mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#768390;">/* 窗口对话框与文本流 */</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QFileDialog&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QTextStream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    , </span><span style="color:#DCBDFB;">ui</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Ui</span><span style="color:#ADBAC7;">::MainWindow)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    ui-&gt;</span><span style="color:#DCBDFB;">setupUi</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将窗口标题设置为文本浏览器 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setWindowTitle</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;文本浏览器&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    textBrowser </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTextBrowser</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 将文本浏览器窗口居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(textBrowser);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openAction </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QAction</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打开&quot;</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* ui窗口自带有menubar(菜单栏)、mainToolbar（工具栏）与</span></span>
<span class="line"><span style="color:#768390;">     * statusbar（状态栏）</span></span>
<span class="line"><span style="color:#768390;">     * menuBar是ui生成工程就有的，所以可以在menubar里添加</span></span>
<span class="line"><span style="color:#768390;">     * 我们的QActiont等，如果不需要menubar，可以在ui设计</span></span>
<span class="line"><span style="color:#768390;">     * 窗口里，在右则对象里把menubar删除，再自己重新定义自己的</span></span>
<span class="line"><span style="color:#768390;">     * 菜单栏</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#768390;">    /* 将动作添加到菜单栏 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    ui-&gt;menubar-&gt;</span><span style="color:#DCBDFB;">addAction</span><span style="color:#ADBAC7;">(openAction);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(openAction, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">triggered</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">openActionTriggered</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> ui;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">openActionTriggered</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 调用系统打开文件窗口，过滤文件名 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QString fileName </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QFileDialog</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getOpenFileName</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">,</span><span style="color:#DCBDFB;">tr</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打开文件&quot;</span><span style="color:#ADBAC7;">),</span><span style="color:#96D0FF;">&quot;&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">tr</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;Files(*.txt *.cpp *.h *.html *.htm)&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">                );</span></span>
<span class="line"><span style="color:#ADBAC7;">    QFile </span><span style="color:#DCBDFB;">myFile</span><span style="color:#ADBAC7;">(fileName);</span></span>
<span class="line"><span style="color:#768390;">    /* 以只读、文本方式打开，若打开失败，则返回 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">myFile.</span><span style="color:#DCBDFB;">open</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::ReadOnly </span><span style="color:#F47067;">|</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::Text))</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 用QTextStream对象接收 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QTextStream </span><span style="color:#DCBDFB;">in</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">myFile);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 读取全部数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QString myText </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> in.</span><span style="color:#DCBDFB;">readAll</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 判断打开文件的后缀，如果是html格式的则设置文本浏览器为html格式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(fileName.</span><span style="color:#DCBDFB;">endsWith</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;html&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">||</span><span style="color:#ADBAC7;"> fileName.</span><span style="color:#DCBDFB;">endsWith</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;htm&quot;</span><span style="color:#ADBAC7;">)){</span></span>
<span class="line"><span style="color:#ADBAC7;">        textBrowser-&gt;</span><span style="color:#DCBDFB;">setHtml</span><span style="color:#ADBAC7;">(myText);</span></span>
<span class="line"><span style="color:#ADBAC7;">    } </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">        textBrowser-&gt;</span><span style="color:#DCBDFB;">setPlainText</span><span style="color:#ADBAC7;">(myText);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* ui窗口自带有statusbar（状态栏），设置打开的文件名 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    ui-&gt;statusbar-&gt;</span><span style="color:#DCBDFB;">showMessage</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;文件名：&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> fileName);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;ui_mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#6A737D;">/* 窗口对话框与文本流 */</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QFileDialog&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QTextStream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">    , </span><span style="color:#6F42C1;">ui</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Ui</span><span style="color:#24292E;">::MainWindow)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    ui-&gt;</span><span style="color:#6F42C1;">setupUi</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将窗口标题设置为文本浏览器 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setWindowTitle</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;文本浏览器&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    textBrowser </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTextBrowser</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将文本浏览器窗口居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(textBrowser);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    openAction </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QAction</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打开&quot;</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* ui窗口自带有menubar(菜单栏)、mainToolbar（工具栏）与</span></span>
<span class="line"><span style="color:#6A737D;">     * statusbar（状态栏）</span></span>
<span class="line"><span style="color:#6A737D;">     * menuBar是ui生成工程就有的，所以可以在menubar里添加</span></span>
<span class="line"><span style="color:#6A737D;">     * 我们的QActiont等，如果不需要menubar，可以在ui设计</span></span>
<span class="line"><span style="color:#6A737D;">     * 窗口里，在右则对象里把menubar删除，再自己重新定义自己的</span></span>
<span class="line"><span style="color:#6A737D;">     * 菜单栏</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将动作添加到菜单栏 */</span></span>
<span class="line"><span style="color:#24292E;">    ui-&gt;menubar-&gt;</span><span style="color:#6F42C1;">addAction</span><span style="color:#24292E;">(openAction);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(openAction, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">triggered</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">openActionTriggered</span><span style="color:#24292E;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> ui;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">openActionTriggered</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 调用系统打开文件窗口，过滤文件名 */</span></span>
<span class="line"><span style="color:#24292E;">    QString fileName </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QFileDialog</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getOpenFileName</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">,</span><span style="color:#6F42C1;">tr</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打开文件&quot;</span><span style="color:#24292E;">),</span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">tr</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Files(*.txt *.cpp *.h *.html *.htm)&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                );</span></span>
<span class="line"><span style="color:#24292E;">    QFile </span><span style="color:#6F42C1;">myFile</span><span style="color:#24292E;">(fileName);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 以只读、文本方式打开，若打开失败，则返回 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">myFile.</span><span style="color:#6F42C1;">open</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::ReadOnly </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::Text))</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 用QTextStream对象接收 */</span></span>
<span class="line"><span style="color:#24292E;">    QTextStream </span><span style="color:#6F42C1;">in</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">myFile);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 读取全部数据 */</span></span>
<span class="line"><span style="color:#24292E;">    QString myText </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> in.</span><span style="color:#6F42C1;">readAll</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 判断打开文件的后缀，如果是html格式的则设置文本浏览器为html格式 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(fileName.</span><span style="color:#6F42C1;">endsWith</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;html&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> fileName.</span><span style="color:#6F42C1;">endsWith</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;htm&quot;</span><span style="color:#24292E;">)){</span></span>
<span class="line"><span style="color:#24292E;">        textBrowser-&gt;</span><span style="color:#6F42C1;">setHtml</span><span style="color:#24292E;">(myText);</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        textBrowser-&gt;</span><span style="color:#6F42C1;">setPlainText</span><span style="color:#24292E;">(myText);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* ui窗口自带有statusbar（状态栏），设置打开的文件名 */</span></span>
<span class="line"><span style="color:#24292E;">    ui-&gt;statusbar-&gt;</span><span style="color:#6F42C1;">showMessage</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;文件名：&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> fileName);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6-3-graphics-view-图形视图" tabindex="-1">6.3 Graphics View:图形视图 <a class="header-anchor" href="#_6-3-graphics-view-图形视图" aria-label="Permalink to &quot;6.3 Graphics View:图形视图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QGraphicsView 继承 QAbstractScrollArea。 QGraphicsView 是图形视图框架的一部分，它提供了基于图元的模型/视图编程。QGraphicsView 在可滚动视图中可视化 QGraphicsScene 的内容。要创建带有几何项的场景，请参阅 QGraphicsScene 的文档。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QGraphicsView 继承 QAbstractScrollArea。 QGraphicsView 是图形视图框架的一部分，它提供了基于图元的模型/视图编程。QGraphicsView 在可滚动视图中可视化 QGraphicsScene 的内容。要创建带有几何项的场景，请参阅 QGraphicsScene 的文档。</span></span></code></pre></div><h3 id="案例-设计一个图像浏览器" tabindex="-1">案例：设计一个图像浏览器 <a class="header-anchor" href="#案例-设计一个图像浏览器" aria-label="Permalink to &quot;案例：设计一个图像浏览器&quot;">​</a></h3><p>例 28_qgraphicsview，简单的图像浏览器（难度：简单），本例设计一个图像浏览器程序，在上一节一的基础上，将它改变为图像浏览器。</p><p>菜单栏点击打开后，系统默认是打开的最近打开的位置，选择任意一个可打开的图片</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;ui_mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QFileDialog&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    , </span><span style="color:#DCBDFB;">ui</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Ui</span><span style="color:#ADBAC7;">::MainWindow)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    ui-&gt;</span><span style="color:#DCBDFB;">setupUi</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体大小 */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 将窗口标题设置为图像浏览器 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setWindowTitle</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;图像浏览器&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化图形视图对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    graphicsView </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QGraphicsView</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 将图像浏览器窗口居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(graphicsView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化场景对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    graphicsScene </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QGraphicsScene</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 在QGraphicsView设置场景 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    graphicsView-&gt;</span><span style="color:#DCBDFB;">setScene</span><span style="color:#ADBAC7;">(graphicsScene);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将动作添加到菜单栏 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openAction </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QAction</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打开&quot;</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ui-&gt;menubar-&gt;</span><span style="color:#DCBDFB;">addAction</span><span style="color:#ADBAC7;">(openAction);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(openAction, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">triggered</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">openActionTriggered</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> ui;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">openActionTriggered</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /*调用系统打开文件窗口，设置窗口标题为“打开文件”，过滤文件名*/</span></span>
<span class="line"><span style="color:#ADBAC7;">    QString fileName </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QFileDialog</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getOpenFileName</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">,</span><span style="color:#DCBDFB;">tr</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打开文件&quot;</span><span style="color:#ADBAC7;">), </span><span style="color:#96D0FF;">&quot;&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">tr</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;Files(*.png *.jpg *.bmp)&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">                );</span></span>
<span class="line"><span style="color:#768390;">    /* 定义QPixmap对象，指向fileName */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPixmap </span><span style="color:#DCBDFB;">image</span><span style="color:#ADBAC7;">(fileName);</span></span>
<span class="line"><span style="color:#768390;">    /* 将image用scaled来重新设置长宽为graphicsView的长宽，</span></span>
<span class="line"><span style="color:#768390;">     * 保持纵横比等</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 假若用户没选择文件，则返回 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(image.</span><span style="color:#DCBDFB;">isNull</span><span style="color:#ADBAC7;">())</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    image </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> image.</span><span style="color:#DCBDFB;">scaled</span><span style="color:#ADBAC7;">(graphicsView-&gt;</span><span style="color:#DCBDFB;">width</span><span style="color:#ADBAC7;">(),</span></span>
<span class="line"><span style="color:#ADBAC7;">                          graphicsView-&gt;</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">(),</span></span>
<span class="line"><span style="color:#ADBAC7;">                          </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::KeepAspectRatio,</span></span>
<span class="line"><span style="color:#ADBAC7;">                          </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::FastTransformation</span></span>
<span class="line"><span style="color:#ADBAC7;">                          );</span></span>
<span class="line"><span style="color:#768390;">    /* 在添加场景内容前，先清除之前的场景内容 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    graphicsScene-&gt;</span><span style="color:#DCBDFB;">clear</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 添加场景内容image */</span></span>
<span class="line"><span style="color:#ADBAC7;">    graphicsScene-&gt;</span><span style="color:#DCBDFB;">addPixmap</span><span style="color:#ADBAC7;">(image);</span></span>
<span class="line"><span style="color:#768390;">    /* ui窗口自带有statusBar（状态栏），设置打开的文件名 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    ui-&gt;statusbar-&gt;</span><span style="color:#DCBDFB;">showMessage</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;文件名：&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> fileName);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;ui_mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QFileDialog&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">    , </span><span style="color:#6F42C1;">ui</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Ui</span><span style="color:#24292E;">::MainWindow)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    ui-&gt;</span><span style="color:#6F42C1;">setupUi</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体大小 */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将窗口标题设置为图像浏览器 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setWindowTitle</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;图像浏览器&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化图形视图对象 */</span></span>
<span class="line"><span style="color:#24292E;">    graphicsView </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QGraphicsView</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将图像浏览器窗口居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(graphicsView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化场景对象 */</span></span>
<span class="line"><span style="color:#24292E;">    graphicsScene </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QGraphicsScene</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 在QGraphicsView设置场景 */</span></span>
<span class="line"><span style="color:#24292E;">    graphicsView-&gt;</span><span style="color:#6F42C1;">setScene</span><span style="color:#24292E;">(graphicsScene);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将动作添加到菜单栏 */</span></span>
<span class="line"><span style="color:#24292E;">    openAction </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QAction</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打开&quot;</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ui-&gt;menubar-&gt;</span><span style="color:#6F42C1;">addAction</span><span style="color:#24292E;">(openAction);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(openAction, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">triggered</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">openActionTriggered</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> ui;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">openActionTriggered</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /*调用系统打开文件窗口，设置窗口标题为“打开文件”，过滤文件名*/</span></span>
<span class="line"><span style="color:#24292E;">    QString fileName </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QFileDialog</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getOpenFileName</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">,</span><span style="color:#6F42C1;">tr</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打开文件&quot;</span><span style="color:#24292E;">), </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">tr</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Files(*.png *.jpg *.bmp)&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                );</span></span>
<span class="line"><span style="color:#6A737D;">    /* 定义QPixmap对象，指向fileName */</span></span>
<span class="line"><span style="color:#24292E;">    QPixmap </span><span style="color:#6F42C1;">image</span><span style="color:#24292E;">(fileName);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将image用scaled来重新设置长宽为graphicsView的长宽，</span></span>
<span class="line"><span style="color:#6A737D;">     * 保持纵横比等</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 假若用户没选择文件，则返回 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(image.</span><span style="color:#6F42C1;">isNull</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    image </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> image.</span><span style="color:#6F42C1;">scaled</span><span style="color:#24292E;">(graphicsView-&gt;</span><span style="color:#6F42C1;">width</span><span style="color:#24292E;">(),</span></span>
<span class="line"><span style="color:#24292E;">                          graphicsView-&gt;</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">(),</span></span>
<span class="line"><span style="color:#24292E;">                          </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::KeepAspectRatio,</span></span>
<span class="line"><span style="color:#24292E;">                          </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::FastTransformation</span></span>
<span class="line"><span style="color:#24292E;">                          );</span></span>
<span class="line"><span style="color:#6A737D;">    /* 在添加场景内容前，先清除之前的场景内容 */</span></span>
<span class="line"><span style="color:#24292E;">    graphicsScene-&gt;</span><span style="color:#6F42C1;">clear</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 添加场景内容image */</span></span>
<span class="line"><span style="color:#24292E;">    graphicsScene-&gt;</span><span style="color:#6F42C1;">addPixmap</span><span style="color:#24292E;">(image);</span></span>
<span class="line"><span style="color:#6A737D;">    /* ui窗口自带有statusBar（状态栏），设置打开的文件名 */</span></span>
<span class="line"><span style="color:#24292E;">    ui-&gt;statusbar-&gt;</span><span style="color:#6F42C1;">showMessage</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;文件名：&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> fileName);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6-4-calendar-widget-日历" tabindex="-1">6.4 Calendar Widget:日历 <a class="header-anchor" href="#_6-4-calendar-widget-日历" aria-label="Permalink to &quot;6.4 Calendar Widget:日历&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QCalendarWidget 继承 QWidget。 QCalendarWidget 类提供了一个基于月的日历小部件，允许用户选择日期。 CalendarWidget 小部件是用当前月份和年份初始化的， QCalendarWidget 还提供了几个公共插槽来更改显示的年份和月份。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QCalendarWidget 继承 QWidget。 QCalendarWidget 类提供了一个基于月的日历小部件，允许用户选择日期。 CalendarWidget 小部件是用当前月份和年份初始化的， QCalendarWidget 还提供了几个公共插槽来更改显示的年份和月份。</span></span></code></pre></div><h3 id="案例-日历简单的使用" tabindex="-1">案例：日历简单的使用 <a class="header-anchor" href="#案例-日历简单的使用" aria-label="Permalink to &quot;案例：日历简单的使用&quot;">​</a></h3><p>例 23_qcalendarwidget 日历简单的使用（难度：简单），本例只是简单的使用日历控件来达到一定的效果。使用一个 CalendarWidget 控件，一个 Label 来显示当前日历所选择的日期，一个 pushButton 按钮，点击 pushButton 按钮来回到当前系统的日期。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置位置与大小，下同 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 对象实例化设置显示的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    calendarWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QCalendarWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    calendarWidget-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QFont font;</span></span>
<span class="line"><span style="color:#768390;">    /* 设置日历里字体的大小为10像素 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    font.</span><span style="color:#DCBDFB;">setPixelSize</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    calendarWidget-&gt;</span><span style="color:#DCBDFB;">setFont</span><span style="color:#ADBAC7;">(font);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 对象实例化设置显示的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;回到当前日期&quot;</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">350</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 对象实例化设置显示的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    label </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLabel</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">350</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    QString str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;当前选择的日期:&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> calendarWidget-&gt;</span><span style="color:#DCBDFB;">selectedDate</span><span style="color:#ADBAC7;">().</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(calendarWidget, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">selectionChanged</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">calendarWidgetSelectionChanged</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">pushButtonClicked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">calendarWidgetSelectionChanged</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 当日历点击改变当前选择的期时，更新Label的显示内容 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QString str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;当前选择的日期:&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> calendarWidget-&gt;</span><span style="color:#DCBDFB;">selectedDate</span><span style="color:#ADBAC7;">().</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(str);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushButtonClicked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置当前选定的日期为系统的QDate */</span></span>
<span class="line"><span style="color:#ADBAC7;">    calendarWidget-&gt;</span><span style="color:#DCBDFB;">setSelectedDate</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QDate</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">currentDate</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置位置与大小，下同 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 对象实例化设置显示的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    calendarWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QCalendarWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    calendarWidget-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">20</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">400</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">300</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QFont font;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置日历里字体的大小为10像素 */</span></span>
<span class="line"><span style="color:#24292E;">    font.</span><span style="color:#6F42C1;">setPixelSize</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    calendarWidget-&gt;</span><span style="color:#6F42C1;">setFont</span><span style="color:#24292E;">(font);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 对象实例化设置显示的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;回到当前日期&quot;</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">350</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 对象实例化设置显示的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    label </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLabel</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">400</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">350</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">400</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    QString str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;当前选择的日期:&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> calendarWidget-&gt;</span><span style="color:#6F42C1;">selectedDate</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(calendarWidget, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">selectionChanged</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">calendarWidgetSelectionChanged</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">pushButtonClicked</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">calendarWidgetSelectionChanged</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 当日历点击改变当前选择的期时，更新Label的显示内容 */</span></span>
<span class="line"><span style="color:#24292E;">    QString str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;当前选择的日期:&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> calendarWidget-&gt;</span><span style="color:#6F42C1;">selectedDate</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(str);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushButtonClicked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置当前选定的日期为系统的QDate */</span></span>
<span class="line"><span style="color:#24292E;">    calendarWidget-&gt;</span><span style="color:#6F42C1;">setSelectedDate</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QDate</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">currentDate</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6-5-lcd-number-液晶数字" tabindex="-1">6.5 LCD Number:液晶数字 <a class="header-anchor" href="#_6-5-lcd-number-液晶数字" aria-label="Permalink to &quot;6.5 LCD Number:液晶数字&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QLCDNumber 继承 QFrame。 QLCDNumber 小部件显示一个类似于 lcd 的数字。 QLCDNumber 小部件可以显示任意大小的数字。它可以显示十进制、十六进制、八进制或二进制数字。使用 display()插槽很容易连接到数据源，该插槽被重载以接受五种参数类型中的任何一种。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QLCDNumber 继承 QFrame。 QLCDNumber 小部件显示一个类似于 lcd 的数字。 QLCDNumber 小部件可以显示任意大小的数字。它可以显示十进制、十六进制、八进制或二进制数字。使用 display()插槽很容易连接到数据源，该插槽被重载以接受五种参数类型中的任何一种。</span></span></code></pre></div><h3 id="案例-1" tabindex="-1">案例： <a class="header-anchor" href="#案例-1" aria-label="Permalink to &quot;案例：&quot;">​</a></h3><p>例 24_qlcdnumber， LCDNumber 时钟（难度：简单），使用一个 LCDNumber 控件作时钟的显示，一个定时器定时更新 LCDNumber 的时间。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体的大小与位置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化与设置显示的位置大小*/</span></span>
<span class="line"><span style="color:#ADBAC7;">    lcdNumber </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLCDNumber</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    lcdNumber-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置显示的位数8位 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    lcdNumber-&gt;</span><span style="color:#DCBDFB;">setDigitCount</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置样式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    lcdNumber-&gt;</span><span style="color:#DCBDFB;">setSegmentStyle</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QLCDNumber</span><span style="color:#ADBAC7;">::Flat);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置lcd显示为当前系统时间 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QTime time </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QTime</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">currentTime</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置显示的样式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    lcdNumber-&gt;</span><span style="color:#DCBDFB;">display</span><span style="color:#ADBAC7;">(time.</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;hh:mm:ss&quot;</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    timer </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTimer</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置定时器1000毫秒发送一个timeout()信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    timer-&gt;</span><span style="color:#DCBDFB;">start</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1000</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(timer, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timeout</span><span style="color:#ADBAC7;">()), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 当定时器计时1000毫秒后，刷新lcd显示当前系统时间 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QTime time </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QTime</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">currentTime</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 设置显示的样式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    lcdNumber-&gt;</span><span style="color:#DCBDFB;">display</span><span style="color:#ADBAC7;">(time.</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;hh:mm:ss&quot;</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体的大小与位置 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化与设置显示的位置大小*/</span></span>
<span class="line"><span style="color:#24292E;">    lcdNumber </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLCDNumber</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    lcdNumber-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置显示的位数8位 */</span></span>
<span class="line"><span style="color:#24292E;">    lcdNumber-&gt;</span><span style="color:#6F42C1;">setDigitCount</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">8</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置样式 */</span></span>
<span class="line"><span style="color:#24292E;">    lcdNumber-&gt;</span><span style="color:#6F42C1;">setSegmentStyle</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QLCDNumber</span><span style="color:#24292E;">::Flat);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置lcd显示为当前系统时间 */</span></span>
<span class="line"><span style="color:#24292E;">    QTime time </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTime</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">currentTime</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置显示的样式 */</span></span>
<span class="line"><span style="color:#24292E;">    lcdNumber-&gt;</span><span style="color:#6F42C1;">display</span><span style="color:#24292E;">(time.</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;hh:mm:ss&quot;</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    timer </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTimer</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置定时器1000毫秒发送一个timeout()信号 */</span></span>
<span class="line"><span style="color:#24292E;">    timer-&gt;</span><span style="color:#6F42C1;">start</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1000</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(timer, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timeout</span><span style="color:#24292E;">()), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 当定时器计时1000毫秒后，刷新lcd显示当前系统时间 */</span></span>
<span class="line"><span style="color:#24292E;">    QTime time </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTime</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">currentTime</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置显示的样式 */</span></span>
<span class="line"><span style="color:#24292E;">    lcdNumber-&gt;</span><span style="color:#6F42C1;">display</span><span style="color:#24292E;">(time.</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;hh:mm:ss&quot;</span><span style="color:#24292E;">));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6-6-progress-bar-进度条" tabindex="-1">6.6 Progress Bar:进度条 <a class="header-anchor" href="#_6-6-progress-bar-进度条" aria-label="Permalink to &quot;6.6 Progress Bar:进度条&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QProgressBar 继承 QWidget。 QProgressBar 小部件提供了一个水平或垂直的进度条。进度条用于向用户显示操作的进度，并向他们确认应用程序仍在运行。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QProgressBar 继承 QWidget。 QProgressBar 小部件提供了一个水平或垂直的进度条。进度条用于向用户显示操作的进度，并向他们确认应用程序仍在运行。</span></span></code></pre></div><h3 id="案例-模拟手机电池充电" tabindex="-1">案例：模拟手机电池充电 <a class="header-anchor" href="#案例-模拟手机电池充电" aria-label="Permalink to &quot;案例：模拟手机电池充电&quot;">​</a></h3><p>例 25_qprogressbar，手机电池充电。用一个 QProgressBar 模拟手机电池充电。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    progressBar </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QProgressBar</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    progressBar-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">60</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /*样式表设置，常用使用setStyleSheet来设置样式（实现界面美化的功能），</span></span>
<span class="line"><span style="color:#768390;">     * 具体可参考seTyleSheet */</span></span>
<span class="line"><span style="color:#ADBAC7;">    progressBar-&gt;</span><span style="color:#DCBDFB;">setStyleSheet</span><span style="color:#ADBAC7;"> (</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;QProgressBar{border:8px solid #FFFFFF;&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;height:30;&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;border-image:url(:/images/battery.png);&quot;</span><span style="color:#768390;"> //背景图片</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;text-align:center;&quot;</span><span style="color:#768390;">    // 文字居中</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;color:rgb(255,0,255);&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;font:20px;&quot;</span><span style="color:#768390;">      // 字体大小为20px</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;border-radius:10px;}&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;QProgressBar::chunk{&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;border-radius:5px;&quot;</span><span style="color:#768390;"> // 斑马线圆角</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;border:1px solid black;&quot;</span><span style="color:#768390;"> // 黑边，默认无边</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;background-color:skyblue;&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#96D0FF;">&quot;width:10px;margin:1px;}&quot;</span><span style="color:#768390;"> // 宽度和间距</span></span>
<span class="line"><span style="color:#ADBAC7;">                );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置progressBar的范围值 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    progressBar-&gt;</span><span style="color:#DCBDFB;">setRange</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 初始化value为0 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    value </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#768390;">    /* 给progressBar设置当前值 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    progressBar-&gt;</span><span style="color:#DCBDFB;">setValue</span><span style="color:#ADBAC7;">(value);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置当前文本字符串的显示格式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    progressBar-&gt;</span><span style="color:#DCBDFB;">setFormat</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;充电中</span><span style="color:#F47067;">%p</span><span style="color:#96D0FF;">%&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 定时器实例化设置每100ms发送一个timeout信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    timer </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTimer</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    timer-&gt;</span><span style="color:#DCBDFB;">start</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(timer, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timeout</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 定显示器时间到，value值自加一 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    value </span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    progressBar-&gt;</span><span style="color:#DCBDFB;">setValue</span><span style="color:#ADBAC7;">(value);</span></span>
<span class="line"><span style="color:#768390;">    /* 若value值大于100，令value再回到0 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(value</span><span style="color:#F47067;">&gt;</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        value </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    progressBar </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QProgressBar</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    progressBar-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">60</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /*样式表设置，常用使用setStyleSheet来设置样式（实现界面美化的功能），</span></span>
<span class="line"><span style="color:#6A737D;">     * 具体可参考seTyleSheet */</span></span>
<span class="line"><span style="color:#24292E;">    progressBar-&gt;</span><span style="color:#6F42C1;">setStyleSheet</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;QProgressBar{border:8px solid #FFFFFF;&quot;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;height:30;&quot;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;border-image:url(:/images/battery.png);&quot;</span><span style="color:#6A737D;"> //背景图片</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;text-align:center;&quot;</span><span style="color:#6A737D;">    // 文字居中</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;color:rgb(255,0,255);&quot;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;font:20px;&quot;</span><span style="color:#6A737D;">      // 字体大小为20px</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;border-radius:10px;}&quot;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;QProgressBar::chunk{&quot;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;border-radius:5px;&quot;</span><span style="color:#6A737D;"> // 斑马线圆角</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;border:1px solid black;&quot;</span><span style="color:#6A737D;"> // 黑边，默认无边</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;background-color:skyblue;&quot;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;width:10px;margin:1px;}&quot;</span><span style="color:#6A737D;"> // 宽度和间距</span></span>
<span class="line"><span style="color:#24292E;">                );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置progressBar的范围值 */</span></span>
<span class="line"><span style="color:#24292E;">    progressBar-&gt;</span><span style="color:#6F42C1;">setRange</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 初始化value为0 */</span></span>
<span class="line"><span style="color:#24292E;">    value </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 给progressBar设置当前值 */</span></span>
<span class="line"><span style="color:#24292E;">    progressBar-&gt;</span><span style="color:#6F42C1;">setValue</span><span style="color:#24292E;">(value);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置当前文本字符串的显示格式 */</span></span>
<span class="line"><span style="color:#24292E;">    progressBar-&gt;</span><span style="color:#6F42C1;">setFormat</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;充电中</span><span style="color:#005CC5;">%p</span><span style="color:#032F62;">%&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 定时器实例化设置每100ms发送一个timeout信号 */</span></span>
<span class="line"><span style="color:#24292E;">    timer </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTimer</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    timer-&gt;</span><span style="color:#6F42C1;">start</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(timer, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timeout</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 定显示器时间到，value值自加一 */</span></span>
<span class="line"><span style="color:#24292E;">    value </span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    progressBar-&gt;</span><span style="color:#6F42C1;">setValue</span><span style="color:#24292E;">(value);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 若value值大于100，令value再回到0 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(value</span><span style="color:#D73A49;">&gt;</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        value </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6-7-qframe" tabindex="-1">6.7 QFrame <a class="header-anchor" href="#_6-7-qframe" aria-label="Permalink to &quot;6.7 QFrame&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QFrame 继承 QWidget。 QFrame 类是有框架的窗口部件的基类，它绘制框架并且调用一个虚函数 drawContents()来填充这个框架。这个函数是被子类重新实现的。这里至少还有两个有用的函数： drawFrame()和 frameChanged()</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QFrame 继承 QWidget。 QFrame 类是有框架的窗口部件的基类，它绘制框架并且调用一个虚函数 drawContents()来填充这个框架。这个函数是被子类重新实现的。这里至少还有两个有用的函数： drawFrame()和 frameChanged()</span></span></code></pre></div><h3 id="案例-水平-垂直线" tabindex="-1">案例：水平/垂直线 <a class="header-anchor" href="#案例-水平-垂直线" aria-label="Permalink to &quot;案例：水平/垂直线&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体的显示位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hline </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QFrame</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 确定起始点，设置长和宽，绘制距形 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hline-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QRect</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置框架样式为Hline，水平，可设置为其他样式例如Box，</span></span>
<span class="line"><span style="color:#768390;">     * 由于是样式选择HLine，所以只显示一条水平直线</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hline-&gt;</span><span style="color:#DCBDFB;">setFrameShape</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QFrame</span><span style="color:#ADBAC7;">::HLine);</span></span>
<span class="line"><span style="color:#768390;">    /* 绘制阴影 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hline-&gt;</span><span style="color:#DCBDFB;">setFrameShadow</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QFrame</span><span style="color:#ADBAC7;">::Sunken);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vline </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QFrame</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 确定起始点，设置长和宽，绘制距形 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vline-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QRect</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置框架样式为Vline，垂直，可设置为其他样式例如Box，</span></span>
<span class="line"><span style="color:#768390;">     * 由于是样式选择Vline，所以只显示一条垂直直线</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vline-&gt;</span><span style="color:#DCBDFB;">setFrameShape</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QFrame</span><span style="color:#ADBAC7;">::VLine);</span></span>
<span class="line"><span style="color:#768390;">    /* 绘制阴影 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vline-&gt;</span><span style="color:#DCBDFB;">setFrameShadow</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QFrame</span><span style="color:#ADBAC7;">::Sunken);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体的显示位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    hline </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QFrame</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 确定起始点，设置长和宽，绘制距形 */</span></span>
<span class="line"><span style="color:#24292E;">    hline-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QRect</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">400</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">40</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置框架样式为Hline，水平，可设置为其他样式例如Box，</span></span>
<span class="line"><span style="color:#6A737D;">     * 由于是样式选择HLine，所以只显示一条水平直线</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    hline-&gt;</span><span style="color:#6F42C1;">setFrameShape</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QFrame</span><span style="color:#24292E;">::HLine);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 绘制阴影 */</span></span>
<span class="line"><span style="color:#24292E;">    hline-&gt;</span><span style="color:#6F42C1;">setFrameShadow</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QFrame</span><span style="color:#24292E;">::Sunken);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    vline </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QFrame</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 确定起始点，设置长和宽，绘制距形 */</span></span>
<span class="line"><span style="color:#24292E;">    vline-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QRect</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置框架样式为Vline，垂直，可设置为其他样式例如Box，</span></span>
<span class="line"><span style="color:#6A737D;">     * 由于是样式选择Vline，所以只显示一条垂直直线</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    vline-&gt;</span><span style="color:#6F42C1;">setFrameShape</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QFrame</span><span style="color:#24292E;">::VLine);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 绘制阴影 */</span></span>
<span class="line"><span style="color:#24292E;">    vline-&gt;</span><span style="color:#6F42C1;">setFrameShadow</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QFrame</span><span style="color:#24292E;">::Sunken);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,38);function g(s,h,m,b,w,q){const o=t,e=D("ClientOnly");return l(),r("div",null,[E,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),u])}const x=c(d,[["render",g]]);export{S as __pageData,x as default};
