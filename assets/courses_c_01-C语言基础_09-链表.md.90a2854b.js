import{_ as c}from"./chunks/ArticleMetadata.59a467b2.js";import{_ as t,v as p,b as r,t as y,O as A,F as l,L as D,R as i,M as C,C as B,B as F}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const x=JSON.parse('{"title":"C语言链表","description":"","frontmatter":{"title":"C语言链表","author":"阿源","date":"2023/01/09 11:15","categories":["C基础快速入门"],"tags":["C","C基础"]},"headers":[],"relativePath":"courses/c/01-C语言基础/09-链表.md","filePath":"courses/c/01-C语言基础/09-链表.md","lastUpdated":1691327334000}'),E={name:"courses/c/01-C语言基础/09-链表.md"},d=l("h1",{id:"链表",tabindex:"-1"},[D("链表 "),l("a",{class:"header-anchor",href:"#链表","aria-label":'Permalink to "链表"'},"​")],-1),u=i(`<h2 id="_1、链表的概述" tabindex="-1">1、链表的概述 <a class="header-anchor" href="#_1、链表的概述" aria-label="Permalink to &quot;1、链表的概述&quot;">​</a></h2><p><strong>1、数组和链表的优缺点</strong></p><p>静态数组：int arr[5]; 必须事先确定数组元素的个数，过多浪费 过小容易溢出，删除插入</p><p>数据效率低（需要移动大量的数据）</p><p>动态数组：不需要事先知道元素的个数，在使用中动态申请，删除插入数据效率低（需要移动大量的数据）</p><p>（数组优点：遍历元素效率高）</p><p>链表：不需要事先知道数据的个数，在使用中动态申请，插入删除不需要移动数据</p><p>（链表缺点：遍历效率低）</p><p><strong>2、链表的概述</strong></p><p>链表是由一个个节点组成，节点没有名字，每个节点从堆区动态申请，节点间物理上是非连</p><p>续的，但是每个节点通过指针域 保存下一个节点的位置 达到逻辑上连续</p><h2 id="_2、静态链表" tabindex="-1">2、静态链表 <a class="header-anchor" href="#_2、静态链表" aria-label="Permalink to &quot;2、静态链表&quot;">​</a></h2><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;"> #include </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">stdio.h</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#6CB6FF;">2</span></span>
<span class="line"><span style="color:#6CB6FF;">3</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu</span></span>
<span class="line"><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">5</span><span style="color:#768390;"> //数据域</span></span>
<span class="line"><span style="color:#6CB6FF;">6</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num;</span></span>
<span class="line"><span style="color:#6CB6FF;">7</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#6CB6FF;">8</span></span>
<span class="line"><span style="color:#6CB6FF;">9</span><span style="color:#768390;"> //指针域</span></span>
<span class="line"><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">next;</span></span>
<span class="line"><span style="color:#6CB6FF;">11</span><span style="color:#ADBAC7;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6CB6FF;">12</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">test01</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#6CB6FF;">13</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">14</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu node1 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> {</span><span style="color:#6CB6FF;">100</span><span style="color:#ADBAC7;">, </span><span style="color:#96D0FF;">&quot;lucy&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#6CB6FF;">15</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu node2 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> {</span><span style="color:#6CB6FF;">101</span><span style="color:#ADBAC7;">, </span><span style="color:#96D0FF;">&quot;bob&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#6CB6FF;">16</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu node3 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> {</span><span style="color:#6CB6FF;">102</span><span style="color:#ADBAC7;">, </span><span style="color:#96D0FF;">&quot;tom&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#6CB6FF;">17</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu node4 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> {</span><span style="color:#6CB6FF;">103</span><span style="color:#ADBAC7;">, </span><span style="color:#96D0FF;">&quot;德玛&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#6CB6FF;">18</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu node5 </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> {</span><span style="color:#6CB6FF;">104</span><span style="color:#ADBAC7;">, </span><span style="color:#96D0FF;">&quot;小法&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">};</span></span>
<span class="line"><span style="color:#6CB6FF;">19</span></span>
<span class="line"><span style="color:#6CB6FF;">20</span><span style="color:#768390;"> //定义链表头</span></span>
<span class="line"><span style="color:#6CB6FF;">21</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">node1;</span></span>
<span class="line"><span style="color:#6CB6FF;">22</span><span style="color:#ADBAC7;"> node1.next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">node2;</span></span>
<span class="line"><span style="color:#6CB6FF;">23</span><span style="color:#ADBAC7;"> node2.next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">node3;</span></span>
<span class="line"><span style="color:#6CB6FF;">24</span><span style="color:#ADBAC7;"> node3.next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">node4;</span></span>
<span class="line"><span style="color:#6CB6FF;">25</span><span style="color:#ADBAC7;"> node4.next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">node5;</span></span>
<span class="line"><span style="color:#6CB6FF;">26</span><span style="color:#ADBAC7;"> node5.next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#6CB6FF;">27</span></span>
<span class="line"><span style="color:#6CB6FF;">28</span><span style="color:#768390;"> //遍历</span></span>
<span class="line"><span style="color:#6CB6FF;">29</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#6CB6FF;">30</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (pb </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#6CB6FF;">31</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#6CB6FF;">32</span><span style="color:#768390;"> //访问数据</span></span>
<span class="line"><span style="color:#6CB6FF;">33</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pb‐</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">num, pb‐</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">name);</span></span>
<span class="line"><span style="color:#6CB6FF;">34</span></span>
<span class="line"><span style="color:#6CB6FF;">35</span><span style="color:#768390;"> //pb移动到下一个节点位置</span></span>
<span class="line"><span style="color:#6CB6FF;">36</span><span style="color:#ADBAC7;"> pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb‐</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">next;</span></span>
<span class="line"><span style="color:#6CB6FF;">37</span><span style="color:#ADBAC7;"> }</span></span>
<span class="line"><span style="color:#6CB6FF;">38</span><span style="color:#ADBAC7;"> }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">1</span><span style="color:#24292E;"> #include </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">stdio.h</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#005CC5;">2</span></span>
<span class="line"><span style="color:#005CC5;">3</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu</span></span>
<span class="line"><span style="color:#005CC5;">4</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">5</span><span style="color:#6A737D;"> //数据域</span></span>
<span class="line"><span style="color:#005CC5;">6</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num;</span></span>
<span class="line"><span style="color:#005CC5;">7</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#E36209;">name</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#005CC5;">8</span></span>
<span class="line"><span style="color:#005CC5;">9</span><span style="color:#6A737D;"> //指针域</span></span>
<span class="line"><span style="color:#005CC5;">10</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">next;</span></span>
<span class="line"><span style="color:#005CC5;">11</span><span style="color:#24292E;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">12</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">test01</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#005CC5;">13</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">14</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu node1 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#005CC5;">100</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;lucy&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#005CC5;">15</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu node2 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#005CC5;">101</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;bob&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#005CC5;">16</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu node3 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#005CC5;">102</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;tom&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#005CC5;">17</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu node4 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#005CC5;">103</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;德玛&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#005CC5;">18</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu node5 </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#005CC5;">104</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;小法&quot;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#005CC5;">19</span></span>
<span class="line"><span style="color:#005CC5;">20</span><span style="color:#6A737D;"> //定义链表头</span></span>
<span class="line"><span style="color:#005CC5;">21</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">node1;</span></span>
<span class="line"><span style="color:#005CC5;">22</span><span style="color:#24292E;"> node1.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">node2;</span></span>
<span class="line"><span style="color:#005CC5;">23</span><span style="color:#24292E;"> node2.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">node3;</span></span>
<span class="line"><span style="color:#005CC5;">24</span><span style="color:#24292E;"> node3.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">node4;</span></span>
<span class="line"><span style="color:#005CC5;">25</span><span style="color:#24292E;"> node4.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">node5;</span></span>
<span class="line"><span style="color:#005CC5;">26</span><span style="color:#24292E;"> node5.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#005CC5;">27</span></span>
<span class="line"><span style="color:#005CC5;">28</span><span style="color:#6A737D;"> //遍历</span></span>
<span class="line"><span style="color:#005CC5;">29</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#005CC5;">30</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (pb </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#005CC5;">31</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#005CC5;">32</span><span style="color:#6A737D;"> //访问数据</span></span>
<span class="line"><span style="color:#005CC5;">33</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pb‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">num, pb‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">name);</span></span>
<span class="line"><span style="color:#005CC5;">34</span></span>
<span class="line"><span style="color:#005CC5;">35</span><span style="color:#6A737D;"> //pb移动到下一个节点位置</span></span>
<span class="line"><span style="color:#005CC5;">36</span><span style="color:#24292E;"> pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb‐</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">next;</span></span>
<span class="line"><span style="color:#005CC5;">37</span><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#005CC5;">38</span><span style="color:#24292E;"> }</span></span></code></pre></div><h2 id="_3、管理系统" tabindex="-1">3、管理系统 <a class="header-anchor" href="#_3、管理系统" aria-label="Permalink to &quot;3、管理系统&quot;">​</a></h2><h3 id="_1、typedef-给结构体类型取别名" tabindex="-1">1、typedef 给结构体类型取别名 <a class="header-anchor" href="#_1、typedef-给结构体类型取别名" aria-label="Permalink to &quot;1、typedef 给结构体类型取别名&quot;">​</a></h3><p><img src="https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c/%E9%93%BE%E8%A1%A81.png" alt=""></p><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">typedef</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//数据域</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//指针域</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">next;</span></span>
<span class="line"><span style="color:#ADBAC7;">} STU;</span></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">, STU </span><span style="color:#F69D50;">tmp</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">search_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">delete_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">typedef</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//数据域</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#E36209;">name</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//指针域</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pre;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">next;</span></span>
<span class="line"><span style="color:#24292E;">} STU;</span></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">, STU </span><span style="color:#E36209;">tmp</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">search_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">delete_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">);</span></span></code></pre></div><h3 id="_2、工程的main函数的设计" tabindex="-1">2、工程的main函数的设计 <a class="header-anchor" href="#_2、工程的main函数的设计" aria-label="Permalink to &quot;2、工程的main函数的设计&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;link.h&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span><span style="color:#768390;"> //一定要初始化为NULL</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">help</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*******************************</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*help:帮助信息                *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*insert:插入链表节点          *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*print:遍历链表节点           *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*search:查询链表某个节点      *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*delete:删除链表某个节点      *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*free:释放整个链表            *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*quit:退出程序                *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*reverse:翻转链表             *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*sort:链表排序                *</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;*******************************</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#F47067;">[]</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">help</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">cmd</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">128</span><span style="color:#ADBAC7;">] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入操作命令:&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%s</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, cmd);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;help&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">help</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;insert&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入需要插入的学生信息num name score:&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">            STU tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%f</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">tmp.num, tmp.name, </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">tmp.score);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">//将tmp插入到链表中</span></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(head, tmp);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;print&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;search&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入要查找的姓名:&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">128</span><span style="color:#ADBAC7;">] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%s</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, name);</span></span>
<span class="line"><span style="color:#ADBAC7;">            STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">ret </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">search_link</span><span style="color:#ADBAC7;">(head, name);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (ret </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;查询的结果:</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%f\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, ret-&gt;num, ret-&gt;name, ret-&gt;score);</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;delete&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入要删除的学号:&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">delete_link</span><span style="color:#ADBAC7;">(head, num);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;free&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;quit&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;reverse&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">reverse_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(cmd, </span><span style="color:#96D0FF;">&quot;sort&quot;</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">sort_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;link.h&quot;</span></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span><span style="color:#6A737D;"> //一定要初始化为NULL</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">help</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">void</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*******************************</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*help:帮助信息                *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*insert:插入链表节点          *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*print:遍历链表节点           *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*search:查询链表某个节点      *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*delete:删除链表某个节点      *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*free:释放整个链表            *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*quit:退出程序                *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*reverse:翻转链表             *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*sort:链表排序                *</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;*******************************</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#D73A49;">[]</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">help</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#E36209;">cmd</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">128</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入操作命令:&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%s</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, cmd);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;help&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">help</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;insert&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入需要插入的学生信息num name score:&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            STU tmp;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%f</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">tmp.num, tmp.name, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">tmp.score);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">//将tmp插入到链表中</span></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(head, tmp);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;print&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;search&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入要查找的姓名:&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#E36209;">name</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">128</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%s</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, name);</span></span>
<span class="line"><span style="color:#24292E;">            STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">ret </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">search_link</span><span style="color:#24292E;">(head, name);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (ret </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;查询的结果:</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%f\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, ret-&gt;num, ret-&gt;name, ret-&gt;score);</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;delete&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入要删除的学号:&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">delete_link</span><span style="color:#24292E;">(head, num);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;free&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;quit&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;reverse&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">reverse_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(cmd, </span><span style="color:#032F62;">&quot;sort&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">sort_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#ifndef</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">__LINK_H__</span></span>
<span class="line"><span style="color:#F47067;">#define</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">__LINK_H__</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">//定义链表节点类型</span></span>
<span class="line"><span style="color:#F47067;">typedef</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//数据域</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">float</span><span style="color:#ADBAC7;"> score;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//指针域</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">next;</span></span>
<span class="line"><span style="color:#ADBAC7;">} STU;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">extern</span><span style="color:#ADBAC7;"> STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, STU </span><span style="color:#F69D50;">tmp</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">extern</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">extern</span><span style="color:#ADBAC7;"> STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">search_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">extern</span><span style="color:#ADBAC7;"> STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">delete_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">extern</span><span style="color:#ADBAC7;"> STU</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(STU</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">extern</span><span style="color:#ADBAC7;"> STU</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">reverse_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">extern</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">sort_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#endif</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#ifndef</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">__LINK_H__</span></span>
<span class="line"><span style="color:#D73A49;">#define</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">__LINK_H__</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">//定义链表节点类型</span></span>
<span class="line"><span style="color:#D73A49;">typedef</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//数据域</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#E36209;">name</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">];</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">float</span><span style="color:#24292E;"> score;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//指针域</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">next;</span></span>
<span class="line"><span style="color:#24292E;">} STU;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">extern</span><span style="color:#24292E;"> STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, STU </span><span style="color:#E36209;">tmp</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">extern</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">extern</span><span style="color:#24292E;"> STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">search_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">name</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">extern</span><span style="color:#24292E;"> STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">delete_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">extern</span><span style="color:#24292E;"> STU</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(STU</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#E36209;">head</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">extern</span><span style="color:#24292E;"> STU</span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">reverse_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">extern</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">sort_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span></code></pre></div><h3 id="_3、链表插入节点值-头插法" tabindex="-1">3、链表插入节点值----头插法 <a class="header-anchor" href="#_3、链表插入节点值-头插法" aria-label="Permalink to &quot;3、链表插入节点值----头插法&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, STU </span><span style="color:#F69D50;">tmp</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//为待插入的数据申请 空间</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">calloc</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(STU));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pi </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">perror</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;calloc&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">exit</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;"> //结束进程</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//将tmp数据赋值到 *pi</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">    pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (head </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;"> //不存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//return head;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span><span style="color:#768390;">   //头插</span></span>
<span class="line"><span style="color:#ADBAC7;">        head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//return head;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, STU </span><span style="color:#E36209;">tmp</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//为待插入的数据申请 空间</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">calloc</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(STU));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pi </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">perror</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;calloc&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">exit</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span><span style="color:#6A737D;"> //结束进程</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//将tmp数据赋值到 *pi</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#24292E;">    pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (head </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span><span style="color:#6A737D;"> //不存在</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//return head;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //存在</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span><span style="color:#6A737D;">   //头插</span></span>
<span class="line"><span style="color:#24292E;">        head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//return head;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_4、遍历链表" tabindex="-1">4、遍历链表 <a class="header-anchor" href="#_4、遍历链表" aria-label="Permalink to &quot;4、遍历链表&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (head </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exits</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (pb </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%f\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pb-&gt;num, pb-&gt;name, pb-&gt;score);</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (head </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exits</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (pb </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%f\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pb-&gt;num, pb-&gt;name, pb-&gt;score);</span></span>
<span class="line"><span style="color:#24292E;">            pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_5、链表的尾部插入" tabindex="-1">5、链表的尾部插入 <a class="header-anchor" href="#_5、链表的尾部插入" aria-label="Permalink to &quot;5、链表的尾部插入&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">//尾部插入</span></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, STU </span><span style="color:#F69D50;">tmp</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//为待插入的数据申请 空间</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">calloc</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(STU));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pi </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">perror</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;calloc&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">exit</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;"> //结束进程</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//将tmp数据赋值到 *pi</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">    pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (head </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;"> //不存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//return head;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//寻找链表的尾节点</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (pb-&gt;next </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//pb就是尾节点</span></span>
<span class="line"><span style="color:#ADBAC7;">        pb-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//尾部插入</span></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, STU </span><span style="color:#E36209;">tmp</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//为待插入的数据申请 空间</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">calloc</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(STU));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pi </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">perror</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;calloc&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">exit</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span><span style="color:#6A737D;"> //结束进程</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//将tmp数据赋值到 *pi</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#24292E;">    pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (head </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span><span style="color:#6A737D;"> //不存在</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//return head;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //存在</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//寻找链表的尾节点</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (pb-&gt;next </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//pb就是尾节点</span></span>
<span class="line"><span style="color:#24292E;">        pb-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_6、有序插入" tabindex="-1">6、有序插入 <a class="header-anchor" href="#_6、有序插入" aria-label="Permalink to &quot;6、有序插入&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">//有序插入  按照num顺序</span></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, STU </span><span style="color:#F69D50;">tmp</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//为待插入的数据申请 空间</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">calloc</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(STU));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pi </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">perror</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;calloc&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">exit</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span><span style="color:#768390;"> //结束进程</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//将tmp数据赋值到 *pi</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">    pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (head </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;"> //不存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//return head;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//寻找插入点的位置</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head, </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pf </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> ((pb-&gt;num </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> pi-&gt;num) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pb-&gt;next </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">))</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pf </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb;</span><span style="color:#768390;">        // 前一个结点</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span><span style="color:#768390;">  // 记录下刚好&gt;=该节点</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pb-&gt;num </span><span style="color:#F47067;">&gt;=</span><span style="color:#ADBAC7;"> pi-&gt;num)</span><span style="color:#768390;"> //头部，中部插入</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (head </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> pb)</span><span style="color:#768390;"> //头部之前插入</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">                head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //中部插入</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                pf-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">                pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //尾部插入</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//有序插入  按照num顺序</span></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, STU </span><span style="color:#E36209;">tmp</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//为待插入的数据申请 空间</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">calloc</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(STU));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pi </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">perror</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;calloc&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">exit</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span><span style="color:#6A737D;"> //结束进程</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//将tmp数据赋值到 *pi</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#24292E;">    pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (head </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span><span style="color:#6A737D;"> //不存在</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//return head;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //存在</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//寻找插入点的位置</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head, </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pf </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> ((pb-&gt;num </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> pi-&gt;num) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pb-&gt;next </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">))</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pf </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb;</span><span style="color:#6A737D;">        // 前一个结点</span></span>
<span class="line"><span style="color:#24292E;">            pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span><span style="color:#6A737D;">  // 记录下刚好&gt;=该节点</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pb-&gt;num </span><span style="color:#D73A49;">&gt;=</span><span style="color:#24292E;"> pi-&gt;num)</span><span style="color:#6A737D;"> //头部，中部插入</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (head </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> pb)</span><span style="color:#6A737D;"> //头部之前插入</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">                head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //中部插入</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                pf-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">                pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //尾部插入</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pb-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_7、查找链表指定节点" tabindex="-1">7、查找链表指定节点 <a class="header-anchor" href="#_7、查找链表指定节点" aria-label="Permalink to &quot;7、查找链表指定节点&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">search_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //链表存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> ((</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(pb-&gt;name, name) </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pb-&gt;next </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">))</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//找到</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#DCBDFB;">strcmp</span><span style="color:#ADBAC7;">(pb-&gt;name, name) </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> pb;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;未找到相关数据</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">search_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">name</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //链表存在</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> ((</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(pb-&gt;name, name) </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pb-&gt;next </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">))</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//找到</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">strcmp</span><span style="color:#24292E;">(pb-&gt;name, name) </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> pb;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;未找到相关数据</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_8、删除链表指定节点" tabindex="-1">8、删除链表指定节点 <a class="header-anchor" href="#_8、删除链表指定节点" aria-label="Permalink to &quot;8、删除链表指定节点&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">delete_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//查找删除的点</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head, </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pf </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> ((pb-&gt;num </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> num) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pb-&gt;next </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">))</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pf </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb;</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pb-&gt;num </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> num)</span><span style="color:#768390;"> //找到</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">//判断删除点的位置</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pb </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span><span style="color:#768390;"> //删除头节点</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#768390;">//free(pb);</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //删除中尾部节点</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                pf-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#768390;">//free(pb);</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(pb);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;已成功删除num=</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;">的节点</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, num);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#768390;"> //未找到</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;未找到需要删除的节点</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">delete_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//查找删除的点</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head, </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pf </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> ((pb-&gt;num </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> num) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pb-&gt;next </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">))</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pf </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb;</span></span>
<span class="line"><span style="color:#24292E;">            pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pb-&gt;num </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> num)</span><span style="color:#6A737D;"> //找到</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">//判断删除点的位置</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pb </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span><span style="color:#6A737D;"> //删除头节点</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">//free(pb);</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //删除中尾部节点</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                pf-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">//free(pb);</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(pb);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;已成功删除num=</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;">的节点</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, num);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#6A737D;"> //未找到</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;未找到需要删除的节点</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_9、释放链表" tabindex="-1">9、释放链表 <a class="header-anchor" href="#_9、释放链表" aria-label="Permalink to &quot;9、释放链表&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (pb </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(pb);</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (pb </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(pb);</span></span>
<span class="line"><span style="color:#24292E;">            pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_10、链表翻转" tabindex="-1">10、链表翻转 <a class="header-anchor" href="#_10、链表翻转" aria-label="Permalink to &quot;10、链表翻转&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">reverse_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">//return head;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">        head-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (pb </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">//纪录pb下一个节点位置</span></span>
<span class="line"><span style="color:#ADBAC7;">            pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">//pb连接上一个节点</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pb;</span></span>
<span class="line"><span style="color:#ADBAC7;">            pb </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pn;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;链表翻转成功</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">reverse_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">//return head;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        head-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (pb </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">//纪录pb下一个节点位置</span></span>
<span class="line"><span style="color:#24292E;">            pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">//pb连接上一个节点</span></span>
<span class="line"><span style="color:#24292E;">            pb-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pb;</span></span>
<span class="line"><span style="color:#24292E;">            pb </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pn;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;链表翻转成功</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_11、链表排序" tabindex="-1">11、链表排序 <a class="header-anchor" href="#_11、链表排序" aria-label="Permalink to &quot;11、链表排序&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">sort_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head, </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_j </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span><span style="color:#768390;"> //int i=0,j=0;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (p_i-&gt;next </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;">     //for(i=0;i&lt;n-1;i++)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_min </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p_i;</span><span style="color:#768390;">   //int min = i;</span></span>
<span class="line"><span style="color:#ADBAC7;">            p_j </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p_min-&gt;next;</span><span style="color:#768390;">  //j=min+1;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (p_j </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span><span style="color:#768390;"> //for(;j&lt;n;j++)</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (p_min-&gt;num </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> p_j-&gt;num)</span><span style="color:#768390;"> //if(arr[min] &gt; arr[j])</span></span>
<span class="line"><span style="color:#ADBAC7;">                    p_min </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p_j;</span><span style="color:#768390;">           //min = j;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">                p_j </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p_j-&gt;next;</span><span style="color:#768390;"> //j++</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (p_i </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> p_min)</span><span style="color:#768390;"> //if(i != min)</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#768390;">//交换数据</span></span>
<span class="line"><span style="color:#ADBAC7;">                STU tmp </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_i;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_min;</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_min </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">                tmp.next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p_i-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">                p_i-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p_min-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">                p_min-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> tmp.next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            p_i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> p_i-&gt;next;</span><span style="color:#768390;"> //i++</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">sort_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head, </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_j </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span><span style="color:#6A737D;"> //int i=0,j=0;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (p_i-&gt;next </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span><span style="color:#6A737D;">     //for(i=0;i&lt;n-1;i++)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_min </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p_i;</span><span style="color:#6A737D;">   //int min = i;</span></span>
<span class="line"><span style="color:#24292E;">            p_j </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p_min-&gt;next;</span><span style="color:#6A737D;">  //j=min+1;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (p_j </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span><span style="color:#6A737D;"> //for(;j&lt;n;j++)</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (p_min-&gt;num </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> p_j-&gt;num)</span><span style="color:#6A737D;"> //if(arr[min] &gt; arr[j])</span></span>
<span class="line"><span style="color:#24292E;">                    p_min </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p_j;</span><span style="color:#6A737D;">           //min = j;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                p_j </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p_j-&gt;next;</span><span style="color:#6A737D;"> //j++</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (p_i </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> p_min)</span><span style="color:#6A737D;"> //if(i != min)</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">//交换数据</span></span>
<span class="line"><span style="color:#24292E;">                STU tmp </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_i;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_min;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_min </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">                tmp.next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p_i-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">                p_i-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p_min-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">                p_min-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tmp.next;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            p_i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> p_i-&gt;next;</span><span style="color:#6A737D;"> //i++</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="_4、双向循环链表" tabindex="-1">4、双向循环链表 <a class="header-anchor" href="#_4、双向循环链表" aria-label="Permalink to &quot;4、双向循环链表&quot;">​</a></h2><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">#include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#F47067;">typedef</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//数据域</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">[</span><span style="color:#6CB6FF;">32</span><span style="color:#ADBAC7;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//指针域</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">struct</span><span style="color:#ADBAC7;"> stu </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">next;</span></span>
<span class="line"><span style="color:#ADBAC7;">} STU;</span></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">, STU </span><span style="color:#F69D50;">tmp</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">search_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">delete_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">main</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">argc</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">char</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">argv</span><span style="color:#F47067;">[]</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> n </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入学生的个数:&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">n);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (i </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; i </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> n; i</span><span style="color:#F47067;">++</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入第</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;">个学员的信息:&quot;</span><span style="color:#ADBAC7;">, i </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">tmp.num, tmp.name);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">head, tmp);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//遍历链表</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//查询</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入你要查询的学号:&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> num </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">num);</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">ret </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">search_link</span><span style="color:#ADBAC7;">(head, num);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (ret </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;查询的结果:</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, ret-&gt;num, ret-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//删除指定节点</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;请输入你要删除的学号:&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">scanf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">delete_link</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">head, num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//遍历链表</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//释放这个链表</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">&amp;</span><span style="color:#ADBAC7;">head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//遍历链表</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">//尾插法</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">insert_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">, STU </span><span style="color:#F69D50;">tmp</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//为插入的节点申请空间</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> (STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">)</span><span style="color:#DCBDFB;">calloc</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">sizeof</span><span style="color:#ADBAC7;">(STU));</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pi </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> tmp;</span></span>
<span class="line"><span style="color:#ADBAC7;">    pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    pi-&gt;pre </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否为空</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        pi-&gt;pre </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        head-&gt;pre-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">        pi-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        pi-&gt;pre </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">        head-&gt;pre </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pi;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//更新外部的head</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">print_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pn </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> pr)</span><span style="color:#768390;"> //链表节点为奇数个</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pn-&gt;next </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> pr)</span><span style="color:#768390;"> ////链表节点为偶数个</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">break</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">                pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">                pr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">STU </span><span style="color:#F47067;">*</span><span style="color:#DCBDFB;">search_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">*</span><span style="color:#F69D50;">head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> ((pn-&gt;num </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> num) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pr-&gt;num </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> num) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pn </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> pr) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pn-&gt;next </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> pr))</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            pr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pn-&gt;num </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> num)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> pn;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pr-&gt;num </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> num)</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> pr;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;没有找到相关节点</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span></span>
<span class="line"><span style="color:#768390;">void delete_link(STU **p_head, int num)</span></span>
<span class="line"><span style="color:#768390;">{</span></span>
<span class="line"><span style="color:#768390;">    STU *head = *p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    if (NULL == head)</span></span>
<span class="line"><span style="color:#768390;">    {</span></span>
<span class="line"><span style="color:#768390;">        printf(&quot;link not exist\\n&quot;);</span></span>
<span class="line"><span style="color:#768390;">        return;</span></span>
<span class="line"><span style="color:#768390;">    }</span></span>
<span class="line"><span style="color:#768390;">    else</span></span>
<span class="line"><span style="color:#768390;">    {</span></span>
<span class="line"><span style="color:#768390;">        STU *pn = head;</span></span>
<span class="line"><span style="color:#768390;">        STU *pr = head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        while ((pn-&gt;num != num) &amp;&amp; (pr-&gt;num != num) &amp;&amp; (pn != pr) &amp;&amp; (pn-&gt;next != pr))</span></span>
<span class="line"><span style="color:#768390;">        {</span></span>
<span class="line"><span style="color:#768390;">            pn = pn-&gt;next;</span></span>
<span class="line"><span style="color:#768390;">            pr = pr-&gt;pre;</span></span>
<span class="line"><span style="color:#768390;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">        if (pn-&gt;num == num) //头部、中部节点</span></span>
<span class="line"><span style="color:#768390;">        {</span></span>
<span class="line"><span style="color:#768390;">            if (pn == head) //删除头节点</span></span>
<span class="line"><span style="color:#768390;">            {</span></span>
<span class="line"><span style="color:#768390;">                head-&gt;next-&gt;pre = head-&gt;pre;</span></span>
<span class="line"><span style="color:#768390;">                head-&gt;pre-&gt;next = head-&gt;next;</span></span>
<span class="line"><span style="color:#768390;">                head = head-&gt;next;</span></span>
<span class="line"><span style="color:#768390;">                //free(pn);</span></span>
<span class="line"><span style="color:#768390;">            }</span></span>
<span class="line"><span style="color:#768390;">            else //删除中部节点</span></span>
<span class="line"><span style="color:#768390;">            {</span></span>
<span class="line"><span style="color:#768390;">                pn-&gt;pre-&gt;next = pn-&gt;next;</span></span>
<span class="line"><span style="color:#768390;">                pn-&gt;next-&gt;pre = pn-&gt;pre;</span></span>
<span class="line"><span style="color:#768390;">                //free(pn);</span></span>
<span class="line"><span style="color:#768390;">            }</span></span>
<span class="line"><span style="color:#768390;">            printf(&quot;成功删除节点:%d %s\\n&quot;, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#768390;">            free(pn);</span></span>
<span class="line"><span style="color:#768390;">        }</span></span>
<span class="line"><span style="color:#768390;">        else if (pr-&gt;num == num) //尾部、中部</span></span>
<span class="line"><span style="color:#768390;">        {</span></span>
<span class="line"><span style="color:#768390;">            pr-&gt;pre-&gt;next = pr-&gt;next;</span></span>
<span class="line"><span style="color:#768390;">            pr-&gt;next-&gt;pre = pr-&gt;pre;</span></span>
<span class="line"><span style="color:#768390;">            printf(&quot;成功删除节点:%d %s\\n&quot;, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#768390;">            free(pr);</span></span>
<span class="line"><span style="color:#768390;">        }</span></span>
<span class="line"><span style="color:#768390;">        else</span></span>
<span class="line"><span style="color:#768390;">        {</span></span>
<span class="line"><span style="color:#768390;">            printf(&quot;没有找到相关节点\\n&quot;);</span></span>
<span class="line"><span style="color:#768390;">        }</span></span>
<span class="line"><span style="color:#768390;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    *p_head = head;</span></span>
<span class="line"><span style="color:#768390;">}</span></span>
<span class="line"><span style="color:#F47067;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">#if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">delete_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">, </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">num</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> ((pn-&gt;num </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> num) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pr-&gt;num </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> num) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pn </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> pr) </span><span style="color:#F47067;">&amp;&amp;</span><span style="color:#ADBAC7;"> (pn-&gt;next </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> pr))</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            pr </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pn-&gt;num </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> num)</span><span style="color:#768390;"> //头部、中部节点</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pn-&gt;next-&gt;pre </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pn-&gt;pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">            pn-&gt;pre-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pn </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span><span style="color:#768390;"> //删除头节点</span></span>
<span class="line"><span style="color:#ADBAC7;">            {</span></span>
<span class="line"><span style="color:#ADBAC7;">                head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;成功删除节点:</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(pn);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (pr-&gt;num </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> num)</span><span style="color:#768390;"> //尾部、中部</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            pr-&gt;pre-&gt;next </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pr-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            pr-&gt;next-&gt;pre </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;成功删除节点:</span><span style="color:#F47067;">%d</span><span style="color:#96D0FF;"> </span><span style="color:#F47067;">%s\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(pr);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;没有找到相关节点</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#F47067;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">free_link</span><span style="color:#ADBAC7;">(STU </span><span style="color:#F47067;">**</span><span style="color:#F69D50;">p_head</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">    STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> head)</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">printf</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;link not exist</span><span style="color:#F47067;">\\n</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">        STU </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">do</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">            head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">(pn);</span></span>
<span class="line"><span style="color:#ADBAC7;">            pn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> head;</span></span>
<span class="line"><span style="color:#ADBAC7;">        } </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;"> (pn </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_head));</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">p_head </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">NULL</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;stdio.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;string.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">#include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&lt;stdlib.h&gt;</span></span>
<span class="line"><span style="color:#D73A49;">typedef</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//数据域</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#E36209;">name</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//指针域</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pre;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> stu </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">next;</span></span>
<span class="line"><span style="color:#24292E;">} STU;</span></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">, STU </span><span style="color:#E36209;">tmp</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">search_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">delete_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">argc</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">char</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">argv</span><span style="color:#D73A49;">[]</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> n </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入学生的个数:&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">n);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (i </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; i </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> n; i</span><span style="color:#D73A49;">++</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入第</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;">个学员的信息:&quot;</span><span style="color:#24292E;">, i </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        STU tmp;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">tmp.num, tmp.name);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">head, tmp);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//遍历链表</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//查询</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入你要查询的学号:&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> num </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">num);</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">ret </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">search_link</span><span style="color:#24292E;">(head, num);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (ret </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;查询的结果:</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, ret-&gt;num, ret-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//删除指定节点</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;请输入你要删除的学号:&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">scanf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">delete_link</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">head, num);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//遍历链表</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//释放这个链表</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//遍历链表</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(head);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">//尾插法</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">insert_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">, STU </span><span style="color:#E36209;">tmp</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//为插入的节点申请空间</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">)</span><span style="color:#6F42C1;">calloc</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">sizeof</span><span style="color:#24292E;">(STU));</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> tmp;</span></span>
<span class="line"><span style="color:#24292E;">    pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    pi-&gt;pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否为空</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        pi-&gt;pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        head-&gt;pre-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">        pi-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        pi-&gt;pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;pre;</span></span>
<span class="line"><span style="color:#24292E;">        head-&gt;pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pi;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//更新外部的head</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">print_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pn </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> pr)</span><span style="color:#6A737D;"> //链表节点为奇数个</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pn-&gt;next </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> pr)</span><span style="color:#6A737D;"> ////链表节点为偶数个</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">break</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">                pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">                pr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">STU </span><span style="color:#D73A49;">*</span><span style="color:#6F42C1;">search_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">*</span><span style="color:#E36209;">head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">//判断链表是否存在</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> ((pn-&gt;num </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> num) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pr-&gt;num </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> num) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pn </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> pr) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pn-&gt;next </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> pr))</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            pr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pn-&gt;num </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> num)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> pn;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pr-&gt;num </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> num)</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> pr;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;没有找到相关节点</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span></span>
<span class="line"><span style="color:#6A737D;">void delete_link(STU **p_head, int num)</span></span>
<span class="line"><span style="color:#6A737D;">{</span></span>
<span class="line"><span style="color:#6A737D;">    STU *head = *p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    if (NULL == head)</span></span>
<span class="line"><span style="color:#6A737D;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        printf(&quot;link not exist\\n&quot;);</span></span>
<span class="line"><span style="color:#6A737D;">        return;</span></span>
<span class="line"><span style="color:#6A737D;">    }</span></span>
<span class="line"><span style="color:#6A737D;">    else</span></span>
<span class="line"><span style="color:#6A737D;">    {</span></span>
<span class="line"><span style="color:#6A737D;">        STU *pn = head;</span></span>
<span class="line"><span style="color:#6A737D;">        STU *pr = head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        while ((pn-&gt;num != num) &amp;&amp; (pr-&gt;num != num) &amp;&amp; (pn != pr) &amp;&amp; (pn-&gt;next != pr))</span></span>
<span class="line"><span style="color:#6A737D;">        {</span></span>
<span class="line"><span style="color:#6A737D;">            pn = pn-&gt;next;</span></span>
<span class="line"><span style="color:#6A737D;">            pr = pr-&gt;pre;</span></span>
<span class="line"><span style="color:#6A737D;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">        if (pn-&gt;num == num) //头部、中部节点</span></span>
<span class="line"><span style="color:#6A737D;">        {</span></span>
<span class="line"><span style="color:#6A737D;">            if (pn == head) //删除头节点</span></span>
<span class="line"><span style="color:#6A737D;">            {</span></span>
<span class="line"><span style="color:#6A737D;">                head-&gt;next-&gt;pre = head-&gt;pre;</span></span>
<span class="line"><span style="color:#6A737D;">                head-&gt;pre-&gt;next = head-&gt;next;</span></span>
<span class="line"><span style="color:#6A737D;">                head = head-&gt;next;</span></span>
<span class="line"><span style="color:#6A737D;">                //free(pn);</span></span>
<span class="line"><span style="color:#6A737D;">            }</span></span>
<span class="line"><span style="color:#6A737D;">            else //删除中部节点</span></span>
<span class="line"><span style="color:#6A737D;">            {</span></span>
<span class="line"><span style="color:#6A737D;">                pn-&gt;pre-&gt;next = pn-&gt;next;</span></span>
<span class="line"><span style="color:#6A737D;">                pn-&gt;next-&gt;pre = pn-&gt;pre;</span></span>
<span class="line"><span style="color:#6A737D;">                //free(pn);</span></span>
<span class="line"><span style="color:#6A737D;">            }</span></span>
<span class="line"><span style="color:#6A737D;">            printf(&quot;成功删除节点:%d %s\\n&quot;, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#6A737D;">            free(pn);</span></span>
<span class="line"><span style="color:#6A737D;">        }</span></span>
<span class="line"><span style="color:#6A737D;">        else if (pr-&gt;num == num) //尾部、中部</span></span>
<span class="line"><span style="color:#6A737D;">        {</span></span>
<span class="line"><span style="color:#6A737D;">            pr-&gt;pre-&gt;next = pr-&gt;next;</span></span>
<span class="line"><span style="color:#6A737D;">            pr-&gt;next-&gt;pre = pr-&gt;pre;</span></span>
<span class="line"><span style="color:#6A737D;">            printf(&quot;成功删除节点:%d %s\\n&quot;, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#6A737D;">            free(pr);</span></span>
<span class="line"><span style="color:#6A737D;">        }</span></span>
<span class="line"><span style="color:#6A737D;">        else</span></span>
<span class="line"><span style="color:#6A737D;">        {</span></span>
<span class="line"><span style="color:#6A737D;">            printf(&quot;没有找到相关节点\\n&quot;);</span></span>
<span class="line"><span style="color:#6A737D;">        }</span></span>
<span class="line"><span style="color:#6A737D;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    *p_head = head;</span></span>
<span class="line"><span style="color:#6A737D;">}</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">#if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">delete_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#E36209;">num</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;pre;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> ((pn-&gt;num </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> num) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pr-&gt;num </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> num) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pn </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> pr) </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> (pn-&gt;next </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> pr))</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            pr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pn-&gt;num </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> num)</span><span style="color:#6A737D;"> //头部、中部节点</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pn-&gt;next-&gt;pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pn-&gt;pre;</span></span>
<span class="line"><span style="color:#24292E;">            pn-&gt;pre-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pn-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pn </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span><span style="color:#6A737D;"> //删除头节点</span></span>
<span class="line"><span style="color:#24292E;">            {</span></span>
<span class="line"><span style="color:#24292E;">                head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;成功删除节点:</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pn-&gt;num, pn-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(pn);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (pr-&gt;num </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> num)</span><span style="color:#6A737D;"> //尾部、中部</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            pr-&gt;pre-&gt;next </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pr-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            pr-&gt;next-&gt;pre </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> pr-&gt;pre;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;成功删除节点:</span><span style="color:#005CC5;">%d</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">%s\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">, pr-&gt;num, pr-&gt;name);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(pr);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;没有找到相关节点</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#D73A49;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">free_link</span><span style="color:#24292E;">(STU </span><span style="color:#D73A49;">**</span><span style="color:#E36209;">p_head</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_head;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> head)</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">printf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;link not exist</span><span style="color:#005CC5;">\\n</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">        STU </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">do</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head-&gt;next;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">free</span><span style="color:#24292E;">(pn);</span></span>
<span class="line"><span style="color:#24292E;">            pn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> head;</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">while</span><span style="color:#24292E;"> (pn </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_head));</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">p_head </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NULL</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,40);function h(s,m,g,q,f,U){const o=c,e=C("ClientOnly");return p(),r("div",null,[d,y(e,null,{default:A(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(p(),B(o,{key:0,article:s.$frontmatter},null,8,["article"])):F("",!0)]}),_:1}),u])}const S=t(E,[["render",h]]);export{x as __pageData,S as default};
