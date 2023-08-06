import{_ as t}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as c,v as l,b as r,E as y,O as i,F as p,L as A,R as D,M as C,C as B,B as F}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const k=JSON.parse('{"title":"for循环中删除集合元素隐藏的陷阱","description":"","frontmatter":{"title":"for循环中删除集合元素隐藏的陷阱","author":"查尔斯","date":"2021/12/08 20:00","categories":["Bug万象集"],"tags":["Java集合"]},"headers":[],"relativePath":"categories/issues/2021/12/08/for循环中删除集合元素隐藏的陷阱.md","filePath":"categories/issues/2021/12/08/for循环中删除集合元素隐藏的陷阱.md","lastUpdated":1691327334000}'),E={name:"categories/issues/2021/12/08/for循环中删除集合元素隐藏的陷阱.md"},d=p("h1",{id:"for循环中删除集合元素隐藏的陷阱",tabindex:"-1"},[A("for循环中删除集合元素隐藏的陷阱 "),p("a",{class:"header-anchor",href:"#for循环中删除集合元素隐藏的陷阱","aria-label":'Permalink to "for循环中删除集合元素隐藏的陷阱"'},"​")],-1),h=D(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p><strong>C：</strong> 今天在审查代码时，发现某位同事提交的代码中有一个比较基础性的错误。</p><p>这部分需求的主要目的是将集合中指定的元素删除掉，而这位同事采用的方法是用 for 循环来循环集合索引，然后通过索引从集合中取出每一个元素，判断是否是要删除的元素，如果是就直接删除掉。</p><p><strong>大概意思的代码，如下：</strong></p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">// 创建集合，并初始化数据</span></span>
<span class="line"><span style="color:#ADBAC7;">List</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">list</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> ArrayList&lt;&gt;(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// 删除元素值为 2 的元素</span></span>
<span class="line"><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">i</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(); i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (Objects.</span><span style="color:#DCBDFB;">equals</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">get</span><span style="color:#ADBAC7;">(i), </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">(i);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line highlighted"><span style="color:#ADBAC7;">System.out.</span><span style="color:#DCBDFB;">println</span><span style="color:#ADBAC7;">(list); </span><span style="color:#768390;">// [1, 3, 4]</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">// 创建集合，并初始化数据</span></span>
<span class="line"><span style="color:#24292E;">List&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 删除元素值为 2 的元素</span></span>
<span class="line"><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(); i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Objects.</span><span style="color:#6F42C1;">equals</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(i), </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)) {</span></span>
<span class="line highlighted"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">(i);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line highlighted"><span style="color:#24292E;">System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(list); </span><span style="color:#6A737D;">// [1, 3, 4]</span></span></code></pre></div><p>笔者知道，肯定有同学会好奇，这结果是正确的啊，哪里有什么问题？的确，这个思路没问题，问题的关键是这位同事采用的循环方式存在问题。</p><p>别着急，接下来，笔者就带各位同学好好测试一下。</p><h2 id="测试代码" tabindex="-1">测试代码 <a class="header-anchor" href="#测试代码" aria-label="Permalink to &quot;测试代码&quot;">​</a></h2><h3 id="基础for循环中删除" tabindex="-1">基础for循环中删除 <a class="header-anchor" href="#基础for循环中删除" aria-label="Permalink to &quot;基础for循环中删除&quot;">​</a></h3><p>直接放代码吧，下方是使用基础的 for 循环（循环索引）来实现的集合元素删除，比之 前言 中的代码，无非是要删除的元素 2 有重复，变成了两个。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@author</span><span style="color:#768390;"> Charles7c</span></span>
<span class="line"><span style="color:#768390;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#ADBAC7;">@</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ListRemoveEleInForLoopTest</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> List</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">BeforeEach</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        list </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> ArrayList&lt;&gt;(</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 运行无异常，测试符合预期 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Test</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;基础for循环中删除元素测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">testBasicForLoop</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">i</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(); i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (Objects.</span><span style="color:#DCBDFB;">equals</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">get</span><span style="color:#ADBAC7;">(i), </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#768390;">// IDEA警告：Suspicious &#39;List.remove()&#39; in the loop</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">                list.</span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">(i);</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        System.out.</span><span style="color:#DCBDFB;">println</span><span style="color:#ADBAC7;">(list); </span><span style="color:#768390;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#ADBAC7;">        Assertions.</span><span style="color:#DCBDFB;">assertEquals</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(), </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@author</span><span style="color:#6A737D;"> Charles7c</span></span>
<span class="line"><span style="color:#6A737D;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ListRemoveEleInForLoopTest</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> List&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">BeforeEach</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 运行无异常，测试符合预期 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Test</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;基础for循环中删除元素测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">testBasicForLoop</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(); i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Objects.</span><span style="color:#6F42C1;">equals</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(i), </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// IDEA警告：Suspicious &#39;List.remove()&#39; in the loop</span></span>
<span class="line highlighted"><span style="color:#24292E;">                list.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">(i);</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line highlighted"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(list); </span><span style="color:#6A737D;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#24292E;">        Assertions.</span><span style="color:#6F42C1;">assertEquals</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(), </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>测试结果也是正常的啊，莫非笔者失手了？别着急 ...</p><p>我们再来测试一下，这回我们稍微调整下重复元素的位置，将重复的元素移动到相邻位置。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@author</span><span style="color:#768390;"> Charles7c</span></span>
<span class="line"><span style="color:#768390;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#ADBAC7;">@</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ListRemoveEleInForLoopTest</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> List</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">BeforeEach</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        list </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> ArrayList&lt;&gt;(</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 运行无异常，测试不通过 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Test</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;基础for循环中删除元素测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">testBasicForLoop</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">i</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(); i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (Objects.</span><span style="color:#DCBDFB;">equals</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">get</span><span style="color:#ADBAC7;">(i), </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#768390;">// IDEA警告：Suspicious &#39;List.remove()&#39; in the loop</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">                list.</span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">(i);</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        System.out.</span><span style="color:#DCBDFB;">println</span><span style="color:#ADBAC7;">(list); </span><span style="color:#768390;">// [1, 2, 3, 4]</span></span>
<span class="line"><span style="color:#ADBAC7;">        Assertions.</span><span style="color:#DCBDFB;">assertEquals</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(), </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@author</span><span style="color:#6A737D;"> Charles7c</span></span>
<span class="line"><span style="color:#6A737D;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ListRemoveEleInForLoopTest</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> List&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">BeforeEach</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 运行无异常，测试不通过 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Test</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;基础for循环中删除元素测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">testBasicForLoop</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(); i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Objects.</span><span style="color:#6F42C1;">equals</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(i), </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// IDEA警告：Suspicious &#39;List.remove()&#39; in the loop</span></span>
<span class="line highlighted"><span style="color:#24292E;">                list.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">(i);</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line highlighted"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(list); </span><span style="color:#6A737D;">// [1, 2, 3, 4]</span></span>
<span class="line"><span style="color:#24292E;">        Assertions.</span><span style="color:#6F42C1;">assertEquals</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(), </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>测试不通过，why？</p><p><strong>原因很简单：</strong> ArrayList 是基于数组结构而来的，在实现 E remove(int index) 方法时，也是在操作数组而已。</p><p><strong>E remove(int index) 方法的源代码，如下：</strong></p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * Removes the element at the specified position in this list.</span></span>
<span class="line"><span style="color:#768390;"> * Shifts any subsequent elements to the left (subtracts one from their</span></span>
<span class="line"><span style="color:#768390;"> * indices).</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@param</span><span style="color:#768390;"> </span><span style="color:#F69D50;">index</span><span style="color:#768390;"> the index of the element to be removed</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@return</span><span style="color:#768390;"> the element that was removed from the list</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@throws</span><span style="color:#768390;"> </span><span style="color:#F69D50;">IndexOutOfBoundsException</span><span style="color:#768390;"> {@inheritDoc}</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> E </span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> index) {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">rangeCheck</span><span style="color:#ADBAC7;">(index);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    modCount</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    E</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">oldValue</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">elementData</span><span style="color:#ADBAC7;">(index);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">numMoved</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> size </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> index </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (numMoved </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">// 表面看是在拷贝数组，但是源数组和目标数组都是同一个，所以是移动数组元素而已</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">// 例如：[1, 2, 3, 4] -&gt; [1, 3, 4, 4]</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        System.</span><span style="color:#DCBDFB;">arraycopy</span><span style="color:#ADBAC7;">(elementData, index</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, elementData, index,</span></span>
<span class="line"><span style="color:#ADBAC7;">                numMoved);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// 元素数量-1，并清除多余元素</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// 例如：[1, 2, 3, 4] -&gt; [1, 3, 4, 4]</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// 最后一个4就是多余的，置为默认值 null</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">    elementData[</span><span style="color:#F47067;">--</span><span style="color:#ADBAC7;">size] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">null</span><span style="color:#ADBAC7;">; </span><span style="color:#768390;">// clear to let GC do its work</span></span>
<span class="line"><span style="color:#ADBAC7;">	</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> oldValue;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Removes the element at the specified position in this list.</span></span>
<span class="line"><span style="color:#6A737D;"> * Shifts any subsequent elements to the left (subtracts one from their</span></span>
<span class="line"><span style="color:#6A737D;"> * indices).</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">index</span><span style="color:#6A737D;"> the index of the element to be removed</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> the element that was removed from the list</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@throws</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">IndexOutOfBoundsException</span><span style="color:#6A737D;"> {@inheritDoc}</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> E </span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> index) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">rangeCheck</span><span style="color:#24292E;">(index);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    modCount</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    E oldValue </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">elementData</span><span style="color:#24292E;">(index);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> numMoved </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> size </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> index </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (numMoved </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 表面看是在拷贝数组，但是源数组和目标数组都是同一个，所以是移动数组元素而已</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 例如：[1, 2, 3, 4] -&gt; [1, 3, 4, 4]</span></span>
<span class="line highlighted"><span style="color:#24292E;">        System.</span><span style="color:#6F42C1;">arraycopy</span><span style="color:#24292E;">(elementData, index</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, elementData, index,</span></span>
<span class="line"><span style="color:#24292E;">                numMoved);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 元素数量-1，并清除多余元素</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 例如：[1, 2, 3, 4] -&gt; [1, 3, 4, 4]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 最后一个4就是多余的，置为默认值 null</span></span>
<span class="line highlighted"><span style="color:#24292E;">    elementData[</span><span style="color:#D73A49;">--</span><span style="color:#24292E;">size] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">; </span><span style="color:#6A737D;">// clear to let GC do its work</span></span>
<span class="line"><span style="color:#24292E;">	</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> oldValue;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>这样的话就会导致，在循环索引中删除完某个元素，其后面的元素移动到这个元素的位置，但是循环的索引可没回退，这样在取值时就会 <strong>跳过下一个元素</strong> 。（看不懂的话，可以debug一下，很清晰的）</p><p>如果被删除元素的下一个元素不是匹配条件的，那还问题不显，但是如果被删除元素的下一个元素也是匹配条件的，也就会出现刚才测试的结果了。</p><p>知道了问题的根源，要是还想要用这种循环，加一行代码就可以了。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@author</span><span style="color:#768390;"> Charles7c</span></span>
<span class="line"><span style="color:#768390;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#ADBAC7;">@</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ListRemoveEleInForLoopTest</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> List</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">BeforeEach</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        list </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> ArrayList&lt;&gt;(</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 运行无异常，测试不通过 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Test</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;基础for循环中删除元素测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">testBasicForLoop</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">int</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">i</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(); i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (Objects.</span><span style="color:#DCBDFB;">equals</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">get</span><span style="color:#ADBAC7;">(i), </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#768390;">// IDEA警告：Suspicious &#39;List.remove()&#39; in the loop</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">                list.</span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">(i);</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#768390;">// !!!回退索引!!!</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">                i</span><span style="color:#F47067;">--</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        System.out.</span><span style="color:#DCBDFB;">println</span><span style="color:#ADBAC7;">(list); </span><span style="color:#768390;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#ADBAC7;">        Assertions.</span><span style="color:#DCBDFB;">assertEquals</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(), </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@author</span><span style="color:#6A737D;"> Charles7c</span></span>
<span class="line"><span style="color:#6A737D;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ListRemoveEleInForLoopTest</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> List&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">BeforeEach</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 运行无异常，测试不通过 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Test</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;基础for循环中删除元素测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">testBasicForLoop</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(); i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Objects.</span><span style="color:#6F42C1;">equals</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(i), </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// IDEA警告：Suspicious &#39;List.remove()&#39; in the loop</span></span>
<span class="line highlighted"><span style="color:#24292E;">                list.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">(i);</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// !!!回退索引!!!</span></span>
<span class="line highlighted"><span style="color:#24292E;">                i</span><span style="color:#D73A49;">--</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line highlighted"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(list); </span><span style="color:#6A737D;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#24292E;">        Assertions.</span><span style="color:#6F42C1;">assertEquals</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(), </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="增强for循环中删除" tabindex="-1">增强for循环中删除 <a class="header-anchor" href="#增强for循环中删除" aria-label="Permalink to &quot;增强for循环中删除&quot;">​</a></h3><p>显然，在基础 for 循环中删除元素，这种方法并不是最好的，那我们就再来看看其他的循环方式吧。</p><p>简单改动下代码，看看平时出场频率也很高的增强 for 循环会如何？</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@author</span><span style="color:#768390;"> Charles7c</span></span>
<span class="line"><span style="color:#768390;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#ADBAC7;">@</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ListRemoveEleInForLoopTest</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> List</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">BeforeEach</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        list </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> ArrayList&lt;&gt;(</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 运行时异常：java.util.ConcurrentModificationException */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Test</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;增强for循环中删除元素测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">testForEachLoop</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (Integer</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">num</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> list) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (Objects.</span><span style="color:#DCBDFB;">equals</span><span style="color:#ADBAC7;">(num, </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">                list.</span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">(num);</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        System.out.</span><span style="color:#DCBDFB;">println</span><span style="color:#ADBAC7;">(list);</span></span>
<span class="line"><span style="color:#ADBAC7;">        Assertions.</span><span style="color:#DCBDFB;">assertSame</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(), </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@author</span><span style="color:#6A737D;"> Charles7c</span></span>
<span class="line"><span style="color:#6A737D;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ListRemoveEleInForLoopTest</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> List&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">BeforeEach</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 运行时异常：java.util.ConcurrentModificationException */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Test</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;增强for循环中删除元素测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">testForEachLoop</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (Integer num </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> list) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Objects.</span><span style="color:#6F42C1;">equals</span><span style="color:#24292E;">(num, </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)) {</span></span>
<span class="line highlighted"><span style="color:#24292E;">                list.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">(num);</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(list);</span></span>
<span class="line"><span style="color:#24292E;">        Assertions.</span><span style="color:#6F42C1;">assertSame</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(), </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>测试中断，删除一个元素后继续循环会抛出运行时异常：java.util.ConcurrentModificationException。 Pass ...</p><h3 id="迭代器中删除" tabindex="-1">迭代器中删除 <a class="header-anchor" href="#迭代器中删除" aria-label="Permalink to &quot;迭代器中删除&quot;">​</a></h3><p>最后，我们再尝试一种循环：迭代器，可能对于部分同学来说，平时使用相对要少一些。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@author</span><span style="color:#768390;"> Charles7c</span></span>
<span class="line"><span style="color:#768390;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#ADBAC7;">@</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ListRemoveEleInForLoopTest</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> List</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">BeforeEach</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        list </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> ArrayList&lt;&gt;(</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 运行无异常，测试符合预期 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Test</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;迭代器中删除元素测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">testIterator</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        Iterator</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">iterator</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> list.</span><span style="color:#DCBDFB;">iterator</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (iterator.</span><span style="color:#DCBDFB;">hasNext</span><span style="color:#ADBAC7;">()) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            Integer</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">num</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> iterator.</span><span style="color:#DCBDFB;">next</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (Objects.</span><span style="color:#DCBDFB;">equals</span><span style="color:#ADBAC7;">(num, </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">)) {</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">                iterator.</span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        System.out.</span><span style="color:#DCBDFB;">println</span><span style="color:#ADBAC7;">(list); </span><span style="color:#768390;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#ADBAC7;">        Assertions.</span><span style="color:#DCBDFB;">assertSame</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(), </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@author</span><span style="color:#6A737D;"> Charles7c</span></span>
<span class="line"><span style="color:#6A737D;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ListRemoveEleInForLoopTest</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> List&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">BeforeEach</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 运行无异常，测试符合预期 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Test</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;迭代器中删除元素测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">testIterator</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        Iterator&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; iterator </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> list.</span><span style="color:#6F42C1;">iterator</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (iterator.</span><span style="color:#6F42C1;">hasNext</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#24292E;">            Integer num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> iterator.</span><span style="color:#6F42C1;">next</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (Objects.</span><span style="color:#6F42C1;">equals</span><span style="color:#24292E;">(num, </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)) {</span></span>
<span class="line highlighted"><span style="color:#24292E;">                iterator.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line highlighted"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(list); </span><span style="color:#6A737D;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#24292E;">        Assertions.</span><span style="color:#6F42C1;">assertSame</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(), </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>测试通过，这种方式也是平时 <strong>推荐大家采用</strong> 的，而且在 Java 8 中，官方还为我们在 Collection 接口中提供了一个 default 方法来简化集合删除元素。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@author</span><span style="color:#768390;"> Charles7c</span></span>
<span class="line"><span style="color:#768390;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#ADBAC7;">@</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ListRemoveEleInForLoopTest</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> List</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">Integer</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">BeforeEach</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        list </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> ArrayList&lt;&gt;(</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">add</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /** 运行无异常，测试符合预期 */</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Test</span></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">DisplayName</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;迭代器中删除元素测试&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">testIterator</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">// Java 8 在 Collection 接口中提供的 default 方法</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        list.</span><span style="color:#DCBDFB;">removeIf</span><span style="color:#ADBAC7;">(num </span><span style="color:#F47067;">-&gt;</span><span style="color:#ADBAC7;"> Objects.</span><span style="color:#DCBDFB;">equals</span><span style="color:#ADBAC7;">(num, </span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"><span style="color:#ADBAC7;">        System.out.</span><span style="color:#DCBDFB;">println</span><span style="color:#ADBAC7;">(list); </span><span style="color:#768390;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#ADBAC7;">        Assertions.</span><span style="color:#DCBDFB;">assertSame</span><span style="color:#ADBAC7;">(list.</span><span style="color:#DCBDFB;">size</span><span style="color:#ADBAC7;">(), </span><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * List集合-循环中删除元素-测试</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@author</span><span style="color:#6A737D;"> Charles7c</span></span>
<span class="line"><span style="color:#6A737D;"> * @date 2021/12/8 20:59</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;List集合-循环中删除元素-测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ListRemoveEleInForLoopTest</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> List&lt;</span><span style="color:#D73A49;">Integer</span><span style="color:#24292E;">&gt; list;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 初始化数据 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">BeforeEach</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        list </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> ArrayList&lt;&gt;(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /** 运行无异常，测试符合预期 */</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Test</span></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">DisplayName</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;迭代器中删除元素测试&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">testIterator</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// Java 8 在 Collection 接口中提供的 default 方法</span></span>
<span class="line highlighted"><span style="color:#24292E;">        list.</span><span style="color:#6F42C1;">removeIf</span><span style="color:#24292E;">(num </span><span style="color:#D73A49;">-&gt;</span><span style="color:#24292E;"> Objects.</span><span style="color:#6F42C1;">equals</span><span style="color:#24292E;">(num, </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">));</span></span>
<span class="line"><span style="color:#24292E;">        System.out.</span><span style="color:#6F42C1;">println</span><span style="color:#24292E;">(list); </span><span style="color:#6A737D;">// [1, 3, 4]</span></span>
<span class="line"><span style="color:#24292E;">        Assertions.</span><span style="color:#6F42C1;">assertSame</span><span style="color:#24292E;">(list.</span><span style="color:#6F42C1;">size</span><span style="color:#24292E;">(), </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p><strong>Collection 接口的 removeIf() 方法的源代码，如下：</strong></p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">interface</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Collection</span><span style="color:#ADBAC7;">&lt;</span><span style="color:#F47067;">E</span><span style="color:#ADBAC7;">&gt; </span><span style="color:#F47067;">extends</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Iterable</span><span style="color:#ADBAC7;">&lt;</span><span style="color:#F47067;">E</span><span style="color:#ADBAC7;">&gt; {</span></span>
<span class="line"><span style="color:#768390;">    /**</span></span>
<span class="line"><span style="color:#768390;">     * Removes all of the elements of this collection that satisfy the given</span></span>
<span class="line"><span style="color:#768390;">     * predicate.  Errors or runtime exceptions thrown during iteration or by</span></span>
<span class="line"><span style="color:#768390;">     * the predicate are relayed to the caller.</span></span>
<span class="line"><span style="color:#768390;">     *</span></span>
<span class="line"><span style="color:#768390;">     * @implSpec</span></span>
<span class="line"><span style="color:#768390;">     * The default implementation traverses all elements of the collection using</span></span>
<span class="line"><span style="color:#768390;">     * its {@link #iterator}.  Each matching element is removed using</span></span>
<span class="line"><span style="color:#768390;">     * {</span><span style="color:#F47067;">@link</span><span style="color:#768390;"> </span><span style="color:#F69D50;">Iterator</span><span style="color:#768390;">#</span><span style="color:#F69D50;">remove()</span><span style="color:#768390;">}.  If the collection&#39;s iterator does not</span></span>
<span class="line"><span style="color:#768390;">     * support removal then an {@code UnsupportedOperationException} will be</span></span>
<span class="line"><span style="color:#768390;">     * thrown on the first matching element.</span></span>
<span class="line"><span style="color:#768390;">     *</span></span>
<span class="line"><span style="color:#768390;">     * </span><span style="color:#F47067;">@param</span><span style="color:#768390;"> </span><span style="color:#F69D50;">filter</span><span style="color:#768390;"> a predicate which returns {@code true} for elements to be</span></span>
<span class="line"><span style="color:#768390;">     *        removed</span></span>
<span class="line"><span style="color:#768390;">     * </span><span style="color:#F47067;">@return</span><span style="color:#768390;"> {@code true} if any elements were removed</span></span>
<span class="line"><span style="color:#768390;">     * </span><span style="color:#F47067;">@throws</span><span style="color:#768390;"> </span><span style="color:#F69D50;">NullPointerException</span><span style="color:#768390;"> if the specified filter is null</span></span>
<span class="line"><span style="color:#768390;">     * </span><span style="color:#F47067;">@throws</span><span style="color:#768390;"> </span><span style="color:#F69D50;">UnsupportedOperationException</span><span style="color:#768390;"> if elements cannot be removed</span></span>
<span class="line"><span style="color:#768390;">     *         from this collection.  Implementations may throw this exception if a</span></span>
<span class="line"><span style="color:#768390;">     *         matching element cannot be removed or if, in general, removal is not</span></span>
<span class="line"><span style="color:#768390;">     *         supported.</span></span>
<span class="line"><span style="color:#768390;">     * </span><span style="color:#F47067;">@since</span><span style="color:#768390;"> 1.8</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">default</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">boolean</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">removeIf</span><span style="color:#ADBAC7;">(Predicate&lt;</span><span style="color:#F47067;">?</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">super</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">E</span><span style="color:#ADBAC7;">&gt; </span><span style="color:#F69D50;">filter</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        Objects.</span><span style="color:#DCBDFB;">requireNonNull</span><span style="color:#ADBAC7;">(filter);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">boolean</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">removed</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">final</span><span style="color:#ADBAC7;"> Iterator</span><span style="color:#F69D50;">&lt;</span><span style="color:#F47067;">E</span><span style="color:#F69D50;">&gt; </span><span style="color:#ADBAC7;">each</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">iterator</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (each.</span><span style="color:#DCBDFB;">hasNext</span><span style="color:#ADBAC7;">()) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (filter.</span><span style="color:#DCBDFB;">test</span><span style="color:#ADBAC7;">(each.</span><span style="color:#DCBDFB;">next</span><span style="color:#ADBAC7;">())) {</span></span>
<span class="line highlighted"><span style="color:#ADBAC7;">                each.</span><span style="color:#DCBDFB;">remove</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">                removed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> removed;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// 省略其他代码...</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Collection</span><span style="color:#24292E;">&lt;</span><span style="color:#D73A49;">E</span><span style="color:#24292E;">&gt; </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Iterable</span><span style="color:#24292E;">&lt;</span><span style="color:#D73A49;">E</span><span style="color:#24292E;">&gt; {</span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Removes all of the elements of this collection that satisfy the given</span></span>
<span class="line"><span style="color:#6A737D;">     * predicate.  Errors or runtime exceptions thrown during iteration or by</span></span>
<span class="line"><span style="color:#6A737D;">     * the predicate are relayed to the caller.</span></span>
<span class="line"><span style="color:#6A737D;">     *</span></span>
<span class="line"><span style="color:#6A737D;">     * @implSpec</span></span>
<span class="line"><span style="color:#6A737D;">     * The default implementation traverses all elements of the collection using</span></span>
<span class="line"><span style="color:#6A737D;">     * its {@link #iterator}.  Each matching element is removed using</span></span>
<span class="line"><span style="color:#6A737D;">     * {</span><span style="color:#D73A49;">@link</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">Iterator</span><span style="color:#6A737D;">#</span><span style="color:#E36209;">remove()</span><span style="color:#6A737D;">}.  If the collection&#39;s iterator does not</span></span>
<span class="line"><span style="color:#6A737D;">     * support removal then an {@code UnsupportedOperationException} will be</span></span>
<span class="line"><span style="color:#6A737D;">     * thrown on the first matching element.</span></span>
<span class="line"><span style="color:#6A737D;">     *</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">filter</span><span style="color:#6A737D;"> a predicate which returns {@code true} for elements to be</span></span>
<span class="line"><span style="color:#6A737D;">     *        removed</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> {@code true} if any elements were removed</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@throws</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">NullPointerException</span><span style="color:#6A737D;"> if the specified filter is null</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@throws</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">UnsupportedOperationException</span><span style="color:#6A737D;"> if elements cannot be removed</span></span>
<span class="line"><span style="color:#6A737D;">     *         from this collection.  Implementations may throw this exception if a</span></span>
<span class="line"><span style="color:#6A737D;">     *         matching element cannot be removed or if, in general, removal is not</span></span>
<span class="line"><span style="color:#6A737D;">     *         supported.</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@since</span><span style="color:#6A737D;"> 1.8</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">removeIf</span><span style="color:#24292E;">(Predicate&lt;</span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">super</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">E</span><span style="color:#24292E;">&gt; </span><span style="color:#E36209;">filter</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        Objects.</span><span style="color:#6F42C1;">requireNonNull</span><span style="color:#24292E;">(filter);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">boolean</span><span style="color:#24292E;"> removed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line highlighted"><span style="color:#24292E;">        </span><span style="color:#D73A49;">final</span><span style="color:#24292E;"> Iterator&lt;</span><span style="color:#D73A49;">E</span><span style="color:#24292E;">&gt; each </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">iterator</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (each.</span><span style="color:#6F42C1;">hasNext</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (filter.</span><span style="color:#6F42C1;">test</span><span style="color:#24292E;">(each.</span><span style="color:#6F42C1;">next</span><span style="color:#24292E;">())) {</span></span>
<span class="line highlighted"><span style="color:#24292E;">                each.</span><span style="color:#6F42C1;">remove</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">                removed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> removed;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 省略其他代码...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>很显然，官方也是用的迭代器来实现的。</p><h2 id="后记" tabindex="-1">后记 <a class="header-anchor" href="#后记" aria-label="Permalink to &quot;后记&quot;">​</a></h2><p><strong>C：</strong> 虽然是一个小问题，但是见到的犯错者无数，以前并未当回事，这次遇到正好记录一下，给各位同学一个提醒。</p>`,37);function u(s,g,m,v,f,b){const o=t,e=C("ClientOnly");return l(),r("div",null,[d,y(e,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),h])}const x=c(E,[["render",u]]);export{k as __pageData,x as default};
