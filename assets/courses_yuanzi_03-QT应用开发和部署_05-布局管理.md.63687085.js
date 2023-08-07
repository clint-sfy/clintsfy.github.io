import{_ as t}from"./chunks/ArticleMetadata.59a467b2.js";import{_ as c,v as l,b as r,t as y,O as i,F as p,L as A,R as C,M as D,C as B,B as F}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const b=JSON.parse('{"title":"布局管理","description":"","frontmatter":{"title":"布局管理","author":"阿源","date":"2023/08/05 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/03-QT应用开发和部署/05-布局管理.md","filePath":"courses/yuanzi/03-QT应用开发和部署/05-布局管理.md","lastUpdated":1691327334000}'),d={name:"courses/yuanzi/03-QT应用开发和部署/05-布局管理.md"},u=p("h1",{id:"正点原子qt之布局管理",tabindex:"-1"},[A("正点原子QT之布局管理 "),p("a",{class:"header-anchor",href:"#正点原子qt之布局管理","aria-label":'Permalink to "正点原子QT之布局管理"'},"​")],-1),E=C(`<h2 id="_7-布局管理" tabindex="-1">7 布局管理 <a class="header-anchor" href="#_7-布局管理" aria-label="Permalink to &quot;7 布局管理&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">（1） Vertiacl Layout:垂直布局</span></span>
<span class="line"><span style="color:#adbac7;">（2） Horizontal Layout:水平布局</span></span>
<span class="line"><span style="color:#adbac7;">（3） Grid Layout:网格布局</span></span>
<span class="line"><span style="color:#adbac7;">（4） Form Layout:表单布局</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">（1） Vertiacl Layout:垂直布局</span></span>
<span class="line"><span style="color:#24292e;">（2） Horizontal Layout:水平布局</span></span>
<span class="line"><span style="color:#24292e;">（3） Grid Layout:网格布局</span></span>
<span class="line"><span style="color:#24292e;">（4） Form Layout:表单布局</span></span></code></pre></div><h3 id="_7-1-qboxlayout" tabindex="-1">7.1 QBoxLayout <a class="header-anchor" href="#_7-1-qboxlayout" aria-label="Permalink to &quot;7.1 QBoxLayout&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QBoxLayout 继承 QLayout。 QBoxLayout 类提供水平或垂直地排列子部件。 QBoxLayout 获取从它的父布局或从 parentWidget()中所获得的空间，将其分成一列框，并使每个托管小部件填充一个框。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QBoxLayout 继承 QLayout。 QBoxLayout 类提供水平或垂直地排列子部件。 QBoxLayout 获取从它的父布局或从 parentWidget()中所获得的空间，将其分成一列框，并使每个托管小部件填充一个框。</span></span></code></pre></div><h3 id="案例-垂直或水平布局" tabindex="-1">案例：垂直或水平布局 <a class="header-anchor" href="#案例-垂直或水平布局" aria-label="Permalink to &quot;案例：垂直或水平布局&quot;">​</a></h3><p>例 29_qboxlayout，垂直或水平布局（难度：简单），使用几个按钮，将他们设置为垂直排布和水平排布，以及设置它们的一些属性。</p><p>可以看到在 hWidget 中添加了 3 个水平排布的按钮，在 vWidget中添加了 3 个垂直排布的按钮。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QList&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化与设置位置大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    hWidget-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">240</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    vWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    vWidget-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">240</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">240</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    hLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    vLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QVBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* QList&lt;T&gt;是Qt的一种泛型容器类。</span></span>
<span class="line"><span style="color:#768390;">     * 它以链表方式存储一组值，</span></span>
<span class="line"><span style="color:#768390;">     * 并能对这组数据进行快速索引</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"><span style="color:#768390;">    /* 将字符串值插入list */</span></span>
<span class="line"><span style="color:#ADBAC7;">    list</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;one&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;two&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;three&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;four&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;five&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;six&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 用一个循环实例化6个按钮 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        pushButton[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        pushButton[i]-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(list[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#768390;">            /* 将按钮添加至hLayout中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            hLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(pushButton[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">        } </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#768390;">            /* 将按钮添加至vLayout中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            vLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(pushButton[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 设置间隔为50 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hLayout-&gt;</span><span style="color:#DCBDFB;">setSpacing</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* hWidget与vWidget的布局设置为hLayout/vLayout */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(hLayout);</span></span>
<span class="line"><span style="color:#ADBAC7;">    vWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(vLayout);</span></span>
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
<span class="line"><span style="color:#6A737D;">    /* 设置主窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化与设置位置大小 */</span></span>
<span class="line"><span style="color:#24292E;">    hWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    hWidget-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">240</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    vWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    vWidget-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">240</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">240</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    hLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    vLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QVBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* QList&lt;T&gt;是Qt的一种泛型容器类。</span></span>
<span class="line"><span style="color:#6A737D;">     * 它以链表方式存储一组值，</span></span>
<span class="line"><span style="color:#6A737D;">     * 并能对这组数据进行快速索引</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">list;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将字符串值插入list */</span></span>
<span class="line"><span style="color:#24292E;">    list</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;one&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;two&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;three&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;four&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;five&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;six&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 用一个循环实例化6个按钮 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        pushButton[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        pushButton[i]-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(list[i]);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#6A737D;">            /* 将按钮添加至hLayout中 */</span></span>
<span class="line"><span style="color:#24292E;">            hLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(pushButton[i]);</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#6A737D;">            /* 将按钮添加至vLayout中 */</span></span>
<span class="line"><span style="color:#24292E;">            vLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(pushButton[i]);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置间隔为50 */</span></span>
<span class="line"><span style="color:#24292E;">    hLayout-&gt;</span><span style="color:#6F42C1;">setSpacing</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* hWidget与vWidget的布局设置为hLayout/vLayout */</span></span>
<span class="line"><span style="color:#24292E;">    hWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(hLayout);</span></span>
<span class="line"><span style="color:#24292E;">    vWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(vLayout);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_7-2-qgridlayout" tabindex="-1">7.2 QGridLayout <a class="header-anchor" href="#_7-2-qgridlayout" aria-label="Permalink to &quot;7.2 QGridLayout&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QGridLayout继承 QLayout。QGridLayout获取可用的空间(通过其父布局或 parentWidget()))，将其分为行和列，并将其管理的每个小部件放入正确的单元格中。由于网格布局管理器中的组件也是会随着窗口拉伸而发生变化的，所以也是需要设置组件之间的比例系数的，与 QBoxLayout 不同的是网格布局管理器还需要分别设置行和列的比例系数。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QGridLayout继承 QLayout。QGridLayout获取可用的空间(通过其父布局或 parentWidget()))，将其分为行和列，并将其管理的每个小部件放入正确的单元格中。由于网格布局管理器中的组件也是会随着窗口拉伸而发生变化的，所以也是需要设置组件之间的比例系数的，与 QBoxLayout 不同的是网格布局管理器还需要分别设置行和列的比例系数。</span></span></code></pre></div><h3 id="案例-网格布局" tabindex="-1">案例：网格布局 <a class="header-anchor" href="#案例-网格布局" aria-label="Permalink to &quot;案例：网格布局&quot;">​</a></h3><p>例 30_qgridlayout，网格布局（难度：简单），使用几个按钮，将他们设置为网格布局，同时设置它们的行、列比例系数（拉伸因子），以及设置它们的一些属性。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    gWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置gWidget居中央 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(gWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    gridLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QGridLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* QList链表，字符串类型 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> list;</span></span>
<span class="line"><span style="color:#ADBAC7;">    list</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮1&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮2&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮3&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮4&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        pushButton[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        pushButton[i]-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(list[i]);</span></span>
<span class="line"><span style="color:#768390;">        /* 设置最小宽度与高度 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        pushButton[i]-&gt;</span><span style="color:#DCBDFB;">setMinimumSize</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">        /* 自动调整按钮的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        pushButton[i]-&gt;</span><span style="color:#DCBDFB;">setSizePolicy</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#F69D50;">QSizePolicy</span><span style="color:#ADBAC7;">::Expanding,</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#F69D50;">QSizePolicy</span><span style="color:#ADBAC7;">::Expanding</span></span>
<span class="line"><span style="color:#ADBAC7;">                    );</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">switch</span><span style="color:#ADBAC7;"> (i) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">case</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#768390;">            /* 将pushButton[0]添加至网格的坐标(0,0),下同 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            gridLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(pushButton[i], </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">case</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">            gridLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(pushButton[i], </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">case</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">            gridLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(pushButton[i], </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">case</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">            gridLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(pushButton[i], </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">default</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 设置第0行与第1行的行比例系数 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    gridLayout-&gt;</span><span style="color:#DCBDFB;">setRowStretch</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    gridLayout-&gt;</span><span style="color:#DCBDFB;">setRowStretch</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置第0列与第1列的列比例系数 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    gridLayout-&gt;</span><span style="color:#DCBDFB;">setColumnStretch</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    gridLayout-&gt;</span><span style="color:#DCBDFB;">setColumnStretch</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将gridLayout设置到gWidget */</span></span>
<span class="line"><span style="color:#ADBAC7;">    gWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(gridLayout);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    gWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置gWidget居中央 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(gWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    gridLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QGridLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* QList链表，字符串类型 */</span></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> list;</span></span>
<span class="line"><span style="color:#24292E;">    list</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮1&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮2&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮3&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮4&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">4</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        pushButton[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        pushButton[i]-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(list[i]);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 设置最小宽度与高度 */</span></span>
<span class="line"><span style="color:#24292E;">        pushButton[i]-&gt;</span><span style="color:#6F42C1;">setMinimumSize</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 自动调整按钮的大小 */</span></span>
<span class="line"><span style="color:#24292E;">        pushButton[i]-&gt;</span><span style="color:#6F42C1;">setSizePolicy</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6F42C1;">QSizePolicy</span><span style="color:#24292E;">::Expanding,</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#6F42C1;">QSizePolicy</span><span style="color:#24292E;">::Expanding</span></span>
<span class="line"><span style="color:#24292E;">                    );</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">switch</span><span style="color:#24292E;"> (i) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#6A737D;">            /* 将pushButton[0]添加至网格的坐标(0,0),下同 */</span></span>
<span class="line"><span style="color:#24292E;">            gridLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(pushButton[i], </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">            gridLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(pushButton[i], </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">            gridLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(pushButton[i], </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">            gridLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(pushButton[i], </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">default</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置第0行与第1行的行比例系数 */</span></span>
<span class="line"><span style="color:#24292E;">    gridLayout-&gt;</span><span style="color:#6F42C1;">setRowStretch</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    gridLayout-&gt;</span><span style="color:#6F42C1;">setRowStretch</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置第0列与第1列的列比例系数 */</span></span>
<span class="line"><span style="color:#24292E;">    gridLayout-&gt;</span><span style="color:#6F42C1;">setColumnStretch</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    gridLayout-&gt;</span><span style="color:#6F42C1;">setColumnStretch</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将gridLayout设置到gWidget */</span></span>
<span class="line"><span style="color:#24292E;">    gWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(gridLayout);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_7-3-qformlayout" tabindex="-1">7.3 QFormLayout <a class="header-anchor" href="#_7-3-qformlayout" aria-label="Permalink to &quot;7.3 QFormLayout&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QFormLayout 继承 QLayout。 QFormLayout 类管理输入小部件及其关联标签的表单。 QFormLayout 是一个方便的布局类，它以两列的形式布局其子类。左列由标签组成，右列由“字段”小部件(QLineEdit(行编辑器)、 QSpinBox(旋转框等))组成。通常使用 setRowWrapPolicy(RowWrapPolicy policy)接口函数设置布局的换行策略进行布局等。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QFormLayout 继承 QLayout。 QFormLayout 类管理输入小部件及其关联标签的表单。 QFormLayout 是一个方便的布局类，它以两列的形式布局其子类。左列由标签组成，右列由“字段”小部件(QLineEdit(行编辑器)、 QSpinBox(旋转框等))组成。通常使用 setRowWrapPolicy(RowWrapPolicy policy)接口函数设置布局的换行策略进行布局等。</span></span></code></pre></div><h3 id="案例-表单布局" tabindex="-1">案例：表单布局 <a class="header-anchor" href="#案例-表单布局" aria-label="Permalink to &quot;案例：表单布局&quot;">​</a></h3><p>例 31_qformlayout，表单布局（难度：简单），将使用 addRow(const QString &amp;labelText,QWidget *field)来创建一个带有给定文本的 QLabel 及 QWidget 小部件，并且它们是伙伴关系。简单的展示表单布局的使用。</p><p>QFomLayout 布局比较适用于行与列比较少的布局格局。如果是多行多列的布局，应该使用 QGirdLayout 布局。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化及设置位置与大小，下同 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    fWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    fWidget-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">250</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    userLineEdit </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLineEdit</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    passwordLineEdit </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLineEdit</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    formLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QFormLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 添加行 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    formLayout-&gt;</span><span style="color:#DCBDFB;">addRow</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;用户名：&quot;</span><span style="color:#ADBAC7;">, userLineEdit);</span></span>
<span class="line"><span style="color:#ADBAC7;">    formLayout-&gt;</span><span style="color:#DCBDFB;">addRow</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;密码    ：&quot;</span><span style="color:#ADBAC7;">, passwordLineEdit);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置水平垂直间距 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    formLayout-&gt;</span><span style="color:#DCBDFB;">setSpacing</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置布局外框的宽度 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    formLayout-&gt;</span><span style="color:#DCBDFB;">setMargin</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将formLayout布局到fWidget */</span></span>
<span class="line"><span style="color:#ADBAC7;">    fWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(formLayout);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化及设置位置与大小，下同 */</span></span>
<span class="line"><span style="color:#24292E;">    fWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    fWidget-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">250</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    userLineEdit </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLineEdit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    passwordLineEdit </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLineEdit</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    formLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QFormLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 添加行 */</span></span>
<span class="line"><span style="color:#24292E;">    formLayout-&gt;</span><span style="color:#6F42C1;">addRow</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;用户名：&quot;</span><span style="color:#24292E;">, userLineEdit);</span></span>
<span class="line"><span style="color:#24292E;">    formLayout-&gt;</span><span style="color:#6F42C1;">addRow</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;密码    ：&quot;</span><span style="color:#24292E;">, passwordLineEdit);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置水平垂直间距 */</span></span>
<span class="line"><span style="color:#24292E;">    formLayout-&gt;</span><span style="color:#6F42C1;">setSpacing</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置布局外框的宽度 */</span></span>
<span class="line"><span style="color:#24292E;">    formLayout-&gt;</span><span style="color:#6F42C1;">setMargin</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将formLayout布局到fWidget */</span></span>
<span class="line"><span style="color:#24292E;">    fWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(formLayout);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_7-4-空间间隔-qspaceritem" tabindex="-1">7.4 空间间隔 QSpacerItem <a class="header-anchor" href="#_7-4-空间间隔-qspaceritem" aria-label="Permalink to &quot;7.4 空间间隔 QSpacerItem&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QSpacerItem 继承 QLayoutItem。 QSpacerItem 类在布局中提供空白(空间间隔)。所以 QSpacerItem 是在布局中使用的。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QSpacerItem 继承 QLayoutItem。 QSpacerItem 类在布局中提供空白(空间间隔)。所以 QSpacerItem 是在布局中使用的。</span></span></code></pre></div><h3 id="案例" tabindex="-1">案例 <a class="header-anchor" href="#案例" aria-label="Permalink to &quot;案例&quot;">​</a></h3><p>例 32_qspaceritem，空间间隔（难度：一般），使用 4 个按钮，在垂直布局添加垂直间隔与按钮 1，在水平布局添加按钮 2~4 与水平间隔。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体显示位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    widget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 居中widget */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(widget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vSpacer  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QSpacerItem</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                                </span><span style="color:#F69D50;">QSizePolicy</span><span style="color:#ADBAC7;">::Minimum,</span></span>
<span class="line"><span style="color:#ADBAC7;">                                </span><span style="color:#F69D50;">QSizePolicy</span><span style="color:#ADBAC7;">::Expanding</span></span>
<span class="line"><span style="color:#ADBAC7;">                                );</span></span>
<span class="line"><span style="color:#ADBAC7;">    hSpacer  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QSpacerItem</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                                </span><span style="color:#F69D50;">QSizePolicy</span><span style="color:#ADBAC7;">::Expanding,</span></span>
<span class="line"><span style="color:#ADBAC7;">                                </span><span style="color:#F69D50;">QSizePolicy</span><span style="color:#ADBAC7;">::Minimum</span></span>
<span class="line"><span style="color:#ADBAC7;">                                );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QVBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    mainLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 在vBoxLayout添加垂直间隔 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addSpacerItem</span><span style="color:#ADBAC7;">(vSpacer);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QList </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QString</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"><span style="color:#768390;">    /* 将字符串值插入list */</span></span>
<span class="line"><span style="color:#ADBAC7;">    list</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮1&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮2&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮3&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;按钮4&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#768390;">    /* 用一个循环实例化4个按钮 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> ; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        bt[i] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        bt[i]-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(list[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (i </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#768390;">            /* 按钮1,设置为100*100 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            bt[i]-&gt;</span><span style="color:#DCBDFB;">setFixedSize</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">            /* 在vBoxLayout添加按钮1 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(bt[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">        } </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#768390;">            /* 按钮2～4,设置为60*60 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            bt[i]-&gt;</span><span style="color:#DCBDFB;">setFixedSize</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">60</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">60</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">            /* 在hBoxLayout添加按钮2～4 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(bt[i]);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 在hBoxLayout添加水平间隔 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addSpacerItem</span><span style="color:#ADBAC7;">(hSpacer);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 在主布局里添加垂直布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mainLayout-&gt;</span><span style="color:#DCBDFB;">addLayout</span><span style="color:#ADBAC7;">(vBoxLayout);</span></span>
<span class="line"><span style="color:#768390;">    /* 在主布局里添加水平布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mainLayout-&gt;</span><span style="color:#DCBDFB;">addLayout</span><span style="color:#ADBAC7;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置部件间距 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mainLayout-&gt;</span><span style="color:#DCBDFB;">setSpacing</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 将主布局设置为widget的布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    widget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(mainLayout);</span></span>
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
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体显示位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    widget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 居中widget */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(widget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化对象 */</span></span>
<span class="line"><span style="color:#24292E;">    vSpacer  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QSpacerItem</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                                </span><span style="color:#6F42C1;">QSizePolicy</span><span style="color:#24292E;">::Minimum,</span></span>
<span class="line"><span style="color:#24292E;">                                </span><span style="color:#6F42C1;">QSizePolicy</span><span style="color:#24292E;">::Expanding</span></span>
<span class="line"><span style="color:#24292E;">                                );</span></span>
<span class="line"><span style="color:#24292E;">    hSpacer  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QSpacerItem</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                                </span><span style="color:#6F42C1;">QSizePolicy</span><span style="color:#24292E;">::Expanding,</span></span>
<span class="line"><span style="color:#24292E;">                                </span><span style="color:#6F42C1;">QSizePolicy</span><span style="color:#24292E;">::Minimum</span></span>
<span class="line"><span style="color:#24292E;">                                );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QVBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    mainLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 在vBoxLayout添加垂直间隔 */</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout-&gt;</span><span style="color:#6F42C1;">addSpacerItem</span><span style="color:#24292E;">(vSpacer);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QList </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QString</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">list;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将字符串值插入list */</span></span>
<span class="line"><span style="color:#24292E;">    list</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮1&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮2&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮3&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;按钮4&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 用一个循环实例化4个按钮 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">4</span><span style="color:#24292E;"> ; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        bt[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        bt[i]-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(list[i]);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (i </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#6A737D;">            /* 按钮1,设置为100*100 */</span></span>
<span class="line"><span style="color:#24292E;">            bt[i]-&gt;</span><span style="color:#6F42C1;">setFixedSize</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">            /* 在vBoxLayout添加按钮1 */</span></span>
<span class="line"><span style="color:#24292E;">            vBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(bt[i]);</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#6A737D;">            /* 按钮2～4,设置为60*60 */</span></span>
<span class="line"><span style="color:#24292E;">            bt[i]-&gt;</span><span style="color:#6F42C1;">setFixedSize</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">60</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">60</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">            /* 在hBoxLayout添加按钮2～4 */</span></span>
<span class="line"><span style="color:#24292E;">            hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(bt[i]);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 在hBoxLayout添加水平间隔 */</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addSpacerItem</span><span style="color:#24292E;">(hSpacer);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 在主布局里添加垂直布局 */</span></span>
<span class="line"><span style="color:#24292E;">    mainLayout-&gt;</span><span style="color:#6F42C1;">addLayout</span><span style="color:#24292E;">(vBoxLayout);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 在主布局里添加水平布局 */</span></span>
<span class="line"><span style="color:#24292E;">    mainLayout-&gt;</span><span style="color:#6F42C1;">addLayout</span><span style="color:#24292E;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置部件间距 */</span></span>
<span class="line"><span style="color:#24292E;">    mainLayout-&gt;</span><span style="color:#6F42C1;">setSpacing</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将主布局设置为widget的布局 */</span></span>
<span class="line"><span style="color:#24292E;">    widget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(mainLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,24);function g(s,h,L,m,Q,w){const o=t,e=D("ClientOnly");return l(),r("div",null,[u,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),E])}const x=c(d,[["render",g]]);export{b as __pageData,x as default};
