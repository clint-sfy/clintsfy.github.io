import{_ as o}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as c,v as n,b as u,E as r,O as i,F as p,L as d,R as q,M as y,C as m,B as _}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const S=JSON.parse('{"title":"C++的queue容器","description":"","frontmatter":{"title":"C++的queue容器","author":"阿源","date":"2023/02/11 21:29","categories":["C++基础快速入门"],"tags":["C++","C++基础","STL"]},"headers":[],"relativePath":"courses/c_plus/02-C++的STL/06-queue容器.md","filePath":"courses/c_plus/02-C++的STL/06-queue容器.md","lastUpdated":1691397650000}'),b={name:"courses/c_plus/02-C++的STL/06-queue容器.md"},h=p("h1",{id:"c-的queue队列容器",tabindex:"-1"},[d("C++的queue队列容器 "),p("a",{class:"header-anchor",href:"#c-的queue队列容器","aria-label":'Permalink to "C++的queue队列容器"'},"​")],-1),f=q(`<h2 id="queue队列容器" tabindex="-1">queue队列容器 <a class="header-anchor" href="#queue队列容器" aria-label="Permalink to &quot;queue队列容器&quot;">​</a></h2><p>Queue是一种先进先出(First In First Out,FIFO)的数据结构</p><p>出数据的一方叫队头，入数据的一方叫队尾。</p><p>queue容器没有迭代器 不支持遍历行为。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">1 queue&lt;T&gt; queT;//queue采用模板类实现，queue对象的默认构造形式：</span></span>
<span class="line"><span style="color:#adbac7;">2 queue(const queue &amp;que);//拷贝构造函数</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">3 3.5.3.2 queue存取、插入和删除操作</span></span>
<span class="line"><span style="color:#adbac7;">4 push(elem);//往队尾添加元素</span></span>
<span class="line"><span style="color:#adbac7;">5 pop();//从队头移除第一个元素</span></span>
<span class="line"><span style="color:#adbac7;">6 back();//返回最后一个元素</span></span>
<span class="line"><span style="color:#adbac7;">7 front();//返回第一个元素</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">8 3.5.3.3 queue赋值操作</span></span>
<span class="line"><span style="color:#adbac7;">9 queue&amp; operator=(const queue &amp;que);//重载等号操作符</span></span>
<span class="line"><span style="color:#adbac7;">10 3.5.3.4 queue大小操作</span></span>
<span class="line"><span style="color:#adbac7;">11 empty();//判断队列是否为空</span></span>
<span class="line"><span style="color:#adbac7;">12 size();//返回队列的大小</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">1 queue&lt;T&gt; queT;//queue采用模板类实现，queue对象的默认构造形式：</span></span>
<span class="line"><span style="color:#24292e;">2 queue(const queue &amp;que);//拷贝构造函数</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">3 3.5.3.2 queue存取、插入和删除操作</span></span>
<span class="line"><span style="color:#24292e;">4 push(elem);//往队尾添加元素</span></span>
<span class="line"><span style="color:#24292e;">5 pop();//从队头移除第一个元素</span></span>
<span class="line"><span style="color:#24292e;">6 back();//返回最后一个元素</span></span>
<span class="line"><span style="color:#24292e;">7 front();//返回第一个元素</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">8 3.5.3.3 queue赋值操作</span></span>
<span class="line"><span style="color:#24292e;">9 queue&amp; operator=(const queue &amp;que);//重载等号操作符</span></span>
<span class="line"><span style="color:#24292e;">10 3.5.3.4 queue大小操作</span></span>
<span class="line"><span style="color:#24292e;">11 empty();//判断队列是否为空</span></span>
<span class="line"><span style="color:#24292e;">12 size();//返回队列的大小</span></span></code></pre></div>`,5);function C(s,g,v,k,T,O){const l=o,t=y("ClientOnly");return n(),u("div",null,[h,r(t,null,{default:i(()=>{var a,e;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((e=s.$frontmatter)==null?void 0:e.showArticleMetadata)??!0)?(n(),m(l,{key:0,article:s.$frontmatter},null,8,["article"])):_("",!0)]}),_:1}),f])}const M=c(b,[["render",C]]);export{S as __pageData,M as default};
