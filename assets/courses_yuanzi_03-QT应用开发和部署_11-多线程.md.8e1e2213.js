import{_ as c}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as t,v as l,b as r,E as y,O as i,F as p,L as A,R as D,M as C,C as B,B as F}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const v=JSON.parse('{"title":"多线程","description":"","frontmatter":{"title":"多线程","author":"阿源","date":"2023/08/11 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/03-QT应用开发和部署/11-多线程.md","filePath":"courses/yuanzi/03-QT应用开发和部署/11-多线程.md","lastUpdated":1691327334000}'),E={name:"courses/yuanzi/03-QT应用开发和部署/11-多线程.md"},d=p("h1",{id:"正点原子qt之多线程",tabindex:"-1"},[A("正点原子QT之多线程 "),p("a",{class:"header-anchor",href:"#正点原子qt之多线程","aria-label":'Permalink to "正点原子QT之多线程"'},"​")],-1),u=D(`<h2 id="_13-多线程" tabindex="-1">13. 多线程 <a class="header-anchor" href="#_13-多线程" aria-label="Permalink to &quot;13. 多线程&quot;">​</a></h2><h3 id="_13-1-继承-qthread-的线程" tabindex="-1">13.1 继承 QThread 的线程 <a class="header-anchor" href="#_13-1-继承-qthread-的线程" aria-label="Permalink to &quot;13.1 继承 QThread 的线程&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">继承 QThread 是创建线程的一个普通方法。 其中创建的线程只有 run()方法在线程里的。其他类内定义的方法都在主线程内。</span></span>
<span class="line"><span style="color:#adbac7;">主线程内有很多方法在主线程内， 但是子线程，只有 run()方法是在子线程里的。 run()方法是继承于 QThread 类的方法，用户需要重写这个方法，一般是把耗时的操作写在这个 run()方法里面。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">继承 QThread 是创建线程的一个普通方法。 其中创建的线程只有 run()方法在线程里的。其他类内定义的方法都在主线程内。</span></span>
<span class="line"><span style="color:#24292e;">主线程内有很多方法在主线程内， 但是子线程，只有 run()方法是在子线程里的。 run()方法是继承于 QThread 类的方法，用户需要重写这个方法，一般是把耗时的操作写在这个 run()方法里面。</span></span></code></pre></div><h3 id="案例" tabindex="-1">案例： <a class="header-anchor" href="#案例" aria-label="Permalink to &quot;案例：&quot;">​</a></h3><p>例 05_qthread_example1 ， 继 承 QThread 类 的 线 程 （ 难 度 ： 一 般 ）。 项 目 路 径 为Qt/2/05_qthread_example1。 本例通过 QThread 类继承线程，然后在 MainWindow 类里使用。通过点击一个按钮开启线程。 当线程执行完成时，会发送 resultReady(const QString &amp;s)信号给主线程。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QThread&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDebug&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QPushButton&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 使用下面声明的WorkerThread线程类 */</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">WorkerThread</span><span style="color:#ADBAC7;">;</span></span>
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
<span class="line"><span style="color:#768390;">    /* 在MainWindow类里声明对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    WorkerThread </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">workerThread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 声明一个按钮，使用此按钮点击后开启线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPushButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pushButton;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">private slots:</span></span>
<span class="line"><span style="color:#768390;">    /* 槽函数，用于接收线程发送的信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">handleResults</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">result</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 点击按钮开启线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">pushButtonClicked</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 新建一个WorkerThread类继承于QThread */</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">WorkerThread</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QThread</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 用到信号槽即需要此宏定义 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">WorkerThread</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QWidget</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">parent</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">nullptr</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Q_UNUSED</span><span style="color:#ADBAC7;">(parent);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 重写run方法，继承QThread的类，只有run方法是在新的线程里 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">run</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">override</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">        QString result </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;线程开启成功&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 这里写上比较耗时的操作 */</span></span>
<span class="line"><span style="color:#768390;">        // ...</span></span>
<span class="line"><span style="color:#768390;">        // 延时2s，把延时2s当作耗时操作</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">sleep</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 发送结果准备好的信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        emit </span><span style="color:#DCBDFB;">resultReady</span><span style="color:#ADBAC7;">(result);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">signals:</span></span>
<span class="line"><span style="color:#768390;">    /* 声明一个信号，译结果准确好的信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">resultReady</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">s</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // MAINWINDOW_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QThread&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDebug&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QPushButton&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 使用下面声明的WorkerThread线程类 */</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">WorkerThread</span><span style="color:#24292E;">;</span></span>
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
<span class="line"><span style="color:#6A737D;">    /* 在MainWindow类里声明对象 */</span></span>
<span class="line"><span style="color:#24292E;">    WorkerThread </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">workerThread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 声明一个按钮，使用此按钮点击后开启线程 */</span></span>
<span class="line"><span style="color:#24292E;">    QPushButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pushButton;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">private slots:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 槽函数，用于接收线程发送的信号 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">handleResults</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">result</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 点击按钮开启线程 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">pushButtonClicked</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 新建一个WorkerThread类继承于QThread */</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">WorkerThread</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QThread</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 用到信号槽即需要此宏定义 */</span></span>
<span class="line"><span style="color:#24292E;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">WorkerThread</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">parent</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nullptr</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">Q_UNUSED</span><span style="color:#24292E;">(parent);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 重写run方法，继承QThread的类，只有run方法是在新的线程里 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">run</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">override</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        QString result </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;线程开启成功&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 这里写上比较耗时的操作 */</span></span>
<span class="line"><span style="color:#6A737D;">        // ...</span></span>
<span class="line"><span style="color:#6A737D;">        // 延时2s，把延时2s当作耗时操作</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">sleep</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 发送结果准备好的信号 */</span></span>
<span class="line"><span style="color:#24292E;">        emit </span><span style="color:#6F42C1;">resultReady</span><span style="color:#24292E;">(result);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">signals:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 声明一个信号，译结果准确好的信号 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">resultReady</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">s</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // MAINWINDOW_H</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 对象实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    workerThread </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">WorkerThread</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 按钮设置大小与文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton-&gt;</span><span style="color:#DCBDFB;">resize</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;开启线程&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(workerThread, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">resultReady</span><span style="color:#ADBAC7;">(QString)),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">handleResults</span><span style="color:#ADBAC7;">(QString)));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">pushButtonClicked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 进程退出，注意本例run()方法没写循环，此方法需要有循环才生效 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    workerThread-&gt;</span><span style="color:#DCBDFB;">quit</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 阻塞等待2000ms检查一次进程是否已经退出 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (workerThread-&gt;</span><span style="color:#DCBDFB;">wait</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;线程已经结束！&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">handleResults</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">result</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 打印出线程发送过来的结果 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">result</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushButtonClicked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 检查线程是否在运行，如果没有则开始运行 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">workerThread-&gt;</span><span style="color:#DCBDFB;">isRunning</span><span style="color:#ADBAC7;">())</span></span>
<span class="line"><span style="color:#ADBAC7;">        workerThread-&gt;</span><span style="color:#DCBDFB;">start</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 对象实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    workerThread </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">WorkerThread</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 按钮设置大小与文本 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton-&gt;</span><span style="color:#6F42C1;">resize</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;开启线程&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(workerThread, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">resultReady</span><span style="color:#24292E;">(QString)),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">handleResults</span><span style="color:#24292E;">(QString)));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">pushButtonClicked</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 进程退出，注意本例run()方法没写循环，此方法需要有循环才生效 */</span></span>
<span class="line"><span style="color:#24292E;">    workerThread-&gt;</span><span style="color:#6F42C1;">quit</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 阻塞等待2000ms检查一次进程是否已经退出 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (workerThread-&gt;</span><span style="color:#6F42C1;">wait</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;线程已经结束！&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">handleResults</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">result</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 打印出线程发送过来的结果 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">result</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushButtonClicked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 检查线程是否在运行，如果没有则开始运行 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">workerThread-&gt;</span><span style="color:#6F42C1;">isRunning</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">        workerThread-&gt;</span><span style="color:#6F42C1;">start</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_13-2-继承-qobject-的线程" tabindex="-1">13.2 继承 QObject 的线程 <a class="header-anchor" href="#_13-2-继承-qobject-的线程" aria-label="Permalink to &quot;13.2 继承 QObject 的线程&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">继承 QThread 类是创建线程的一种方法，另一种就是继承QObject 类。继承 QObject 类更加灵活。 它通过 QObject::moveToThread()方法，将一个 QObeject的类转移到一个线程里执行。</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">首先我们写一个类继承 QObject，通过 QObject::moveToThread()方法将它移到一个 QThread 线程里执行。那么可以通过主线程发送信号去调用 QThread 线程的方法如上图的 fun4()， fun5()等等。这些方法都是在 QThread 线程里执行的。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">继承 QThread 类是创建线程的一种方法，另一种就是继承QObject 类。继承 QObject 类更加灵活。 它通过 QObject::moveToThread()方法，将一个 QObeject的类转移到一个线程里执行。</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">首先我们写一个类继承 QObject，通过 QObject::moveToThread()方法将它移到一个 QThread 线程里执行。那么可以通过主线程发送信号去调用 QThread 线程的方法如上图的 fun4()， fun5()等等。这些方法都是在 QThread 线程里执行的。</span></span></code></pre></div><h3 id="案例-1" tabindex="-1">案例： <a class="header-anchor" href="#案例-1" aria-label="Permalink to &quot;案例：&quot;">​</a></h3><p>例 06_qthread_example2 ， 继 承 QObject 类 的 线 程 （ 难 度 ： 一 般 ） 。本例通过 QObject 类继承线程，然后在 MainWindow 类里使用。通过点击一个按钮开启线程。 另一个按钮点击关闭线程。 另外通过加锁的操作来安全的终止一个线程。（我们可以通过 QMutexLocker 可以安全的使用 QMutex 以免忘记解锁。）</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QThread&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDebug&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QPushButton&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QMutexLocker&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QMutex&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 工人类 */</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Worker</span><span style="color:#ADBAC7;">;</span></span>
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
<span class="line"><span style="color:#768390;">    /* 开始线程按钮 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPushButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pushButton1;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 打断线程按钮 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QPushButton </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pushButton2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 全局线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QThread workerThread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 工人类 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    Worker </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">worker;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">private slots:</span></span>
<span class="line"><span style="color:#768390;">    /* 按钮1点击开启线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">pushButton1Clicked</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 按钮2点击打断线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">pushButton2Clicked</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 用于接收工人是否在工作的信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">handleResults</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">signals:</span></span>
<span class="line"><span style="color:#768390;">    /* 工人开始工作（做些耗时的操作 ） */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">startWork</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* Worker类，这个类声明了doWork1函数，将整个Worker类移至线程workerThread */</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Worker</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QObject</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#768390;">    /* 互斥锁 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QMutex lock;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 标志位 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> isCanRun;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">public slots:</span></span>
<span class="line"><span style="color:#768390;">    /* 耗时的工作都放在槽函数下，工人可以有多份不同的工作，但是每次只能去做一份 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">doWork1</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">parameter</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 标志位为真 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        isCanRun </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 死循环 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#768390;">            /* 此{}作用是QMutexLocker与lock的作用范围，获取锁后，</span></span>
<span class="line"><span style="color:#768390;">             * 运行完成后即解锁 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                QMutexLocker </span><span style="color:#DCBDFB;">locker</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">lock);</span></span>
<span class="line"><span style="color:#768390;">                /* 如果标志位不为真 */</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">isCanRun) {</span></span>
<span class="line"><span style="color:#768390;">                    /* 跳出循环 */</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">                }</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#768390;">            /* 使用QThread里的延时函数，当作一个普通延时 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F69D50;">QThread</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">sleep</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            emit </span><span style="color:#DCBDFB;">resultReady</span><span style="color:#ADBAC7;">(parameter </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;doWork1函数&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#768390;">        /* doWork1运行完成，发送信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        emit </span><span style="color:#DCBDFB;">resultReady</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打断doWork1函数&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    // void doWork2();...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#768390;">    /* 打断线程（注意此方法不能放在槽函数下） */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">stopWork</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;打断线程&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 获取锁后，运行完成后即解锁 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        QMutexLocker </span><span style="color:#DCBDFB;">locker</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">lock);</span></span>
<span class="line"><span style="color:#ADBAC7;">        isCanRun </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">signals:</span></span>
<span class="line"><span style="color:#768390;">    /* 工人工作函数状态的信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">resultReady</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">result</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // MAINWINDOW_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MAINWINDOW_H</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QMainWindow&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QThread&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDebug&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QPushButton&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QMutexLocker&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QMutex&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 工人类 */</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Worker</span><span style="color:#24292E;">;</span></span>
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
<span class="line"><span style="color:#6A737D;">    /* 开始线程按钮 */</span></span>
<span class="line"><span style="color:#24292E;">    QPushButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pushButton1;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 打断线程按钮 */</span></span>
<span class="line"><span style="color:#24292E;">    QPushButton </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pushButton2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 全局线程 */</span></span>
<span class="line"><span style="color:#24292E;">    QThread workerThread;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 工人类 */</span></span>
<span class="line"><span style="color:#24292E;">    Worker </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">worker;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">private slots:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 按钮1点击开启线程 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">pushButton1Clicked</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 按钮2点击打断线程 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">pushButton2Clicked</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 用于接收工人是否在工作的信号 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">handleResults</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">signals:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 工人开始工作（做些耗时的操作 ） */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">startWork</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* Worker类，这个类声明了doWork1函数，将整个Worker类移至线程workerThread */</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Worker</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QObject</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Q_OBJECT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 互斥锁 */</span></span>
<span class="line"><span style="color:#24292E;">    QMutex lock;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 标志位 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> isCanRun;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">public slots:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 耗时的工作都放在槽函数下，工人可以有多份不同的工作，但是每次只能去做一份 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">doWork1</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">parameter</span><span style="color:#24292E;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 标志位为真 */</span></span>
<span class="line"><span style="color:#24292E;">        isCanRun </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 死循环 */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#6A737D;">            /* 此{}作用是QMutexLocker与lock的作用范围，获取锁后，</span></span>
<span class="line"><span style="color:#6A737D;">             * 运行完成后即解锁 */</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                QMutexLocker </span><span style="color:#6F42C1;">locker</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">lock);</span></span>
<span class="line"><span style="color:#6A737D;">                /* 如果标志位不为真 */</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">isCanRun) {</span></span>
<span class="line"><span style="color:#6A737D;">                    /* 跳出循环 */</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#6A737D;">            /* 使用QThread里的延时函数，当作一个普通延时 */</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">QThread</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">sleep</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            emit </span><span style="color:#6F42C1;">resultReady</span><span style="color:#24292E;">(parameter </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;doWork1函数&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#6A737D;">        /* doWork1运行完成，发送信号 */</span></span>
<span class="line"><span style="color:#24292E;">        emit </span><span style="color:#6F42C1;">resultReady</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打断doWork1函数&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    // void doWork2();...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 打断线程（注意此方法不能放在槽函数下） */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">stopWork</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;打断线程&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 获取锁后，运行完成后即解锁 */</span></span>
<span class="line"><span style="color:#24292E;">        QMutexLocker </span><span style="color:#6F42C1;">locker</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">lock);</span></span>
<span class="line"><span style="color:#24292E;">        isCanRun </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">signals:</span></span>
<span class="line"><span style="color:#6A737D;">    /* 工人工作函数状态的信号 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">resultReady</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">result</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // MAINWINDOW_H</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置显示位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置按钮的位置大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton1-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">80</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton2-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">80</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置两个按钮的文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton1-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;开启线程&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton2-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打断线程&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 工人类实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    worker </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Worker;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将worker类移至线程workerThread */</span></span>
<span class="line"><span style="color:#ADBAC7;">    worker-&gt;</span><span style="color:#DCBDFB;">moveToThread</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">workerThread);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 线程完成销毁对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">workerThread, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">finished</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            worker, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">deleteLater</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">workerThread, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">finished</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">workerThread, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">deleteLater</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 发送开始工作的信号，开始工作 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">startWork</span><span style="color:#ADBAC7;">(QString)),</span></span>
<span class="line"><span style="color:#ADBAC7;">            worker, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">doWork1</span><span style="color:#ADBAC7;">(QString)));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 接收到worker发送过来的信号 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(worker, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">resultReady</span><span style="color:#ADBAC7;">(QString)),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">handleResults</span><span style="color:#ADBAC7;">(QString)));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 点击按钮开始线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton1, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">pushButton1Clicked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 点击按钮打断线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton2, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">pushButton2Clicked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 打断线程再退出 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    worker-&gt;</span><span style="color:#DCBDFB;">stopWork</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    workerThread.</span><span style="color:#DCBDFB;">quit</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 阻塞线程2000ms，判断线程是否结束 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (workerThread.</span><span style="color:#DCBDFB;">wait</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2000</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;线程结束&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushButton1Clicked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 字符串常量 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> QString str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;正在运行&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 判断线程是否在运行 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">workerThread.</span><span style="color:#DCBDFB;">isRunning</span><span style="color:#ADBAC7;">()) {</span></span>
<span class="line"><span style="color:#768390;">        /* 开启线程 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        workerThread.</span><span style="color:#DCBDFB;">start</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 发送正在运行的信号，线程收到信号后执行后返回线程耗时函数 + 此字符串 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    emit </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">startWork</span><span style="color:#ADBAC7;">(str);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushButton2Clicked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 如果线程在运行 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(workerThread.</span><span style="color:#DCBDFB;">isRunning</span><span style="color:#ADBAC7;">()) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 停止耗时工作，跳出耗时工作的循环 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        worker-&gt;</span><span style="color:#DCBDFB;">stopWork</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">handleResults</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">results</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 打印线程的状态 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;线程的状态：&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">results</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置显示位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置按钮的位置大小 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton1-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">80</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton2-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">400</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">80</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置两个按钮的文本 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton1-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;开启线程&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton2-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打断线程&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 工人类实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    worker </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Worker;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将worker类移至线程workerThread */</span></span>
<span class="line"><span style="color:#24292E;">    worker-&gt;</span><span style="color:#6F42C1;">moveToThread</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">workerThread);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 线程完成销毁对象 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">workerThread, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">finished</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            worker, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">deleteLater</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">workerThread, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">finished</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">workerThread, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">deleteLater</span><span style="color:#24292E;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 发送开始工作的信号，开始工作 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">startWork</span><span style="color:#24292E;">(QString)),</span></span>
<span class="line"><span style="color:#24292E;">            worker, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">doWork1</span><span style="color:#24292E;">(QString)));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 接收到worker发送过来的信号 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(worker, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">resultReady</span><span style="color:#24292E;">(QString)),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">handleResults</span><span style="color:#24292E;">(QString)));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 点击按钮开始线程 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton1, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">pushButton1Clicked</span><span style="color:#24292E;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 点击按钮打断线程 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton2, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">pushButton2Clicked</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 打断线程再退出 */</span></span>
<span class="line"><span style="color:#24292E;">    worker-&gt;</span><span style="color:#6F42C1;">stopWork</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    workerThread.</span><span style="color:#6F42C1;">quit</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 阻塞线程2000ms，判断线程是否结束 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (workerThread.</span><span style="color:#6F42C1;">wait</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2000</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;线程结束&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushButton1Clicked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 字符串常量 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> QString str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;正在运行&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 判断线程是否在运行 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">workerThread.</span><span style="color:#6F42C1;">isRunning</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#6A737D;">        /* 开启线程 */</span></span>
<span class="line"><span style="color:#24292E;">        workerThread.</span><span style="color:#6F42C1;">start</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 发送正在运行的信号，线程收到信号后执行后返回线程耗时函数 + 此字符串 */</span></span>
<span class="line"><span style="color:#24292E;">    emit </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">startWork</span><span style="color:#24292E;">(str);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushButton2Clicked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 如果线程在运行 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(workerThread.</span><span style="color:#6F42C1;">isRunning</span><span style="color:#24292E;">()) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 停止耗时工作，跳出耗时工作的循环 */</span></span>
<span class="line"><span style="color:#24292E;">        worker-&gt;</span><span style="color:#6F42C1;">stopWork</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">handleResults</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#E36209;">results</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 打印线程的状态 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;线程的状态：&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">results</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,13);function h(s,k,g,Q,W,w){const o=c,e=C("ClientOnly");return l(),r("div",null,[d,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),u])}const q=t(E,[["render",h]]);export{v as __pageData,q as default};
