import{_ as t}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as c,v as l,b as r,E as y,O as i,F as p,L as A,R as C,M as D,C as B,B as d}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const L=JSON.parse('{"title":"容器","description":"","frontmatter":{"title":"容器","author":"阿源","date":"2023/08/06 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/03-QT应用开发和部署/06-容器.md","filePath":"courses/yuanzi/03-QT应用开发和部署/06-容器.md","lastUpdated":1691327334000}'),F={name:"courses/yuanzi/03-QT应用开发和部署/06-容器.md"},u=p("h1",{id:"正点原子qt之容器",tabindex:"-1"},[A("正点原子QT之容器 "),p("a",{class:"header-anchor",href:"#正点原子qt之容器","aria-label":'Permalink to "正点原子QT之容器"'},"​")],-1),E=C(`<h2 id="_8-容器" tabindex="-1">8. 容器 <a class="header-anchor" href="#_8-容器" aria-label="Permalink to &quot;8. 容器&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">（1） Group Box:组框</span></span>
<span class="line"><span style="color:#adbac7;">（2） Scroll Area:滚动区域</span></span>
<span class="line"><span style="color:#adbac7;">（3） Tool Box:工具箱</span></span>
<span class="line"><span style="color:#adbac7;">（4） Tab Widget:标签小部件</span></span>
<span class="line"><span style="color:#adbac7;">（5） Stacked WIdget:堆叠小部件</span></span>
<span class="line"><span style="color:#adbac7;">（6） Frame:帧</span></span>
<span class="line"><span style="color:#adbac7;">（7） Widget:小部件</span></span>
<span class="line"><span style="color:#adbac7;">（8） MDI Area:MDI 区域</span></span>
<span class="line"><span style="color:#adbac7;">（9） Dock Widget:停靠窗体部件</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">（1） Group Box:组框</span></span>
<span class="line"><span style="color:#24292e;">（2） Scroll Area:滚动区域</span></span>
<span class="line"><span style="color:#24292e;">（3） Tool Box:工具箱</span></span>
<span class="line"><span style="color:#24292e;">（4） Tab Widget:标签小部件</span></span>
<span class="line"><span style="color:#24292e;">（5） Stacked WIdget:堆叠小部件</span></span>
<span class="line"><span style="color:#24292e;">（6） Frame:帧</span></span>
<span class="line"><span style="color:#24292e;">（7） Widget:小部件</span></span>
<span class="line"><span style="color:#24292e;">（8） MDI Area:MDI 区域</span></span>
<span class="line"><span style="color:#24292e;">（9） Dock Widget:停靠窗体部件</span></span></code></pre></div><h3 id="_8-1-qgroupbox-组框" tabindex="-1">8.1 QGroupBox:组框 <a class="header-anchor" href="#_8-1-qgroupbox-组框" aria-label="Permalink to &quot;8.1 QGroupBox:组框&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QGroupBox 继承 QWidget。 QGroupBox 为构建分组框提供了支持。分组框通常带有一个边框和一个标题栏，作为容器部件来使用，在其中可以布置各种窗口部件。布局时可用作一组控件的容器，但是需要注意的是，内部通常使用布局控件（如QBoxLayout）进行布局。组框还提供键盘快捷方式，键盘快捷方式将键盘焦点移动到组框的一个子部件。</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">QGroupBox 小部件提供一个带有标题的组框框架。 一般与一组或者是同类型的部件一起使用。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QGroupBox 继承 QWidget。 QGroupBox 为构建分组框提供了支持。分组框通常带有一个边框和一个标题栏，作为容器部件来使用，在其中可以布置各种窗口部件。布局时可用作一组控件的容器，但是需要注意的是，内部通常使用布局控件（如QBoxLayout）进行布局。组框还提供键盘快捷方式，键盘快捷方式将键盘焦点移动到组框的一个子部件。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">QGroupBox 小部件提供一个带有标题的组框框架。 一般与一组或者是同类型的部件一起使用。</span></span></code></pre></div><h3 id="案例-组框示例" tabindex="-1">案例：组框示例 <a class="header-anchor" href="#案例-组框示例" aria-label="Permalink to &quot;案例：组框示例&quot;">​</a></h3><p>例 33_qgroupbox，组框示例（难度：简单），使用 3 个 QRadioButton 单选框按钮，与QVBoxLayout（垂直布局）来展示组框的基本使用。</p><p>程序编译运行的结果如下，可以看到 radioButton 有规则的排布在 groupBox 组框里面。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QList&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 以标题为“QGroupBox示例”实例化groupBox对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    groupBox </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QGroupBox</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">tr</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;QGroupBox示例&quot;</span><span style="color:#ADBAC7;">), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    groupBox-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QVBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 字符串链表 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"><span style="color:#ADBAC7;">    list</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;选项一&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;选项二&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;选项三&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        radioButton[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QRadioButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        radioButton[i]-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(list[i]);</span></span>
<span class="line"><span style="color:#768390;">        /* 在vBoxLayout添加radioButton */</span></span>
<span class="line"><span style="color:#ADBAC7;">        vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(radioButton[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 添加一个伸缩量1 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addStretch</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* vBoxLayout布局设置为groupBox布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    groupBox-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(vBoxLayout);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QList&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 以标题为“QGroupBox示例”实例化groupBox对象 */</span></span>
<span class="line"><span style="color:#24292E;">    groupBox </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QGroupBox</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">tr</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;QGroupBox示例&quot;</span><span style="color:#24292E;">), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    groupBox-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QVBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 字符串链表 */</span></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">list;</span></span>
<span class="line"><span style="color:#24292E;">    list</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;选项一&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;选项二&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;选项三&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        radioButton[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QRadioButton</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        radioButton[i]-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(list[i]);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 在vBoxLayout添加radioButton */</span></span>
<span class="line"><span style="color:#24292E;">        vBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(radioButton[i]);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 添加一个伸缩量1 */</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout-&gt;</span><span style="color:#6F42C1;">addStretch</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* vBoxLayout布局设置为groupBox布局 */</span></span>
<span class="line"><span style="color:#24292E;">    groupBox-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(vBoxLayout);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_8-2-qscrollarea-滚动区域" tabindex="-1">8.2 QScrollArea:滚动区域 <a class="header-anchor" href="#_8-2-qscrollarea-滚动区域" aria-label="Permalink to &quot;8.2 QScrollArea:滚动区域&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QScrollArea 继承 QAbstractScrollArea。滚动区域用于在框架中显示子部件的内容。如果小部件超过框架的大小，视图就会出现滚动条，以便可以查看子小部件的整个区域。</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">QScrollArea 类提供到另一个小部件的滚动视图。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QScrollArea 继承 QAbstractScrollArea。滚动区域用于在框架中显示子部件的内容。如果小部件超过框架的大小，视图就会出现滚动条，以便可以查看子小部件的整个区域。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">QScrollArea 类提供到另一个小部件的滚动视图。</span></span></code></pre></div><h3 id="案例-滚动视图" tabindex="-1">案例：滚动视图 <a class="header-anchor" href="#案例-滚动视图" aria-label="Permalink to &quot;案例：滚动视图&quot;">​</a></h3><p>例 34_qscrollarea 滚动视图（难度：简单），使用一个 Label 标签，将 Label 标签设置为一张图片，并把 Label 标签放置于滚动区域内，此时图片应要大于滚动区域才会出现滚动条。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    scrollArea </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QScrollArea</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置滚动区域为700*380 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    scrollArea-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">700</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">380</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    label </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLabel</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* label显示的lantingxu.png图片分辨率为1076*500 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QImage </span><span style="color:#DCBDFB;">image</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;:/images/lantingxu.png&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setPixmap</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QPixmap</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">fromImage</span><span style="color:#ADBAC7;">(image));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    scrollArea-&gt;</span><span style="color:#DCBDFB;">setWidget</span><span style="color:#ADBAC7;">(label);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    scrollArea </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QScrollArea</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置滚动区域为700*380 */</span></span>
<span class="line"><span style="color:#24292E;">    scrollArea-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">700</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">380</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    label </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLabel</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* label显示的lantingxu.png图片分辨率为1076*500 */</span></span>
<span class="line"><span style="color:#24292E;">    QImage </span><span style="color:#6F42C1;">image</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;:/images/lantingxu.png&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setPixmap</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QPixmap</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">fromImage</span><span style="color:#24292E;">(image));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    scrollArea-&gt;</span><span style="color:#6F42C1;">setWidget</span><span style="color:#24292E;">(label);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_8-3-qtoolbox-工具箱" tabindex="-1">8.3 QToolBox:工具箱 <a class="header-anchor" href="#_8-3-qtoolbox-工具箱" aria-label="Permalink to &quot;8.3 QToolBox:工具箱&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QToolBox 继承 QFrame。 QToolBox 类提供了一列选项卡小部件项。工具箱是一个小部件，它显示一列选项卡在另一列的上面，当前项显示在当前选项卡的下面。每个选项卡在选项卡列中都有一个索引位置。选项卡的项是 QWidget。</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">QToolBox（工具盒类）提供了一种列状的层叠窗体，中文译为工具箱，类似抽屉</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QToolBox 继承 QFrame。 QToolBox 类提供了一列选项卡小部件项。工具箱是一个小部件，它显示一列选项卡在另一列的上面，当前项显示在当前选项卡的下面。每个选项卡在选项卡列中都有一个索引位置。选项卡的项是 QWidget。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">QToolBox（工具盒类）提供了一种列状的层叠窗体，中文译为工具箱，类似抽屉</span></span></code></pre></div><h3 id="案例-qq-好友面板" tabindex="-1">案例：QQ 好友面板 <a class="header-anchor" href="#案例-qq-好友面板" aria-label="Permalink to &quot;案例：QQ 好友面板&quot;">​</a></h3><p>35_qtoolbox， QQ 好友面板之 QToolBox（难度：简单），本例将使用到前面的知识QGroupBox 组框与 QBoxLayout 布局管理。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    toolBox </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QToolBox</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolBox-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">250</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置toolBox的样式，此处设置为30%不透明度的黑色 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolBox-&gt;</span><span style="color:#DCBDFB;">setStyleSheet</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;QToolBox {background-color:rgba(0, 0, 0, 30%);}&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        vBoxLayout[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QVBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        groupBox[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QGroupBox</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 字符串链表 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">strList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    strList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;李白&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;王照君&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;李元芳&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;程咬金&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;钟馗&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;上官婉儿&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 字符串图标链表 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">iconsList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    iconsList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/libai&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/wangzhaojun&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/liyuanfang&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/chengyaojin&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">           </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/zhongkui&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/shangguanwaner&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        toolButton[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QToolButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">        /* 设置toolButton图标 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        toolButton[i]-&gt;</span><span style="color:#DCBDFB;">setIcon</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QIcon</span><span style="color:#ADBAC7;">(iconsList[i]));</span></span>
<span class="line"><span style="color:#768390;">        /* 设置toolButton的文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        toolButton[i]-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(strList[i]);</span></span>
<span class="line"><span style="color:#768390;">        /* 设置toolButton的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        toolButton[i]-&gt;</span><span style="color:#DCBDFB;">setFixedSize</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">150</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">        /* 设置toolButton的setToolButtonStyle的样式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        toolButton[i]-&gt;</span><span style="color:#DCBDFB;">setToolButtonStyle</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::ToolButtonTextBesideIcon</span></span>
<span class="line"><span style="color:#ADBAC7;">                    );</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">( i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> ) {</span></span>
<span class="line"><span style="color:#768390;">            /* 将toolButton添加到时垂直布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            vBoxLayout[</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">]-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(toolButton[i]);</span></span>
<span class="line"><span style="color:#768390;">            /* 添加一个伸缩量1 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            vBoxLayout[</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">]-&gt;</span><span style="color:#DCBDFB;">addStretch</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        } </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">            vBoxLayout[</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(toolButton[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">            vBoxLayout[</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]-&gt;</span><span style="color:#DCBDFB;">addStretch</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 将垂直布局的内容添加到组框groupBox */</span></span>
<span class="line"><span style="color:#ADBAC7;">    groupBox[</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">]-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(vBoxLayout[</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">]);</span></span>
<span class="line"><span style="color:#ADBAC7;">    groupBox[</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(vBoxLayout[</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将组框加入QToolBox里 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolBox-&gt;</span><span style="color:#DCBDFB;">addItem</span><span style="color:#ADBAC7;">(groupBox[</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">],</span><span style="color:#96D0FF;">&quot;我的好友&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    toolBox-&gt;</span><span style="color:#DCBDFB;">addItem</span><span style="color:#ADBAC7;">(groupBox[</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">],</span><span style="color:#96D0FF;">&quot;黑名单&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    toolBox </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QToolBox</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    toolBox-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">50</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">250</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置toolBox的样式，此处设置为30%不透明度的黑色 */</span></span>
<span class="line"><span style="color:#24292E;">    toolBox-&gt;</span><span style="color:#6F42C1;">setStyleSheet</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;QToolBox {background-color:rgba(0, 0, 0, 30%);}&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        vBoxLayout[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QVBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        groupBox[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QGroupBox</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 字符串链表 */</span></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">strList;</span></span>
<span class="line"><span style="color:#24292E;">    strList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;李白&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;王照君&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;李元芳&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;程咬金&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;钟馗&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;上官婉儿&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 字符串图标链表 */</span></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">iconsList;</span></span>
<span class="line"><span style="color:#24292E;">    iconsList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/libai&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/wangzhaojun&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/liyuanfang&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/chengyaojin&quot;</span></span>
<span class="line"><span style="color:#24292E;">           </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/zhongkui&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/shangguanwaner&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        toolButton[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QToolButton</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">        /* 设置toolButton图标 */</span></span>
<span class="line"><span style="color:#24292E;">        toolButton[i]-&gt;</span><span style="color:#6F42C1;">setIcon</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QIcon</span><span style="color:#24292E;">(iconsList[i]));</span></span>
<span class="line"><span style="color:#6A737D;">        /* 设置toolButton的文本 */</span></span>
<span class="line"><span style="color:#24292E;">        toolButton[i]-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(strList[i]);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 设置toolButton的大小 */</span></span>
<span class="line"><span style="color:#24292E;">        toolButton[i]-&gt;</span><span style="color:#6F42C1;">setFixedSize</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">150</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 设置toolButton的setToolButtonStyle的样式 */</span></span>
<span class="line"><span style="color:#24292E;">        toolButton[i]-&gt;</span><span style="color:#6F42C1;">setToolButtonStyle</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::ToolButtonTextBesideIcon</span></span>
<span class="line"><span style="color:#24292E;">                    );</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">( i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;"> ) {</span></span>
<span class="line"><span style="color:#6A737D;">            /* 将toolButton添加到时垂直布局 */</span></span>
<span class="line"><span style="color:#24292E;">            vBoxLayout[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(toolButton[i]);</span></span>
<span class="line"><span style="color:#6A737D;">            /* 添加一个伸缩量1 */</span></span>
<span class="line"><span style="color:#24292E;">            vBoxLayout[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]-&gt;</span><span style="color:#6F42C1;">addStretch</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            vBoxLayout[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(toolButton[i]);</span></span>
<span class="line"><span style="color:#24292E;">            vBoxLayout[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]-&gt;</span><span style="color:#6F42C1;">addStretch</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将垂直布局的内容添加到组框groupBox */</span></span>
<span class="line"><span style="color:#24292E;">    groupBox[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(vBoxLayout[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]);</span></span>
<span class="line"><span style="color:#24292E;">    groupBox[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(vBoxLayout[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将组框加入QToolBox里 */</span></span>
<span class="line"><span style="color:#24292E;">    toolBox-&gt;</span><span style="color:#6F42C1;">addItem</span><span style="color:#24292E;">(groupBox[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">],</span><span style="color:#032F62;">&quot;我的好友&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    toolBox-&gt;</span><span style="color:#6F42C1;">addItem</span><span style="color:#24292E;">(groupBox[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">],</span><span style="color:#032F62;">&quot;黑名单&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_8-4-qtabwidget-标签小部件" tabindex="-1">8.4 QTabWidget:标签小部件 <a class="header-anchor" href="#_8-4-qtabwidget-标签小部件" aria-label="Permalink to &quot;8.4 QTabWidget:标签小部件&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">TabWidget 继承 QWidget。 abWidget 类提供了一组选项卡（多页面）小部件。 QTabWidget主要是用来分页显示的，每一页一个界面，众多界面公用一块区域，节省了界面大小，很方便的为用户显示更多的信息。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">TabWidget 继承 QWidget。 abWidget 类提供了一组选项卡（多页面）小部件。 QTabWidget主要是用来分页显示的，每一页一个界面，众多界面公用一块区域，节省了界面大小，很方便的为用户显示更多的信息。</span></span></code></pre></div><h3 id="案例-标题栏多页面切换" tabindex="-1">案例：标题栏多页面切换 <a class="header-anchor" href="#案例-标题栏多页面切换" aria-label="Permalink to &quot;案例：标题栏多页面切换&quot;">​</a></h3><p>例 36_qtabwidget，标题栏多页面切换（难度：简单），本例创建 3 个页面，每个页面里有一个 Label 标签部件，点击每个页面的选项卡则会切换到不同的页面上。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    widget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(widget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 多页面小部件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    tabWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTabWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 水平布局实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">strLabelList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    strLabelList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;标签一&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;标签二&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;标签三&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">strTabList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    strTabList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;页面一&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;页面二&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;页面三&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">iconList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    iconList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/icon1&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">           </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/icon2&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;:/icons/icon3&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        label[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLabel</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">        /* 设置标签文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        label[i]-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(strLabelList[i]);</span></span>
<span class="line"><span style="color:#768390;">        /* 标签对齐方式（居中） */</span></span>
<span class="line"><span style="color:#ADBAC7;">        label[i]-&gt;</span><span style="color:#DCBDFB;">setAlignment</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::AlignCenter);</span></span>
<span class="line"><span style="color:#768390;">        /* 添加页面 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        tabWidget-&gt;</span><span style="color:#DCBDFB;">addTab</span><span style="color:#ADBAC7;">(label[i],</span></span>
<span class="line"><span style="color:#ADBAC7;">                          </span><span style="color:#DCBDFB;">QIcon</span><span style="color:#ADBAC7;">(iconList[i]),</span></span>
<span class="line"><span style="color:#ADBAC7;">                          strTabList[i]</span></span>
<span class="line"><span style="color:#ADBAC7;">                          );</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 是否添加关闭按钮 */</span></span>
<span class="line"><span style="color:#768390;">    //tabWidget-&gt;setTabsClosable(true);</span></span>
<span class="line"><span style="color:#768390;">    /* 将tabWidget水平直排布 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(tabWidget);</span></span>
<span class="line"><span style="color:#768390;">    /* 将垂直布局设置到widget */</span></span>
<span class="line"><span style="color:#ADBAC7;">    widget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(hBoxLayout);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    widget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(widget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 多页面小部件 */</span></span>
<span class="line"><span style="color:#24292E;">    tabWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTabWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 水平布局实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">strLabelList;</span></span>
<span class="line"><span style="color:#24292E;">    strLabelList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;标签一&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;标签二&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;标签三&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">strTabList;</span></span>
<span class="line"><span style="color:#24292E;">    strTabList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;页面一&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;页面二&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;页面三&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">iconList;</span></span>
<span class="line"><span style="color:#24292E;">    iconList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/icon1&quot;</span></span>
<span class="line"><span style="color:#24292E;">           </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/icon2&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;:/icons/icon3&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        label[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLabel</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">        /* 设置标签文本 */</span></span>
<span class="line"><span style="color:#24292E;">        label[i]-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(strLabelList[i]);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 标签对齐方式（居中） */</span></span>
<span class="line"><span style="color:#24292E;">        label[i]-&gt;</span><span style="color:#6F42C1;">setAlignment</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::AlignCenter);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 添加页面 */</span></span>
<span class="line"><span style="color:#24292E;">        tabWidget-&gt;</span><span style="color:#6F42C1;">addTab</span><span style="color:#24292E;">(label[i],</span></span>
<span class="line"><span style="color:#24292E;">                          </span><span style="color:#6F42C1;">QIcon</span><span style="color:#24292E;">(iconList[i]),</span></span>
<span class="line"><span style="color:#24292E;">                          strTabList[i]</span></span>
<span class="line"><span style="color:#24292E;">                          );</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 是否添加关闭按钮 */</span></span>
<span class="line"><span style="color:#6A737D;">    //tabWidget-&gt;setTabsClosable(true);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将tabWidget水平直排布 */</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(tabWidget);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将垂直布局设置到widget */</span></span>
<span class="line"><span style="color:#24292E;">    widget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(hBoxLayout);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_8-5-qstackedwidget-堆叠小部件" tabindex="-1">8.5 QStackedWIdget:堆叠小部件 <a class="header-anchor" href="#_8-5-qstackedwidget-堆叠小部件" aria-label="Permalink to &quot;8.5 QStackedWIdget:堆叠小部件&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QStackedWidget 继承 QFrame。 QStackedWidget 类提供了一个小部件堆栈，其中一次只能看到一个小部件，与 QQ 的设置面板类似。 QStackedWidget 可用于创建类似于 QTabWidget 提供的用户界面。它是构建在 QStackedLayout 类之上的一个方便的布局小部件。常与 QListWidget搭配使用，效果如下图，左边的是 QListWidget 列表，右边的是 QStackedWidget。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QStackedWidget 继承 QFrame。 QStackedWidget 类提供了一个小部件堆栈，其中一次只能看到一个小部件，与 QQ 的设置面板类似。 QStackedWidget 可用于创建类似于 QTabWidget 提供的用户界面。它是构建在 QStackedLayout 类之上的一个方便的布局小部件。常与 QListWidget搭配使用，效果如下图，左边的是 QListWidget 列表，右边的是 QStackedWidget。</span></span></code></pre></div><h3 id="案例-列表栏多页面切换" tabindex="-1">案例：列表栏多页面切换 <a class="header-anchor" href="#案例-列表栏多页面切换" aria-label="Permalink to &quot;案例：列表栏多页面切换&quot;">​</a></h3><p>例 37_qstackedwidget，列表栏多页面切换（难度：简单），本例创建 3 个堆栈页面，每个页面里有一个 Label 标签部件，点击每个列表的不同项则会切换到不同的页面上。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* widget小部件实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    widget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(widget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 垂直布局实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 堆栈部件实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    stackedWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStackedWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 列表实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    listWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QListWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">strListWidgetList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    strListWidgetList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;窗口一&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;窗口二&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;窗口三&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#768390;">        /* listWidget插入项 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        listWidget-&gt;</span><span style="color:#DCBDFB;">insertItem</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                    i,</span></span>
<span class="line"><span style="color:#ADBAC7;">                    strListWidgetList[i]</span></span>
<span class="line"><span style="color:#ADBAC7;">                    );</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">strLabelList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    strLabelList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;标签一&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;标签二&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;标签三&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        label[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLabel</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">        /* 设置标签文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        label[i]-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(strLabelList[i]);</span></span>
<span class="line"><span style="color:#768390;">        /* 标签对齐方式（居中） */</span></span>
<span class="line"><span style="color:#ADBAC7;">        label[i]-&gt;</span><span style="color:#DCBDFB;">setAlignment</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::AlignCenter);</span></span>
<span class="line"><span style="color:#768390;">        /* 添加页面 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        stackedWidget-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(label[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置列表的最大宽度 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    listWidget-&gt;</span><span style="color:#DCBDFB;">setMaximumWidth</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 添加到水平布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(listWidget);</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(stackedWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将widget的布局设置成hboxLayout */</span></span>
<span class="line"><span style="color:#ADBAC7;">    widget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 利用listWidget的信号函数currentRowChanged()与</span></span>
<span class="line"><span style="color:#768390;">     * 槽函数setCurrentIndex(),进行信号与槽连接</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(listWidget, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">currentRowChanged</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)),</span></span>
<span class="line"><span style="color:#ADBAC7;">            stackedWidget, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">setCurrentIndex</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* widget小部件实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    widget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(widget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 垂直布局实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 堆栈部件实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    stackedWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStackedWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 列表实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    listWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QListWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">strListWidgetList;</span></span>
<span class="line"><span style="color:#24292E;">    strListWidgetList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;窗口一&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;窗口二&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;窗口三&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#6A737D;">        /* listWidget插入项 */</span></span>
<span class="line"><span style="color:#24292E;">        listWidget-&gt;</span><span style="color:#6F42C1;">insertItem</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                    i,</span></span>
<span class="line"><span style="color:#24292E;">                    strListWidgetList[i]</span></span>
<span class="line"><span style="color:#24292E;">                    );</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">strLabelList;</span></span>
<span class="line"><span style="color:#24292E;">    strLabelList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;标签一&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;标签二&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;标签三&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        label[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLabel</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">        /* 设置标签文本 */</span></span>
<span class="line"><span style="color:#24292E;">        label[i]-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(strLabelList[i]);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 标签对齐方式（居中） */</span></span>
<span class="line"><span style="color:#24292E;">        label[i]-&gt;</span><span style="color:#6F42C1;">setAlignment</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::AlignCenter);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 添加页面 */</span></span>
<span class="line"><span style="color:#24292E;">        stackedWidget-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(label[i]);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置列表的最大宽度 */</span></span>
<span class="line"><span style="color:#24292E;">    listWidget-&gt;</span><span style="color:#6F42C1;">setMaximumWidth</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 添加到水平布局 */</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(listWidget);</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(stackedWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将widget的布局设置成hboxLayout */</span></span>
<span class="line"><span style="color:#24292E;">    widget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 利用listWidget的信号函数currentRowChanged()与</span></span>
<span class="line"><span style="color:#6A737D;">     * 槽函数setCurrentIndex(),进行信号与槽连接</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(listWidget, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">currentRowChanged</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)),</span></span>
<span class="line"><span style="color:#24292E;">            stackedWidget, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">setCurrentIndex</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_8-6-qframe-帧" tabindex="-1">8.6 QFrame:帧 <a class="header-anchor" href="#_8-6-qframe-帧" aria-label="Permalink to &quot;8.6 QFrame:帧&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">见6.7</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">见6.7</span></span></code></pre></div><h3 id="_8-7-qwidget-小部件" tabindex="-1">8.7 QWidget:小部件 <a class="header-anchor" href="#_8-7-qwidget-小部件" aria-label="Permalink to &quot;8.7 QWidget:小部件&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QWidget 类是所有用户界面对象的基类（如 QLabel 类继承于 QFrame 类，而 QFrame 类又继承于 QWidget 类）。</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">QWidget 不是一个抽象类，它可以用作其他 Widget 的容器，并很容易作为子类来创建定制Widget。它经常用于创建、放置和容纳其他的 Widget 窗</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QWidget 类是所有用户界面对象的基类（如 QLabel 类继承于 QFrame 类，而 QFrame 类又继承于 QWidget 类）。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">QWidget 不是一个抽象类，它可以用作其他 Widget 的容器，并很容易作为子类来创建定制Widget。它经常用于创建、放置和容纳其他的 Widget 窗</span></span></code></pre></div><h3 id="_8-8-qmdiarea-mdi-区域" tabindex="-1">8.8 QMDIArea: MDI 区域 <a class="header-anchor" href="#_8-8-qmdiarea-mdi-区域" aria-label="Permalink to &quot;8.8 QMDIArea: MDI 区域&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QMdiArea 继承 QAbstractScrollArea。 QMdiArea 小部件提供一个显示 MDI 窗口的区域。QMdiArea的功能本质上类似于 MDI窗口的窗口管理器。大多数复杂的程序，都使用 MDI框架，在 Qt designer 中可以直接将控件 MDI Area 拖入使用。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QMdiArea 继承 QAbstractScrollArea。 QMdiArea 小部件提供一个显示 MDI 窗口的区域。QMdiArea的功能本质上类似于 MDI窗口的窗口管理器。大多数复杂的程序，都使用 MDI框架，在 Qt designer 中可以直接将控件 MDI Area 拖入使用。</span></span></code></pre></div><h3 id="案例-父子窗口" tabindex="-1">案例：父子窗口 <a class="header-anchor" href="#案例-父子窗口" aria-label="Permalink to &quot;案例：父子窗口&quot;">​</a></h3><p>例 38_qmdiarea，父子窗口（难度：简单），本例创建一个 MDI Area 区域，使用一个按钮，每单击按钮时，就会在 MDI Area 区域新建一个 MdiSubWindow 窗口。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置窗口的显示位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;新建窗口&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    mdiArea </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QMdiArea</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置MDI Area区域大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mdiArea-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">700</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">430</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 连接信号槽 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">creat_newMdiSubWindow</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">creat_newMdiSubWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    newMdiSubWindow </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QMdiSubWindow</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    newMdiSubWindow-&gt;</span><span style="color:#DCBDFB;">setWindowTitle</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;新建窗口&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 如果窗口设置了Qt::WA_DeleteOnClose 这个属性，</span></span>
<span class="line"><span style="color:#768390;">     * 在窗口接受了关闭事件后，Qt会释放这个窗口所占用的资源</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    newMdiSubWindow-&gt;</span><span style="color:#DCBDFB;">setAttribute</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::WA_DeleteOnClose);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 添加子窗口 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mdiArea-&gt;</span><span style="color:#DCBDFB;">addSubWindow</span><span style="color:#ADBAC7;">(newMdiSubWindow);</span></span>
<span class="line"><span style="color:#768390;">    /* 显示窗口，不设置时为不显示 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    newMdiSubWindow-&gt;</span><span style="color:#DCBDFB;">show</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 自适应窗口 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    newMdiSubWindow-&gt;</span><span style="color:#DCBDFB;">sizePolicy</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 以级联的方式排列所有窗口 */</span></span>
<span class="line"><span style="color:#768390;">    // mdiArea-&gt;cascadeSubWindows();</span></span>
<span class="line"><span style="color:#768390;">    /* 以平铺方式排列所有窗口 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mdiArea-&gt;</span><span style="color:#DCBDFB;">tileSubWindows</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置窗口的显示位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;新建窗口&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">30</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    mdiArea </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QMdiArea</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置MDI Area区域大小 */</span></span>
<span class="line"><span style="color:#24292E;">    mdiArea-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">30</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">700</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">430</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 连接信号槽 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">creat_newMdiSubWindow</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">creat_newMdiSubWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    newMdiSubWindow </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QMdiSubWindow</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    newMdiSubWindow-&gt;</span><span style="color:#6F42C1;">setWindowTitle</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;新建窗口&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 如果窗口设置了Qt::WA_DeleteOnClose 这个属性，</span></span>
<span class="line"><span style="color:#6A737D;">     * 在窗口接受了关闭事件后，Qt会释放这个窗口所占用的资源</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    newMdiSubWindow-&gt;</span><span style="color:#6F42C1;">setAttribute</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::WA_DeleteOnClose);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 添加子窗口 */</span></span>
<span class="line"><span style="color:#24292E;">    mdiArea-&gt;</span><span style="color:#6F42C1;">addSubWindow</span><span style="color:#24292E;">(newMdiSubWindow);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 显示窗口，不设置时为不显示 */</span></span>
<span class="line"><span style="color:#24292E;">    newMdiSubWindow-&gt;</span><span style="color:#6F42C1;">show</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 自适应窗口 */</span></span>
<span class="line"><span style="color:#24292E;">    newMdiSubWindow-&gt;</span><span style="color:#6F42C1;">sizePolicy</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 以级联的方式排列所有窗口 */</span></span>
<span class="line"><span style="color:#6A737D;">    // mdiArea-&gt;cascadeSubWindows();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 以平铺方式排列所有窗口 */</span></span>
<span class="line"><span style="color:#24292E;">    mdiArea-&gt;</span><span style="color:#6F42C1;">tileSubWindows</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_8-9-qdockwidget-停靠窗体部件" tabindex="-1">8.9 QDockWidget: 停靠窗体部件 <a class="header-anchor" href="#_8-9-qdockwidget-停靠窗体部件" aria-label="Permalink to &quot;8.9 QDockWidget: 停靠窗体部件&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QDockWidget 继承 QWidget。 QDockWidget 类提供了一个小部件，可以停靠在 QMainWindow 内，也可以作为桌面的顶级窗口浮动。 QDockWidget 提供了停靠部件的概念，也称为工具面板或实用程序窗口。停靠窗口是放置在 QMainWindow 中央窗口附近的停靠窗口部件区域中的辅助窗口。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QDockWidget 继承 QWidget。 QDockWidget 类提供了一个小部件，可以停靠在 QMainWindow 内，也可以作为桌面的顶级窗口浮动。 QDockWidget 提供了停靠部件的概念，也称为工具面板或实用程序窗口。停靠窗口是放置在 QMainWindow 中央窗口附近的停靠窗口部件区域中的辅助窗口。</span></span></code></pre></div><h3 id="案例-停靠窗口" tabindex="-1">案例：停靠窗口 <a class="header-anchor" href="#案例-停靠窗口" aria-label="Permalink to &quot;案例：停靠窗口&quot;">​</a></h3><p>例 39_qdockwidget，停靠窗口（难度：简单），本例创建一个停靠窗口，在停靠窗口里添加文本编辑框，并且把这个停靠窗口放置到 QMainWindow 的顶部。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体的显示的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化标题为停靠窗口 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    dockWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QDockWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;停靠窗口&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化文本编辑框 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    textEdit </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTextEdit</span><span style="color:#ADBAC7;">(dockWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    textEdit-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;这是一个测试&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 停靠窗口添加文本编辑框 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    dockWidget-&gt;</span><span style="color:#DCBDFB;">setWidget</span><span style="color:#ADBAC7;">(textEdit);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 放在主窗体的顶部 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">addDockWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::TopDockWidgetArea, dockWidget);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体的显示的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化标题为停靠窗口 */</span></span>
<span class="line"><span style="color:#24292E;">    dockWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QDockWidget</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;停靠窗口&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化文本编辑框 */</span></span>
<span class="line"><span style="color:#24292E;">    textEdit </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTextEdit</span><span style="color:#24292E;">(dockWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    textEdit-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;这是一个测试&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 停靠窗口添加文本编辑框 */</span></span>
<span class="line"><span style="color:#24292E;">    dockWidget-&gt;</span><span style="color:#6F42C1;">setWidget</span><span style="color:#24292E;">(textEdit);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 放在主窗体的顶部 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">addDockWidget</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::TopDockWidgetArea, dockWidget);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,42);function g(s,h,W,b,Q,q){const o=t,e=D("ClientOnly");return l(),r("div",null,[u,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):d("",!0)]}),_:1}),E])}const k=c(F,[["render",g]]);export{L as __pageData,k as default};
