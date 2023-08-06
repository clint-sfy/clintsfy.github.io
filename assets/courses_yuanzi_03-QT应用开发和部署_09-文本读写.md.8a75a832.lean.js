import{_ as t}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as c,v as l,b as r,E as y,O as i,F as p,L as A,R as D,M as B,C,B as F}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const b=JSON.parse('{"title":"文本读写","description":"","frontmatter":{"title":"文本读写","author":"阿源","date":"2023/08/09 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/03-QT应用开发和部署/09-文本读写.md","filePath":"courses/yuanzi/03-QT应用开发和部署/09-文本读写.md","lastUpdated":1691327334000}'),E={name:"courses/yuanzi/03-QT应用开发和部署/09-文本读写.md"},d=p("h1",{id:"正点原子qt之文本读写",tabindex:"-1"},[A("正点原子QT之文本读写 "),p("a",{class:"header-anchor",href:"#正点原子qt之文本读写","aria-label":'Permalink to "正点原子QT之文本读写"'},"​")],-1),u=D(`<h2 id="_11-文本读写" tabindex="-1">11. 文本读写 <a class="header-anchor" href="#_11-文本读写" aria-label="Permalink to &quot;11. 文本读写&quot;">​</a></h2><h3 id="_11-1-qfile-读写文本" tabindex="-1">11.1 QFile 读写文本 <a class="header-anchor" href="#_11-1-qfile-读写文本" aria-label="Permalink to &quot;11.1 QFile 读写文本&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QFile 是一个读写文本、二进制文件和资源的 I/O 设备。 QFile 可以自己使用，也可以更方便地与 QTextStream 或 QDataStream 一起使用。</span></span>
<span class="line"><span style="color:#adbac7;">可以使用 exists()检查文件是否存在，并使用 remove()删除文件。用 open()打开文件，用 close()关闭文件，用 flush()刷新文件。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QFile 是一个读写文本、二进制文件和资源的 I/O 设备。 QFile 可以自己使用，也可以更方便地与 QTextStream 或 QDataStream 一起使用。</span></span>
<span class="line"><span style="color:#24292e;">可以使用 exists()检查文件是否存在，并使用 remove()删除文件。用 open()打开文件，用 close()关闭文件，用 flush()刷新文件。</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QFile::open()函数打开文件时需要传递 QIODevice::OpenModeFlag 枚举类型的数，决定文件以什么方式打开， QIODevice::OpenModeFlag 类型的主要取值如下：</span></span>
<span class="line"><span style="color:#adbac7;">QIODevice::ReadOnly：以只读方式打开文件，用于载入文件。</span></span>
<span class="line"><span style="color:#adbac7;"> QIODevice::WriteOnly：以只写方式打开文件，用于保存文件。</span></span>
<span class="line"><span style="color:#adbac7;"> QIODevice::ReadWrite：以读写方式打开。</span></span>
<span class="line"><span style="color:#adbac7;"> QIODevice::Append：以添加模式打开，新写入文件的数据添加到文件尾部。</span></span>
<span class="line"><span style="color:#adbac7;"> QIODevice::Truncate：以截取方式打开文件，文件原有的内容全部被删除。</span></span>
<span class="line"><span style="color:#adbac7;"> QIODevice::Text：以文本方式打开文件，读取时“\\n”被自动翻译为换行符，写入时字符串结束符会自动翻译为系统平台的编码，如 Windows 平台下是“\\r\\n”。</span></span>
<span class="line"><span style="color:#adbac7;">这些取值可以组合，例如 QIODevice::ReadOnly | QIODevice::Text</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QFile::open()函数打开文件时需要传递 QIODevice::OpenModeFlag 枚举类型的数，决定文件以什么方式打开， QIODevice::OpenModeFlag 类型的主要取值如下：</span></span>
<span class="line"><span style="color:#24292e;">QIODevice::ReadOnly：以只读方式打开文件，用于载入文件。</span></span>
<span class="line"><span style="color:#24292e;"> QIODevice::WriteOnly：以只写方式打开文件，用于保存文件。</span></span>
<span class="line"><span style="color:#24292e;"> QIODevice::ReadWrite：以读写方式打开。</span></span>
<span class="line"><span style="color:#24292e;"> QIODevice::Append：以添加模式打开，新写入文件的数据添加到文件尾部。</span></span>
<span class="line"><span style="color:#24292e;"> QIODevice::Truncate：以截取方式打开文件，文件原有的内容全部被删除。</span></span>
<span class="line"><span style="color:#24292e;"> QIODevice::Text：以文本方式打开文件，读取时“\\n”被自动翻译为换行符，写入时字符串结束符会自动翻译为系统平台的编码，如 Windows 平台下是“\\r\\n”。</span></span>
<span class="line"><span style="color:#24292e;">这些取值可以组合，例如 QIODevice::ReadOnly | QIODevice::Text</span></span></code></pre></div><h3 id="案例-读写文本" tabindex="-1">案例：读写文本 <a class="header-anchor" href="#案例-读写文本" aria-label="Permalink to &quot;案例：读写文本&quot;">​</a></h3><p>打开后，文本的内容如下，可以进行修改，修改后点击关闭就会写入到此文件里</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QFileDialog&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 布局设置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    textEdit </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTextEdit</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QVBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    vWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    hWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置两个按钮的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setMinimumHeight</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setMaximumWidth</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">120</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setMinimumHeight</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setMaximumWidth</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">120</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置两个按钮的文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打开&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;关闭&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置关闭按钮为不可用属性，需要打开文件才设置为可用属性 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 水平布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(openPushButton);</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(closePushButton);</span></span>
<span class="line"><span style="color:#ADBAC7;">    hWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 垂直布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(textEdit);</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(hWidget);</span></span>
<span class="line"><span style="color:#ADBAC7;">    vWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(vBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(vWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(openPushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">openFile</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(closePushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">closeFile</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">openFile</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 获取文件的路径 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QString fileName </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QFileDialog</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getOpenFileName</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 指向文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    file.</span><span style="color:#DCBDFB;">setFileName</span><span style="color:#ADBAC7;">(fileName);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 判断文件是否存在 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">file.</span><span style="color:#DCBDFB;">exists</span><span style="color:#ADBAC7;">())</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 以读写的方式打开 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">file.</span><span style="color:#DCBDFB;">open</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::ReadOnly </span><span style="color:#F47067;">|</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::Text))</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 读取文本到textEdit */</span></span>
<span class="line"><span style="color:#ADBAC7;">    textEdit-&gt;</span><span style="color:#DCBDFB;">setPlainText</span><span style="color:#ADBAC7;">(file.</span><span style="color:#DCBDFB;">readAll</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置打开按钮不可用，需要关闭再打开 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置关闭按钮为可用属性 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 关闭文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    file.</span><span style="color:#DCBDFB;">close</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">closeFile</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 检测打开按钮是否可用，不可用时，说明已经打开了文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">openPushButton-&gt;</span><span style="color:#DCBDFB;">isEnabled</span><span style="color:#ADBAC7;">()) {</span></span>
<span class="line"><span style="color:#768390;">        /* 获取textEdit的文本内容 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        QString str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> textEdit-&gt;</span><span style="color:#DCBDFB;">toPlainText</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 以只读的方式打开 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">file.</span><span style="color:#DCBDFB;">open</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::WriteOnly </span><span style="color:#F47067;">|</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::Text))</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 转换为字节数组 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        QByteArray strBytes </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> str.</span><span style="color:#DCBDFB;">toUtf8</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 写入文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        file.</span><span style="color:#DCBDFB;">write</span><span style="color:#ADBAC7;">(strBytes, strBytes.</span><span style="color:#DCBDFB;">length</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 清空textEdit的显示内容 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        textEdit-&gt;</span><span style="color:#DCBDFB;">clear</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 关闭文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        file.</span><span style="color:#DCBDFB;">close</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 重新设置打开和关闭按钮的属性 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        openPushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        closePushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QFileDialog&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 布局设置 */</span></span>
<span class="line"><span style="color:#24292E;">    textEdit </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTextEdit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QVBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    vWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    hWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置两个按钮的大小 */</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setMinimumHeight</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setMaximumWidth</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">120</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setMinimumHeight</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setMaximumWidth</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">120</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置两个按钮的文本 */</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打开&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;关闭&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置关闭按钮为不可用属性，需要打开文件才设置为可用属性 */</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 水平布局 */</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(openPushButton);</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(closePushButton);</span></span>
<span class="line"><span style="color:#24292E;">    hWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 垂直布局 */</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(textEdit);</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(hWidget);</span></span>
<span class="line"><span style="color:#24292E;">    vWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(vBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(vWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(openPushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">openFile</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(closePushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">closeFile</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">openFile</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 获取文件的路径 */</span></span>
<span class="line"><span style="color:#24292E;">    QString fileName </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QFileDialog</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getOpenFileName</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 指向文件 */</span></span>
<span class="line"><span style="color:#24292E;">    file.</span><span style="color:#6F42C1;">setFileName</span><span style="color:#24292E;">(fileName);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 判断文件是否存在 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">file.</span><span style="color:#6F42C1;">exists</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 以读写的方式打开 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">file.</span><span style="color:#6F42C1;">open</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::ReadOnly </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::Text))</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 读取文本到textEdit */</span></span>
<span class="line"><span style="color:#24292E;">    textEdit-&gt;</span><span style="color:#6F42C1;">setPlainText</span><span style="color:#24292E;">(file.</span><span style="color:#6F42C1;">readAll</span><span style="color:#24292E;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置打开按钮不可用，需要关闭再打开 */</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置关闭按钮为可用属性 */</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 关闭文件 */</span></span>
<span class="line"><span style="color:#24292E;">    file.</span><span style="color:#6F42C1;">close</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">closeFile</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 检测打开按钮是否可用，不可用时，说明已经打开了文件 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">openPushButton-&gt;</span><span style="color:#6F42C1;">isEnabled</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#6A737D;">        /* 获取textEdit的文本内容 */</span></span>
<span class="line"><span style="color:#24292E;">        QString str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> textEdit-&gt;</span><span style="color:#6F42C1;">toPlainText</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 以只读的方式打开 */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">file.</span><span style="color:#6F42C1;">open</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::WriteOnly </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::Text))</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 转换为字节数组 */</span></span>
<span class="line"><span style="color:#24292E;">        QByteArray strBytes </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> str.</span><span style="color:#6F42C1;">toUtf8</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 写入文件 */</span></span>
<span class="line"><span style="color:#24292E;">        file.</span><span style="color:#6F42C1;">write</span><span style="color:#24292E;">(strBytes, strBytes.</span><span style="color:#6F42C1;">length</span><span style="color:#24292E;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 清空textEdit的显示内容 */</span></span>
<span class="line"><span style="color:#24292E;">        textEdit-&gt;</span><span style="color:#6F42C1;">clear</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 关闭文件 */</span></span>
<span class="line"><span style="color:#24292E;">        file.</span><span style="color:#6F42C1;">close</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 重新设置打开和关闭按钮的属性 */</span></span>
<span class="line"><span style="color:#24292E;">        openPushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        closePushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_11-2-qtextstream-读写文本" tabindex="-1">11.2 QTextStream 读写文本 <a class="header-anchor" href="#_11-2-qtextstream-读写文本" aria-label="Permalink to &quot;11.2 QTextStream 读写文本&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QTextStream 类为读写文本提供了一个方便的接口，常与 QFile 结合使用。 QTextStream 可以在 QIODevice、 QByteArray 或 QString 上操作。使用QTextStream 的流操作符，您可以方便地读写单词、行和数字。为了生成文本， QTextStream 支持字段填充和对齐的格式化选项，以及数字的格式化。看到 Stream 这个名词就知道，它与流操作有关，那么我们可以使用 C++的操作符“&lt;&lt;”和“&gt;&gt;” (流提取运算符和流插入运算符)进行操作流了。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QTextStream 类为读写文本提供了一个方便的接口，常与 QFile 结合使用。 QTextStream 可以在 QIODevice、 QByteArray 或 QString 上操作。使用QTextStream 的流操作符，您可以方便地读写单词、行和数字。为了生成文本， QTextStream 支持字段填充和对齐的格式化选项，以及数字的格式化。看到 Stream 这个名词就知道，它与流操作有关，那么我们可以使用 C++的操作符“&lt;&lt;”和“&gt;&gt;” (流提取运算符和流插入运算符)进行操作流了。</span></span></code></pre></div><h3 id="案例-文本流读写文本" tabindex="-1">案例：文本流读写文本 <a class="header-anchor" href="#案例-文本流读写文本" aria-label="Permalink to &quot;案例：文本流读写文本&quot;">​</a></h3><p>例 02_qtextstream， 文本流读写文本（难度：简单）。项目路径为 Qt/2/02_qtextstream。QTextStream 的例子与 QFile 的一样，只是在 QFile 的例子里加入了 QTextStream。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QFileDialog&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 布局设置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    textEdit </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTextEdit</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QVBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    vWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    hWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置两个按钮的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setMinimumHeight</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setMaximumWidth</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">120</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setMinimumHeight</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setMaximumWidth</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">120</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置两个按钮的文本 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;打开&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;关闭&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置关闭按钮为不可用属性，需要打开文件才设置为可用属性 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 水平布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(openPushButton);</span></span>
<span class="line"><span style="color:#ADBAC7;">    hBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(closePushButton);</span></span>
<span class="line"><span style="color:#ADBAC7;">    hWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 垂直布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(textEdit);</span></span>
<span class="line"><span style="color:#ADBAC7;">    vBoxLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(hWidget);</span></span>
<span class="line"><span style="color:#ADBAC7;">    vWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(vBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(vWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(openPushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">openFile</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(closePushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">closeFile</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">openFile</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 获取文件的路径 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QString fileName </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QFileDialog</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getOpenFileName</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 指向文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    file.</span><span style="color:#DCBDFB;">setFileName</span><span style="color:#ADBAC7;">(fileName);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 判断文件是否存在 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">file.</span><span style="color:#DCBDFB;">exists</span><span style="color:#ADBAC7;">())</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 以读写的方式打开 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">file.</span><span style="color:#DCBDFB;">open</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::ReadOnly </span><span style="color:#F47067;">|</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::Text))</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 使用文本流读取文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QTextStream </span><span style="color:#DCBDFB;">stream</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">file);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 读取文本到textEdit */</span></span>
<span class="line"><span style="color:#ADBAC7;">    textEdit-&gt;</span><span style="color:#DCBDFB;">setPlainText</span><span style="color:#ADBAC7;">(stream.</span><span style="color:#DCBDFB;">readAll</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置打开按钮不可用，需要关闭再打开 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    openPushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置关闭按钮为可用属性 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    closePushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 关闭文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    file.</span><span style="color:#DCBDFB;">close</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">closeFile</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 检测打开按钮是否可用，不可用时，说明已经打开了文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">openPushButton-&gt;</span><span style="color:#DCBDFB;">isEnabled</span><span style="color:#ADBAC7;">()) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 以只读的方式打开 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">file.</span><span style="color:#DCBDFB;">open</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::WriteOnly </span><span style="color:#F47067;">|</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QIODevice</span><span style="color:#ADBAC7;">::Text))</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 用文本流读取文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        QTextStream </span><span style="color:#DCBDFB;">stream</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">file);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 获取textEdit的文本内容，转为字符串 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        QString str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> textEdit-&gt;</span><span style="color:#DCBDFB;">toPlainText</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 使用流提取运算符，写入文本流 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        stream</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">str;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 清空textEdit的显示内容 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        textEdit-&gt;</span><span style="color:#DCBDFB;">clear</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 关闭文件 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        file.</span><span style="color:#DCBDFB;">close</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        /* 重新设置打开和关闭按钮的属性 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        openPushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        closePushButton-&gt;</span><span style="color:#DCBDFB;">setEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QFileDialog&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 布局设置 */</span></span>
<span class="line"><span style="color:#24292E;">    textEdit </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTextEdit</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QVBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    vWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    hWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置两个按钮的大小 */</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setMinimumHeight</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setMaximumWidth</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">120</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setMinimumHeight</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setMaximumWidth</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">120</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置两个按钮的文本 */</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;打开&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;关闭&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置关闭按钮为不可用属性，需要打开文件才设置为可用属性 */</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 水平布局 */</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(openPushButton);</span></span>
<span class="line"><span style="color:#24292E;">    hBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(closePushButton);</span></span>
<span class="line"><span style="color:#24292E;">    hWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(hBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 垂直布局 */</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(textEdit);</span></span>
<span class="line"><span style="color:#24292E;">    vBoxLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(hWidget);</span></span>
<span class="line"><span style="color:#24292E;">    vWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(vBoxLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(vWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(openPushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">openFile</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(closePushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">closeFile</span><span style="color:#24292E;">()));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">openFile</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 获取文件的路径 */</span></span>
<span class="line"><span style="color:#24292E;">    QString fileName </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QFileDialog</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getOpenFileName</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 指向文件 */</span></span>
<span class="line"><span style="color:#24292E;">    file.</span><span style="color:#6F42C1;">setFileName</span><span style="color:#24292E;">(fileName);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 判断文件是否存在 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">file.</span><span style="color:#6F42C1;">exists</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 以读写的方式打开 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">file.</span><span style="color:#6F42C1;">open</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::ReadOnly </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::Text))</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 使用文本流读取文件 */</span></span>
<span class="line"><span style="color:#24292E;">    QTextStream </span><span style="color:#6F42C1;">stream</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">file);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 读取文本到textEdit */</span></span>
<span class="line"><span style="color:#24292E;">    textEdit-&gt;</span><span style="color:#6F42C1;">setPlainText</span><span style="color:#24292E;">(stream.</span><span style="color:#6F42C1;">readAll</span><span style="color:#24292E;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置打开按钮不可用，需要关闭再打开 */</span></span>
<span class="line"><span style="color:#24292E;">    openPushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置关闭按钮为可用属性 */</span></span>
<span class="line"><span style="color:#24292E;">    closePushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 关闭文件 */</span></span>
<span class="line"><span style="color:#24292E;">    file.</span><span style="color:#6F42C1;">close</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">closeFile</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 检测打开按钮是否可用，不可用时，说明已经打开了文件 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">openPushButton-&gt;</span><span style="color:#6F42C1;">isEnabled</span><span style="color:#24292E;">()) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 以只读的方式打开 */</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">file.</span><span style="color:#6F42C1;">open</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::WriteOnly </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QIODevice</span><span style="color:#24292E;">::Text))</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 用文本流读取文件 */</span></span>
<span class="line"><span style="color:#24292E;">        QTextStream </span><span style="color:#6F42C1;">stream</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">file);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 获取textEdit的文本内容，转为字符串 */</span></span>
<span class="line"><span style="color:#24292E;">        QString str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> textEdit-&gt;</span><span style="color:#6F42C1;">toPlainText</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 使用流提取运算符，写入文本流 */</span></span>
<span class="line"><span style="color:#24292E;">        stream</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">str;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 清空textEdit的显示内容 */</span></span>
<span class="line"><span style="color:#24292E;">        textEdit-&gt;</span><span style="color:#6F42C1;">clear</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 关闭文件 */</span></span>
<span class="line"><span style="color:#24292E;">        file.</span><span style="color:#6F42C1;">close</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        /* 重新设置打开和关闭按钮的属性 */</span></span>
<span class="line"><span style="color:#24292E;">        openPushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        closePushButton-&gt;</span><span style="color:#6F42C1;">setEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,12);function g(s,h,x,Q,m,v){const o=t,e=B("ClientOnly");return l(),r("div",null,[d,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),C(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),u])}const O=c(E,[["render",g]]);export{b as __pageData,O as default};
