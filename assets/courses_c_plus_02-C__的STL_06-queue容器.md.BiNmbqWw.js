import{_ as o}from"./chunks/ArticleMetadata.CDaExH3F.js";import{_ as r,C as i,c,o as p,k as t,G as d,P as m,a as q,w as h,b as _,e as C}from"./chunks/framework.CZWML48V.js";import"./chunks/md5.DoRRH4_b.js";const S=JSON.parse('{"title":"C++的queue容器","description":"","frontmatter":{"title":"C++的queue容器","author":"阿源","date":"2023/02/11 21:29","categories":["C++基础快速入门"],"tags":["C++","C++基础","STL"]},"headers":[],"relativePath":"courses/c_plus/02-C++的STL/06-queue容器.md","filePath":"courses/c_plus/02-C++的STL/06-queue容器.md","lastUpdated":1713341239000}'),f={name:"courses/c_plus/02-C++的STL/06-queue容器.md"};function g(a,e,k,b,v,T){const u=o,l=i("ClientOnly");return p(),c("div",null,[e[0]||(e[0]=t("h1",{id:"c-的queue队列容器",tabindex:"-1"},[q("C++的queue队列容器 "),t("a",{class:"header-anchor",href:"#c-的queue队列容器","aria-label":'Permalink to "C++的queue队列容器"'},"​")],-1)),d(l,null,{default:h(()=>{var s,n;return[(((s=a.$frontmatter)==null?void 0:s.aside)??!0)&&(((n=a.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(p(),_(u,{key:0,article:a.$frontmatter},null,8,["article"])):C("",!0)]}),_:1}),e[1]||(e[1]=m(`<h2 id="queue队列容器" tabindex="-1">queue队列容器 <a class="header-anchor" href="#queue队列容器" aria-label="Permalink to &quot;queue队列容器&quot;">​</a></h2><p>Queue是一种先进先出(First In First Out,FIFO)的数据结构</p><p>出数据的一方叫队头，入数据的一方叫队尾。</p><p>queue容器没有迭代器 不支持遍历行为。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>1 queue&lt;T&gt; queT;//queue采用模板类实现，queue对象的默认构造形式：</span></span>
<span class="line"><span>2 queue(const queue &amp;que);//拷贝构造函数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3 3.5.3.2 queue存取、插入和删除操作</span></span>
<span class="line"><span>4 push(elem);//往队尾添加元素</span></span>
<span class="line"><span>5 pop();//从队头移除第一个元素</span></span>
<span class="line"><span>6 back();//返回最后一个元素</span></span>
<span class="line"><span>7 front();//返回第一个元素</span></span>
<span class="line"><span></span></span>
<span class="line"><span>8 3.5.3.3 queue赋值操作</span></span>
<span class="line"><span>9 queue&amp; operator=(const queue &amp;que);//重载等号操作符</span></span>
<span class="line"><span>10 3.5.3.4 queue大小操作</span></span>
<span class="line"><span>11 empty();//判断队列是否为空</span></span>
<span class="line"><span>12 size();//返回队列的大小</span></span></code></pre></div>`,5))])}const O=r(f,[["render",g]]);export{S as __pageData,O as default};
