import{_ as o}from"./chunks/ArticleMetadata.CXcxJ8bO.js";import{_ as r,C as i,c as k,o as e,k as p,G as d,P as m,a as u,w as h,b as _,e as C}from"./chunks/framework.CrIyLpqU.js";import"./chunks/md5.qV03bT1e.js";const N=JSON.parse('{"title":"C++的stack容器","description":"","frontmatter":{"title":"C++的stack容器","author":"阿源","date":"2023/02/10 21:29","categories":["C++基础快速入门"],"tags":["C++","C++基础","STL"]},"headers":[],"relativePath":"courses/c_plus/02-C++的STL/05-stack容器.md","filePath":"courses/c_plus/02-C++的STL/05-stack容器.md","lastUpdated":1713341239000}'),f={name:"courses/c_plus/02-C++的STL/05-stack容器.md"};function g(s,a,b,v,S,T){const c=o,l=i("ClientOnly");return e(),k("div",null,[a[0]||(a[0]=p("h1",{id:"c-的stack栈容器",tabindex:"-1"},[u("C++的stack栈容器 "),p("a",{class:"header-anchor",href:"#c-的stack栈容器","aria-label":'Permalink to "C++的stack栈容器"'},"​")],-1)),d(l,null,{default:h(()=>{var n,t;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((t=s.$frontmatter)==null?void 0:t.showArticleMetadata)??!0)?(e(),_(c,{key:0,article:s.$frontmatter},null,8,["article"])):C("",!0)]}),_:1}),a[1]||(a[1]=m(`<h2 id="stack栈容器" tabindex="-1">stack栈容器 <a class="header-anchor" href="#stack栈容器" aria-label="Permalink to &quot;stack栈容器&quot;">​</a></h2><p>stack是一种先进后出(First In Last Out,FILO)的数据结构。</p><p>操作数据的一端 叫栈顶。</p><p>top永远指向栈顶元素。</p><p><strong>栈容器没有迭代器。不支持遍历行为。</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>1 3.4.3.1 stack构造函数</span></span>
<span class="line"><span>2 stack&lt;T&gt; stkT;//stack采用模板类实现， stack对象的默认构造形式：</span></span>
<span class="line"><span>3 stack(const stack &amp;stk);//拷贝构造函数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4 3.4.3.2 stack赋值操作</span></span>
<span class="line"><span>5 stack&amp; operator=(const stack &amp;stk);//重载等号操作符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>6 3.4.3.3 stack数据存取操作</span></span>
<span class="line"><span>7 push(elem);//向栈顶添加元素</span></span>
<span class="line"><span>8 pop();//从栈顶移除第一个元素</span></span>
<span class="line"><span>9 top();//返回栈顶元素</span></span>
<span class="line"><span></span></span>
<span class="line"><span>10 3.4.3.4 stack大小操作</span></span>
<span class="line"><span>11 empty();//判断堆栈是否为空</span></span>
<span class="line"><span>12 size();//返回堆栈的大小</span></span></code></pre></div>`,6))])}const O=r(f,[["render",g]]);export{N as __pageData,O as default};
