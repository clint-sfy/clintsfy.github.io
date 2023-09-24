import{_ as t}from"./chunks/ArticleMetadata.efdb5e9a.js";import{_ as c,v as l,b as r,t as y,O as i,F as p,L as A,R as D,M as C,C as B,B as d}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const v=JSON.parse('{"title":"项目式视图组（基于模型）","description":"","frontmatter":{"title":"项目式视图组（基于模型）","author":"阿源","date":"2023/08/07 12:00","categories":["QT快速入门"],"tags":["C++","QT5"]},"headers":[],"relativePath":"courses/yuanzi/02-QT应用开发和部署/07-项目式视图组（基于模型）.md","filePath":"courses/yuanzi/02-QT应用开发和部署/07-项目式视图组（基于模型）.md","lastUpdated":1695461708000}'),F={name:"courses/yuanzi/02-QT应用开发和部署/07-项目式视图组（基于模型）.md"},E=p("h1",{id:"正点原子qt之项目式视图组-基于模型",tabindex:"-1"},[A("正点原子QT之项目式视图组（基于模型） "),p("a",{class:"header-anchor",href:"#正点原子qt之项目式视图组-基于模型","aria-label":'Permalink to "正点原子QT之项目式视图组（基于模型）"'},"​")],-1),u=D(`<h2 id="_9-项目式视图组-基于模型" tabindex="-1">9. 项目式视图组（基于模型） <a class="header-anchor" href="#_9-项目式视图组-基于模型" aria-label="Permalink to &quot;9. 项目式视图组（基于模型）&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">（1） List View:清单视图</span></span>
<span class="line"><span style="color:#adbac7;">（2） Tree View:树形视图</span></span>
<span class="line"><span style="color:#adbac7;">（3） Table View:表视图</span></span>
<span class="line"><span style="color:#adbac7;">（4） Column View:列表视图</span></span>
<span class="line"><span style="color:#adbac7;">（5） Undo View:撤销列表视图</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">（1） List View:清单视图</span></span>
<span class="line"><span style="color:#24292e;">（2） Tree View:树形视图</span></span>
<span class="line"><span style="color:#24292e;">（3） Table View:表视图</span></span>
<span class="line"><span style="color:#24292e;">（4） Column View:列表视图</span></span>
<span class="line"><span style="color:#24292e;">（5） Undo View:撤销列表视图</span></span></code></pre></div><h3 id="_9-1-qlistview-清单视图" tabindex="-1">9.1 QListView:清单视图 <a class="header-anchor" href="#_9-1-qlistview-清单视图" aria-label="Permalink to &quot;9.1 QListView:清单视图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QListView 继承 QAbstractItemView，被 QListWidget 和 QUndoView 继承。 QListView 类提供模型上的列表或图标视图。 QListView 以简单的非分层列表或图标集合的形式显示存储在模型中的项。该类用于提供以前由 QListBox 和 QIconView 类提供的列表和图标视图，但是使用了 Qt 的模型/视图体系结构提供的更灵活的方法。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QListView 继承 QAbstractItemView，被 QListWidget 和 QUndoView 继承。 QListView 类提供模型上的列表或图标视图。 QListView 以简单的非分层列表或图标集合的形式显示存储在模型中的项。该类用于提供以前由 QListBox 和 QIconView 类提供的列表和图标视图，但是使用了 Qt 的模型/视图体系结构提供的更灵活的方法。</span></span></code></pre></div><h3 id="案例-清单图" tabindex="-1">案例：清单图 <a class="header-anchor" href="#案例-清单图" aria-label="Permalink to &quot;案例：清单图&quot;">​</a></h3><p>例 40_qlistview，清单图（难度：简单）。使用一个 ListView 控件，展示如何在列表中插入数据，其中表中的内容可编辑，可删除。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗口位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    listView </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QListView</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 将listView居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(listView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QStringList strList;</span></span>
<span class="line"><span style="color:#ADBAC7;">    strList</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;高三（1）班&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;高三（2）班&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;高三（3）班&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化，字符串模型 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    stringListModel </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStringListModel</span><span style="color:#ADBAC7;">(strList);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 向表中插入一段数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    listView-&gt;</span><span style="color:#DCBDFB;">setModel</span><span style="color:#ADBAC7;">(stringListModel);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置为视图为图标模式 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    listView-&gt;</span><span style="color:#DCBDFB;">setViewMode</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QListView</span><span style="color:#ADBAC7;">::IconMode);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置为不可拖动 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    listView-&gt;</span><span style="color:#DCBDFB;">setDragEnabled</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗口位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    listView </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QListView</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将listView居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(listView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QStringList strList;</span></span>
<span class="line"><span style="color:#24292E;">    strList</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;高三（1）班&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;高三（2）班&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;高三（3）班&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化，字符串模型 */</span></span>
<span class="line"><span style="color:#24292E;">    stringListModel </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStringListModel</span><span style="color:#24292E;">(strList);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 向表中插入一段数据 */</span></span>
<span class="line"><span style="color:#24292E;">    listView-&gt;</span><span style="color:#6F42C1;">setModel</span><span style="color:#24292E;">(stringListModel);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置为视图为图标模式 */</span></span>
<span class="line"><span style="color:#24292E;">    listView-&gt;</span><span style="color:#6F42C1;">setViewMode</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QListView</span><span style="color:#24292E;">::IconMode);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置为不可拖动 */</span></span>
<span class="line"><span style="color:#24292E;">    listView-&gt;</span><span style="color:#6F42C1;">setDragEnabled</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_9-2-qtreeview-树形视图" tabindex="-1">9.2 QTreeView:树形视图 <a class="header-anchor" href="#_9-2-qtreeview-树形视图" aria-label="Permalink to &quot;9.2 QTreeView:树形视图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QTreeView 继承 QAbstractItemView，被 QTreeWidget 继承。 QTreeView 类提供树视图的默认模型/视图实现。 QTreeView 实现了模型项的树表示。该类用于提供以前由 QListView 类提供的标准分层列表，但是使用了 Qt 的模型/视图体系结构提供的更灵活的方法。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QTreeView 继承 QAbstractItemView，被 QTreeWidget 继承。 QTreeView 类提供树视图的默认模型/视图实现。 QTreeView 实现了模型项的树表示。该类用于提供以前由 QListView 类提供的标准分层列表，但是使用了 Qt 的模型/视图体系结构提供的更灵活的方法。</span></span></code></pre></div><h3 id="案例-仿-word-标题" tabindex="-1">案例：仿 word 标题 <a class="header-anchor" href="#案例-仿-word-标题" aria-label="Permalink to &quot;案例：仿 word 标题&quot;">​</a></h3><p>例 41_qtreeview，仿 word 标题（难度：简单）。要使一个 QTreeView 能够显示数据，需要构造一个 model 并设置 QTreeView。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QStandardItemModel&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QStandardItem&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 实例化QTreeView对象 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    treeView </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTreeView</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(treeView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 构建Model */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItemModel </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">sdiModel </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItemModel</span><span style="color:#ADBAC7;">(treeView);</span></span>
<span class="line"><span style="color:#ADBAC7;">    sdiModel-&gt;</span><span style="color:#DCBDFB;">setHorizontalHeaderLabels</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">QStringList</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#DCBDFB;">QStringLiteral</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;标题&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStringLiteral</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;名称&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">                );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#768390;">        /* 一级标题 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        QList</span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QStandardItem</span><span style="color:#F47067;">*&gt;</span><span style="color:#ADBAC7;"> items1;</span></span>
<span class="line"><span style="color:#ADBAC7;">        QStandardItem</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> item1 </span><span style="color:#F47067;">=</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">number</span><span style="color:#ADBAC7;">(i));</span></span>
<span class="line"><span style="color:#ADBAC7;">        QStandardItem</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> item2 </span><span style="color:#F47067;">=</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QStringLiteral</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;一级标题&quot;</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"><span style="color:#768390;">        /* 添加项一 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        items1.</span><span style="color:#DCBDFB;">append</span><span style="color:#ADBAC7;">(item1);</span></span>
<span class="line"><span style="color:#768390;">        /* 添加项二 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        items1.</span><span style="color:#DCBDFB;">append</span><span style="color:#ADBAC7;">(item2);</span></span>
<span class="line"><span style="color:#768390;">        /* appendRow方法添加到model上 */</span></span>
<span class="line"><span style="color:#ADBAC7;">        sdiModel-&gt;</span><span style="color:#DCBDFB;">appendRow</span><span style="color:#ADBAC7;">(items1);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> j </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; j </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">; j</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#768390;">            /* 在一级标题后面插入二级标题 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            QList</span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">QStandardItem</span><span style="color:#F47067;">*&gt;</span><span style="color:#ADBAC7;"> items2;</span></span>
<span class="line"><span style="color:#ADBAC7;">            QStandardItem</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> item3 </span><span style="color:#F47067;">=</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">number</span><span style="color:#ADBAC7;">(j));</span></span>
<span class="line"><span style="color:#ADBAC7;">            QStandardItem</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> item4 </span><span style="color:#F47067;">=</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QStringLiteral</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;二级标题&quot;</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"><span style="color:#ADBAC7;">            items2.</span><span style="color:#DCBDFB;">append</span><span style="color:#ADBAC7;">(item3);</span></span>
<span class="line"><span style="color:#ADBAC7;">            items2.</span><span style="color:#DCBDFB;">append</span><span style="color:#ADBAC7;">(item4);</span></span>
<span class="line"><span style="color:#768390;">            /* 使用appendRow方法添加到item1上 */</span></span>
<span class="line"><span style="color:#ADBAC7;">            item1-&gt;</span><span style="color:#DCBDFB;">appendRow</span><span style="color:#ADBAC7;">(items2);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 设置Model给treeView */</span></span>
<span class="line"><span style="color:#ADBAC7;">    treeView-&gt;</span><span style="color:#DCBDFB;">setModel</span><span style="color:#ADBAC7;">(sdiModel);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QStandardItemModel&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QStandardItem&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化QTreeView对象 */</span></span>
<span class="line"><span style="color:#24292E;">    treeView </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTreeView</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(treeView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 构建Model */</span></span>
<span class="line"><span style="color:#24292E;">    QStandardItemModel </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">sdiModel </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItemModel</span><span style="color:#24292E;">(treeView);</span></span>
<span class="line"><span style="color:#24292E;">    sdiModel-&gt;</span><span style="color:#6F42C1;">setHorizontalHeaderLabels</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">QStringList</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#6F42C1;">QStringLiteral</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;标题&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStringLiteral</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;名称&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#6A737D;">        /* 一级标题 */</span></span>
<span class="line"><span style="color:#24292E;">        QList</span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QStandardItem</span><span style="color:#D73A49;">*&gt;</span><span style="color:#24292E;"> items1;</span></span>
<span class="line"><span style="color:#24292E;">        QStandardItem</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> item1 </span><span style="color:#D73A49;">=</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">number</span><span style="color:#24292E;">(i));</span></span>
<span class="line"><span style="color:#24292E;">        QStandardItem</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> item2 </span><span style="color:#D73A49;">=</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QStringLiteral</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;一级标题&quot;</span><span style="color:#24292E;">));</span></span>
<span class="line"><span style="color:#6A737D;">        /* 添加项一 */</span></span>
<span class="line"><span style="color:#24292E;">        items1.</span><span style="color:#6F42C1;">append</span><span style="color:#24292E;">(item1);</span></span>
<span class="line"><span style="color:#6A737D;">        /* 添加项二 */</span></span>
<span class="line"><span style="color:#24292E;">        items1.</span><span style="color:#6F42C1;">append</span><span style="color:#24292E;">(item2);</span></span>
<span class="line"><span style="color:#6A737D;">        /* appendRow方法添加到model上 */</span></span>
<span class="line"><span style="color:#24292E;">        sdiModel-&gt;</span><span style="color:#6F42C1;">appendRow</span><span style="color:#24292E;">(items1);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> j </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; j </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5</span><span style="color:#24292E;">; j</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#6A737D;">            /* 在一级标题后面插入二级标题 */</span></span>
<span class="line"><span style="color:#24292E;">            QList</span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">QStandardItem</span><span style="color:#D73A49;">*&gt;</span><span style="color:#24292E;"> items2;</span></span>
<span class="line"><span style="color:#24292E;">            QStandardItem</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> item3 </span><span style="color:#D73A49;">=</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">number</span><span style="color:#24292E;">(j));</span></span>
<span class="line"><span style="color:#24292E;">            QStandardItem</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> item4 </span><span style="color:#D73A49;">=</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QStringLiteral</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;二级标题&quot;</span><span style="color:#24292E;">));</span></span>
<span class="line"><span style="color:#24292E;">            items2.</span><span style="color:#6F42C1;">append</span><span style="color:#24292E;">(item3);</span></span>
<span class="line"><span style="color:#24292E;">            items2.</span><span style="color:#6F42C1;">append</span><span style="color:#24292E;">(item4);</span></span>
<span class="line"><span style="color:#6A737D;">            /* 使用appendRow方法添加到item1上 */</span></span>
<span class="line"><span style="color:#24292E;">            item1-&gt;</span><span style="color:#6F42C1;">appendRow</span><span style="color:#24292E;">(items2);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置Model给treeView */</span></span>
<span class="line"><span style="color:#24292E;">    treeView-&gt;</span><span style="color:#6F42C1;">setModel</span><span style="color:#24292E;">(sdiModel);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_9-3-qtableview-表视图" tabindex="-1">9.3 QTableView:表视图 <a class="header-anchor" href="#_9-3-qtableview-表视图" aria-label="Permalink to &quot;9.3 QTableView:表视图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QTableView 继承 QAbstractItemView，被 QTableWidget 继承。 QTableView 类提供了表视图的默认模型/视图实现。 QTableView 实现了一个表视图，用于显示来自模型的项。该类用于提供以前由 QTable 类提供的标准表，但使用 Qt 的模型/视图体系结构提供的更灵活的方法。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QTableView 继承 QAbstractItemView，被 QTableWidget 继承。 QTableView 类提供了表视图的默认模型/视图实现。 QTableView 实现了一个表视图，用于显示来自模型的项。该类用于提供以前由 QTable 类提供的标准表，但使用 Qt 的模型/视图体系结构提供的更灵活的方法。</span></span></code></pre></div><h3 id="案例-表格视图" tabindex="-1">案例：表格视图 <a class="header-anchor" href="#案例-表格视图" aria-label="Permalink to &quot;案例：表格视图&quot;">​</a></h3><p>例 42_qtableview，表格视图（难度：简单）。要使一个 QTableView 能够显示数据，需要构造一个 model 并设置给 QTableView。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QStandardItemModel&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QHeaderView&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    tableView </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QTableView</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(tableView);</span></span>
<span class="line"><span style="color:#768390;">    /* 显示网格线 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    tableView-&gt;</span><span style="color:#DCBDFB;">setShowGrid</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItemModel</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> model </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItemModel</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStringList labels </span><span style="color:#F47067;">=</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F69D50;">QObject</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">tr</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;语文,数学,英语&quot;</span><span style="color:#ADBAC7;">).</span><span style="color:#DCBDFB;">simplified</span><span style="color:#ADBAC7;">().</span><span style="color:#DCBDFB;">split</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;,&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    /* 设置水平头标签 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    model-&gt;</span><span style="color:#DCBDFB;">setHorizontalHeaderLabels</span><span style="color:#ADBAC7;">(labels);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* item */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItem</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> item </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#768390;">    /* model插入项内容 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        item </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;80&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        model-&gt;</span><span style="color:#DCBDFB;">setItem</span><span style="color:#ADBAC7;">(i, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, item);</span></span>
<span class="line"><span style="color:#ADBAC7;">        item </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;99&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        model-&gt;</span><span style="color:#DCBDFB;">setItem</span><span style="color:#ADBAC7;">(i, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, item);</span></span>
<span class="line"><span style="color:#ADBAC7;">        item </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;100&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        model-&gt;</span><span style="color:#DCBDFB;">setItem</span><span style="color:#ADBAC7;">(i, </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">, item);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    /* 将model设置给tableView */</span></span>
<span class="line"><span style="color:#ADBAC7;">    tableView-&gt;</span><span style="color:#DCBDFB;">setModel</span><span style="color:#ADBAC7;">(model);</span></span>
<span class="line"><span style="color:#768390;">    /* 平均分列 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    tableView-&gt;</span><span style="color:#DCBDFB;">horizontalHeader</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">-&gt;</span><span style="color:#DCBDFB;">setSectionResizeMode</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QHeaderView</span><span style="color:#ADBAC7;">::Stretch);</span></span>
<span class="line"><span style="color:#768390;">    /* 平均分行 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    tableView-&gt;</span><span style="color:#DCBDFB;">verticalHeader</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">-&gt;</span><span style="color:#DCBDFB;">setSectionResizeMode</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">QHeaderView</span><span style="color:#ADBAC7;">::Stretch);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QStandardItemModel&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QHeaderView&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置窗口的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    tableView </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QTableView</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(tableView);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 显示网格线 */</span></span>
<span class="line"><span style="color:#24292E;">    tableView-&gt;</span><span style="color:#6F42C1;">setShowGrid</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QStandardItemModel</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> model </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItemModel</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    QStringList labels </span><span style="color:#D73A49;">=</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">QObject</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">tr</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;语文,数学,英语&quot;</span><span style="color:#24292E;">).</span><span style="color:#6F42C1;">simplified</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">split</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;,&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置水平头标签 */</span></span>
<span class="line"><span style="color:#24292E;">    model-&gt;</span><span style="color:#6F42C1;">setHorizontalHeaderLabels</span><span style="color:#24292E;">(labels);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* item */</span></span>
<span class="line"><span style="color:#24292E;">    QStandardItem</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> item </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    /* model插入项内容 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5</span><span style="color:#24292E;">; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        item </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;80&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        model-&gt;</span><span style="color:#6F42C1;">setItem</span><span style="color:#24292E;">(i, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, item);</span></span>
<span class="line"><span style="color:#24292E;">        item </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;99&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        model-&gt;</span><span style="color:#6F42C1;">setItem</span><span style="color:#24292E;">(i, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, item);</span></span>
<span class="line"><span style="color:#24292E;">        item </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;100&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        model-&gt;</span><span style="color:#6F42C1;">setItem</span><span style="color:#24292E;">(i, </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">, item);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    /* 将model设置给tableView */</span></span>
<span class="line"><span style="color:#24292E;">    tableView-&gt;</span><span style="color:#6F42C1;">setModel</span><span style="color:#24292E;">(model);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 平均分列 */</span></span>
<span class="line"><span style="color:#24292E;">    tableView-&gt;</span><span style="color:#6F42C1;">horizontalHeader</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">-&gt;</span><span style="color:#6F42C1;">setSectionResizeMode</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QHeaderView</span><span style="color:#24292E;">::Stretch);</span></span>
<span class="line"><span style="color:#6A737D;">    /* 平均分行 */</span></span>
<span class="line"><span style="color:#24292E;">    tableView-&gt;</span><span style="color:#6F42C1;">verticalHeader</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">-&gt;</span><span style="color:#6F42C1;">setSectionResizeMode</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">QHeaderView</span><span style="color:#24292E;">::Stretch);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_9-4-qcolumnview-列表视图" tabindex="-1">9.4 QColumnView:列表视图 <a class="header-anchor" href="#_9-4-qcolumnview-列表视图" aria-label="Permalink to &quot;9.4 QColumnView:列表视图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">ColumnView 继承 QAbstractItemView。QColumnView 在许多 QListViews 中显示一个模型，每个 QListViews 对应树中的每个层次结构。这有时被称为级联列表。 QColumnView 类是模型/视图类之一，是 Qt 模型/视图框架的一部分。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">ColumnView 继承 QAbstractItemView。QColumnView 在许多 QListViews 中显示一个模型，每个 QListViews 对应树中的每个层次结构。这有时被称为级联列表。 QColumnView 类是模型/视图类之一，是 Qt 模型/视图框架的一部分。</span></span></code></pre></div><h3 id="案例-收货地址" tabindex="-1">案例：收货地址 <a class="header-anchor" href="#案例-收货地址" aria-label="Permalink to &quot;案例：收货地址&quot;">​</a></h3><p>例 43_qcolumnview，收货地址（难度：简单）。使用一个 QColumnView，向其插入多级QStandardItem。这样就可以模拟成一个多级联的视图。与我们在像某宝，某东里填写的收货地址十分类似。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QStandardItem&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体显示位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItemModel </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">model </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> QStandardItemModel;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 省份 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItem </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">province </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;广东省&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 城市 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItem </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">city1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;茂名市&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItem </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">city2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;中山市&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 添加城市到省份下 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    province-&gt;</span><span style="color:#DCBDFB;">appendRow</span><span style="color:#ADBAC7;">(city1);</span></span>
<span class="line"><span style="color:#ADBAC7;">    province-&gt;</span><span style="color:#DCBDFB;">appendRow</span><span style="color:#ADBAC7;">(city2);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItem </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">town1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;电白镇&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    QStandardItem </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">town2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QStandardItem</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;南头镇&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 添加城镇到城市下 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    city1-&gt;</span><span style="color:#DCBDFB;">appendRow</span><span style="color:#ADBAC7;">(town1);</span></span>
<span class="line"><span style="color:#ADBAC7;">    city2-&gt;</span><span style="color:#DCBDFB;">appendRow</span><span style="color:#ADBAC7;">(town2);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    columnView </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> QColumnView;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 建立model */</span></span>
<span class="line"><span style="color:#ADBAC7;">    model-&gt;</span><span style="color:#DCBDFB;">appendRow</span><span style="color:#ADBAC7;">(province);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置model */</span></span>
<span class="line"><span style="color:#ADBAC7;">    columnView-&gt;</span><span style="color:#DCBDFB;">setModel</span><span style="color:#ADBAC7;">(model);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置居中 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(columnView);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QStandardItem&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体显示位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    QStandardItemModel </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">model </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> QStandardItemModel;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 省份 */</span></span>
<span class="line"><span style="color:#24292E;">    QStandardItem </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">province </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;广东省&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 城市 */</span></span>
<span class="line"><span style="color:#24292E;">    QStandardItem </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">city1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;茂名市&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    QStandardItem </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">city2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;中山市&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 添加城市到省份下 */</span></span>
<span class="line"><span style="color:#24292E;">    province-&gt;</span><span style="color:#6F42C1;">appendRow</span><span style="color:#24292E;">(city1);</span></span>
<span class="line"><span style="color:#24292E;">    province-&gt;</span><span style="color:#6F42C1;">appendRow</span><span style="color:#24292E;">(city2);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    QStandardItem </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">town1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;电白镇&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    QStandardItem </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">town2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QStandardItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;南头镇&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 添加城镇到城市下 */</span></span>
<span class="line"><span style="color:#24292E;">    city1-&gt;</span><span style="color:#6F42C1;">appendRow</span><span style="color:#24292E;">(town1);</span></span>
<span class="line"><span style="color:#24292E;">    city2-&gt;</span><span style="color:#6F42C1;">appendRow</span><span style="color:#24292E;">(town2);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    columnView </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> QColumnView;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 建立model */</span></span>
<span class="line"><span style="color:#24292E;">    model-&gt;</span><span style="color:#6F42C1;">appendRow</span><span style="color:#24292E;">(province);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置model */</span></span>
<span class="line"><span style="color:#24292E;">    columnView-&gt;</span><span style="color:#6F42C1;">setModel</span><span style="color:#24292E;">(model);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置居中 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(columnView);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_9-5-qundoview-撤销列表视图" tabindex="-1">9.5 QUndoView:撤销列表视图 <a class="header-anchor" href="#_9-5-qundoview-撤销列表视图" aria-label="Permalink to &quot;9.5 QUndoView:撤销列表视图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">QUndoView 继承 QlistView。 QUndoView 类显示 QUndoStack 的内容。 QUndoView 是一个QListView，它显示在撤销堆栈上推送的命令列表。总是选择最近执行的命令。</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">QUndoView 继承 QlistView。 QUndoView 类显示 QUndoStack 的内容。 QUndoView 是一个QListView，它显示在撤销堆栈上推送的命令列表。总是选择最近执行的命令。</span></span></code></pre></div><h3 id="案例-仿-ps-历史记录" tabindex="-1">案例：仿 PS 历史记录 <a class="header-anchor" href="#案例-仿-ps-历史记录" aria-label="Permalink to &quot;案例：仿 PS 历史记录&quot;">​</a></h3><p>例 44_qundoview，仿 PS 历史记录（难度：一般）。如果大家学习过 PS，都知道 PS 里有个历史记录面板，点击就会撤回到历史记录的步骤。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">(QWidget </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">    : </span><span style="color:#DCBDFB;">QMainWindow</span><span style="color:#ADBAC7;">(parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 设置主窗体显示的位置与大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setGeometry</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">800</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例一个水平布局，用于左侧按钮区域与右侧历史记录面板 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QHBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例一个水平布局，用于左侧标签与按钮 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vLayout </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QVBoxLayout</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 主Widget, 因为MainWindow自带一个布局，</span></span>
<span class="line"><span style="color:#768390;">     * 我们要新建一个Widget容纳新布局</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mainWidget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 用于存放命令行栈 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    undoStack </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QUndoStack</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 用于容纳左侧标签与按钮布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    widget </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QWidget</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 历史记录面板实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    undoView </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QUndoView</span><span style="color:#ADBAC7;">(undoStack);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 实例化一个按钮，用于加一操作 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QPushButton</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 标签，用于显示计算结果 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    label </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">QLabel</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置widget的大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    widget-&gt;</span><span style="color:#DCBDFB;">setMinimumSize</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">400</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">480</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将两个widget添加到水平布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    hLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(widget);</span></span>
<span class="line"><span style="color:#ADBAC7;">    hLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(undoView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 初始化count的值 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    count </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 显示初始化计算结果 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;计算结果：&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">number</span><span style="color:#ADBAC7;">(count));</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setAlignment</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Qt</span><span style="color:#ADBAC7;">::AlignCenter);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 左侧布局 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    vLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(label);</span></span>
<span class="line"><span style="color:#ADBAC7;">    vLayout-&gt;</span><span style="color:#DCBDFB;">addWidget</span><span style="color:#ADBAC7;">(pushButton);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 左侧布局控件的高度设置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setMaximumHeight</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton-&gt;</span><span style="color:#DCBDFB;">setMaximumHeight</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">height</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">/</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 按钮文件设置 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    pushButton-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;加1&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置widget的布局为vLayout */</span></span>
<span class="line"><span style="color:#ADBAC7;">    widget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(vLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 将主窗体的布局设置为hLayout */</span></span>
<span class="line"><span style="color:#ADBAC7;">    mainWidget-&gt;</span><span style="color:#DCBDFB;">setLayout</span><span style="color:#ADBAC7;">(hLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 设置mainWidget为主窗体的居中widget */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;</span><span style="color:#DCBDFB;">setCentralWidget</span><span style="color:#ADBAC7;">(mainWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接，按钮点击，执行加一操作 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(pushButton, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">clicked</span><span style="color:#ADBAC7;">()), </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">pushButtonClieked</span><span style="color:#ADBAC7;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 信号槽连接，历史记录项index发生变化，显示count大小 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">connect</span><span style="color:#ADBAC7;">(undoStack, </span><span style="color:#DCBDFB;">SIGNAL</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">indexChanged</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">) ),</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">SLOT</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">showCountValue</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 入栈操作会自动调用addCommand的redo */</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushButtonClieked</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 变量值加一 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    count</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* value指向count的地址 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">value </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">count;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 用重写的addCommand类实例化 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    QUndoCommand </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">add </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">addCommand</span><span style="color:#ADBAC7;">(value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 入栈 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    undoStack-&gt;</span><span style="color:#DCBDFB;">push</span><span style="color:#ADBAC7;">(add);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">showCountValue</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 标签用于显示计算结果 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    label-&gt;</span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;计算结果：&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">QString</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">number</span><span style="color:#ADBAC7;">(count));</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MainWindow</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MainWindow</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;mainwindow.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">(QWidget </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">    : </span><span style="color:#6F42C1;">QMainWindow</span><span style="color:#24292E;">(parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 设置主窗体显示的位置与大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setGeometry</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">800</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例一个水平布局，用于左侧按钮区域与右侧历史记录面板 */</span></span>
<span class="line"><span style="color:#24292E;">    hLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QHBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例一个水平布局，用于左侧标签与按钮 */</span></span>
<span class="line"><span style="color:#24292E;">    vLayout </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QVBoxLayout</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 主Widget, 因为MainWindow自带一个布局，</span></span>
<span class="line"><span style="color:#6A737D;">     * 我们要新建一个Widget容纳新布局</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    mainWidget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 用于存放命令行栈 */</span></span>
<span class="line"><span style="color:#24292E;">    undoStack </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QUndoStack</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 用于容纳左侧标签与按钮布局 */</span></span>
<span class="line"><span style="color:#24292E;">    widget </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QWidget</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 历史记录面板实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    undoView </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QUndoView</span><span style="color:#24292E;">(undoStack);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 实例化一个按钮，用于加一操作 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QPushButton</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 标签，用于显示计算结果 */</span></span>
<span class="line"><span style="color:#24292E;">    label </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QLabel</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置widget的大小 */</span></span>
<span class="line"><span style="color:#24292E;">    widget-&gt;</span><span style="color:#6F42C1;">setMinimumSize</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">400</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">480</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将两个widget添加到水平布局 */</span></span>
<span class="line"><span style="color:#24292E;">    hLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(widget);</span></span>
<span class="line"><span style="color:#24292E;">    hLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(undoView);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 初始化count的值 */</span></span>
<span class="line"><span style="color:#24292E;">    count </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 显示初始化计算结果 */</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;计算结果：&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">number</span><span style="color:#24292E;">(count));</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setAlignment</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Qt</span><span style="color:#24292E;">::AlignCenter);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 左侧布局 */</span></span>
<span class="line"><span style="color:#24292E;">    vLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(label);</span></span>
<span class="line"><span style="color:#24292E;">    vLayout-&gt;</span><span style="color:#6F42C1;">addWidget</span><span style="color:#24292E;">(pushButton);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 左侧布局控件的高度设置 */</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setMaximumHeight</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    pushButton-&gt;</span><span style="color:#6F42C1;">setMaximumHeight</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">height</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 按钮文件设置 */</span></span>
<span class="line"><span style="color:#24292E;">    pushButton-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;加1&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置widget的布局为vLayout */</span></span>
<span class="line"><span style="color:#24292E;">    widget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(vLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 将主窗体的布局设置为hLayout */</span></span>
<span class="line"><span style="color:#24292E;">    mainWidget-&gt;</span><span style="color:#6F42C1;">setLayout</span><span style="color:#24292E;">(hLayout);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 设置mainWidget为主窗体的居中widget */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;</span><span style="color:#6F42C1;">setCentralWidget</span><span style="color:#24292E;">(mainWidget);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接，按钮点击，执行加一操作 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(pushButton, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">clicked</span><span style="color:#24292E;">()), </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">pushButtonClieked</span><span style="color:#24292E;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 信号槽连接，历史记录项index发生变化，显示count大小 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">connect</span><span style="color:#24292E;">(undoStack, </span><span style="color:#6F42C1;">SIGNAL</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">indexChanged</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">) ),</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">SLOT</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">showCountValue</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 入栈操作会自动调用addCommand的redo */</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushButtonClieked</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 变量值加一 */</span></span>
<span class="line"><span style="color:#24292E;">    count</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* value指向count的地址 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">value </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">count;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 用重写的addCommand类实例化 */</span></span>
<span class="line"><span style="color:#24292E;">    QUndoCommand </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">add </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">addCommand</span><span style="color:#24292E;">(value);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 入栈 */</span></span>
<span class="line"><span style="color:#24292E;">    undoStack-&gt;</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(add);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">showCountValue</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 标签用于显示计算结果 */</span></span>
<span class="line"><span style="color:#24292E;">    label-&gt;</span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;计算结果：&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">QString</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">number</span><span style="color:#24292E;">(count));</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MainWindow</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;command.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">addCommand</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">addCommand</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">value, QUndoCommand </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">parent)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 使用Q_UNUSED,避免未使用的数据类型 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Q_UNUSED</span><span style="color:#ADBAC7;">(parent);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* undoView显示的操作信息 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setText</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;进行了加1操作&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* value的地址赋值给new_count */</span></span>
<span class="line"><span style="color:#ADBAC7;">    new_count </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> value;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 让构造函数传过来的*new_count的值赋值给old_count */</span></span>
<span class="line"><span style="color:#ADBAC7;">    old_count </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">new_count;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 执行stack push时或者重做操作时会自动调用 */</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">addCommand</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">redo</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 重新赋值给new_count */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">new_count </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> old_count;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 打印出*new_count的值 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;redo:&quot;</span><span style="color:#F47067;">&lt;&lt;*</span><span style="color:#ADBAC7;">new_count</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/* 回撤操作时执行 */</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">addCommand</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">undo</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    /* 回撤操作每次应减一 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    (</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">new_count)</span><span style="color:#F47067;">--</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /* 打印出*new_count的值 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">qDebug</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;undo:&quot;</span><span style="color:#F47067;">&lt;&lt;*</span><span style="color:#ADBAC7;">new_count</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">addCommand</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">addCommand</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;command.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;QDebug&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">addCommand</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">addCommand</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">value, QUndoCommand </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">parent)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 使用Q_UNUSED,避免未使用的数据类型 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Q_UNUSED</span><span style="color:#24292E;">(parent);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* undoView显示的操作信息 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setText</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;进行了加1操作&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* value的地址赋值给new_count */</span></span>
<span class="line"><span style="color:#24292E;">    new_count </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> value;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 让构造函数传过来的*new_count的值赋值给old_count */</span></span>
<span class="line"><span style="color:#24292E;">    old_count </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">new_count;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 执行stack push时或者重做操作时会自动调用 */</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">addCommand</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">redo</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 重新赋值给new_count */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">new_count </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> old_count;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 打印出*new_count的值 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;redo:&quot;</span><span style="color:#D73A49;">&lt;&lt;*</span><span style="color:#24292E;">new_count</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/* 回撤操作时执行 */</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">addCommand</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">undo</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    /* 回撤操作每次应减一 */</span></span>
<span class="line"><span style="color:#24292E;">    (</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">new_count)</span><span style="color:#D73A49;">--</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /* 打印出*new_count的值 */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">qDebug</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;undo:&quot;</span><span style="color:#D73A49;">&lt;&lt;*</span><span style="color:#24292E;">new_count</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">addCommand</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">addCommand</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,28);function w(s,m,g,Q,h,b){const o=t,e=C("ClientOnly");return l(),r("div",null,[E,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):d("",!0)]}),_:1}),u])}const M=c(F,[["render",w]]);export{v as __pageData,M as default};
