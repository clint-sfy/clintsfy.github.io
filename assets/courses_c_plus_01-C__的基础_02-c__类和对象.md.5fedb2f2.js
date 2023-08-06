import{_ as c}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as t,v as l,b as r,E as y,O as A,F as p,L as i,R as D,M as C,C as B,B as F}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const _=JSON.parse('{"title":"C++类和对象","description":"","frontmatter":{"title":"C++类和对象","author":"阿源","date":"2023/02/02 21:29","categories":["C++基础快速入门"],"tags":["C++","C++基础","类和对象"]},"headers":[],"relativePath":"courses/c_plus/01-C++的基础/02-c++类和对象.md","filePath":"courses/c_plus/01-C++的基础/02-c++类和对象.md","lastUpdated":1691327334000}'),E={name:"courses/c_plus/01-C++的基础/02-c++类和对象.md"},d=p("h1",{id:"类和对象",tabindex:"-1"},[i("类和对象 "),p("a",{class:"header-anchor",href:"#类和对象","aria-label":'Permalink to "类和对象"'},"​")],-1),u=D(`<h2 id="_1-类的概述" tabindex="-1">1. 类的概述 <a class="header-anchor" href="#_1-类的概述" aria-label="Permalink to &quot;1. 类的概述&quot;">​</a></h2><p>类将数据和方法封装在一起，加以权限区分，用户只能通过公共方法 访问私有数据。</p><h3 id="_1、定义一个类-关键字class" tabindex="-1">1、定义一个类 关键字class <a class="header-anchor" href="#_1、定义一个类-关键字class" aria-label="Permalink to &quot;1、定义一个类 关键字class&quot;">​</a></h3><p>类的权限分为：private、protected、public。但是在类的内部 不存在 权限之分。只是对类外有效。 如果类不涉及到继承，private、protected没有区别，都是私有属性。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> #include </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">iostream</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#768390;"> //类Data1 是一个类型</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data1</span></span>
<span class="line"><span style="color:#ADBAC7;">7 {</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#768390;"> //类中 默认为私有</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span><span style="color:#768390;">//不要给类中成员 初始化</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">protected:</span><span style="color:#768390;">//保护</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span><span style="color:#768390;">//公共</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#768390;"> //在类的内部 不存在 权限之分</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">showData</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">b</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">c</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#768390;"> //类实例化一个对象</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> Data1 ob;</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#768390;"> //类外不能直接访问 类的私有和保护数据</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#768390;"> //cout&lt;&lt;ob.a &lt;&lt;endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#768390;"> //cout&lt;&lt;ob.b &lt;&lt;endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.c </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#768390;">    //类中的成员函数 需要对象调用</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">showData</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> #include </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">iostream</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#005CC5;">2</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">4</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#6A737D;"> //类Data1 是一个类型</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data1</span></span>
<span class="line"><span style="color:#24292E;">7 {</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#6A737D;"> //类中 默认为私有</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span><span style="color:#6A737D;">//不要给类中成员 初始化</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">protected:</span><span style="color:#6A737D;">//保护</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span><span style="color:#6A737D;">//公共</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#6A737D;"> //在类的内部 不存在 权限之分</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showData</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">b</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">c</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#6A737D;"> //类实例化一个对象</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> Data1 ob;</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#6A737D;"> //类外不能直接访问 类的私有和保护数据</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#6A737D;"> //cout&lt;&lt;ob.a &lt;&lt;endl;</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#6A737D;"> //cout&lt;&lt;ob.b &lt;&lt;endl;</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.c </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">29</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#6A737D;">    //类中的成员函数 需要对象调用</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">showData</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> }</span></span></code></pre></div><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB1.png" alt=""></p><h2 id="_2-实现一个类" tabindex="-1">2. 实现一个类 <a class="header-anchor" href="#_2-实现一个类" aria-label="Permalink to &quot;2. 实现一个类&quot;">​</a></h2><h3 id="请设计一个person类" tabindex="-1">请设计一个Person类 <a class="header-anchor" href="#请设计一个person类" aria-label="Permalink to &quot;请设计一个Person类&quot;">​</a></h3><p>请设计一个Person类，Person类具有name和age属性，提供初始化函数(Init)，并提供对name和age的读写函数(set，get)，但必须确保age的赋值在有效范围内(0-100),超出有效范围，则拒绝赋值，并提供方法输出姓名和年龄</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#96D0FF;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Person</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> mName[</span><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mAge;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#768390;">    //初始化成员</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">age</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(mName, name);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(age</span><span style="color:#F47067;">&gt;=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> age</span><span style="color:#F47067;">&lt;=</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            mAge </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> age;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;年龄无效&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //设置name</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setName</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(mName, name);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //获取name</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">getName</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> mName;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //设置age</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setAge</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">age</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(age</span><span style="color:#F47067;">&gt;=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> age</span><span style="color:#F47067;">&lt;=</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            mAge </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> age;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;年龄无效&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //得到age</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getAge</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> mAge;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //显示所有数据</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">showPerson</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mName</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mAge</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#032F62;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Person</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> mName[</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mAge;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#6A737D;">    //初始化成员</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">init</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">name</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">age</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(mName, name);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(age</span><span style="color:#D73A49;">&gt;=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> age</span><span style="color:#D73A49;">&lt;=</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            mAge </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> age;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;年龄无效&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //设置name</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setName</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">name</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(mName, name);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //获取name</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">getName</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> mName;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //设置age</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setAge</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">age</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(age</span><span style="color:#D73A49;">&gt;=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> age</span><span style="color:#D73A49;">&lt;=</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            mAge </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> age;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;年龄无效&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //得到age</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getAge</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> mAge;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //显示所有数据</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showPerson</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mName</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mAge</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h3 id="点和圆的关系" tabindex="-1"><strong>点和圆的关系</strong> <a class="header-anchor" href="#点和圆的关系" aria-label="Permalink to &quot;**点和圆的关系**&quot;">​</a></h3><p>设计一个圆形类（AdvCircle），和一个点类（Point），计算点和圆的关系。 假如圆心坐标为x0, y0, 半径为r，点的坐标为x1, y1： 1）点在圆上：(x1-x0)(x1-x0) + (y1-y0)(y1-y0) == rr 2）点在圆内：(x1-x0)(x1-x0) + (y1-y0)(y1-y0) &lt; rr 3）点在圆外：(x1-x0)(x1-x0) + (y1-y0)(y1-y0) &gt; r*r</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Point</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mX;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mY;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setX</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">x</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mX </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> x;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getX</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> mX;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setY</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">y</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mY </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> y;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getY</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> mY;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Circle</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    Point p;</span><span style="color:#768390;">//对象作为类的成员变量</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mR;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setPoint</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">x</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">y</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        p.</span><span style="color:#DCBDFB;">setX</span><span style="color:#ADBAC7;">(x);</span></span>
<span class="line"><span style="color:#ADBAC7;">        p.</span><span style="color:#DCBDFB;">setY</span><span style="color:#ADBAC7;">(y);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">Point</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getPoint</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setR</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">r</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mR </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> r;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getR</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> mR;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //判断点 在圆的位置</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">pointIsOnCircle</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Point</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> len </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (ob.</span><span style="color:#DCBDFB;">getX</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;">p.</span><span style="color:#DCBDFB;">getX</span><span style="color:#ADBAC7;">())</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">(ob.</span><span style="color:#DCBDFB;">getX</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;">p.</span><span style="color:#DCBDFB;">getX</span><span style="color:#ADBAC7;">())</span><span style="color:#F47067;">+\\</span></span>
<span class="line"><span style="color:#ADBAC7;">                (ob.</span><span style="color:#DCBDFB;">getY</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;">p.</span><span style="color:#DCBDFB;">getY</span><span style="color:#ADBAC7;">())</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">(ob.</span><span style="color:#DCBDFB;">getY</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;">p.</span><span style="color:#DCBDFB;">getY</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(len </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> mR</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">mR)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(len </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> mR</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">mR)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(len </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> mR</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">mR)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Point</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mX;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mY;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setX</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">x</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mX </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> x;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getX</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> mX;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setY</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">y</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mY </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> y;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getY</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> mY;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Circle</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    Point p;</span><span style="color:#6A737D;">//对象作为类的成员变量</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mR;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setPoint</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">x</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">y</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        p.</span><span style="color:#6F42C1;">setX</span><span style="color:#24292E;">(x);</span></span>
<span class="line"><span style="color:#24292E;">        p.</span><span style="color:#6F42C1;">setY</span><span style="color:#24292E;">(y);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Point</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getPoint</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setR</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">r</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mR </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> r;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getR</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> mR;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //判断点 在圆的位置</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">pointIsOnCircle</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Point</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> len </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (ob.</span><span style="color:#6F42C1;">getX</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">p.</span><span style="color:#6F42C1;">getX</span><span style="color:#24292E;">())</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">(ob.</span><span style="color:#6F42C1;">getX</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">p.</span><span style="color:#6F42C1;">getX</span><span style="color:#24292E;">())</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">                (ob.</span><span style="color:#6F42C1;">getY</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">p.</span><span style="color:#6F42C1;">getY</span><span style="color:#24292E;">())</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">(ob.</span><span style="color:#6F42C1;">getY</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">p.</span><span style="color:#6F42C1;">getY</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(len </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> mR</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">mR)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(len </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> mR</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">mR)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(len </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> mR</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">mR)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h2 id="_3-成员函数在类外实现" tabindex="-1">3. 成员函数在类外实现 <a class="header-anchor" href="#_3-成员函数在类外实现" aria-label="Permalink to &quot;3. 成员函数在类外实现&quot;">​</a></h2><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">class Data2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#ADBAC7;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setA</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test05</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data2 ob;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">setA</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#F47067;">[]</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">test05</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#768390;">// 利用作用域符号</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> Data2::</span><span style="color:#DCBDFB;">setA</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> Data2::</span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">class Data2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#24292E;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setA</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test05</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data2 ob;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">setA</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#D73A49;">[]</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">test05</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6A737D;">// 利用作用域符号</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> Data2::</span><span style="color:#6F42C1;">setA</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> Data2::</span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_4-类在其他文件实现" tabindex="-1">4.类在其他文件实现 <a class="header-anchor" href="#_4-类在其他文件实现" aria-label="Permalink to &quot;4.类在其他文件实现&quot;">​</a></h2><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">DATA_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">DATA_H</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setA</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // DATA_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DATA_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DATA_H</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setA</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // DATA_H</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;data.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">setA</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;data.h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">setA</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;data.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data ob;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">setA</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;data.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data ob;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">setA</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_5-构造函数" tabindex="-1">5. 构造函数 <a class="header-anchor" href="#_5-构造函数" aria-label="Permalink to &quot;5. 构造函数&quot;">​</a></h2><h3 id="_1、构造函数的概述" tabindex="-1">1、构造函数的概述 <a class="header-anchor" href="#_1、构造函数的概述" aria-label="Permalink to &quot;1、构造函数的概述&quot;">​</a></h3><p>构造函数 是类实例化对象的时候自动调用。</p><h3 id="_2、创建构造函数" tabindex="-1">2、创建构造函数 <a class="header-anchor" href="#_2、创建构造函数" aria-label="Permalink to &quot;2、创建构造函数&quot;">​</a></h3><p>构造函数名和类名称相同，不能有返回值类型（连void都不可以），可以有有参数（支持重载）,必须public权限</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">class Data1</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#ADBAC7;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//无参构造函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;无参构造函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">class Data1</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#24292E;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//无参构造函数</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;无参构造函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>类实例化对象时：先为对象开辟空间 然后才是 调用构造函数</p><h3 id="_3、构造函数的分类" tabindex="-1">3、构造函数的分类 <a class="header-anchor" href="#_3、构造函数的分类" aria-label="Permalink to &quot;3、构造函数的分类&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data1</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#768390;">    //无参构造函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;无参构造函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //有参构造函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;有参构造函数 mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //析构函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Data1</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析构函数 mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data1</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#6A737D;">    //无参构造函数</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;无参构造函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //有参构造函数</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;有参构造函数 mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //析构函数</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Data1</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析构函数 mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h3 id="_4、构造函数的调用" tabindex="-1">4、构造函数的调用 <a class="header-anchor" href="#_4、构造函数的调用" aria-label="Permalink to &quot;4、构造函数的调用&quot;">​</a></h3><p>1、如果用户不提供构造函数 编译器会自动 提供一个无参的空的构造函数。</p><p>2、如果用户提供构造函数 编译器会自动 屏蔽默认无参的构造</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //隐式调用无参构造函数（推荐）</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data1 ob1;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob1.mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#768390;">    //显示调用无参构造函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data1 ob2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //隐式调用有参构造函数（推荐）</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data1 </span><span style="color:#DCBDFB;">ob3</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //显示调用有参构造函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data1 ob4 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //匿名对象(无参)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //构造函数隐式转换（类中只有一个数据成员）</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data1 ob5 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;"> //Data ob5(100)</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //隐式调用无参构造函数（推荐）</span></span>
<span class="line"><span style="color:#24292E;">    Data1 ob1;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob1.mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#6A737D;">    //显示调用无参构造函数</span></span>
<span class="line"><span style="color:#24292E;">    Data1 ob2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //隐式调用有参构造函数（推荐）</span></span>
<span class="line"><span style="color:#24292E;">    Data1 </span><span style="color:#6F42C1;">ob3</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //显示调用有参构造函数</span></span>
<span class="line"><span style="color:#24292E;">    Data1 ob4 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //匿名对象(无参)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //构造函数隐式转换（类中只有一个数据成员）</span></span>
<span class="line"><span style="color:#24292E;">    Data1 ob5 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span><span style="color:#6A737D;"> //Data ob5(100)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"></span></code></pre></div><p>注意：写任何一个类 无参构造， 有参构造需要实现</p><h2 id="_6-析构函数" tabindex="-1">6.析构函数 <a class="header-anchor" href="#_6-析构函数" aria-label="Permalink to &quot;6.析构函数&quot;">​</a></h2><p>当对象生命周期结束的时候 系统自动调用析构函数。 函数名和类名称相同，在函数名前加~，没有返回值类型，没有函数形参。（不能被重载） 先调用析构函数 再释放对象的空间。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">//析构函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析构函数 mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//析构函数</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析构函数 mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data1 </span><span style="color:#DCBDFB;">ob2</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        Data1 </span><span style="color:#DCBDFB;">ob3</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data1 </span><span style="color:#DCBDFB;">ob4</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#768390;">// 析构函数在生命周期结束的时候释放空间</span></span>
<span class="line"><span style="color:#768390;">//  括号结束时  括号里的释放  由于是在栈区 后进先出</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data1 </span><span style="color:#6F42C1;">ob2</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">200</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        Data1 </span><span style="color:#6F42C1;">ob3</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    Data1 </span><span style="color:#6F42C1;">ob4</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6A737D;">// 析构函数在生命周期结束的时候释放空间</span></span>
<span class="line"><span style="color:#6A737D;">//  括号结束时  括号里的释放  由于是在栈区 后进先出</span></span></code></pre></div><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB2.png" alt=""></p><p>一般情况下，空的析构函数就足够。</p><p>但是如果一个类有指针成员，这个类必须 写析构函数，释放指针成员所指向空间</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#96D0FF;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#96D0FF;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">name;</span><span style="color:#768390;">//指针成员</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data2</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        name</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data2</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        name </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">calloc</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">strlen</span><span style="color:#ADBAC7;">(str)</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(name, str);</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;有参构造 name=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">name</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Data2</span><span style="color:#ADBAC7;">()</span><span style="color:#768390;">  // 防止内存泄漏 先释放堆区 在释放栈区的name</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析构函数name = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">name</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(name </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(name);</span></span>
<span class="line"><span style="color:#ADBAC7;">            name</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#032F62;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#032F62;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">name;</span><span style="color:#6A737D;">//指针成员</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        name</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        name </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">calloc</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">strlen</span><span style="color:#24292E;">(str)</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(name, str);</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;有参构造 name=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">name</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Data2</span><span style="color:#24292E;">()</span><span style="color:#6A737D;">  // 防止内存泄漏 先释放堆区 在释放栈区的name</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析构函数name = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">name</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(name </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(name);</span></span>
<span class="line"><span style="color:#24292E;">            name</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h2 id="_7-拷贝构造函数" tabindex="-1">7.拷贝构造函数 <a class="header-anchor" href="#_7-拷贝构造函数" aria-label="Permalink to &quot;7.拷贝构造函数&quot;">​</a></h2><h3 id="_1、拷贝构造的定义" tabindex="-1">1、拷贝构造的定义 <a class="header-anchor" href="#_1、拷贝构造的定义" aria-label="Permalink to &quot;1、拷贝构造的定义&quot;">​</a></h3><p>拷贝构造：本质是构造函数</p><p>拷贝构造的调用时机：旧对象 初始化 新对象 才会调用拷贝构造。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data4</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#F47067;">#if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data4</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;无参构造 mA = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#F47067;">#endif</span></span>
<span class="line"><span style="color:#F47067;">#if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data4</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;有参构造 mA = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#F47067;">#endif</span></span>
<span class="line"><span style="color:#F47067;">#if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data4</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">//ob就是旧对象的别名</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">        //一旦实现 了拷贝构造 必须完成赋值动作</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob.mA;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;拷贝构造函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#F47067;">#endif</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Data4</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析构函数 mA = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F69D50;">Data4</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getObject</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data4 </span><span style="color:#DCBDFB;">ob1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;A:&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">ob1 </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> ob1;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test04</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data4 ob2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getObject</span><span style="color:#ADBAC7;">();</span><span style="color:#768390;">  //旧对象 初始化 为新对象</span></span>
<span class="line"><span style="color:#768390;">    //ob2 = ob1  这个不算  都是旧对象</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;B:&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">ob2 </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data4</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#D73A49;">#if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data4</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;无参构造 mA = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span>
<span class="line"><span style="color:#D73A49;">#if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data4</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;有参构造 mA = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span>
<span class="line"><span style="color:#D73A49;">#if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data4</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">//ob就是旧对象的别名</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        //一旦实现 了拷贝构造 必须完成赋值动作</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob.mA;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;拷贝构造函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Data4</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析构函数 mA = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#6F42C1;">Data4</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getObject</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data4 </span><span style="color:#6F42C1;">ob1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;A:&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">ob1 </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> ob1;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test04</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data4 ob2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getObject</span><span style="color:#24292E;">();</span><span style="color:#6A737D;">  //旧对象 初始化 为新对象</span></span>
<span class="line"><span style="color:#6A737D;">    //ob2 = ob1  这个不算  都是旧对象</span></span>
<span class="line"><span style="color:#24292E;">    cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;B:&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">ob2 </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>如果用户不提供拷贝构造 编译器会自动提供一个默认的拷贝构造（完成赋值动作--浅拷贝）</p><h3 id="_2、拷贝构造-和-无参构造-有参构造的关系" tabindex="-1">2、拷贝构造 和 无参构造 有参构造的关系 <a class="header-anchor" href="#_2、拷贝构造-和-无参构造-有参构造的关系" aria-label="Permalink to &quot;2、拷贝构造 和 无参构造 有参构造的关系&quot;">​</a></h3><p>如果用户定义了 拷贝构造 或者有参构造 都会屏蔽无参构造。</p><p>如果用户定义了 无参构造 或者有参构造 不会屏蔽拷贝构造。</p><h3 id="_3、拷贝构造几种调用形式-了解" tabindex="-1">3、拷贝构造几种调用形式（了解） <a class="header-anchor" href="#_3、拷贝构造几种调用形式-了解" aria-label="Permalink to &quot;3、拷贝构造几种调用形式（了解）&quot;">​</a></h3><p><strong>1、旧对象给新对象初始化 调用拷贝构造</strong></p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> Data4 </span><span style="color:#DCBDFB;">ob1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> Data4 ob2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob1;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> Data4 </span><span style="color:#6F42C1;">ob1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> Data4 ob2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob1;</span></span></code></pre></div><p><strong>2、给对象取别名 不会调用拷贝构造</strong></p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> Data4 </span><span style="color:#DCBDFB;">ob1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> Data4 </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">ob2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob1;</span><span style="color:#768390;">//不会调用拷贝构造</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> Data4 </span><span style="color:#6F42C1;">ob1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> Data4 </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">ob2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob1;</span><span style="color:#6A737D;">//不会调用拷贝构造</span></span></code></pre></div><p><strong>3、普通对象作为函数参数 调用函数时 会发生拷贝构造</strong></p><p>实参传给形参的时候，会开辟空间 相当于旧对象给了新对象 发生了拷贝构造</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB3.png" alt=""></p><p><strong>4、函数返回值普通对象 （Visual Studio会发生拷贝构造）（Qtcreater,linux不会发生）</strong></p><p>Visual Studio会发生拷贝构造</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB4.png" alt=""></p><h2 id="_8-拷贝构造的浅拷贝和深拷贝" tabindex="-1">8. 拷贝构造的浅拷贝和深拷贝 <a class="header-anchor" href="#_8-拷贝构造的浅拷贝和深拷贝" aria-label="Permalink to &quot;8. 拷贝构造的浅拷贝和深拷贝&quot;">​</a></h2><p>默认的拷贝构造 都是浅拷贝。</p><p>如果类中没有指针成员， 不用实现拷贝构造和析构函数。</p><p>如果类中有指针成员， 必须实现析构函数释放指针成员指向的堆区空间，必须实现拷贝构造完成深拷贝动作</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data5</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">name;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data5</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        name</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data5</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        name </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">calloc</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">strlen</span><span style="color:#ADBAC7;">(str)</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(name, str);</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;有参构造 name=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">name</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data5</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data5</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">//深拷贝</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">         //为对象的指针成员申请独立的空间</span></span>
<span class="line"><span style="color:#ADBAC7;">         name </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">char*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">calloc</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">strlen</span><span style="color:#ADBAC7;">(ob.name) </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">         </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(name, ob.name);</span></span>
<span class="line"><span style="color:#ADBAC7;">         cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;拷贝构造函数&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Data5</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析构函数name = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">name</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(name </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(name);</span></span>
<span class="line"><span style="color:#ADBAC7;">            name</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test05</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data5 </span><span style="color:#DCBDFB;">ob1</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;hello world</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data5 ob2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob1;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">test05</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data5</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">name;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data5</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        name</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data5</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        name </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">calloc</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">strlen</span><span style="color:#24292E;">(str)</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(name, str);</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;有参构造 name=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">name</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data5</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data5</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">//深拷贝</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">         //为对象的指针成员申请独立的空间</span></span>
<span class="line"><span style="color:#24292E;">         name </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">char*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">calloc</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">strlen</span><span style="color:#24292E;">(ob.name) </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">         </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(name, ob.name);</span></span>
<span class="line"><span style="color:#24292E;">         cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;拷贝构造函数&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Data5</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析构函数name = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">name</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(name </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(name);</span></span>
<span class="line"><span style="color:#24292E;">            name</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test05</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data5 </span><span style="color:#6F42C1;">ob1</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;hello world</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    Data5 ob2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob1;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">test05</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>设计一个类：无参构造、有参构造、析够函数、拷贝构造</p><h2 id="_9-初始化列表" tabindex="-1">9. 初始化列表 <a class="header-anchor" href="#_9-初始化列表" aria-label="Permalink to &quot;9. 初始化列表&quot;">​</a></h2><p>一个类的对象 作为另一个类的成员：成员对象</p><p>如果类中想调用成员对象的有参构造 必须使用初始化列表。</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB5.png" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">A成员对象 B自身</span></span>
<span class="line"><span style="color:#adbac7;">A 无参构造</span></span>
<span class="line"><span style="color:#adbac7;">B 无参构造</span></span>
<span class="line"><span style="color:#adbac7;">B 析构</span></span>
<span class="line"><span style="color:#adbac7;">A 析构</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">A成员对象 B自身</span></span>
<span class="line"><span style="color:#24292e;">A 无参构造</span></span>
<span class="line"><span style="color:#24292e;">B 无参构造</span></span>
<span class="line"><span style="color:#24292e;">B 析构</span></span>
<span class="line"><span style="color:#24292e;">A 析构</span></span></code></pre></div><p>类会自动调用成员对象的无参构造。</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">// 初始化列表</span></span>
<span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">B</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(a)</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// 初始化列表</span></span>
<span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">B</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(a)</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> }</span></span></code></pre></div><p>类想调用成员对象 有参构造 必须使用初始化列表</p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">class A</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#ADBAC7;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;A的无参构造 mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    explicit </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;A的有参构造mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;A的析构函数 mA = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">class A</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#24292E;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;A的无参构造 mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    explicit </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;A的有参构造mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;A的析构函数 mA = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">B</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mB;</span></span>
<span class="line"><span style="color:#ADBAC7;">    A ob;</span><span style="color:#768390;">//成员对象</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">B</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;B类的无参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //初始化列表 成员对象 必须使用对象名+（）</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">B</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">mB</span><span style="color:#ADBAC7;">(b),</span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(a)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;B类的有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~B</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">       cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;B的析构函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    B </span><span style="color:#DCBDFB;">ob1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;mA =&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob1.ob.mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;, mB =&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob1.mB</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">B</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mB;</span></span>
<span class="line"><span style="color:#24292E;">    A ob;</span><span style="color:#6A737D;">//成员对象</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">B</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;B类的无参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //初始化列表 成员对象 必须使用对象名+（）</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">B</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">mB</span><span style="color:#24292E;">(b),</span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(a)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;B类的有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~B</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">       cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;B的析构函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    B </span><span style="color:#6F42C1;">ob1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;mA =&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob1.ob.mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;, mB =&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob1.mB</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_10-对象数组" tabindex="-1">10. 对象数组 <a class="header-anchor" href="#_10-对象数组" aria-label="Permalink to &quot;10. 对象数组&quot;">​</a></h2><p>对象数组：本质是数组 数组的每个元素是对象</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">A</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;A的无参构造 mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">explicit</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;A的有参构造mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~A</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;A的析构函数 mA = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">A</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;A的无参构造 mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">explicit</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;A的有参构造mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~A</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;A的析构函数 mA = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //对象数组 每个元素都会自动调用构造和析构函数</span></span>
<span class="line"><span style="color:#768390;">    //对象数组不初始化  每个元素 调用无参构造</span></span>
<span class="line"><span style="color:#ADBAC7;">    A arr1[</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //对象数组的初始化 必须显示使用有参构造 逐个元素初始化</span></span>
<span class="line"><span style="color:#ADBAC7;">    A arr2[</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">]</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">{</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">),</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">),</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">),</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">),</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">) };</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> n </span><span style="color:#F47067;">=sizeof</span><span style="color:#ADBAC7;">(arr2)</span><span style="color:#F47067;">/sizeof</span><span style="color:#ADBAC7;">(arr2[</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">]);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(i</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;i</span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">n;i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">arr2[i].mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //对象数组 每个元素都会自动调用构造和析构函数</span></span>
<span class="line"><span style="color:#6A737D;">    //对象数组不初始化  每个元素 调用无参构造</span></span>
<span class="line"><span style="color:#24292E;">    A arr1[</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //对象数组的初始化 必须显示使用有参构造 逐个元素初始化</span></span>
<span class="line"><span style="color:#24292E;">    A arr2[</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">),</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">),</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">),</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">40</span><span style="color:#24292E;">),</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">) };</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> n </span><span style="color:#D73A49;">=sizeof</span><span style="color:#24292E;">(arr2)</span><span style="color:#D73A49;">/sizeof</span><span style="color:#24292E;">(arr2[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(i</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;i</span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">n;i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">arr2[i].mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_11-explicit关键字" tabindex="-1">11. explicit关键字 <a class="header-anchor" href="#_11-explicit关键字" aria-label="Permalink to &quot;11. explicit关键字&quot;">​</a></h2><p>explicit防止构造函数隐式转换</p><p>explicit修饰构造函数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">1 //允许有参构造 隐式转换</span></span>
<span class="line"><span style="color:#adbac7;">2 A(int a)</span></span>
<span class="line"><span style="color:#adbac7;">3 {</span></span>
<span class="line"><span style="color:#adbac7;">4 mA = a;</span></span>
<span class="line"><span style="color:#adbac7;">5 cout&lt;&lt;&quot;A的有参构造mA=&quot;&lt;&lt;mA&lt;&lt;endl;</span></span>
<span class="line"><span style="color:#adbac7;">6 }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">1 //允许有参构造 隐式转换</span></span>
<span class="line"><span style="color:#24292e;">2 A(int a)</span></span>
<span class="line"><span style="color:#24292e;">3 {</span></span>
<span class="line"><span style="color:#24292e;">4 mA = a;</span></span>
<span class="line"><span style="color:#24292e;">5 cout&lt;&lt;&quot;A的有参构造mA=&quot;&lt;&lt;mA&lt;&lt;endl;</span></span>
<span class="line"><span style="color:#24292e;">6 }</span></span></code></pre></div><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#768390;"> //构造函数隐式转换（类中只有一个数据成员）</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> A ob1</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//ok  容易造成误解  本质上是A ob1（100）  不是赋值！</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#6A737D;"> //构造函数隐式转换（类中只有一个数据成员）</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> A ob1</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//ok  容易造成误解  本质上是A ob1（100）  不是赋值！</span></span></code></pre></div><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#768390;"> //防止有参构造 隐式转换 </span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> explicit </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;A的有参构造mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#6A737D;"> //防止有参构造 隐式转换 </span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> explicit </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;A的有参构造mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> }</span></span></code></pre></div><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#768390;"> //构造函数隐式转换（类中只有一个数据成员）</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> A ob1</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//err 转换失败</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#6A737D;"> //构造函数隐式转换（类中只有一个数据成员）</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> A ob1</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//err 转换失败</span></span></code></pre></div><h2 id="_12-new和delete-堆区空间操作" tabindex="-1">12. new和delete 堆区空间操作 <a class="header-anchor" href="#_12-new和delete-堆区空间操作" aria-label="Permalink to &quot;12. new和delete 堆区空间操作&quot;">​</a></h2><h3 id="_1、new和delete操作基本类型的空间" tabindex="-1">1、new和delete操作基本类型的空间 <a class="header-anchor" href="#_1、new和delete操作基本类型的空间" aria-label="Permalink to &quot;1、new和delete操作基本类型的空间&quot;">​</a></h3><p><strong>new和malloc delete和free 没有区别</strong></p><p><strong>区别：</strong></p><p>new 不用强制类型转换</p><p>new在申请空间的时候可以 初始化空间内容</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#768390;">    //申请int空间 并初始化为100</span></span>
<span class="line"><span style="color:#ADBAC7;">    p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;">//堆区空间</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;*p = &quot;</span><span style="color:#F47067;">&lt;&lt;*</span><span style="color:#ADBAC7;">p</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">  // *p=100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    //申请int空间 并初始化为100</span></span>
<span class="line"><span style="color:#24292E;">    p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span><span style="color:#6A737D;">//堆区空间</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;*p = &quot;</span><span style="color:#D73A49;">&lt;&lt;*</span><span style="color:#24292E;">p</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">  // *p=100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">arr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //申请数组 5个int元素</span></span>
<span class="line"><span style="color:#768390;">    //arr = new int[5];//堆区空间</span></span>
<span class="line"><span style="color:#ADBAC7;">    arr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">]{</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(i</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;i</span><span style="color:#F47067;">&lt;</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">;i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">arr[i]</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //如果new有[]  delete就必须有[]</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">delete []</span><span style="color:#ADBAC7;"> arr;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">arr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //申请数组 5个int元素</span></span>
<span class="line"><span style="color:#6A737D;">    //arr = new int[5];//堆区空间</span></span>
<span class="line"><span style="color:#24292E;">    arr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">]{</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">40</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(i</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;i</span><span style="color:#D73A49;">&lt;</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">;i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">arr[i]</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //如果new有[]  delete就必须有[]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">delete []</span><span style="color:#24292E;"> arr;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_2、new和delete操作类的空间" tabindex="-1">2、new和delete操作类的空间 <a class="header-anchor" href="#_2、new和delete操作类的空间" aria-label="Permalink to &quot;2、new和delete操作类的空间&quot;">​</a></h3><p>malloc不会调用构造函数 free不会调用析构函数</p><p>new 会调用构造函数 delete调用析构函数</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#96D0FF;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">A</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;无参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;有参构造 mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~A</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析构函数 mA=&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#032F62;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">A</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;无参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;有参构造 mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~A</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析构函数 mA=&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test03</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">#if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#768390;">  //malloc free</span></span>
<span class="line"><span style="color:#ADBAC7;">    A </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (A </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">malloc</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(A));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">p-&gt;mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(p);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span></span>
<span class="line"><span style="color:#ADBAC7;">    A </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //p-&gt;mA = 100;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">p-&gt;mA</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#F47067;">#endif</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test03</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">#if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#6A737D;">  //malloc free</span></span>
<span class="line"><span style="color:#24292E;">    A </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (A </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">malloc</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(A));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    p-&gt;mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">p-&gt;mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(p);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">    A </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //p-&gt;mA = 100;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">p-&gt;mA</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_3、new申请对象数组" tabindex="-1">3、new申请对象数组 <a class="header-anchor" href="#_3、new申请对象数组" aria-label="Permalink to &quot;3、new申请对象数组&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test04</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //每个元素 默认调用无参构造</span></span>
<span class="line"><span style="color:#768390;">    //A *arr = new A[5];</span></span>
<span class="line"><span style="color:#ADBAC7;">    A </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">arr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> A[</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">]{</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">), </span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">),</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">),</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">),</span><span style="color:#DCBDFB;">A</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">)};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">delete  []</span><span style="color:#ADBAC7;"> arr;</span><span style="color:#768390;">  // 加[]  会进行5次析构</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test04</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //每个元素 默认调用无参构造</span></span>
<span class="line"><span style="color:#6A737D;">    //A *arr = new A[5];</span></span>
<span class="line"><span style="color:#24292E;">    A </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">arr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> A[</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">]{</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">), </span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">),</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">),</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">40</span><span style="color:#24292E;">),</span><span style="color:#6F42C1;">A</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">)};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">delete  []</span><span style="color:#24292E;"> arr;</span><span style="color:#6A737D;">  // 加[]  会进行5次析构</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_13-静态成员" tabindex="-1">13. 静态成员 <a class="header-anchor" href="#_13-静态成员" aria-label="Permalink to &quot;13. 静态成员&quot;">​</a></h2><h3 id="_1、概念的引入" tabindex="-1">1、概念的引入 <a class="header-anchor" href="#_1、概念的引入" aria-label="Permalink to &quot;1、概念的引入&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB6.png" alt=""></p><p>类的对象 拥有独立的 普通成员数据。</p><p>static 修饰的成员 叫 静态成员。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span><span style="color:#768390;">//静态成员数据</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">func</span><span style="color:#ADBAC7;">()</span><span style="color:#768390;">//静态成员函数</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span><span style="color:#6A737D;">//静态成员数据</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">func</span><span style="color:#24292E;">()</span><span style="color:#6A737D;">//静态成员函数</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">6</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> }</span></span></code></pre></div><h3 id="_2、静态成员数据" tabindex="-1">2、静态成员数据 <a class="header-anchor" href="#_2、静态成员数据" aria-label="Permalink to &quot;2、静态成员数据&quot;">​</a></h3><p>static修饰的静态成员 属于类而不是对象。（所有对象 共享 一份 静态成员数据）</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB7.png" alt=""></p><p>static修饰的成员 定义类的时候 必须分配空间。</p><p>static修饰的静态成员数据 必须类中定义 类外初始化。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span><span style="color:#768390;">//普通成员数据</span></span>
<span class="line"><span style="color:#768390;">    //类中定义</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> b;</span><span style="color:#768390;">//静态成员数据</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#768390;">//类外初始化</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data</span><span style="color:#ADBAC7;">::b</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //静态成员数据 通过类名称直接访问（属于类）</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#F69D50;">Data</span><span style="color:#ADBAC7;">::b</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //静态成员数据 通过对象访问(共享)</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data ob1;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob1.b</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    ob1.b </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">200</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data ob2;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob2.b </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">300</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#F69D50;">Data</span><span style="color:#ADBAC7;">::b</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">//300</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span><span style="color:#6A737D;">//普通成员数据</span></span>
<span class="line"><span style="color:#6A737D;">    //类中定义</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> b;</span><span style="color:#6A737D;">//静态成员数据</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#6A737D;">//类外初始化</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data</span><span style="color:#24292E;">::b</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //静态成员数据 通过类名称直接访问（属于类）</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#6F42C1;">Data</span><span style="color:#24292E;">::b</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //静态成员数据 通过对象访问(共享)</span></span>
<span class="line"><span style="color:#24292E;">    Data ob1;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob1.b</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    ob1.b </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">200</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    Data ob2;</span></span>
<span class="line"><span style="color:#24292E;">    ob2.b </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">300</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#6F42C1;">Data</span><span style="color:#24292E;">::b</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">//300</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p><strong>案例1：使用静态成员数据 统计对象的个数</strong></p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> mA;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> count;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data2</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        count</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data2</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        mA </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        count</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data2</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data2</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        count</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Data2</span><span style="color:#ADBAC7;">()</span><span style="color:#768390;">  // 析构的时候 --</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">       count</span><span style="color:#F47067;">--</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data2</span><span style="color:#ADBAC7;">::count</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data2 ob1;</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data2 </span><span style="color:#DCBDFB;">ob2</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data2 ob3 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob2;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;对象个数:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#F69D50;">Data2</span><span style="color:#ADBAC7;">::count</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">//3</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        Data2 ob4;</span></span>
<span class="line"><span style="color:#ADBAC7;">        Data2 ob5;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;对象个数:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#F69D50;">Data2</span><span style="color:#ADBAC7;">::count</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">//5</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;对象个数:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#F69D50;">Data2</span><span style="color:#ADBAC7;">::count</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">//3</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> mA;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> count;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        count</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        mA </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        count</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        count</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Data2</span><span style="color:#24292E;">()</span><span style="color:#6A737D;">  // 析构的时候 --</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">       count</span><span style="color:#D73A49;">--</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">::count</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data2 ob1;</span></span>
<span class="line"><span style="color:#24292E;">    Data2 </span><span style="color:#6F42C1;">ob2</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    Data2 ob3 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob2;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;对象个数:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">::count</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">//3</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        Data2 ob4;</span></span>
<span class="line"><span style="color:#24292E;">        Data2 ob5;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;对象个数:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">::count</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">//5</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;对象个数:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">::count</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">//3</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_3、静态成员函数" tabindex="-1">3、静态成员函数 <a class="header-anchor" href="#_3、静态成员函数" aria-label="Permalink to &quot;3、静态成员函数&quot;">​</a></h3><p>静态成员函数 是属于类 而不是对象（所有对象 共享）</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data3</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> data;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        data </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//err 静态成员函数 只能操作 静态成员数据 而data为普通成员数据</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data3</span><span style="color:#ADBAC7;">::a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test03</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#F69D50;">Data3</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getA</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">  // 由于a是私有的，通过公共方法去实现</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">test03</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data3</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> data;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        data </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//err 静态成员函数 只能操作 静态成员数据 而data为普通成员数据</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data3</span><span style="color:#24292E;">::a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test03</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#6F42C1;">Data3</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getA</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">  // 由于a是私有的，通过公共方法去实现</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">test03</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_14-单例模式" tabindex="-1">14. 单例模式 <a class="header-anchor" href="#_14-单例模式" aria-label="Permalink to &quot;14. 单例模式&quot;">​</a></h2><p>单例模式的类 只能实例化 一个对象。 重要步骤：将构造函数私有化</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">SingleTon</span><span style="color:#768390;">//单例模式</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //构造私有化 防止实例化其他对象</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">SingleTon</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#ADBAC7;">        count</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">SingleTon</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">SingleTon</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">){</span></span>
<span class="line"><span style="color:#ADBAC7;">        count</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~SingleTon</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#768390;">    //const防止p 在类内部 被修改指向</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> SingleTon </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> p;</span><span style="color:#768390;">//保存唯一的实例地址</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> count;</span><span style="color:#768390;">//统计任务执行次数</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">static</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">SingleTon</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getSingleTon</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">//获取唯一的实例地址 静态数据只能用静态方法</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //用户自定义 任务函数</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        count</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;当前第&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">count</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;次任务打印:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">str</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">SingleTon </span><span style="color:#F47067;">*const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">SingleTon</span><span style="color:#ADBAC7;">::p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> SingleTon;</span><span style="color:#768390;">//创建唯一的实例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //获取单例的地址</span></span>
<span class="line"><span style="color:#ADBAC7;">    SingleTon </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p1 </span><span style="color:#F47067;">=</span><span style="color:#F69D50;">SingleTon</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getSingleTon</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    p1-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;离职证明1&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    p1-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;学历证明1&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    p1-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;学位证明1&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    p1-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;身份证明1&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    SingleTon </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p2 </span><span style="color:#F47067;">=</span><span style="color:#F69D50;">SingleTon</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getSingleTon</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    p2-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;离职证明2&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    p2-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;学历证明2&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    p2-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;学位证明2&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    p2-&gt;</span><span style="color:#DCBDFB;">printString</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;身份证明2&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SingleTon</span><span style="color:#6A737D;">//单例模式</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //构造私有化 防止实例化其他对象</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">SingleTon</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#24292E;">        count</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">SingleTon</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SingleTon</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">){</span></span>
<span class="line"><span style="color:#24292E;">        count</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~SingleTon</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#6A737D;">    //const防止p 在类内部 被修改指向</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> SingleTon </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> p;</span><span style="color:#6A737D;">//保存唯一的实例地址</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> count;</span><span style="color:#6A737D;">//统计任务执行次数</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">static</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SingleTon</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getSingleTon</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">//获取唯一的实例地址 静态数据只能用静态方法</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //用户自定义 任务函数</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        count</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;当前第&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">count</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;次任务打印:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">str</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">SingleTon </span><span style="color:#D73A49;">*const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SingleTon</span><span style="color:#24292E;">::p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> SingleTon;</span><span style="color:#6A737D;">//创建唯一的实例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //获取单例的地址</span></span>
<span class="line"><span style="color:#24292E;">    SingleTon </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p1 </span><span style="color:#D73A49;">=</span><span style="color:#6F42C1;">SingleTon</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getSingleTon</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    p1-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;离职证明1&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    p1-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;学历证明1&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    p1-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;学位证明1&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    p1-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;身份证明1&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    SingleTon </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p2 </span><span style="color:#D73A49;">=</span><span style="color:#6F42C1;">SingleTon</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getSingleTon</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    p2-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;离职证明2&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    p2-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;学历证明2&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    p2-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;学位证明2&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    p2-&gt;</span><span style="color:#6F42C1;">printString</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;身份证明2&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_15-类的存储结构" tabindex="-1">15. 类的存储结构 <a class="header-anchor" href="#_15-类的存储结构" aria-label="Permalink to &quot;15. 类的存储结构&quot;">​</a></h2><p>成员函数、静态成员 不占类的空间。</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB8.png" alt=""></p><p>成员函数、静态成员 是独立存储 是所有对象共享</p><h2 id="_16-this指针" tabindex="-1">16.this指针 <a class="header-anchor" href="#_16-this指针" aria-label="Permalink to &quot;16.this指针&quot;">​</a></h2><h3 id="_1、知识点的引入" tabindex="-1">1、知识点的引入 <a class="header-anchor" href="#_1、知识点的引入" aria-label="Permalink to &quot;1、知识点的引入&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB9.png" alt=""></p><h3 id="_2、普通成员函数-默认有一个this指针-指向调用该成员函数的对象" tabindex="-1">2、普通成员函数 默认有一个this指针 指向调用该成员函数的对象 <a class="header-anchor" href="#_2、普通成员函数-默认有一个this指针-指向调用该成员函数的对象" aria-label="Permalink to &quot;2、普通成员函数 默认有一个this指针 指向调用该成员函数的对象&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">mutable</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data2</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">c</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;b </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;c </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //const 修饰成员函数为只读（该成员函数不允许对 成员数据 赋值） mutable修饰的成员除外</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">showData</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">const</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">        //a = 100;//err</span></span>
<span class="line"><span style="color:#ADBAC7;">        c</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">b</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">c</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data2 </span><span style="color:#DCBDFB;">ob1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob1.</span><span style="color:#DCBDFB;">showData</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">mutable</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">c</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;b </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;c </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //const 修饰成员函数为只读（该成员函数不允许对 成员数据 赋值） mutable修饰的成员除外</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showData</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">const</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        //a = 100;//err</span></span>
<span class="line"><span style="color:#24292E;">        c</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">b</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">c</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data2 </span><span style="color:#6F42C1;">ob1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob1.</span><span style="color:#6F42C1;">showData</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_3、this来完成链式操作" tabindex="-1">3、this来完成链式操作 <a class="header-anchor" href="#_3、this来完成链式操作" aria-label="Permalink to &quot;3、this来完成链式操作&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data1</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">Data1</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">myPrintf</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">str</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//返回调用该成员函数的对象</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data1</span><span style="color:#ADBAC7;">().</span><span style="color:#DCBDFB;">myPrintf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;hehe&quot;</span><span style="color:#ADBAC7;">).</span><span style="color:#DCBDFB;">myPrintf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;haha&quot;</span><span style="color:#ADBAC7;">).</span><span style="color:#DCBDFB;">myPrintf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;xixix&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data1</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data1</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">myPrintf</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">str</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//返回调用该成员函数的对象</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data1</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">myPrintf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;hehe&quot;</span><span style="color:#24292E;">).</span><span style="color:#6F42C1;">myPrintf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;haha&quot;</span><span style="color:#24292E;">).</span><span style="color:#6F42C1;">myPrintf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;xixix&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_17-const修饰成员函数" tabindex="-1">17.const修饰成员函数 <a class="header-anchor" href="#_17-const修饰成员函数" aria-label="Permalink to &quot;17.const修饰成员函数&quot;">​</a></h2><p>const 修饰成员函数为只读（该成员函数不允许对 成员数据 赋值） mutable修饰的成员除外</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">mutable</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data2</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">c</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;b </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;c </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //const 修饰成员函数为只读（该成员函数不允许对 成员数据 赋值） mutable修饰的成员除外</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">showData</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">const</span><span style="color:#768390;">   // 注意这里的const!!!!!</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">        //a = 100;//err</span></span>
<span class="line"><span style="color:#ADBAC7;">        c</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">b</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">c</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data2 </span><span style="color:#DCBDFB;">ob1</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob1.</span><span style="color:#DCBDFB;">showData</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">mutable</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data2</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">c</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;b </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;c </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //const 修饰成员函数为只读（该成员函数不允许对 成员数据 赋值） mutable修饰的成员除外</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showData</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">const</span><span style="color:#6A737D;">   // 注意这里的const!!!!!</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        //a = 100;//err</span></span>
<span class="line"><span style="color:#24292E;">        c</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">b</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">c</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Data2 </span><span style="color:#6F42C1;">ob1</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob1.</span><span style="color:#6F42C1;">showData</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_18-友元-friend" tabindex="-1">18. 友元 friend <a class="header-anchor" href="#_18-友元-friend" aria-label="Permalink to &quot;18. 友元 friend&quot;">​</a></h2><p>类将数据和方法封装在一起 加以权限区分 用户只能通过公共方法 操作私有数据。（封装性）</p><p>友元 重要用在运算符重载上。 一个函数或者类 作为了另一个类的友元 那么这个函数或类 就可以直接访问 另一个类的私有数据。</p><h3 id="_1、普通全局函数-作为类的友元" tabindex="-1">1、普通全局函数 作为类的友元 <a class="header-anchor" href="#_1、普通全局函数-作为类的友元" aria-label="Permalink to &quot;1、普通全局函数 作为类的友元&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Room</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;"> //普通全局函数 作为类的友元</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    string bedRoom;</span><span style="color:#768390;">//卧室</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    string setingRoom;</span><span style="color:#768390;">//客厅</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Room</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">string</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">bedRoom</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">string</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">setingRoom</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;bedRoom </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> bedRoom;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;setingRoom </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> setingRoom;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">//普通全局函数</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.setingRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.bedRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">  // 有friend就可以访问</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Room </span><span style="color:#DCBDFB;">room</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;刘坤卧室&quot;</span><span style="color:#ADBAC7;">,</span><span style="color:#96D0FF;">&quot;刘坤客厅&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(room);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Room</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">);</span><span style="color:#6A737D;"> //普通全局函数 作为类的友元</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    string bedRoom;</span><span style="color:#6A737D;">//卧室</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    string setingRoom;</span><span style="color:#6A737D;">//客厅</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">string</span><span style="color:#24292E;"> </span><span style="color:#E36209;">bedRoom</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">string</span><span style="color:#24292E;"> </span><span style="color:#E36209;">setingRoom</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;bedRoom </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> bedRoom;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;setingRoom </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> setingRoom;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">//普通全局函数</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.setingRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.bedRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">  // 有friend就可以访问</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Room </span><span style="color:#6F42C1;">room</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;刘坤卧室&quot;</span><span style="color:#24292E;">,</span><span style="color:#032F62;">&quot;刘坤客厅&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(room);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_2、类的某个成员函数-作为另一个类的友元" tabindex="-1">2、类的某个成员函数 作为另一个类的友元 <a class="header-anchor" href="#_2、类的某个成员函数-作为另一个类的友元" aria-label="Permalink to &quot;2、类的某个成员函数 作为另一个类的友元&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//向前声明 只能说明类名称</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;">  // 有Room 要向前声明</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">visiting02</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Room</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">visiting02</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;">  // 成员函数 作为另一个类的友元</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    string bedRoom;</span><span style="color:#768390;">//卧室</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    string setingRoom;</span><span style="color:#768390;">//客厅</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Room</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">string</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">bedRoom</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">string</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">setingRoom</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;bedRoom </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> bedRoom;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;setingRoom </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> setingRoom;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;翰文访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.setingRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;翰文访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.bedRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">visiting02</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;好基友张三访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.setingRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">   cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;好基友张三访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.bedRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Room </span><span style="color:#DCBDFB;">room</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;吴维的卧室&quot;</span><span style="color:#ADBAC7;">,</span><span style="color:#96D0FF;">&quot;吴维的客厅&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    goodGay ob;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(room);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">visiting02</span><span style="color:#ADBAC7;">(room);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//向前声明 只能说明类名称</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">);</span><span style="color:#6A737D;">  // 有Room 要向前声明</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">visiting02</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Room</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">visiting02</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">);</span><span style="color:#6A737D;">  // 成员函数 作为另一个类的友元</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    string bedRoom;</span><span style="color:#6A737D;">//卧室</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    string setingRoom;</span><span style="color:#6A737D;">//客厅</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">string</span><span style="color:#24292E;"> </span><span style="color:#E36209;">bedRoom</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">string</span><span style="color:#24292E;"> </span><span style="color:#E36209;">setingRoom</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;bedRoom </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> bedRoom;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;setingRoom </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> setingRoom;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;翰文访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.setingRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;翰文访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.bedRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">visiting02</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;好基友张三访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.setingRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">   cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;好基友张三访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.bedRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Room </span><span style="color:#6F42C1;">room</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;吴维的卧室&quot;</span><span style="color:#24292E;">,</span><span style="color:#032F62;">&quot;吴维的客厅&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    goodGay ob;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(room);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">visiting02</span><span style="color:#24292E;">(room);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">翰文访问了吴维的客厅</span></span>
<span class="line"><span style="color:#adbac7;">好基友张三访问了吴维的客厅</span></span>
<span class="line"><span style="color:#adbac7;">好基友张三访问了吴维的卧室</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">翰文访问了吴维的客厅</span></span>
<span class="line"><span style="color:#24292e;">好基友张三访问了吴维的客厅</span></span>
<span class="line"><span style="color:#24292e;">好基友张三访问了吴维的卧室</span></span></code></pre></div><h3 id="_3、整个类作为-另一个类的友元" tabindex="-1">3、整个类作为 另一个类的友元 <a class="header-anchor" href="#_3、整个类作为-另一个类的友元" aria-label="Permalink to &quot;3、整个类作为 另一个类的友元&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//向前声明 只能说明类名称</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">visiting02</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Room</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    string bedRoom;</span><span style="color:#768390;">//卧室</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    string setingRoom;</span><span style="color:#768390;">//客厅</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Room</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">string</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">bedRoom</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">string</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">setingRoom</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;bedRoom </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> bedRoom;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;setingRoom </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> setingRoom;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Room </span><span style="color:#DCBDFB;">room</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;吴维的卧室&quot;</span><span style="color:#ADBAC7;">,</span><span style="color:#96D0FF;">&quot;吴维的客厅&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    goodGay ob;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(room);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">visiting02</span><span style="color:#ADBAC7;">(room);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">visiting01</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;翰文访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.setingRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;翰文访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.bedRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">goodGay</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">visiting02</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Room</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">room</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;好基友张三访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.setingRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;好基友张三访问了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">room.bedRoom</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//向前声明 只能说明类名称</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">visiting02</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Room</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    string bedRoom;</span><span style="color:#6A737D;">//卧室</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    string setingRoom;</span><span style="color:#6A737D;">//客厅</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">string</span><span style="color:#24292E;"> </span><span style="color:#E36209;">bedRoom</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">string</span><span style="color:#24292E;"> </span><span style="color:#E36209;">setingRoom</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;bedRoom </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> bedRoom;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;setingRoom </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> setingRoom;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Room </span><span style="color:#6F42C1;">room</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;吴维的卧室&quot;</span><span style="color:#24292E;">,</span><span style="color:#032F62;">&quot;吴维的客厅&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    goodGay ob;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(room);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">visiting02</span><span style="color:#24292E;">(room);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">visiting01</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;翰文访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.setingRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;翰文访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.bedRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">goodGay</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">visiting02</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Room</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">room</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;好基友张三访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.setingRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;好基友张三访问了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">room.bedRoom</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">翰文访问了吴维的客厅</span></span>
<span class="line"><span style="color:#ADBAC7;">翰文访问了吴维的卧室</span></span>
<span class="line"><span style="color:#ADBAC7;">好基友张三访问了吴维的客厅</span></span>
<span class="line"><span style="color:#ADBAC7;">好基友张三访问了吴维的卧室</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">翰文访问了吴维的客厅</span></span>
<span class="line"><span style="color:#24292E;">翰文访问了吴维的卧室</span></span>
<span class="line"><span style="color:#24292E;">好基友张三访问了吴维的客厅</span></span>
<span class="line"><span style="color:#24292E;">好基友张三访问了吴维的卧室</span></span></code></pre></div><h3 id="_4、友元的注意" tabindex="-1">4、友元的注意 <a class="header-anchor" href="#_4、友元的注意" aria-label="Permalink to &quot;4、友元的注意&quot;">​</a></h3><p>1．友元关系不能被继承。</p><p>2．友元关系是单向的，类A是类B的朋友，但类B不一定是类A的朋友。</p><p>3．友元关系不具有传递性。类B是类A的朋友，类C是类B的朋友，但类C不一定是类A的朋友</p><h3 id="友元案例-遥控器的类" tabindex="-1">友元案例（遥控器的类） <a class="header-anchor" href="#友元案例-遥控器的类" aria-label="Permalink to &quot;友元案例（遥控器的类）&quot;">​</a></h3><p>请编写电视机类，电视机有开机和关机状态，有音量，有频道，提供音量操作的方法，频道操作的方法。由于电视机只能逐一调整频道，不能指定频道，增加遥控类，遥控类除了拥有电视机已有的功能，再增加根据输入调台功能。</p><p>提示：遥控器可作为电视机类的友元类</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    TV </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Remote</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">p</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">offOrOn</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">downVolume</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">upChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">downChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">showTv</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">setChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">channel</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">   </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">setChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">channel</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;">  // 遥控器要去操作TV的频道</span></span>
<span class="line"><span style="color:#ADBAC7;">   </span><span style="color:#F47067;">enum</span><span style="color:#ADBAC7;">{</span><span style="color:#6CB6FF;">OFF</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">ON</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#ADBAC7;">   </span><span style="color:#F47067;">enum</span><span style="color:#ADBAC7;">{</span><span style="color:#6CB6FF;">minVol</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">maxVol</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#ADBAC7;">   </span><span style="color:#F47067;">enum</span><span style="color:#ADBAC7;">{</span><span style="color:#6CB6FF;">minChan</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">maxChan</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> state;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> volume;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> channel;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">TV</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        state </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> OFF;</span></span>
<span class="line"><span style="color:#ADBAC7;">        volume </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> minVol;</span></span>
<span class="line"><span style="color:#ADBAC7;">        channel </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> minChan;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">offOrOn</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">downVolume</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">upChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">downChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">showTv</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    TV </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">p</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">offOrOn</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">downVolume</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">upChannel</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">downChannel</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showTv</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setChannel</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">channel</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">setChannel</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">channel</span><span style="color:#24292E;">);</span><span style="color:#6A737D;">  // 遥控器要去操作TV的频道</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">enum</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">OFF</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">ON</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">enum</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">minVol</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">maxVol</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">enum</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">minChan</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">maxChan</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">25</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> state;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> volume;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> channel;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        state </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> OFF;</span></span>
<span class="line"><span style="color:#24292E;">        volume </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> minVol;</span></span>
<span class="line"><span style="color:#24292E;">        channel </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> minChan;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">offOrOn</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">downVolume</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">upChannel</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">downChannel</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">showTv</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h4 id="offoron" tabindex="-1">offOrOn <a class="header-anchor" href="#offoron" aria-label="Permalink to &quot;offOrOn&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">offOrOn</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    state </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (state</span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;">OFF</span><span style="color:#F47067;">?</span><span style="color:#ADBAC7;">ON</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;">OFF);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">offOrOn</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    state </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (state</span><span style="color:#D73A49;">==</span><span style="color:#24292E;">OFF</span><span style="color:#D73A49;">?</span><span style="color:#24292E;">ON</span><span style="color:#D73A49;">:</span><span style="color:#24292E;">OFF);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="upvolume" tabindex="-1">upVolume <a class="header-anchor" href="#upvolume" aria-label="Permalink to &quot;upVolume&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(volume </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> maxVol)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;音量已经最大了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    volume</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(volume </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> maxVol)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;音量已经最大了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    volume</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="downvolume" tabindex="-1">downVolume <a class="header-anchor" href="#downvolume" aria-label="Permalink to &quot;downVolume&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">downVolume</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(volume </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> minVol)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;音量已经最小了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    volume</span><span style="color:#F47067;">--</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">downVolume</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(volume </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> minVol)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;音量已经最小了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    volume</span><span style="color:#D73A49;">--</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="upchannel" tabindex="-1">upChannel <a class="header-anchor" href="#upchannel" aria-label="Permalink to &quot;upChannel&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">upChannel</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(channel </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> maxChan)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;频道已经最大了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    channel</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">downChannel</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(channel </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> minChan)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;频道已经最小了&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    channel</span><span style="color:#F47067;">--</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">upChannel</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(channel </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> maxChan)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;频道已经最大了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    channel</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">downChannel</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(channel </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> minChan)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;频道已经最小了&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    channel</span><span style="color:#D73A49;">--</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="showtv" tabindex="-1">showTv <a class="header-anchor" href="#showtv" aria-label="Permalink to &quot;showTv&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">TV</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">showTv</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;当前电视机的状态:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">(state</span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;">OFF</span><span style="color:#F47067;">?</span><span style="color:#96D0FF;">&quot;关&quot;</span><span style="color:#F47067;">:</span><span style="color:#96D0FF;">&quot;开&quot;</span><span style="color:#ADBAC7;">)</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;当前电视机的音量:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">volume</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;当前电视机的频道:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">channel</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">TV</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">showTv</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;当前电视机的状态:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">(state</span><span style="color:#D73A49;">==</span><span style="color:#24292E;">OFF</span><span style="color:#D73A49;">?</span><span style="color:#032F62;">&quot;关&quot;</span><span style="color:#D73A49;">:</span><span style="color:#032F62;">&quot;开&quot;</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;当前电视机的音量:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">volume</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;当前电视机的频道:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">channel</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="remote" tabindex="-1">Remote <a class="header-anchor" href="#remote" aria-label="Permalink to &quot;Remote&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">Remote</span><span style="color:#ADBAC7;">(TV </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">offOrOn</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;</span><span style="color:#DCBDFB;">offOrOn</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;</span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">downVolume</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;</span><span style="color:#DCBDFB;">downVolume</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">upChannel</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;</span><span style="color:#DCBDFB;">upChannel</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">downChannel</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;</span><span style="color:#DCBDFB;">downChannel</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">showTv</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;</span><span style="color:#DCBDFB;">showTv</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Remote</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">setChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">channel</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    p-&gt;channel </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> channel;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">(TV </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">offOrOn</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    p-&gt;</span><span style="color:#6F42C1;">offOrOn</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    p-&gt;</span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">downVolume</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    p-&gt;</span><span style="color:#6F42C1;">downVolume</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">upChannel</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    p-&gt;</span><span style="color:#6F42C1;">upChannel</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">downChannel</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    p-&gt;</span><span style="color:#6F42C1;">downChannel</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">showTv</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    p-&gt;</span><span style="color:#6F42C1;">showTv</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Remote</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">setChannel</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">channel</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    p-&gt;channel </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> channel;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="main" tabindex="-1">main <a class="header-anchor" href="#main" aria-label="Permalink to &quot;main&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //实例化一个电视机</span></span>
<span class="line"><span style="color:#ADBAC7;">    TV tv;</span></span>
<span class="line"><span style="color:#ADBAC7;">    Remote </span><span style="color:#DCBDFB;">re</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">tv);</span><span style="color:#768390;"> // Remote(TV *p); 所以要传地址</span></span>
<span class="line"><span style="color:#ADBAC7;">    re.</span><span style="color:#DCBDFB;">offOrOn</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    re.</span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    re.</span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    re.</span><span style="color:#DCBDFB;">upVolume</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    re.</span><span style="color:#DCBDFB;">setChannel</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    re.</span><span style="color:#DCBDFB;">showTv</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //实例化一个电视机</span></span>
<span class="line"><span style="color:#24292E;">    TV tv;</span></span>
<span class="line"><span style="color:#24292E;">    Remote </span><span style="color:#6F42C1;">re</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">tv);</span><span style="color:#6A737D;"> // Remote(TV *p); 所以要传地址</span></span>
<span class="line"><span style="color:#24292E;">    re.</span><span style="color:#6F42C1;">offOrOn</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    re.</span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    re.</span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    re.</span><span style="color:#6F42C1;">upVolume</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    re.</span><span style="color:#6F42C1;">setChannel</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    re.</span><span style="color:#6F42C1;">showTv</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_5、设计动态数组类" tabindex="-1">5、设计动态数组类 <a class="header-anchor" href="#_5、设计动态数组类" aria-label="Permalink to &quot;5、设计动态数组类&quot;">​</a></h3><p>相当于数组达到最大限度时 会自行扩充然后复制</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB10.png" alt=""></p><h4 id="array-h" tabindex="-1">array.h <a class="header-anchor" href="#array-h" aria-label="Permalink to &quot;array.h&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ARRAY_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ARRAY_H</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">arr;</span><span style="color:#768390;">//存放首元素地址</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> capacity;</span><span style="color:#768390;">//容量</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> size;</span><span style="color:#768390;">//大小</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Array</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Array</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">capacity</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Array</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Array</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getCapacity</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getSize</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">  // 不允许成员赋值！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">printArray</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    //插入尾部元素</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">elem</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    //删除尾部元素</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">popBack</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#DCBDFB;">at</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">pos</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;">  // 访问arr[pos] 相当于 *(arr+pos) </span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // ARRAY_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ARRAY_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ARRAY_H</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">arr;</span><span style="color:#6A737D;">//存放首元素地址</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> capacity;</span><span style="color:#6A737D;">//容量</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> size;</span><span style="color:#6A737D;">//大小</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">capacity</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Array</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getCapacity</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">const</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getSize</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">const</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">  // 不允许成员赋值！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">printArray</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    //插入尾部元素</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">elem</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    //删除尾部元素</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">popBack</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#6F42C1;">at</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">pos</span><span style="color:#24292E;">);</span><span style="color:#6A737D;">  // 访问arr[pos] 相当于 *(arr+pos) </span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // ARRAY_H</span></span></code></pre></div><h4 id="array-cpp" tabindex="-1">array.cpp <a class="header-anchor" href="#array-cpp" aria-label="Permalink to &quot;array.cpp&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;array.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#96D0FF;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getCapacity</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">const</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> capacity;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">getSize</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">const</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> size;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">printArray</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;">(i</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;i</span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">size; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">arr[i]</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">elem</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //判断容器是否满</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(size </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> capacity)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">        //申请空间</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">tmp </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">2</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">capacity];</span></span>
<span class="line"><span style="color:#768390;">        //将就空间的内容 拷贝到新空间</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">memcpy</span><span style="color:#ADBAC7;">(tmp, arr, capacity</span><span style="color:#F47067;">*sizeof</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">));</span></span>
<span class="line"><span style="color:#768390;">        //释放原有的空间</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">delete []</span><span style="color:#ADBAC7;"> arr;</span></span>
<span class="line"><span style="color:#768390;">        //更新arr的空间</span></span>
<span class="line"><span style="color:#ADBAC7;">        arr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#768390;">        //更新容量</span></span>
<span class="line"><span style="color:#ADBAC7;">        capacity </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">2</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">capacity;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    arr[size]</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">elem;</span></span>
<span class="line"><span style="color:#ADBAC7;">    size</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">popBack</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(size </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;容量为空&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        size</span><span style="color:#F47067;">--</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">at</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">pos</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(pos</span><span style="color:#F47067;">&lt;</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">||</span><span style="color:#ADBAC7;"> pos </span><span style="color:#F47067;">&gt;=</span><span style="color:#ADBAC7;">size)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;访问违法内存&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">exit</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> arr[pos];</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">Array</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    capacity </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    arr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">[capacity];</span></span>
<span class="line"><span style="color:#768390;">    //空间清0</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(arr, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">capacity);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">Array</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> capacity)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;capacity </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> capacity;</span></span>
<span class="line"><span style="color:#ADBAC7;">    size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    arr  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">[capacity];</span></span>
<span class="line"><span style="color:#768390;">    //空间清0</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(arr, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">capacity);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">Array</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> Array </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">ob)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    capacity </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob.capacity;</span></span>
<span class="line"><span style="color:#ADBAC7;">    size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob.size;</span></span>
<span class="line"><span style="color:#768390;">    //深拷贝</span></span>
<span class="line"><span style="color:#ADBAC7;">    arr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">[capacity];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memcpy</span><span style="color:#ADBAC7;">(arr, ob.arr, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">capacity);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">Array</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">Array</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(arr </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">delete []</span><span style="color:#ADBAC7;"> arr;</span></span>
<span class="line"><span style="color:#ADBAC7;">        arr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;array.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#032F62;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getCapacity</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">const</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> capacity;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">getSize</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">const</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> size;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">printArray</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;">(i</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;i</span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">size; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">arr[i]</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">elem</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //判断容器是否满</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(size </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> capacity)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        //申请空间</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">tmp </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">2</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">capacity];</span></span>
<span class="line"><span style="color:#6A737D;">        //将就空间的内容 拷贝到新空间</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">memcpy</span><span style="color:#24292E;">(tmp, arr, capacity</span><span style="color:#D73A49;">*sizeof</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">));</span></span>
<span class="line"><span style="color:#6A737D;">        //释放原有的空间</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete []</span><span style="color:#24292E;"> arr;</span></span>
<span class="line"><span style="color:#6A737D;">        //更新arr的空间</span></span>
<span class="line"><span style="color:#24292E;">        arr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#6A737D;">        //更新容量</span></span>
<span class="line"><span style="color:#24292E;">        capacity </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">capacity;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    arr[size]</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">elem;</span></span>
<span class="line"><span style="color:#24292E;">    size</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">popBack</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(size </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;容量为空&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        size</span><span style="color:#D73A49;">--</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int&amp;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">at</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">pos</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(pos</span><span style="color:#D73A49;">&lt;</span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> pos </span><span style="color:#D73A49;">&gt;=</span><span style="color:#24292E;">size)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;访问违法内存&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">exit</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> arr[pos];</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    capacity </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    arr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[capacity];</span></span>
<span class="line"><span style="color:#6A737D;">    //空间清0</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(arr, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">capacity);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> capacity)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;capacity </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> capacity;</span></span>
<span class="line"><span style="color:#24292E;">    size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    arr  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[capacity];</span></span>
<span class="line"><span style="color:#6A737D;">    //空间清0</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(arr, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">capacity);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> Array </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">ob)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    capacity </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob.capacity;</span></span>
<span class="line"><span style="color:#24292E;">    size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob.size;</span></span>
<span class="line"><span style="color:#6A737D;">    //深拷贝</span></span>
<span class="line"><span style="color:#24292E;">    arr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;">[capacity];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memcpy</span><span style="color:#24292E;">(arr, ob.arr, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">capacity);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(arr </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete []</span><span style="color:#24292E;"> arr;</span></span>
<span class="line"><span style="color:#24292E;">        arr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h4 id="main-h" tabindex="-1">main.h <a class="header-anchor" href="#main-h" aria-label="Permalink to &quot;main.h&quot;">​</a></h4><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;array.h&quot;</span></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Array ob;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getCapacity</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getSize</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">printArray</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getCapacity</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getSize</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">pushBack</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">60</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">printArray</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getCapacity</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getSize</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">popBack</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">popBack</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">printArray</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getCapacity</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">getSize</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;arr[2] = &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.</span><span style="color:#DCBDFB;">at</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">)</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">at</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.</span><span style="color:#DCBDFB;">printArray</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;array.h&quot;</span></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Array ob;</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getCapacity</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getSize</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">40</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">printArray</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getCapacity</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getSize</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">50</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">pushBack</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">60</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">printArray</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getCapacity</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getSize</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">popBack</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">popBack</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">printArray</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getCapacity</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">getSize</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;arr[2] = &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.</span><span style="color:#6F42C1;">at</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">at</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    ob.</span><span style="color:#6F42C1;">printArray</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_19-运算符重载-operator" tabindex="-1">19. 运算符重载 operator <a class="header-anchor" href="#_19-运算符重载-operator" aria-label="Permalink to &quot;19. 运算符重载 operator&quot;">​</a></h2><p>运算符重载 是对已有的运算符 指定新功能。不能创建新运算。</p><p>运算符重载关键字operator</p><p><strong>思路：</strong></p><p>1、弄懂运算符的运算对象的个数。（个数决定了 重载函数的参数个数）</p><p>2、识别运算符左边的运算对象 是类的对象 还是其他.</p><p>类的对象：全局函数实现（不推荐） 成员函数实现（推荐，少一个参数）</p><p>其他：只能是全局函数实现</p><h3 id="_1、重载-运算符-全局函数实现-重载输入" tabindex="-1">1、重载&lt;&lt;运算符（全局函数实现） <strong>重载输入&gt;&gt;</strong> <a class="header-anchor" href="#_1、重载-运算符-全局函数实现-重载输入" aria-label="Permalink to &quot;1、重载&lt;&lt;运算符（全局函数实现） **重载输入&gt;&gt;**&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;string&gt;</span></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Person</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    // 重载的话 全局函数一定要加友元！！！</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ostream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&lt;&lt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">ostream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">out</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">istream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;operator</span><span style="color:#F69D50;">&gt;&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">istream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">in</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num;</span></span>
<span class="line"><span style="color:#ADBAC7;">    string name;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">float</span><span style="color:#ADBAC7;"> score;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Person</span><span style="color:#ADBAC7;">(){}</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Person</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">string</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">float</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">score</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">num</span><span style="color:#ADBAC7;">(num),</span><span style="color:#DCBDFB;">name</span><span style="color:#ADBAC7;">(name),</span><span style="color:#DCBDFB;">score</span><span style="color:#ADBAC7;">(score){}</span></span>
<span class="line"><span style="color:#768390;">    //成员函数重载+   lucy+bob</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">+</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        Person tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">        tmp.num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;num </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> ob.num;</span></span>
<span class="line"><span style="color:#ADBAC7;">        tmp.name </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;name </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> ob.name;</span></span>
<span class="line"><span style="color:#ADBAC7;">        tmp.score </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;score </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> ob.score;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //成员函数重载==  lucy == bob</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">==</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(num </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> ob.num </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> name</span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;">ob.name </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> score</span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;">ob.score)</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //重载后置++ operator++(a,int)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">++</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">        //先保存 旧的值</span></span>
<span class="line"><span style="color:#ADBAC7;">        Person old </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//*this == lucy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        //lucy++ ==&gt; lucy = lucy+1</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;num </span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;name </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;name</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;name;</span><span style="color:#768390;">//（自定义操作）</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;score </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;score</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> old;</span><span style="color:#768390;">//返回旧值</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //重载前置++ operator++(a)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">++</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">        //先++</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;num </span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;name </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;name</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;name;</span><span style="color:#768390;">//（自定义操作）</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;score </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;score</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        //后使用</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;string&gt;</span></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Person</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    // 重载的话 全局函数一定要加友元！！！</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ostream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&lt;&lt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">ostream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">out</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">istream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;operator</span><span style="color:#6F42C1;">&gt;&gt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">istream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">in</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num;</span></span>
<span class="line"><span style="color:#24292E;">    string name;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">float</span><span style="color:#24292E;"> score;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;">(){}</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">string</span><span style="color:#24292E;"> </span><span style="color:#E36209;">name</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">float</span><span style="color:#24292E;"> </span><span style="color:#E36209;">score</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">num</span><span style="color:#24292E;">(num),</span><span style="color:#6F42C1;">name</span><span style="color:#24292E;">(name),</span><span style="color:#6F42C1;">score</span><span style="color:#24292E;">(score){}</span></span>
<span class="line"><span style="color:#6A737D;">    //成员函数重载+   lucy+bob</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">+</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        Person tmp;</span></span>
<span class="line"><span style="color:#24292E;">        tmp.num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;num </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> ob.num;</span></span>
<span class="line"><span style="color:#24292E;">        tmp.name </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;name </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> ob.name;</span></span>
<span class="line"><span style="color:#24292E;">        tmp.score </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;score </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> ob.score;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //成员函数重载==  lucy == bob</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">==</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(num </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> ob.num </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> name</span><span style="color:#D73A49;">==</span><span style="color:#24292E;">ob.name </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> score</span><span style="color:#D73A49;">==</span><span style="color:#24292E;">ob.score)</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //重载后置++ operator++(a,int)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">++</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        //先保存 旧的值</span></span>
<span class="line"><span style="color:#24292E;">        Person old </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//*this == lucy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        //lucy++ ==&gt; lucy = lucy+1</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;num </span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;name </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;name</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;name;</span><span style="color:#6A737D;">//（自定义操作）</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;score </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;score</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> old;</span><span style="color:#6A737D;">//返回旧值</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //重载前置++ operator++(a)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">++</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        //先++</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;num </span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;name </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;name</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;name;</span><span style="color:#6A737D;">//（自定义操作）</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;score </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;score</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        //后使用</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">ostream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&lt;&lt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">ostream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">out</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;"> // ostream &amp; 输出可以进行链式操作</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    // 输出的时候最好不要引用   Person ob</span></span>
<span class="line"><span style="color:#ADBAC7;">    out</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.num</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.name</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.score</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> out;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#F69D50;">istream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;operator</span><span style="color:#F69D50;">&gt;&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">istream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">in</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">Person</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    in</span><span style="color:#F47067;">&gt;&gt;</span><span style="color:#ADBAC7;">ob.num</span><span style="color:#F47067;">&gt;&gt;</span><span style="color:#ADBAC7;">ob.name</span><span style="color:#F47067;">&gt;&gt;</span><span style="color:#ADBAC7;">ob.score;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> in;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Person </span><span style="color:#DCBDFB;">lucy</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">,</span><span style="color:#96D0FF;">&quot;lucy&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">88.8</span><span style="color:#F47067;">f</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    Person bob;</span></span>
<span class="line"><span style="color:#768390;">    //先++  后使用</span></span>
<span class="line"><span style="color:#ADBAC7;">    bob </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">lucy;</span><span style="color:#768390;">//</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">bob</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;  </span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">lucy</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;"> //opreator&lt;&lt;(count,lucy)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">ostream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&lt;&lt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">ostream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">out</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span><span style="color:#6A737D;"> // ostream &amp; 输出可以进行链式操作</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    // 输出的时候最好不要引用   Person ob</span></span>
<span class="line"><span style="color:#24292E;">    out</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.num</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.name</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.score</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> out;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">istream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;operator</span><span style="color:#6F42C1;">&gt;&gt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">istream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">in</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">Person</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    in</span><span style="color:#D73A49;">&gt;&gt;</span><span style="color:#24292E;">ob.num</span><span style="color:#D73A49;">&gt;&gt;</span><span style="color:#24292E;">ob.name</span><span style="color:#D73A49;">&gt;&gt;</span><span style="color:#24292E;">ob.score;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> in;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Person </span><span style="color:#6F42C1;">lucy</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">,</span><span style="color:#032F62;">&quot;lucy&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">88.8</span><span style="color:#D73A49;">f</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    Person bob;</span></span>
<span class="line"><span style="color:#6A737D;">    //先++  后使用</span></span>
<span class="line"><span style="color:#24292E;">    bob </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">++</span><span style="color:#24292E;">lucy;</span><span style="color:#6A737D;">//</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">bob</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;  </span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">lucy</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;"> //opreator&lt;&lt;(count,lucy)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">100 lucy 88</span></span>
<span class="line"><span style="color:#adbac7;">102 bob 99</span></span>
<span class="line"><span style="color:#adbac7;">100 lucy 88</span></span>
<span class="line"><span style="color:#adbac7;">102 bob 99</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">100 lucy 88</span></span>
<span class="line"><span style="color:#24292e;">102 bob 99</span></span>
<span class="line"><span style="color:#24292e;">100 lucy 88</span></span>
<span class="line"><span style="color:#24292e;">102 bob 99</span></span></code></pre></div><p>如果使用全局函数 重载运算符 必须将全局函数设置成友元。</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB12.png" alt=""></p><h3 id="_3、可以重载的运算符" tabindex="-1">3、可以重载的运算符 <a class="header-anchor" href="#_3、可以重载的运算符" aria-label="Permalink to &quot;3、可以重载的运算符&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB11.png" alt=""></p><h2 id="_20-强化string类" tabindex="-1">20. 强化string类 <a class="header-anchor" href="#_20-强化string类" aria-label="Permalink to &quot;20. 强化string类&quot;">​</a></h2><h3 id="mystring-h" tabindex="-1">Mystring.h <a class="header-anchor" href="#mystring-h" aria-label="Permalink to &quot;Mystring.h&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MYSTRING_H</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MYSTRING_H</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyString</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ostream</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&lt;&lt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">ostream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">out</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">friend</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">istream</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&gt;&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">istream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">in</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">str;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> size;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">MyString</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">MyString</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">MyString</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~MyString</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getSize</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#768390;">    //成员函数重载[]</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">[]</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">pos</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">+</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">+</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    // 将一个字符串拷贝给 当前Mystring 要深拷贝</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">MyString</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">=</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">MyString</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">=</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">//    bool operator&lt;(MyString ob);</span></span>
<span class="line"><span style="color:#768390;">//    bool operator&lt;(char *str);</span></span>
<span class="line"><span style="color:#768390;">//    bool operator==(MyString ob);</span></span>
<span class="line"><span style="color:#768390;">//    bool operator==(char *str);</span></span>
<span class="line"><span style="color:#768390;">//    bool operator!=(MyString ob);</span></span>
<span class="line"><span style="color:#768390;">//    bool operator!=(char *str);</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#endif</span><span style="color:#768390;"> // MYSTRING_H</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MYSTRING_H</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MYSTRING_H</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyString</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ostream</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&lt;&lt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">ostream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">out</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">friend</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">istream</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&gt;&gt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">istream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">in</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">str;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> size;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~MyString</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getSize</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">const</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">    //成员函数重载[]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">[]</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">pos</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">+</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">+</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    // 将一个字符串拷贝给 当前Mystring 要深拷贝</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MyString</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">=</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">MyString</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">=</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&gt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&gt;</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">//    bool operator&lt;(MyString ob);</span></span>
<span class="line"><span style="color:#6A737D;">//    bool operator&lt;(char *str);</span></span>
<span class="line"><span style="color:#6A737D;">//    bool operator==(MyString ob);</span></span>
<span class="line"><span style="color:#6A737D;">//    bool operator==(char *str);</span></span>
<span class="line"><span style="color:#6A737D;">//    bool operator!=(MyString ob);</span></span>
<span class="line"><span style="color:#6A737D;">//    bool operator!=(char *str);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#endif</span><span style="color:#6A737D;"> // MYSTRING_H</span></span></code></pre></div><h3 id="_1、构造和析构函数" tabindex="-1"><strong>1、构造和析构函数</strong> <a class="header-anchor" href="#_1、构造和析构函数" aria-label="Permalink to &quot;**1、构造和析构函数**&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MyString</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    str</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    size</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MyString</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">str)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">strlen</span><span style="color:#ADBAC7;">(str);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">[size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, str);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#DCBDFB;">MyString</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> MyString </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">ob)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob.size;</span></span>
<span class="line"><span style="color:#ADBAC7;">    str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">[size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(str, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(str, ob.str);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MyString</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(str </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">delete []</span><span style="color:#ADBAC7;"> str;</span></span>
<span class="line"><span style="color:#ADBAC7;">        str</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    str</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    size</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">str)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">strlen</span><span style="color:#24292E;">(str);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;">[size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, str);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> MyString </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">ob)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob.size;</span></span>
<span class="line"><span style="color:#24292E;">    str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;">[size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(str, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(str, ob.str);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(str </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete []</span><span style="color:#24292E;"> str;</span></span>
<span class="line"><span style="color:#24292E;">        str</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_2、重载输入输出" tabindex="-1">2、重载输入输出 <a class="header-anchor" href="#_2、重载输入输出" aria-label="Permalink to &quot;2、重载输入输出&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">//全局函数实现 &lt;&lt;重载</span></span>
<span class="line"><span style="color:#F69D50;">ostream</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&lt;&lt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">ostream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">out</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    out</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.str;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> out;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#768390;">//全局函数实现 &gt;&gt;重载</span></span>
<span class="line"><span style="color:#F69D50;">istream</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&gt;&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">istream</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">in</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> buf[</span><span style="color:#6CB6FF;">1024</span><span style="color:#ADBAC7;">]</span><span style="color:#F47067;">=</span><span style="color:#96D0FF;">&quot;&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    cin</span><span style="color:#F47067;">&gt;&gt;</span><span style="color:#ADBAC7;">buf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(ob.str </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">//ob已经有字符串</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">delete []</span><span style="color:#ADBAC7;"> ob.str;</span></span>
<span class="line"><span style="color:#ADBAC7;">        ob.str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    ob.size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">strlen</span><span style="color:#ADBAC7;">(buf);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">[ob.size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(ob.str, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">,ob.size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(ob.str, buf);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> in;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//全局函数实现 &lt;&lt;重载</span></span>
<span class="line"><span style="color:#6F42C1;">ostream</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&lt;&lt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">ostream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">out</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    out</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.str;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> out;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6A737D;">//全局函数实现 &gt;&gt;重载</span></span>
<span class="line"><span style="color:#6F42C1;">istream</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&gt;&gt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">istream</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">in</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> buf[</span><span style="color:#005CC5;">1024</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    cin</span><span style="color:#D73A49;">&gt;&gt;</span><span style="color:#24292E;">buf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(ob.str </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">//ob已经有字符串</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete []</span><span style="color:#24292E;"> ob.str;</span></span>
<span class="line"><span style="color:#24292E;">        ob.str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    ob.size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">strlen</span><span style="color:#24292E;">(buf);</span></span>
<span class="line"><span style="color:#24292E;">    ob.str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;">[ob.size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(ob.str, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">,ob.size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(ob.str, buf);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> in;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_3、重载中括号运算符" tabindex="-1">3、重载中括号运算符 <a class="header-anchor" href="#_3、重载中括号运算符" aria-label="Permalink to &quot;3、重载中括号运算符&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">char&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">[]</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">pos</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(pos</span><span style="color:#F47067;">&lt;</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">||</span><span style="color:#ADBAC7;"> pos</span><span style="color:#F47067;">&gt;=</span><span style="color:#ADBAC7;">size)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;元素位置不合法&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">exit</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> str[pos];</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">char&amp;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">[]</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">pos</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(pos</span><span style="color:#D73A49;">&lt;</span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> pos</span><span style="color:#D73A49;">&gt;=</span><span style="color:#24292E;">size)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;元素位置不合法&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">exit</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> str[pos];</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_4、重载-运算符" tabindex="-1">4、重载+运算符 <a class="header-anchor" href="#_4、重载-运算符" aria-label="Permalink to &quot;4、重载+运算符&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">+</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    MyString tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">    tmp.size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> size</span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;">ob.size;</span></span>
<span class="line"><span style="color:#ADBAC7;">    tmp.str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">[tmp.size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(tmp.str, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, tmp.size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(tmp.str, str);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcat</span><span style="color:#ADBAC7;">(tmp.str, ob.str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">+</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    MyString tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">    tmp.size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> size</span><span style="color:#F47067;">+</span><span style="color:#DCBDFB;">strlen</span><span style="color:#ADBAC7;">(str);</span></span>
<span class="line"><span style="color:#ADBAC7;">    tmp.str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">[tmp.size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(tmp.str, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, tmp.size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(tmp.str, </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcat</span><span style="color:#ADBAC7;">(tmp.str, str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">+</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    MyString tmp;</span></span>
<span class="line"><span style="color:#24292E;">    tmp.size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> size</span><span style="color:#D73A49;">+</span><span style="color:#24292E;">ob.size;</span></span>
<span class="line"><span style="color:#24292E;">    tmp.str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;">[tmp.size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(tmp.str, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, tmp.size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(tmp.str, str);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcat</span><span style="color:#24292E;">(tmp.str, ob.str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">+</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    MyString tmp;</span></span>
<span class="line"><span style="color:#24292E;">    tmp.size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> size</span><span style="color:#D73A49;">+</span><span style="color:#6F42C1;">strlen</span><span style="color:#24292E;">(str);</span></span>
<span class="line"><span style="color:#24292E;">    tmp.str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;">[tmp.size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(tmp.str, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, tmp.size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(tmp.str, </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcat</span><span style="color:#24292E;">(tmp.str, str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_5、如果有指针成员-必须重载-赋值运算符-深拷贝" tabindex="-1">5、如果有指针成员 必须重载=赋值运算符（深拷贝） <a class="header-anchor" href="#_5、如果有指针成员-必须重载-赋值运算符-深拷贝" aria-label="Permalink to &quot;5、如果有指针成员 必须重载=赋值运算符（深拷贝）&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">=</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //str2 = str1;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">delete []</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> ob.size;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, ob.str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">=</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#768390;">    //str2 = str1;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">delete []</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;size </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">strlen</span><span style="color:#ADBAC7;">(str);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;size</span><span style="color:#F47067;">+</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">strcpy</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">=</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //str2 = str1;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete []</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> ob.size;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, ob.str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">=</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">    //str2 = str1;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete []</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;size </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">strlen</span><span style="color:#24292E;">(str);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;size</span><span style="color:#D73A49;">+</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">strcpy</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, str);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6、重载-运算符" tabindex="-1">6、重载&gt;运算符 <a class="header-anchor" href="#_6、重载-运算符" aria-label="Permalink to &quot;6、重载&gt;运算符&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ob</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(str</span><span style="color:#F47067;">==</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">||</span><span style="color:#ADBAC7;"> ob.str </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">exit</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, ob.str) </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">bool</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyString</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">&gt;</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">str</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str</span><span style="color:#F47067;">==</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">||</span><span style="color:#ADBAC7;"> str </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">exit</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;str, str) </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&gt;</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;"> </span><span style="color:#E36209;">ob</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(str</span><span style="color:#D73A49;">==</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> ob.str </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">exit</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, ob.str) </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">bool</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyString</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">&gt;</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">str</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str</span><span style="color:#D73A49;">==</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> str </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">exit</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;str, str) </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_21-重载函数调用运算符" tabindex="-1">21. 重载函数调用运算符() <a class="header-anchor" href="#_21-重载函数调用运算符" aria-label="Permalink to &quot;21. 重载函数调用运算符()&quot;">​</a></h2><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%B1%BB13.png" alt=""></p><h2 id="_22-智能指针" tabindex="-1">22. 智能指针 <a class="header-anchor" href="#_22-智能指针" aria-label="Permalink to &quot;22. 智能指针&quot;">​</a></h2><p>智能指针：解决 堆区空间的对象 释放问题</p><p>重载* 运算符：</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Data</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Data</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;无参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Data</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;析构函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">func</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;func函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">SmartPointer</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#ADBAC7;">    Data </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">SmartPointer</span><span style="color:#ADBAC7;">(){}</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">SmartPointer</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">Data</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">p</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~SmartPointer</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">Data</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">*</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">       </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">Data</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">operator</span><span style="color:#F69D50;">-&gt;</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> p;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    SmartPointer </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Data);</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob.operator </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">().</span><span style="color:#DCBDFB;">func</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    (</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">ob).</span><span style="color:#DCBDFB;">func</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    ob.operator </span><span style="color:#F47067;">-&gt;</span><span style="color:#ADBAC7;">()-&gt;</span><span style="color:#DCBDFB;">func</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    ob-&gt;</span><span style="color:#DCBDFB;">func</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">test02</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Data</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;无参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Data</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;析构函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">func</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;func函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SmartPointer</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#24292E;">    Data </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">SmartPointer</span><span style="color:#24292E;">(){}</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">SmartPointer</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">Data</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">p</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~SmartPointer</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">*</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Data</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">operator</span><span style="color:#6F42C1;">-&gt;</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> p;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    SmartPointer </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Data);</span></span>
<span class="line"><span style="color:#24292E;">    ob.operator </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">func</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    (</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">ob).</span><span style="color:#6F42C1;">func</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    ob.operator </span><span style="color:#D73A49;">-&gt;</span><span style="color:#24292E;">()-&gt;</span><span style="color:#6F42C1;">func</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    ob-&gt;</span><span style="color:#6F42C1;">func</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">test02</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">无参构造</span></span>
<span class="line"><span style="color:#adbac7;">func函数</span></span>
<span class="line"><span style="color:#adbac7;">func函数</span></span>
<span class="line"><span style="color:#adbac7;">func函数</span></span>
<span class="line"><span style="color:#adbac7;">func函数</span></span>
<span class="line"><span style="color:#adbac7;">析构函数</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">无参构造</span></span>
<span class="line"><span style="color:#24292e;">func函数</span></span>
<span class="line"><span style="color:#24292e;">func函数</span></span>
<span class="line"><span style="color:#24292e;">func函数</span></span>
<span class="line"><span style="color:#24292e;">func函数</span></span>
<span class="line"><span style="color:#24292e;">析构函数</span></span></code></pre></div><h2 id="_23-继承概述" tabindex="-1">23. 继承概述 <a class="header-anchor" href="#_23-继承概述" aria-label="Permalink to &quot;23. 继承概述&quot;">​</a></h2><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%BB%A7%E6%89%BF1.png" alt=""></p><h2 id="_24-子类的定义形式" tabindex="-1">24. 子类的定义形式 <a class="header-anchor" href="#_24-子类的定义形式" aria-label="Permalink to &quot;24. 子类的定义形式&quot;">​</a></h2><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> 父类{};</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> 子类:继承方式 父类名</span></span>
<span class="line"><span style="color:#ADBAC7;">3 {</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#768390;"> //新增子类数据</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> };</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> 父类{};</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> 子类:继承方式 父类名</span></span>
<span class="line"><span style="color:#24292E;">3 {</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#6A737D;"> //新增子类数据</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> };</span></span></code></pre></div><p>继承方式：private protected public(推荐)</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%BB%A7%E6%89%BF2.png" alt=""></p><p>公共继承 保持不变，保护继承变保护，私有继承变私有，所有父类私有在子类中不可见</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类默认构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Base</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类默认构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Base</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span></code></pre></div><h2 id="_25-子类的构造析够顺序" tabindex="-1">25. 子类的构造析够顺序 <a class="header-anchor" href="#_25-子类的构造析够顺序" aria-label="Permalink to &quot;25. 子类的构造析够顺序&quot;">​</a></h2><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%BB%A7%E6%89%BF3.png" alt=""></p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类默认构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Base</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Other</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Other</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Other默认构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Other</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;b </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Other有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Other</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Other析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    Other ob;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Son</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //父类写类名称   成员对象用对象名</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Son</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">c</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">(a), </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(b)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;c </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Son</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Son </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类默认构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Base</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Other</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Other</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Other默认构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Other</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;b </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Other有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Other</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Other析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    Other ob;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //父类写类名称   成员对象用对象名</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">c</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">(a), </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(b)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;c </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Son</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Son </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">父类构造</span></span>
<span class="line"><span style="color:#adbac7;">Other构造</span></span>
<span class="line"><span style="color:#adbac7;">Son构造</span></span>
<span class="line"><span style="color:#adbac7;">Son析够</span></span>
<span class="line"><span style="color:#adbac7;">Other析够</span></span>
<span class="line"><span style="color:#adbac7;">父类析够</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">父类构造</span></span>
<span class="line"><span style="color:#24292e;">Other构造</span></span>
<span class="line"><span style="color:#24292e;">Son构造</span></span>
<span class="line"><span style="color:#24292e;">Son析够</span></span>
<span class="line"><span style="color:#24292e;">Other析够</span></span>
<span class="line"><span style="color:#24292e;">父类析够</span></span></code></pre></div><h2 id="_26-子类调用成员对象、父类的有参构造" tabindex="-1">26. 子类调用成员对象、父类的有参构造 <a class="header-anchor" href="#_26-子类调用成员对象、父类的有参构造" aria-label="Permalink to &quot;26. 子类调用成员对象、父类的有参构造&quot;">​</a></h2><p>子类 会自动调用 成员对象、父类的默认构造。</p><p>子类 必须使用初始化列表 调用成员对象、父类的有参构造。</p><p>初始化列表时：父类写类名称 成员对象用对象名。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类默认构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Base</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;父类析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Other</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Other</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Other默认构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Other</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;b </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> b;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Other有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Other</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Other析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    Other ob;</span><span style="color:#768390;">  // 这里的成员对象  注意赋值的时候！！！</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Son</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#768390;">    //父类写类名称   成员对象用对象名 ！！！！ 超级重要</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Son</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">c</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">(a), </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(b)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#768390;">        // this-&gt;a = a; 这里不行 这是父类的a</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">-&gt;c </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> c;</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son有参构造&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">~Son</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son析够&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Son </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#ADBAC7;">[])</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类默认构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Base</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;父类析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Other</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Other</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Other默认构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Other</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;b </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Other有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Other</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Other析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    Other ob;</span><span style="color:#6A737D;">  // 这里的成员对象  注意赋值的时候！！！</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    //父类写类名称   成员对象用对象名 ！！！！ 超级重要</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">c</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">(a), </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(b)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        // this-&gt;a = a; 这里不行 这是父类的a</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">-&gt;c </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> c;</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son有参构造&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">~Son</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son析够&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Son </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#24292E;">[])</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_27-子类和父类同名成员处理" tabindex="-1">27.子类和父类同名成员处理 <a class="header-anchor" href="#_27-子类和父类同名成员处理" aria-label="Permalink to &quot;27.子类和父类同名成员处理&quot;">​</a></h2><h3 id="_1、子类和父类-同名成员数据" tabindex="-1">1、子类和父类 同名成员数据 <a class="header-anchor" href="#_1、子类和父类-同名成员数据" aria-label="Permalink to &quot;1、子类和父类 同名成员数据&quot;">​</a></h3><p>同名成员 最简单 最安全的处理方式：加作用域</p><p>子类默认优先访问 子类的同名成员</p><p>必须加父类作用域 访问父类的同名成员</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a)</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">‐</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">13 {</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Son</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> x, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> y):</span><span style="color:#DCBDFB;">Base</span><span style="color:#ADBAC7;">(x)</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> a </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> y;</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> Son </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#768390;"> //子类默认优先访问 子类的同名成员</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#768390;"> //必须加父类作用域 访问父类的同名成员</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.Base::a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a)</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">11</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">13 {</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> x, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> y):</span><span style="color:#6F42C1;">Base</span><span style="color:#24292E;">(x)</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> a </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> y;</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">21</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> Son </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#6A737D;"> //子类默认优先访问 子类的同名成员</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#6A737D;"> //必须加父类作用域 访问父类的同名成员</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.Base::a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">20</span></span>
<span class="line"><span style="color:#adbac7;">10</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">20</span></span>
<span class="line"><span style="color:#24292e;">10</span></span></code></pre></div><h3 id="_2、子类和父类-同名成员函数" tabindex="-1">2、子类和父类 同名成员函数 <a class="header-anchor" href="#_2、子类和父类-同名成员函数" aria-label="Permalink to &quot;2、子类和父类 同名成员函数&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Base 无参的fun01&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">11 {</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son 无参的fun01&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> Son ob;</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#768390;"> //子类默认优先访问 子类的同名成员</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> ob.</span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#768390;"> //必须加父类作用域 访问父类的同名成员</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> ob.Base::</span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Base 无参的fun01&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">9</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">11 {</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son 无参的fun01&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">18</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> Son ob;</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#6A737D;"> //子类默认优先访问 子类的同名成员</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> ob.</span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#6A737D;"> //必须加父类作用域 访问父类的同名成员</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> ob.Base::</span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">Son无参的fun01</span></span>
<span class="line"><span style="color:#adbac7;">Base 无参的fun01</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Son无参的fun01</span></span>
<span class="line"><span style="color:#24292e;">Base 无参的fun01</span></span></code></pre></div><h3 id="_3、子类-重定义-父类的同名函数" tabindex="-1">3、子类 重定义 父类的同名函数 <a class="header-anchor" href="#_3、子类-重定义-父类的同名函数" aria-label="Permalink to &quot;3、子类 重定义 父类的同名函数&quot;">​</a></h3><p>重载：无继承，同一作用域，参数的个数、顺序、类型不同 都可重载</p><p>重定义：有继承， 子类 重定义 父类的同名函数（参数可以不同）（非虚函数）</p><p>子类一旦 重定义了父类的同名函数（不管参数是否一致），子类中都将屏蔽父类所有的同名函数。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Base 无参的fun01&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a)</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Base 的fun01 int&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> b)</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Base 的fun01 int int&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base</span></span>
<span class="line"><span style="color:#ADBAC7;">19 {</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">(string a)</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Son 的fun01 char&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> Son ob;</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> ob.</span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;hello&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;"> ob.</span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> ob.</span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span><span style="color:#ADBAC7;"> ob.</span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Base 无参的fun01&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a)</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Base 的fun01 int&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> b)</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Base 的fun01 int int&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">17</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base</span></span>
<span class="line"><span style="color:#24292E;">19 {</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">(string a)</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Son 的fun01 char&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">26</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> Son ob;</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> ob.</span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;hello&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;"> ob.</span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> ob.</span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#005CC5;">33</span><span style="color:#24292E;"> ob.</span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#005CC5;">34</span><span style="color:#24292E;"> }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">Son的fun01 char</span></span>
<span class="line"><span style="color:#adbac7;">Base 无参的fun01</span></span>
<span class="line"><span style="color:#adbac7;">Base 的fun01 int</span></span>
<span class="line"><span style="color:#adbac7;">Base 的fun01 int int</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">Son的fun01 char</span></span>
<span class="line"><span style="color:#24292e;">Base 无参的fun01</span></span>
<span class="line"><span style="color:#24292e;">Base 的fun01 int</span></span>
<span class="line"><span style="color:#24292e;">Base 的fun01 int int</span></span></code></pre></div><h2 id="_28-子类不能继承父类成员" tabindex="-1">28. 子类不能继承父类成员 <a class="header-anchor" href="#_28-子类不能继承父类成员" aria-label="Permalink to &quot;28. 子类不能继承父类成员&quot;">​</a></h2><p>父类的构造、析够、operator= 不能被子类 继承</p><h2 id="_29-多继承" tabindex="-1">29. 多继承 <a class="header-anchor" href="#_29-多继承" aria-label="Permalink to &quot;29. 多继承&quot;">​</a></h2><h3 id="_1、多继承的格式" tabindex="-1">1、多继承的格式 <a class="header-anchor" href="#_1、多继承的格式" aria-label="Permalink to &quot;1、多继承的格式&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">1 class 父类1{};</span></span>
<span class="line"><span style="color:#adbac7;">2 class 父类2{};</span></span>
<span class="line"><span style="color:#adbac7;">3</span></span>
<span class="line"><span style="color:#adbac7;">4</span></span>
<span class="line"><span style="color:#adbac7;">5 class 子类:继承方式1 父类1, 继承方式2 父类2</span></span>
<span class="line"><span style="color:#adbac7;">6 {</span></span>
<span class="line"><span style="color:#adbac7;">7 //新增子类数据</span></span>
<span class="line"><span style="color:#adbac7;">8 };</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">1 class 父类1{};</span></span>
<span class="line"><span style="color:#24292e;">2 class 父类2{};</span></span>
<span class="line"><span style="color:#24292e;">3</span></span>
<span class="line"><span style="color:#24292e;">4</span></span>
<span class="line"><span style="color:#24292e;">5 class 子类:继承方式1 父类1, 继承方式2 父类2</span></span>
<span class="line"><span style="color:#24292e;">6 {</span></span>
<span class="line"><span style="color:#24292e;">7 //新增子类数据</span></span>
<span class="line"><span style="color:#24292e;">8 };</span></span></code></pre></div><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base1</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base1</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">a</span><span style="color:#ADBAC7;">(a){}</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base2</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">a</span><span style="color:#ADBAC7;">(a){}</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base1</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#768390;">    //int a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Son</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">Base1</span><span style="color:#ADBAC7;">(a),</span><span style="color:#DCBDFB;">Base2</span><span style="color:#ADBAC7;">(b){}</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Son </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot; &quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.b</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#768390;">    //cout&lt;&lt;ob.a&lt;&lt;endl;//子类a</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base1</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base1</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">a</span><span style="color:#24292E;">(a){}</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base2</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">a</span><span style="color:#24292E;">(a){}</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base1</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#6A737D;">    //int a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">Base1</span><span style="color:#24292E;">(a),</span><span style="color:#6F42C1;">Base2</span><span style="color:#24292E;">(b){}</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Son </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.b</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#6A737D;">    //cout&lt;&lt;ob.a&lt;&lt;endl;//子类a</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">6422384 4200555</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">6422384 4200555</span></span></code></pre></div><h3 id="_2、多继承中同名成员" tabindex="-1">2、多继承中同名成员 <a class="header-anchor" href="#_2、多继承中同名成员" aria-label="Permalink to &quot;2、多继承中同名成员&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base1</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base1</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">a</span><span style="color:#ADBAC7;">(a){}</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Base2</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">a</span><span style="color:#ADBAC7;">(a){}</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Son</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base1</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Base2</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#768390;">    //int a;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Son</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">a</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">b</span><span style="color:#ADBAC7;">):</span><span style="color:#DCBDFB;">Base1</span><span style="color:#ADBAC7;">(a),</span><span style="color:#DCBDFB;">Base2</span><span style="color:#ADBAC7;">(b){}</span></span>
<span class="line"><span style="color:#ADBAC7;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    Son </span><span style="color:#DCBDFB;">ob</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#768390;">    //cout&lt;&lt;ob.a&lt;&lt;endl;//子类a</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.Base1::a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">//Base1 a</span></span>
<span class="line"><span style="color:#ADBAC7;">    cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">ob.Base2::a</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span><span style="color:#768390;">//Base2 a</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;iostream&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base1</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base1</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">a</span><span style="color:#24292E;">(a){}</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Base2</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">a</span><span style="color:#24292E;">(a){}</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base1</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Base2</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#6A737D;">    //int a;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">Son</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">a</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">b</span><span style="color:#24292E;">):</span><span style="color:#6F42C1;">Base1</span><span style="color:#24292E;">(a),</span><span style="color:#6F42C1;">Base2</span><span style="color:#24292E;">(b){}</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    Son </span><span style="color:#6F42C1;">ob</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">20</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">    //cout&lt;&lt;ob.a&lt;&lt;endl;//子类a</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.Base1::a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">//Base1 a</span></span>
<span class="line"><span style="color:#24292E;">    cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">ob.Base2::a</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span><span style="color:#6A737D;">//Base2 a</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">30</span></span>
<span class="line"><span style="color:#adbac7;">10</span></span>
<span class="line"><span style="color:#adbac7;">20</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">30</span></span>
<span class="line"><span style="color:#24292e;">10</span></span>
<span class="line"><span style="color:#24292e;">20</span></span></code></pre></div><h2 id="_30-菱形继承" tabindex="-1">30. 菱形继承 <a class="header-anchor" href="#_30-菱形继承" aria-label="Permalink to &quot;30. 菱形继承&quot;">​</a></h2><p>菱形继承：有公共祖先的继承 叫菱形继承。</p><p>最底层的子类 数据 会包含多分（公共祖先的数据）</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E7%BB%A7%E6%89%BF4.png" alt=""></p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> data;</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Sheep</span><span style="color:#ADBAC7;"> :</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span><span style="color:#ADBAC7;">{};</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Tuo</span><span style="color:#ADBAC7;"> :</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span><span style="color:#ADBAC7;"> {};</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">SheepTuo</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Sheep</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Tuo</span><span style="color:#ADBAC7;">{};</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> SheepTuo ob;</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">memset</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">ob, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(SheepTuo));</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#768390;"> //cout &lt;&lt; ob.data &lt;&lt; endl;//二义性</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> ob.Sheep::data </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> ob.Tuo::data </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> data;</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Sheep</span><span style="color:#24292E;"> :</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span><span style="color:#24292E;">{};</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Tuo</span><span style="color:#24292E;"> :</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span><span style="color:#24292E;"> {};</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SheepTuo</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Sheep</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Tuo</span><span style="color:#24292E;">{};</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> SheepTuo ob;</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">memset</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">ob, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(SheepTuo));</span></span>
<span class="line"><span style="color:#005CC5;">13</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#6A737D;"> //cout &lt;&lt; ob.data &lt;&lt; endl;//二义性</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> ob.Sheep::data </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> ob.Tuo::data </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> }</span></span></code></pre></div><p>怎么才能只要公共祖先的一份数据呢？</p><h2 id="_31-虚继承" tabindex="-1">31. 虚继承 <a class="header-anchor" href="#_31-虚继承" aria-label="Permalink to &quot;31. 虚继承&quot;">​</a></h2><p>虚继承 解决 菱形继承中 多分公共祖先数据的问题</p><h3 id="_1、虚继承的概述" tabindex="-1">1、虚继承的概述 <a class="header-anchor" href="#_1、虚继承的概述" aria-label="Permalink to &quot;1、虚继承的概述&quot;">​</a></h3><p>在继承方式 前加virtual修饰</p><p>子类虚继承父类 子类只会保存一份公共数据</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">#include&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#adbac7;">#include&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#adbac7;">using namespace std;</span></span>
<span class="line"><span style="color:#adbac7;">class Animal</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">public:</span></span>
<span class="line"><span style="color:#adbac7;">    int data;</span></span>
<span class="line"><span style="color:#adbac7;">};</span></span>
<span class="line"><span style="color:#adbac7;">class Sheep :virtual public Animal{};</span></span>
<span class="line"><span style="color:#adbac7;">class Tuo :virtual public Animal {};</span></span>
<span class="line"><span style="color:#adbac7;">class SheepTuo:public Sheep,public Tuo{};</span></span>
<span class="line"><span style="color:#adbac7;">int main()</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">    SheepTuo ob;</span></span>
<span class="line"><span style="color:#adbac7;">    memset(&amp;ob, 0, sizeof(SheepTuo));</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">    cout &lt;&lt; ob.data &lt;&lt; endl;</span></span>
<span class="line"><span style="color:#adbac7;">    //cout &lt;&lt; ob.Sheep::data &lt;&lt; endl;</span></span>
<span class="line"><span style="color:#adbac7;">    //cout &lt;&lt; ob.Tuo::data &lt;&lt; endl;</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">#include&lt;iostream&gt;</span></span>
<span class="line"><span style="color:#24292e;">#include&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#24292e;">using namespace std;</span></span>
<span class="line"><span style="color:#24292e;">class Animal</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">public:</span></span>
<span class="line"><span style="color:#24292e;">    int data;</span></span>
<span class="line"><span style="color:#24292e;">};</span></span>
<span class="line"><span style="color:#24292e;">class Sheep :virtual public Animal{};</span></span>
<span class="line"><span style="color:#24292e;">class Tuo :virtual public Animal {};</span></span>
<span class="line"><span style="color:#24292e;">class SheepTuo:public Sheep,public Tuo{};</span></span>
<span class="line"><span style="color:#24292e;">int main()</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">    SheepTuo ob;</span></span>
<span class="line"><span style="color:#24292e;">    memset(&amp;ob, 0, sizeof(SheepTuo));</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    cout &lt;&lt; ob.data &lt;&lt; endl;</span></span>
<span class="line"><span style="color:#24292e;">    //cout &lt;&lt; ob.Sheep::data &lt;&lt; endl;</span></span>
<span class="line"><span style="color:#24292e;">    //cout &lt;&lt; ob.Tuo::data &lt;&lt; endl;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="_2、分析虚继承的实现原理" tabindex="-1">2、分析虚继承的实现原理 <a class="header-anchor" href="#_2、分析虚继承的实现原理" aria-label="Permalink to &quot;2、分析虚继承的实现原理&quot;">​</a></h3><p>虚继承 会在子类中产生 虚基类指针（vbptr） 指向 虚基类表(vbtable), 虚基类表纪录的是通过该指针访问公共祖先的数据的偏移量。</p><p>注意：虚继承只能解决具备公共祖先的多继承所带来的二义性问题，不能解决没有公共祖先的多继承的.</p><p>工程开发中真正意义上的多继承是几乎不被使用，因为多重继承带来的代码复杂性远多于其带来的便利，多重继承对代码维护性上的影响是灾难性的，在设计方法上，任何多继承都可以用单继承代替。</p><h2 id="_32-多态的概述" tabindex="-1">32.多态的概述 <a class="header-anchor" href="#_32-多态的概述" aria-label="Permalink to &quot;32.多态的概述&quot;">​</a></h2><p>静态多态（编译时多态，早绑定）：函数重载、运算符重载</p><p>动态多态（运行时多态，晚绑定）：虚函数</p><h2 id="_33-虚函数" tabindex="-1">33. 虚函数 <a class="header-anchor" href="#_33-虚函数" aria-label="Permalink to &quot;33. 虚函数&quot;">​</a></h2><h3 id="_1、知识点引入" tabindex="-1">1、知识点引入 <a class="header-anchor" href="#_1、知识点引入" aria-label="Permalink to &quot;1、知识点引入&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E5%A4%9A%E6%80%811.png" alt=""></p><p>父类指针（引用）保存 子类空间地址的目的 就是让算法通用。</p><h3 id="_2、父类指针-保存-子类空间地址-带来的问题" tabindex="-1">2、父类指针 保存 子类空间地址（带来的问题） <a class="header-anchor" href="#_2、父类指针-保存-子类空间地址-带来的问题" aria-label="Permalink to &quot;2、父类指针 保存 子类空间地址（带来的问题）&quot;">​</a></h3><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;动物在说话&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Dog</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">10 {</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;狗在汪汪&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> Animal </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Dog;</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> p‐</span><span style="color:#F47067;">&gt;</span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;动物在说话&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Dog</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">10 {</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;狗在汪汪&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">17</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> Animal </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Dog;</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> p‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">动物在说话</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">动物在说话</span></span></code></pre></div><p>其实用户的需求：p-&gt;speak 希望等到的是“狗在汪汪” 而不是“动物在说话”。</p><p>原因在此：</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E5%A4%9A%E6%80%812.png" alt=""></p><h3 id="_3、虚函数的定义-成员函数前加virtual修饰" tabindex="-1">3、虚函数的定义：成员函数前加virtual修饰 <a class="header-anchor" href="#_3、虚函数的定义-成员函数前加virtual修饰" aria-label="Permalink to &quot;3、虚函数的定义：成员函数前加virtual修饰&quot;">​</a></h3><p>子类重写父类的虚函数注意：有继承、子类重写父类虚函数（函数名、返回值类型、参数类型个数顺序 必须完全一致)。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#768390;"> //虚函数</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;动物在说话&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Dog</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">11 {</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#768390;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;狗在汪汪&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Cat</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">20 {</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#768390;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;猫在喵喵&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> Animal </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Dog;</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;"> p1‐</span><span style="color:#F47067;">&gt;</span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> Animal </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Cat;</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span><span style="color:#ADBAC7;"> p2‐</span><span style="color:#F47067;">&gt;</span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span></span>
<span class="line"><span style="color:#6CB6FF;">35</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> p1;</span></span>
<span class="line"><span style="color:#6CB6FF;">36</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> p2;</span></span>
<span class="line"><span style="color:#6CB6FF;">37</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#6A737D;"> //虚函数</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;动物在说话&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Dog</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">11 {</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#6A737D;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;狗在汪汪&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Cat</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">20 {</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#6A737D;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;猫在喵喵&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> Animal </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Dog;</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;"> p1‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> Animal </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Cat;</span></span>
<span class="line"><span style="color:#005CC5;">33</span><span style="color:#24292E;"> p2‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">34</span></span>
<span class="line"><span style="color:#005CC5;">35</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> p1;</span></span>
<span class="line"><span style="color:#005CC5;">36</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> p2;</span></span>
<span class="line"><span style="color:#005CC5;">37</span><span style="color:#24292E;"> }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">狗在汪汪</span></span>
<span class="line"><span style="color:#adbac7;">猫在喵喵</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">狗在汪汪</span></span>
<span class="line"><span style="color:#24292e;">猫在喵喵</span></span></code></pre></div><h3 id="_4、虚函数原理" tabindex="-1">4、虚函数原理 <a class="header-anchor" href="#_4、虚函数原理" aria-label="Permalink to &quot;4、虚函数原理&quot;">​</a></h3><p>如果一个类中的成员函数 被virtual修饰，那么这个函数就是虚函数。类就会产生一个虚函数指针（vfptr）指向了一张虚函数表（vftable）。 如果这个类 没有涉及到继承， 这时虚函数表中 纪录及时当前类的虚函数入口地址。</p><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E5%A4%9A%E6%80%813.png" alt=""></p><h2 id="_34-纯虚函数" tabindex="-1">34. 纯虚函数 <a class="header-anchor" href="#_34-纯虚函数" aria-label="Permalink to &quot;34. 纯虚函数&quot;">​</a></h2><p>虚函数不实现函数体：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">1 class Animal</span></span>
<span class="line"><span style="color:#adbac7;">2 {</span></span>
<span class="line"><span style="color:#adbac7;">3 public:</span></span>
<span class="line"><span style="color:#adbac7;">4 //纯虚函数</span></span>
<span class="line"><span style="color:#adbac7;">5 virtual void speak(void)=0;</span></span>
<span class="line"><span style="color:#adbac7;">6 };</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">1 class Animal</span></span>
<span class="line"><span style="color:#24292e;">2 {</span></span>
<span class="line"><span style="color:#24292e;">3 public:</span></span>
<span class="line"><span style="color:#24292e;">4 //纯虚函数</span></span>
<span class="line"><span style="color:#24292e;">5 virtual void speak(void)=0;</span></span>
<span class="line"><span style="color:#24292e;">6 };</span></span></code></pre></div><p>一旦类中有纯虚函数，那么这个类 就是抽象类。</p><p>抽象类 不能实例化 对象。（Animal ob；错误）</p><p>抽象类 必须被继承 同时 子类 必须重写 父类的所有纯虚函数，否则 子类也是抽象类。</p><p><strong>抽象类主要的目的 是设计 类的接口：</strong></p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> #include </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">iostream</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#768390;"> //抽象制作饮品</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">AbstractDrinking</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#768390;"> //烧水</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Boil</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#768390;"> //冲泡</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Brew</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#768390;"> //倒入杯中</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PourInCup</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#768390;"> //加入辅料</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PutSomething</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#768390;"> //规定流程</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MakeDrink</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">‐</span><span style="color:#F47067;">&gt;</span><span style="color:#DCBDFB;">Boil</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Brew</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PourInCup</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PutSomething</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#768390;"> //制作咖啡</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Coffee</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">AbstractDrinking</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#768390;"> //烧水</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Boil</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;煮农夫山泉!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#768390;"> //冲泡</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Brew</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;冲泡咖啡!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">35</span><span style="color:#768390;"> //倒入杯中</span></span>
<span class="line"><span style="color:#6CB6FF;">36</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PourInCup</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">37</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;将咖啡倒入杯中!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">38</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">39</span><span style="color:#768390;"> //加入辅料</span></span>
<span class="line"><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PutSomething</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">41</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;加入牛奶!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">42</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">43</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">44</span></span>
<span class="line"><span style="color:#6CB6FF;">45</span><span style="color:#768390;"> //制作茶水</span></span>
<span class="line"><span style="color:#6CB6FF;">46</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Tea</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">AbstractDrinking</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#6CB6FF;">47</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">48</span><span style="color:#768390;"> //烧水</span></span>
<span class="line"><span style="color:#6CB6FF;">49</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Boil</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;煮自来水!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">51</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">52</span><span style="color:#768390;"> //冲泡</span></span>
<span class="line"><span style="color:#6CB6FF;">53</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Brew</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">54</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;冲泡茶叶!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">55</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">56</span><span style="color:#768390;"> //倒入杯中</span></span>
<span class="line"><span style="color:#6CB6FF;">57</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PourInCup</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">58</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;将茶水倒入杯中!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">59</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">60</span><span style="color:#768390;"> //加入辅料</span></span>
<span class="line"><span style="color:#6CB6FF;">61</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PutSomething</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">62</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;加入食盐!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">63</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">64</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">65</span></span>
<span class="line"><span style="color:#6CB6FF;">66</span><span style="color:#768390;"> //业务函数</span></span>
<span class="line"><span style="color:#6CB6FF;">67</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">DoBussiness</span><span style="color:#ADBAC7;">(AbstractDrinking</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> drink){</span></span>
<span class="line"><span style="color:#6CB6FF;">68</span><span style="color:#ADBAC7;"> drink‐</span><span style="color:#F47067;">&gt;</span><span style="color:#DCBDFB;">MakeDrink</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">69</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> drink;</span></span>
<span class="line"><span style="color:#6CB6FF;">70</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">71</span></span>
<span class="line"><span style="color:#6CB6FF;">72</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> argc, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">argv[])</span></span>
<span class="line"><span style="color:#6CB6FF;">73</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">74</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">DoBussiness</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Coffee);</span></span>
<span class="line"><span style="color:#6CB6FF;">75</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;‐‐‐‐‐‐‐‐‐‐‐‐‐‐&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">76</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">DoBussiness</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Tea);</span></span>
<span class="line"><span style="color:#6CB6FF;">77</span></span>
<span class="line"><span style="color:#6CB6FF;">78</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> #include </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">iostream</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#005CC5;">2</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#6A737D;"> //抽象制作饮品</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AbstractDrinking</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#6A737D;"> //烧水</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Boil</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#6A737D;"> //冲泡</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Brew</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#6A737D;"> //倒入杯中</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PourInCup</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#6A737D;"> //加入辅料</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PutSomething</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#6A737D;"> //规定流程</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MakeDrink</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#6F42C1;">Boil</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Brew</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PourInCup</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PutSomething</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">23</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#6A737D;"> //制作咖啡</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Coffee</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AbstractDrinking</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#6A737D;"> //烧水</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Boil</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;煮农夫山泉!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#6A737D;"> //冲泡</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Brew</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">33</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;冲泡咖啡!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">34</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">35</span><span style="color:#6A737D;"> //倒入杯中</span></span>
<span class="line"><span style="color:#005CC5;">36</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PourInCup</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">37</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;将咖啡倒入杯中!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">38</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">39</span><span style="color:#6A737D;"> //加入辅料</span></span>
<span class="line"><span style="color:#005CC5;">40</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PutSomething</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">41</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;加入牛奶!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">42</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">43</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">44</span></span>
<span class="line"><span style="color:#005CC5;">45</span><span style="color:#6A737D;"> //制作茶水</span></span>
<span class="line"><span style="color:#005CC5;">46</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Tea</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AbstractDrinking</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#005CC5;">47</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">48</span><span style="color:#6A737D;"> //烧水</span></span>
<span class="line"><span style="color:#005CC5;">49</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Boil</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">50</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;煮自来水!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">51</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">52</span><span style="color:#6A737D;"> //冲泡</span></span>
<span class="line"><span style="color:#005CC5;">53</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Brew</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">54</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;冲泡茶叶!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">55</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">56</span><span style="color:#6A737D;"> //倒入杯中</span></span>
<span class="line"><span style="color:#005CC5;">57</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PourInCup</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">58</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;将茶水倒入杯中!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">59</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">60</span><span style="color:#6A737D;"> //加入辅料</span></span>
<span class="line"><span style="color:#005CC5;">61</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PutSomething</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">62</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;加入食盐!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">63</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">64</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">65</span></span>
<span class="line"><span style="color:#005CC5;">66</span><span style="color:#6A737D;"> //业务函数</span></span>
<span class="line"><span style="color:#005CC5;">67</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DoBussiness</span><span style="color:#24292E;">(AbstractDrinking</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> drink){</span></span>
<span class="line"><span style="color:#005CC5;">68</span><span style="color:#24292E;"> drink‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#6F42C1;">MakeDrink</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">69</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> drink;</span></span>
<span class="line"><span style="color:#005CC5;">70</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">71</span></span>
<span class="line"><span style="color:#005CC5;">72</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> argc, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">argv[])</span></span>
<span class="line"><span style="color:#005CC5;">73</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">74</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DoBussiness</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Coffee);</span></span>
<span class="line"><span style="color:#005CC5;">75</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;‐‐‐‐‐‐‐‐‐‐‐‐‐‐&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">76</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DoBussiness</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Tea);</span></span>
<span class="line"><span style="color:#005CC5;">77</span></span>
<span class="line"><span style="color:#005CC5;">78</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span></code></pre></div><p><strong>问题1：虚函数 和纯虚函数的 区别</strong></p><p>虚函数：virtual修饰 有函数体 不会导致父类为抽象类。</p><p>纯虚函数：virtual修饰，=0，没有函数体 导致父类为抽象类。子类必须重写父类的所有纯虚函数。</p><h2 id="_35-虚析构函数" tabindex="-1">35. 虚析构函数 <a class="header-anchor" href="#_35-虚析构函数" aria-label="Permalink to &quot;35.  虚析构函数&quot;">​</a></h2><p>虚析构：通过父类指针 释放整个子类空间。</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#768390;"> //虚函数</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;动物在说话&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#768390;"> //虚析构</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">Animal</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Animal的析构函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Dog</span><span style="color:#ADBAC7;"> :</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">16 {</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#768390;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;狗在汪汪&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">Dog</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Dog的析构函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;"> Animal</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> p1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Dog;</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> p1‐</span><span style="color:#F47067;">&gt;</span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> p1;</span></span>
<span class="line"><span style="color:#6CB6FF;">35</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#6A737D;"> //虚函数</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;动物在说话&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#6A737D;"> //虚析构</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">Animal</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Animal的析构函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Dog</span><span style="color:#24292E;"> :</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">16 {</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#6A737D;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;狗在汪汪&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">Dog</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Dog的析构函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">28</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;"> Animal</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> p1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Dog;</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> p1‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">33</span></span>
<span class="line"><span style="color:#005CC5;">34</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> p1;</span></span>
<span class="line"><span style="color:#005CC5;">35</span><span style="color:#24292E;"> }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">狗在汪汪</span></span>
<span class="line"><span style="color:#adbac7;">Dog的析够函数</span></span>
<span class="line"><span style="color:#adbac7;">Animal的析够函数</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">狗在汪汪</span></span>
<span class="line"><span style="color:#24292e;">Dog的析够函数</span></span>
<span class="line"><span style="color:#24292e;">Animal的析够函数</span></span></code></pre></div><p>构造的顺序：父类---&gt;成员----&gt;子类</p><p>析构的顺序：子类---&gt;成员----&gt;父类</p><h2 id="_36-纯虚析构函数" tabindex="-1">36. 纯虚析构函数 <a class="header-anchor" href="#_36-纯虚析构函数" aria-label="Permalink to &quot;36. 纯虚析构函数&quot;">​</a></h2><p>纯虚析构的本质：是析构函数，各个类的回收工作。而且析构函数不能被继承。</p><p>必须为纯虚析构函数提供一个函数体。</p><p>纯虚析构函数 必须在类外实现</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> #include </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">iostream</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">5 {</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#768390;"> //纯虚函数</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#768390;"> //纯虚析构函数 必须在类外实现</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">Animal</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Dog</span><span style="color:#ADBAC7;"> :</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span></span>
<span class="line"><span style="color:#ADBAC7;">14 {</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#768390;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;狗在汪汪&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">Dog</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Dog的析构函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> Animal</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> p1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> Dog;</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> p1‐</span><span style="color:#F47067;">&gt;</span><span style="color:#DCBDFB;">speak</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">delete</span><span style="color:#ADBAC7;"> p1;</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">35</span></span>
<span class="line"><span style="color:#6CB6FF;">36</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> argc, </span><span style="color:#F47067;">char*</span><span style="color:#ADBAC7;"> argv[])</span></span>
<span class="line"><span style="color:#6CB6FF;">37</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">38</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">39</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">41</span></span>
<span class="line"><span style="color:#6CB6FF;">42</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Animal</span><span style="color:#ADBAC7;">::</span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">Animal</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">43</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">44</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;Animal的析构函数&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">45</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> #include </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">iostream</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#005CC5;">2</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">5 {</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#6A737D;"> //纯虚函数</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">9</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#6A737D;"> //纯虚析构函数 必须在类外实现</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">Animal</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Dog</span><span style="color:#24292E;"> :</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span></span>
<span class="line"><span style="color:#24292E;">14 {</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#6A737D;"> //子类重写 父类的虚函数</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;狗在汪汪&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">Dog</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Dog的析构函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">26</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> Animal</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> p1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> Dog;</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> p1‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#6F42C1;">speak</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">31</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> p1;</span></span>
<span class="line"><span style="color:#005CC5;">33</span></span>
<span class="line"><span style="color:#005CC5;">34</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">35</span></span>
<span class="line"><span style="color:#005CC5;">36</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> argc, </span><span style="color:#D73A49;">char*</span><span style="color:#24292E;"> argv[])</span></span>
<span class="line"><span style="color:#005CC5;">37</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">38</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">39</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">40</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">41</span></span>
<span class="line"><span style="color:#005CC5;">42</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Animal</span><span style="color:#24292E;">::</span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">Animal</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">43</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">44</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;Animal的析构函数&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">45</span><span style="color:#24292E;"> }</span></span></code></pre></div><p><strong>问题1：虚析构 和纯虚析构的区别？</strong></p><p>虚析构：virtual修饰，有函数体，不会导致父类为抽象类。</p><p>纯虚析构：virtual修饰，=0，函数体必须类外实现，导致父类为抽象类。</p><h2 id="多态的常用问题" tabindex="-1">多态的常用问题 <a class="header-anchor" href="#多态的常用问题" aria-label="Permalink to &quot;多态的常用问题&quot;">​</a></h2><p><strong>1、多态的分类<strong><strong>2、谈谈你对</strong></strong>动态捆绑****机制的理解（虚函数实现原理）</strong></p><p><strong>3、重载、重定义、重写的区别</strong></p><p><strong>4、虚函数和纯虚函数的区别</strong></p><p><strong>5、虚析构和纯虚析构的区别</strong></p><p><strong>6、虚函数的作用</strong></p><p><strong>7、虚析构的作用</strong></p><h2 id="重载、重定义、重写的区别" tabindex="-1"><strong>重载、重定义、重写的区别</strong> <a class="header-anchor" href="#重载、重定义、重写的区别" aria-label="Permalink to &quot;**重载、重定义、重写的区别**&quot;">​</a></h2><p>重载：同一作用域，同名函数，参数的顺序、个数、类型不同 都可以重载。函数的返回值类型不能作为重载条件（函数重载、运算符重载）</p><p>重定义：有继承，子类 重定义 父类的同名函数（非虚函数）， 参数顺序、个数、类型可以不同。子类的同名函数会屏蔽父类的所有同名函数（可以通过作用域解决）</p><p>重写（覆盖）：有继承，子类 重写 父类的虚函数。返回值类型、函数名、参数顺序、个数、类型都必须一致</p>`,333);function h(s,g,m,b,v,q){const o=c,e=C("ClientOnly");return l(),r("div",null,[d,y(e,null,{default:A(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),u])}const R=t(E,[["render",h]]);export{_ as __pageData,R as default};
