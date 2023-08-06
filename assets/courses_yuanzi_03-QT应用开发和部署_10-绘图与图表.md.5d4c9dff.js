import{_ as t}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as c,v as l,b as r,E as y,O as i,F as p,L as A,R as D,M as C,C as B,B as F}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const q=JSON.parse('{"title":"绘图与图表","description":"","frontmatter":{"title":"绘图与图表","author":"阿源","date":"2023/08/10 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/03-QT应用开发和部署/10-绘图与图表.md","filePath":"courses/yuanzi/03-QT应用开发和部署/10-绘图与图表.md","lastUpdated":1691327334000}'),E={name:"courses/yuanzi/03-QT应用开发和部署/10-绘图与图表.md"},d=p("h1",{id:"正点原子qt之绘图与图表",tabindex:"-1"},[A("正点原子QT之绘图与图表 "),p("a",{class:"header-anchor",href:"#正点原子qt之绘图与图表","aria-label":'Permalink to "正点原子QT之绘图与图表"'},"​")],-1),g=D(`<h2 id="_12-绘图与图表" tabindex="-1">12. 绘图与图表 <a class="header-anchor" href="#_12-绘图与图表" aria-label="Permalink to &quot;12. 绘图与图表&quot;">​</a></h2><h3 id="_12-1-qpainter-绘图" tabindex="-1">12.1 QPainter 绘图 <a class="header-anchor" href="#_12-1-qpainter-绘图" aria-label="Permalink to &quot;12.1 QPainter 绘图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">Qt 里的所有绘图，比如一个按钮和一个 Label 的显示， 都有绘图系统来执行。绘图系统基于 QPainter、和 QPaintDevice 和 QPainEngine 类。 QPainter 是可以直接用来操作绘图的类，而QPaintDevice 和 QPainEngine 都比 QPainter 更底层，我们只需要了解一下 QPaintDevice 和QPainEngine 就行了。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Qt 里的所有绘图，比如一个按钮和一个 Label 的显示， 都有绘图系统来执行。绘图系统基于 QPainter、和 QPaintDevice 和 QPainEngine 类。 QPainter 是可以直接用来操作绘图的类，而QPaintDevice 和 QPainEngine 都比 QPainter 更底层，我们只需要了解一下 QPaintDevice 和QPainEngine 就行了。</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">paintEvent()事件可以被重写。（解释：什么是绘图事件？可以这么理解，当界面初始化或者需要刷新时才会执行的事件，也就是说绘图事件在构造对象实例化时会执行，需要刷新界面我们可以使用 update()方法执行 paintEvent()事件）。</span></span>
<span class="line"><span style="color:#adbac7;">paintEvent()事件是父类 QWidget 提供给子类的接口，在父类里定义为空， 所以可以说paintEvent()事件就是专门给子类画图用的。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">paintEvent()事件可以被重写。（解释：什么是绘图事件？可以这么理解，当界面初始化或者需要刷新时才会执行的事件，也就是说绘图事件在构造对象实例化时会执行，需要刷新界面我们可以使用 update()方法执行 paintEvent()事件）。</span></span>
<span class="line"><span style="color:#24292e;">paintEvent()事件是父类 QWidget 提供给子类的接口，在父类里定义为空， 所以可以说paintEvent()事件就是专门给子类画图用的。</span></span></code></pre></div><h3 id="案例-旋转的-cd" tabindex="-1">案例：旋转的 CD <a class="header-anchor" href="#案例-旋转的-cd" aria-label="Permalink to &quot;案例：旋转的 CD&quot;">​</a></h3><p>例 03_qpainter， 旋转的 CD（难度：一般）。项目路径为 Qt/2/03_qpainter。 本例使用一张CD 图片，用 QPainter 在 paintEvent()将 CD 画在窗口的中心，并且每 100ms 旋转 1 度角度。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QPainter&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QPaintEvent&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QTimer&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QMainWindow</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QWidget</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">parent</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">nullptr</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~MainWindow</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 重写父类下的protected方法*/</span></span>
<span class="line"><span style="color:#F47067;">protected:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">paintEvent</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QPaintEvent</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#768390;">    /* 定时器，用于定时更新界面 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QTimer </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">timer;</span></span>
<span class="line"><span style="color:#768390;">    /* 角度 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> angle;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">private slots:</span></span>
<span class="line"><span style="color:#768390;">    /* 槽函数 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // MAINWINDOW_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QPainter&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QPaintEvent&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QTimer&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QMainWindow</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">parent</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nullptr</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~MainWindow</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 重写父类下的protected方法*/</span></span>
<span class="line"><span style="color:#D73A49;">protected:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">paintEvent</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QPaintEvent</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 定时器，用于定时更新界面 */</span></span>
<span class="line"><span style="color:#24292E;">    QTimer </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">timer;</span></span>
<span class="line"><span style="color:#6A737D;">    /* 角度 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> angle;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">private slots:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 槽函数 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // MAINWINDOW_H</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;QDebug&quot;</span></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗口位置及颜色 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setPalette</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QPalette</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::gray));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setAutoFillBackground</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 定时器实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    timer </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTimer</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 默认角度为0 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    angle </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 定时100ms */</span></span>
<span class="line"><span style="color:#ADBAC7;">    timer-&gt;</span><span style="color:#DCBDFB;">start</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(timer, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timeout</span><span style="color:#ADBAC7;">()), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 需要更新界面，不设置不更新 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">update</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">paintEvent</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QPaintEvent</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 指定父对象，this指本窗口 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPainter </span><span style="color:#DCBDFB;">painter</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置抗锯齿，流畅转换 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    painter.</span><span style="color:#DCBDFB;">setRenderHints</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QPainter</span><span style="color:#ADBAC7;">::Antialiasing</span></span>
<span class="line"><span style="color:#ADBAC7;">                           </span><span style="color:#F47067;">|</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QPainter</span><span style="color:#ADBAC7;">::SmoothPixmapTransform);</span></span>
<span class="line"><span style="color:#768390;">    /* 计算旋转角度 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (angle</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">360</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        angle </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* QPixmap类型对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPixmap image;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 加载 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    image.</span><span style="color:#DCBDFB;">load</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;:/image/cd.png&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* QRectF即，继承QRect（Qt的矩形类），F代表精确到浮点类型 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QRectF </span><span style="color:#DCBDFB;">rect</span><span style="color:#ADBAC7;">((</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">width</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> image.</span><span style="color:#DCBDFB;">width</span><span style="color:#ADBAC7;">()) </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                (</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> image.</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">()) </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                image.</span><span style="color:#DCBDFB;">width</span><span style="color:#ADBAC7;">(),</span></span>
<span class="line"><span style="color:#ADBAC7;">                image.</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 默认参考点为左上角原点（0,0），因为旋转需要以图形的中心为参考点，</span></span>
<span class="line"><span style="color:#768390;">     * 我们使用translate把参考点设置为CD图形的中心点坐标 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    painter.</span><span style="color:#DCBDFB;">translate</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> rect.</span><span style="color:#DCBDFB;">x</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> rect.</span><span style="color:#DCBDFB;">width</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> rect.</span><span style="color:#DCBDFB;">y</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> rect.</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 旋转角度 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    painter.</span><span style="color:#DCBDFB;">rotate</span><span style="color:#ADBAC7;">(angle);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 现在参考点为CD图形的中心，我们需要把它设置回原点的位置，</span></span>
<span class="line"><span style="color:#768390;">     * 所以需要减去上面加上的数 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    painter.</span><span style="color:#DCBDFB;">translate</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> (rect.</span><span style="color:#DCBDFB;">x</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> rect.</span><span style="color:#DCBDFB;">width</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> (rect.</span><span style="color:#DCBDFB;">y</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> rect.</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 画图,QPainter提供了许多drawX的方法 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    painter.</span><span style="color:#DCBDFB;">drawImage</span><span style="color:#ADBAC7;">(rect, image.</span><span style="color:#DCBDFB;">toImage</span><span style="color:#ADBAC7;">(), image.</span><span style="color:#DCBDFB;">rect</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 再画一个矩形 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    painter.</span><span style="color:#DCBDFB;">drawRect</span><span style="color:#ADBAC7;">(rect.</span><span style="color:#DCBDFB;">toRect</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;QDebug&quot;</span></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗口位置及颜色 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setPalette</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QPalette</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::gray));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setAutoFillBackground</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 定时器实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    timer </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTimer</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 默认角度为0 */</span></span>
<span class="line"><span style="color:#24292E;">    angle </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 定时100ms */</span></span>
<span class="line"><span style="color:#24292E;">    timer-&gt;</span><span style="color:#6F42C1;">start</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(timer, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timeout</span><span style="color:#24292E;">()), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 需要更新界面，不设置不更新 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">update</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">paintEvent</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QPaintEvent</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 指定父对象，this指本窗口 */</span></span>
<span class="line"><span style="color:#24292E;">    QPainter </span><span style="color:#6F42C1;">painter</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置抗锯齿，流畅转换 */</span></span>
<span class="line"><span style="color:#24292E;">    painter.</span><span style="color:#6F42C1;">setRenderHints</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QPainter</span><span style="color:#24292E;">::Antialiasing</span></span>
<span class="line"><span style="color:#24292E;">                           </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPainter</span><span style="color:#24292E;">::SmoothPixmapTransform);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 计算旋转角度 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (angle</span><span style="color:#D73A49;">++</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">360</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        angle </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* QPixmap类型对象 */</span></span>
<span class="line"><span style="color:#24292E;">    QPixmap image;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 加载 */</span></span>
<span class="line"><span style="color:#24292E;">    image.</span><span style="color:#6F42C1;">load</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;:/image/cd.png&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* QRectF即，继承QRect（Qt的矩形类），F代表精确到浮点类型 */</span></span>
<span class="line"><span style="color:#24292E;">    QRectF </span><span style="color:#6F42C1;">rect</span><span style="color:#24292E;">((</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">width</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> image.</span><span style="color:#6F42C1;">width</span><span style="color:#24292E;">()) </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                (</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> image.</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">()) </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                image.</span><span style="color:#6F42C1;">width</span><span style="color:#24292E;">(),</span></span>
<span class="line"><span style="color:#24292E;">                image.</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 默认参考点为左上角原点（0,0），因为旋转需要以图形的中心为参考点，</span></span>
<span class="line"><span style="color:#6A737D;">     * 我们使用translate把参考点设置为CD图形的中心点坐标 */</span></span>
<span class="line"><span style="color:#24292E;">    painter.</span><span style="color:#6F42C1;">translate</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> rect.</span><span style="color:#6F42C1;">x</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> rect.</span><span style="color:#6F42C1;">width</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                      </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> rect.</span><span style="color:#6F42C1;">y</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> rect.</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 旋转角度 */</span></span>
<span class="line"><span style="color:#24292E;">    painter.</span><span style="color:#6F42C1;">rotate</span><span style="color:#24292E;">(angle);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 现在参考点为CD图形的中心，我们需要把它设置回原点的位置，</span></span>
<span class="line"><span style="color:#6A737D;">     * 所以需要减去上面加上的数 */</span></span>
<span class="line"><span style="color:#24292E;">    painter.</span><span style="color:#6F42C1;">translate</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> (rect.</span><span style="color:#6F42C1;">x</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> rect.</span><span style="color:#6F42C1;">width</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">                      </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> (rect.</span><span style="color:#6F42C1;">y</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> rect.</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 画图,QPainter提供了许多drawX的方法 */</span></span>
<span class="line"><span style="color:#24292E;">    painter.</span><span style="color:#6F42C1;">drawImage</span><span style="color:#24292E;">(rect, image.</span><span style="color:#6F42C1;">toImage</span><span style="color:#24292E;">(), image.</span><span style="color:#6F42C1;">rect</span><span style="color:#24292E;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 再画一个矩形 */</span></span>
<span class="line"><span style="color:#24292E;">    painter.</span><span style="color:#6F42C1;">drawRect</span><span style="color:#24292E;">(rect.</span><span style="color:#6F42C1;">toRect</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_12-2-qchart-图表" tabindex="-1">12.2 QChart 图表 <a class="header-anchor" href="#_12-2-qchart-图表" aria-label="Permalink to &quot;12.2 QChart 图表&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">Qt5.7 之前， Qt 在开源社区版本里没有 Qt Charts（自带的绘图组件库）。这使得像 QWT、 QCustomPlot 等第三方库有了巨大的生存空间，作者也在 Qt 5.7 以下版本使用过第三方的 QCustomPlot。</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">QT += charts</span></span>
<span class="line"><span style="color:#adbac7;">using namespace QtCharts;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Qt5.7 之前， Qt 在开源社区版本里没有 Qt Charts（自带的绘图组件库）。这使得像 QWT、 QCustomPlot 等第三方库有了巨大的生存空间，作者也在 Qt 5.7 以下版本使用过第三方的 QCustomPlot。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">QT += charts</span></span>
<span class="line"><span style="color:#24292e;">using namespace QtCharts;</span></span></code></pre></div><h3 id="案例-实时动态曲线" tabindex="-1">案例：实时动态曲线 <a class="header-anchor" href="#案例-实时动态曲线" aria-label="Permalink to &quot;案例：实时动态曲线&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDateTime&gt;</span></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置最显示位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 最大储存maxSize - 1个数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    maxSize </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">51</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#768390;">    /* x轴上的最大值 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    maxX </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5000</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#768390;">    /* y轴最大值 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    maxY </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* splineSeries曲线实例化（折线用QLineSeries） */</span></span>
<span class="line"><span style="color:#ADBAC7;">    splineSeries </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QSplineSeries</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 图表实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chart </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QChart</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 图表视图实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chartView </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QChartView</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 坐标轴 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisY </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QValueAxis</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisX </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QValueAxis</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* 定时器 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    timer </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTimer</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* legend译图例类型，以绘图的颜色区分，本例设置为隐藏 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chart-&gt;</span><span style="color:#DCBDFB;">legend</span><span style="color:#ADBAC7;">()-&gt;</span><span style="color:#DCBDFB;">hide</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#768390;">    /* chart设置标题 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chart-&gt;</span><span style="color:#DCBDFB;">setTitle</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;实时动态曲线示例&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 添加一条曲线splineSeries */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chart-&gt;</span><span style="color:#DCBDFB;">addSeries</span><span style="color:#ADBAC7;">(splineSeries);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置显示格式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisY-&gt;</span><span style="color:#DCBDFB;">setLabelFormat</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%i</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* y轴标题 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisY-&gt;</span><span style="color:#DCBDFB;">setTitleText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;温度/℃&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* y轴标题位置（设置坐标轴的方向） */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chart-&gt;</span><span style="color:#DCBDFB;">addAxis</span><span style="color:#ADBAC7;">(axisY, </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::AlignLeft);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置y轴范围 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisY-&gt;</span><span style="color:#DCBDFB;">setRange</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, maxY);</span></span>
<span class="line"><span style="color:#768390;">    /* 将splineSeries附加于y轴上 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    splineSeries-&gt;</span><span style="color:#DCBDFB;">attachAxis</span><span style="color:#ADBAC7;">(axisY);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置显示格式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisX-&gt;</span><span style="color:#DCBDFB;">setLabelFormat</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%i</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* x轴标题 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisX-&gt;</span><span style="color:#DCBDFB;">setTitleText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;时间/ms&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* x轴标题位置（设置坐标轴的方向） */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chart-&gt;</span><span style="color:#DCBDFB;">addAxis</span><span style="color:#ADBAC7;">(axisX, </span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::AlignBottom);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置x轴范围 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    axisX-&gt;</span><span style="color:#DCBDFB;">setRange</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, maxX);</span></span>
<span class="line"><span style="color:#768390;">    /* 将splineSeries附加于x轴上 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    splineSeries-&gt;</span><span style="color:#DCBDFB;">attachAxis</span><span style="color:#ADBAC7;">(axisX);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将图表的内容设置在图表视图上 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chartView-&gt;</span><span style="color:#DCBDFB;">setChart</span><span style="color:#ADBAC7;">(chart);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置抗锯齿 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    chartView-&gt;</span><span style="color:#DCBDFB;">setRenderHint</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QPainter</span><span style="color:#ADBAC7;">::Antialiasing);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置为图表视图为中心部件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(chartView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 定时200ms */</span></span>
<span class="line"><span style="color:#ADBAC7;">    timer-&gt;</span><span style="color:#DCBDFB;">start</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(timer, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timeout</span><span style="color:#ADBAC7;">()), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置随机种子，随机数初始化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">qsrand</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">time</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">timerTimeOut</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 产生随机0~maxY之间的数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">receivedData</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">qrand</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">%</span><span style="color:#ADBAC7;"> maxY );</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">receivedData</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">value</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 将数据添加到data中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    data.</span><span style="color:#DCBDFB;">append</span><span style="color:#ADBAC7;">(value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 当储存数据的个数大于最大值时，把第一个数据删除 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (data.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> maxSize) {</span></span>
<span class="line"><span style="color:#768390;">        /* 移除data中第一个数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        data.</span><span style="color:#DCBDFB;">removeFirst</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 先清空 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    splineSeries-&gt;</span><span style="color:#DCBDFB;">clear</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 计算x轴上的点与点之间显示的间距 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> xSpace </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> maxX </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> (maxSize </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 添加点，xSpace * i 表示第i个点的x轴的位置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> data.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(); </span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">i) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        splineSeries-&gt;</span><span style="color:#DCBDFB;">append</span><span style="color:#ADBAC7;">(xSpace </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> i, data.</span><span style="color:#DCBDFB;">at</span><span style="color:#ADBAC7;">(i));</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDateTime&gt;</span></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置最显示位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 最大储存maxSize - 1个数据 */</span></span>
<span class="line"><span style="color:#24292E;">    maxSize </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">51</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /* x轴上的最大值 */</span></span>
<span class="line"><span style="color:#24292E;">    maxX </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5000</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /* y轴最大值 */</span></span>
<span class="line"><span style="color:#24292E;">    maxY </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">40</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* splineSeries曲线实例化（折线用QLineSeries） */</span></span>
<span class="line"><span style="color:#24292E;">    splineSeries </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QSplineSeries</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 图表实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    chart </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QChart</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 图表视图实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    chartView </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QChartView</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 坐标轴 */</span></span>
<span class="line"><span style="color:#24292E;">    axisY </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QValueAxis</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    axisX </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QValueAxis</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* 定时器 */</span></span>
<span class="line"><span style="color:#24292E;">    timer </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTimer</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* legend译图例类型，以绘图的颜色区分，本例设置为隐藏 */</span></span>
<span class="line"><span style="color:#24292E;">    chart-&gt;</span><span style="color:#6F42C1;">legend</span><span style="color:#24292E;">()-&gt;</span><span style="color:#6F42C1;">hide</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#6A737D;">    /* chart设置标题 */</span></span>
<span class="line"><span style="color:#24292E;">    chart-&gt;</span><span style="color:#6F42C1;">setTitle</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;实时动态曲线示例&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 添加一条曲线splineSeries */</span></span>
<span class="line"><span style="color:#24292E;">    chart-&gt;</span><span style="color:#6F42C1;">addSeries</span><span style="color:#24292E;">(splineSeries);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置显示格式 */</span></span>
<span class="line"><span style="color:#24292E;">    axisY-&gt;</span><span style="color:#6F42C1;">setLabelFormat</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%i</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* y轴标题 */</span></span>
<span class="line"><span style="color:#24292E;">    axisY-&gt;</span><span style="color:#6F42C1;">setTitleText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;温度/℃&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* y轴标题位置（设置坐标轴的方向） */</span></span>
<span class="line"><span style="color:#24292E;">    chart-&gt;</span><span style="color:#6F42C1;">addAxis</span><span style="color:#24292E;">(axisY, </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::AlignLeft);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置y轴范围 */</span></span>
<span class="line"><span style="color:#24292E;">    axisY-&gt;</span><span style="color:#6F42C1;">setRange</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, maxY);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将splineSeries附加于y轴上 */</span></span>
<span class="line"><span style="color:#24292E;">    splineSeries-&gt;</span><span style="color:#6F42C1;">attachAxis</span><span style="color:#24292E;">(axisY);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置显示格式 */</span></span>
<span class="line"><span style="color:#24292E;">    axisX-&gt;</span><span style="color:#6F42C1;">setLabelFormat</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%i</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* x轴标题 */</span></span>
<span class="line"><span style="color:#24292E;">    axisX-&gt;</span><span style="color:#6F42C1;">setTitleText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;时间/ms&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* x轴标题位置（设置坐标轴的方向） */</span></span>
<span class="line"><span style="color:#24292E;">    chart-&gt;</span><span style="color:#6F42C1;">addAxis</span><span style="color:#24292E;">(axisX, </span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::AlignBottom);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置x轴范围 */</span></span>
<span class="line"><span style="color:#24292E;">    axisX-&gt;</span><span style="color:#6F42C1;">setRange</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, maxX);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将splineSeries附加于x轴上 */</span></span>
<span class="line"><span style="color:#24292E;">    splineSeries-&gt;</span><span style="color:#6F42C1;">attachAxis</span><span style="color:#24292E;">(axisX);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将图表的内容设置在图表视图上 */</span></span>
<span class="line"><span style="color:#24292E;">    chartView-&gt;</span><span style="color:#6F42C1;">setChart</span><span style="color:#24292E;">(chart);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置抗锯齿 */</span></span>
<span class="line"><span style="color:#24292E;">    chartView-&gt;</span><span style="color:#6F42C1;">setRenderHint</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QPainter</span><span style="color:#24292E;">::Antialiasing);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置为图表视图为中心部件 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(chartView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 定时200ms */</span></span>
<span class="line"><span style="color:#24292E;">    timer-&gt;</span><span style="color:#6F42C1;">start</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(timer, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timeout</span><span style="color:#24292E;">()), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置随机种子，随机数初始化 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">qsrand</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">time</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">timerTimeOut</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 产生随机0~maxY之间的数据 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">receivedData</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">qrand</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">%</span><span style="color:#24292E;"> maxY );</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">receivedData</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">value</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将数据添加到data中 */</span></span>
<span class="line"><span style="color:#24292E;">    data.</span><span style="color:#6F42C1;">append</span><span style="color:#24292E;">(value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 当储存数据的个数大于最大值时，把第一个数据删除 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (data.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> maxSize) {</span></span>
<span class="line"><span style="color:#6A737D;">        /* 移除data中第一个数据 */</span></span>
<span class="line"><span style="color:#24292E;">        data.</span><span style="color:#6F42C1;">removeFirst</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 先清空 */</span></span>
<span class="line"><span style="color:#24292E;">    splineSeries-&gt;</span><span style="color:#6F42C1;">clear</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 计算x轴上的点与点之间显示的间距 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> xSpace </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> maxX </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> (maxSize </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 添加点，xSpace * i 表示第i个点的x轴的位置 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> data.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(); </span><span style="color:#D73A49;">++</span><span style="color:#24292E;">i) {</span></span>
<span class="line"><span style="color:#24292E;">        splineSeries-&gt;</span><span style="color:#6F42C1;">append</span><span style="color:#24292E;">(xSpace </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> i, data.</span><span style="color:#6F42C1;">at</span><span style="color:#24292E;">(i));</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,12);function h(s,m,u,Q,x,v){const o=t,e=C("ClientOnly");return l(),r("div",null,[d,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),g])}const b=c(E,[["render",h]]);export{q as __pageData,b as default};
