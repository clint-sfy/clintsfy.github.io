import{_ as c}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as t,v as l,b as r,E as y,O as C,F as p,L as A,R as i,M as F,C as B,B as D}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const f=JSON.parse('{"title":"C++异常","description":"","frontmatter":{"title":"C++异常","author":"阿源","date":"2023/02/05 21:29","categories":["C++基础快速入门"],"tags":["C++","C++基础","异常"]},"headers":[],"relativePath":"courses/c_plus/01-C++的基础/05-c++异常.md","filePath":"courses/c_plus/01-C++的基础/05-c++异常.md","lastUpdated":1691327334000}'),E={name:"courses/c_plus/01-C++的基础/05-c++异常.md"},h=p("h1",{id:"c-异常",tabindex:"-1"},[A("C++异常 "),p("a",{class:"header-anchor",href:"#c-异常","aria-label":'Permalink to "C++异常"'},"​")],-1),u=i(`<h2 id="异常的概述" tabindex="-1">异常的概述 <a class="header-anchor" href="#异常的概述" aria-label="Permalink to &quot;异常的概述&quot;">​</a></h2><p>遇到错误 抛出异常 捕获异常</p><p>异常：是指在程序运行的过程中发生的一些异常事件（如：除0溢出，数组下标越界，所要读取的文件不存在,空指针，内存不足，访问非法内存等等）。（异常是一个类）</p><p>c++异常机制相比C语言异常处理的优势?</p><p>​ 函数的返回值可以忽略，但异常不可忽略。（忽略异常 程序结束）</p><p>​ 整型返回值没有任何语义信息。而异常却包含语义信息，有时你从类名就能够体现出来</p><h2 id="异常的抛出、捕获" tabindex="-1">异常的抛出、捕获 <a class="header-anchor" href="#异常的抛出、捕获" aria-label="Permalink to &quot;异常的抛出、捕获&quot;">​</a></h2><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">try</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> 异常值;</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(异常类型1 异常值1)</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> 处理异常的代码1;</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(异常类型2 异常值2)</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> 处理异常的代码2;</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(...)</span><span style="color:#768390;">//任何异常都捕获</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> 处理异常的代码3;</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">try</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> 异常值;</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(异常类型1 异常值1)</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> 处理异常的代码1;</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(异常类型2 异常值2)</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> 处理异常的代码2;</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(...)</span><span style="color:#6A737D;">//任何异常都捕获</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> 处理异常的代码3;</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> }</span></span></code></pre></div><h2 id="栈解旋" tabindex="-1">栈解旋 <a class="header-anchor" href="#栈解旋" aria-label="Permalink to &quot;栈解旋&quot;">​</a></h2><p>异常被抛出后，从进入try块起，到异常被抛掷前，这期间在栈上构造的所有对象，都会被自动析构。析构的顺序与构造的顺序相反，这一过程称为栈的解旋</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">try</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> Data ob1;</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> Data ob2;</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> Data ob3;</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//抛出异常后 ob3 ob2 ob1依次自动释放（栈解旋）</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">try</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> Data ob1;</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> Data ob2;</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> Data ob3;</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//抛出异常后 ob3 ob2 ob1依次自动释放（栈解旋）</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> }</span></span></code></pre></div><h2 id="异常的接口声明" tabindex="-1">异常的接口声明 <a class="header-anchor" href="#异常的接口声明" aria-label="Permalink to &quot;异常的接口声明&quot;">​</a></h2><p>异常的接口声明：描述的是 可以抛出哪些类型的异常</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> #include </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">iostream</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">using</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">namespace</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">std</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#768390;"> //函数默认 可以抛出任何类型的异常（推荐）</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#768390;"> //throw 1;</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#768390;"> //throw &#39;1&#39;;</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;hello&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#768390;"> //只能抛出int,char异常</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun02</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#768390;"> //throw 1;</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#768390;"> //throw &#39;1&#39;;</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;hello&quot;</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;">//抛出 不能捕获</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#768390;"> //不能抛出 任何异常</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun03</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#768390;"> //throw &#39;1&#39;;</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#768390;"> //throw &quot;hello&quot;;//抛出 不能捕获</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> ret </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">try</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">fun03</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">35</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">36</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">//捕获</span></span>
<span class="line"><span style="color:#6CB6FF;">37</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">38</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;int异常值为:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">39</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">40</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">//捕获</span></span>
<span class="line"><span style="color:#6CB6FF;">41</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">42</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;char异常值为:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">43</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">44</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">//捕获</span></span>
<span class="line"><span style="color:#6CB6FF;">45</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">46</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;const char *异常值为:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">47</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">48</span></span>
<span class="line"><span style="color:#6CB6FF;">49</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(...)</span><span style="color:#768390;">//捕获</span></span>
<span class="line"><span style="color:#6CB6FF;">50</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">51</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#96D0FF;">&quot;其他异常值为:&quot;</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">52</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">53</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">54</span></span>
<span class="line"><span style="color:#6CB6FF;">55</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> argc, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">argv[])</span></span>
<span class="line"><span style="color:#6CB6FF;">56</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">57</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">58</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">59</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> #include </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">iostream</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#005CC5;">2</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">using</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">namespace</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">std</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">4</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#6A737D;"> //函数默认 可以抛出任何类型的异常（推荐）</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#6A737D;"> //throw 1;</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#6A737D;"> //throw &#39;1&#39;;</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;hello&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">11</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#6A737D;"> //只能抛出int,char异常</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun02</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">char</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#6A737D;"> //throw 1;</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#6A737D;"> //throw &#39;1&#39;;</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;hello&quot;</span><span style="color:#24292E;">;</span><span style="color:#6A737D;">//抛出 不能捕获</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">20</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#6A737D;"> //不能抛出 任何异常</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun03</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#6A737D;"> //throw &#39;1&#39;;</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#6A737D;"> //throw &quot;hello&quot;;//抛出 不能捕获</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">28</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> ret </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">try</span></span>
<span class="line"><span style="color:#005CC5;">33</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">34</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fun03</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">35</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">36</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">//捕获</span></span>
<span class="line"><span style="color:#005CC5;">37</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">38</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;int异常值为:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">39</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">40</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">char</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">//捕获</span></span>
<span class="line"><span style="color:#005CC5;">41</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">42</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;char异常值为:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">43</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">44</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">//捕获</span></span>
<span class="line"><span style="color:#005CC5;">45</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">46</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;const char *异常值为:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">47</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">48</span></span>
<span class="line"><span style="color:#005CC5;">49</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(...)</span><span style="color:#6A737D;">//捕获</span></span>
<span class="line"><span style="color:#005CC5;">50</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">51</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#032F62;">&quot;其他异常值为:&quot;</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">52</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">53</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">54</span></span>
<span class="line"><span style="color:#005CC5;">55</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> argc, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">argv[])</span></span>
<span class="line"><span style="color:#005CC5;">56</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">57</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">58</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">59</span><span style="color:#24292E;"> }</span></span></code></pre></div><h2 id="异常变量的生命周期" tabindex="-1">异常变量的生命周期 <a class="header-anchor" href="#异常变量的生命周期" aria-label="Permalink to &quot;异常变量的生命周期&quot;">​</a></h2><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">MyException</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MyException</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;异常变量构造&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">MyException</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> MyException </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> e)</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;拷贝构造&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">MyException</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;异常变量析构&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> };</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyException</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyException</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;异常变量构造&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">MyException</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> MyException </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> e)</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;拷贝构造&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">MyException</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;异常变量析构&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> };</span></span></code></pre></div><h3 id="_1、以普通对象-接异常值" tabindex="-1">1、以普通对象 接异常值 <a class="header-anchor" href="#_1、以普通对象-接异常值" aria-label="Permalink to &quot;1、以普通对象 接异常值&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E5%BC%82%E5%B8%B81.png" alt=""></p><h3 id="_2、以对象指针-接异常值" tabindex="-1">2、以对象指针 接异常值 <a class="header-anchor" href="#_2、以对象指针-接异常值" aria-label="Permalink to &quot;2、以对象指针 接异常值&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E5%BC%82%E5%B8%B82.png" alt=""></p><h3 id="_3、对象引用-接异常值-推荐" tabindex="-1">3、对象引用 接异常值（推荐） <a class="header-anchor" href="#_3、对象引用-接异常值-推荐" aria-label="Permalink to &quot;3、对象引用 接异常值（推荐）&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E5%BC%82%E5%B8%B83.png" alt=""></p><h2 id="异常的多态" tabindex="-1">异常的多态 <a class="header-anchor" href="#异常的多态" aria-label="Permalink to &quot;异常的多态&quot;">​</a></h2><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#768390;"> //异常基类</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">BaseException</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">printError</span><span style="color:#ADBAC7;">(){};</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#768390;"> //空指针异常</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">NullPointerException</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">BaseException</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">printError</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;空指针异常!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#768390;"> //越界异常</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">OutOfRangeException</span><span style="color:#ADBAC7;"> : </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">BaseException</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">printError</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> cout </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;越界异常!&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;"> endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">doWork</span><span style="color:#ADBAC7;">(){</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#768390;"> //throw NullPointerException();</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">OutOfRangeException</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test03</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">try</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">doWork</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;"> (BaseException</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;"> ex)</span><span style="color:#768390;">//父类引用 可以捕获搭配该父类派生出的所有子类的子类</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">35</span><span style="color:#ADBAC7;"> ex.</span><span style="color:#DCBDFB;">printError</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">36</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">37</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#6A737D;"> //异常基类</span></span>
<span class="line"><span style="color:#005CC5;">2</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">BaseException</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">printError</span><span style="color:#24292E;">(){};</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">6</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#6A737D;"> //空指针异常</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NullPointerException</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">BaseException</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">printError</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;空指针异常!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#6A737D;"> //越界异常</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OutOfRangeException</span><span style="color:#24292E;"> : </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">BaseException</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">printError</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> cout </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;越界异常!&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;"> endl;</span></span>
<span class="line"><span style="color:#005CC5;">19</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">21</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">doWork</span><span style="color:#24292E;">(){</span></span>
<span class="line"><span style="color:#005CC5;">23</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#6A737D;"> //throw NullPointerException();</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OutOfRangeException</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">27</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test03</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">try</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">doWork</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">33</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;"> (BaseException</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;"> ex)</span><span style="color:#6A737D;">//父类引用 可以捕获搭配该父类派生出的所有子类的子类</span></span>
<span class="line"><span style="color:#005CC5;">34</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">35</span><span style="color:#24292E;"> ex.</span><span style="color:#6F42C1;">printError</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">36</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">37</span><span style="color:#24292E;"> }</span></span></code></pre></div><h2 id="c-标准异常" tabindex="-1">c++标准异常 <a class="header-anchor" href="#c-标准异常" aria-label="Permalink to &quot;c++标准异常&quot;">​</a></h2><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/%E5%BC%82%E5%B8%B84.png" alt=""></p><h2 id="编写自己的异常" tabindex="-1">编写自己的异常 <a class="header-anchor" href="#编写自己的异常" aria-label="Permalink to &quot;编写自己的异常&quot;">​</a></h2><p>编写字节的异常：基于标准异常</p><p>自己的异常 一定要从exception上继承</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">NewException</span><span style="color:#ADBAC7;">:</span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">exception</span></span>
<span class="line"><span style="color:#ADBAC7;">2 {</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">private:</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> string msg;</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">public:</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">NewException</span><span style="color:#ADBAC7;">(){}</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">NewException</span><span style="color:#ADBAC7;">(string msg)</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">‐</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">msg </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> msg;</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#768390;"> //重写父类的what</span></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">virtual</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char*</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">what</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;">()</span><span style="color:#768390;">//防止父类在子类前抛出标准异常</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#768390;"> //将string类转换成char *</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">this</span><span style="color:#ADBAC7;">‐</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">msg.</span><span style="color:#DCBDFB;">c_str</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">~</span><span style="color:#DCBDFB;">NewException</span><span style="color:#ADBAC7;">(){}</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test05</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">try</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">NewException</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;哈哈，自己的异常&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">catch</span><span style="color:#ADBAC7;">(exception </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">e)</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> cout</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">e.</span><span style="color:#DCBDFB;">what</span><span style="color:#ADBAC7;">()</span><span style="color:#F47067;">&lt;&lt;</span><span style="color:#ADBAC7;">endl;</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NewException</span><span style="color:#24292E;">:</span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">exception</span></span>
<span class="line"><span style="color:#24292E;">2 {</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">private:</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> string msg;</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">public:</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NewException</span><span style="color:#24292E;">(){}</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NewException</span><span style="color:#24292E;">(string msg)</span></span>
<span class="line"><span style="color:#005CC5;">8</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">msg </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> msg;</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#6A737D;"> //重写父类的what</span></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">virtual</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char*</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">what</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;">()</span><span style="color:#6A737D;">//防止父类在子类前抛出标准异常</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#6A737D;"> //将string类转换成char *</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">msg.</span><span style="color:#6F42C1;">c_str</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#6F42C1;">NewException</span><span style="color:#24292E;">(){}</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> };</span></span>
<span class="line"><span style="color:#005CC5;">19</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test05</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">try</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NewException</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;哈哈，自己的异常&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#005CC5;">25</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">27</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;">(exception </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">e)</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> cout</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">e.</span><span style="color:#6F42C1;">what</span><span style="color:#24292E;">()</span><span style="color:#D73A49;">&lt;&lt;</span><span style="color:#24292E;">endl;</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;"> }</span></span></code></pre></div>`,30);function d(s,g,m,b,q,v){const o=c,e=F("ClientOnly");return l(),r("div",null,[h,y(e,null,{default:C(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(l(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):D("",!0)]}),_:1}),u])}const k=t(E,[["render",d]]);export{f as __pageData,k as default};
