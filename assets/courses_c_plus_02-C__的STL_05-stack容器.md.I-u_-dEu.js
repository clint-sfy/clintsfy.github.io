import{_ as l}from"./chunks/ArticleMetadata.1_--bNMz.js";import{_ as o,D as r,o as t,c as i,I as d,w as _,k as e,a as k,R as m,b as u,e as h}from"./chunks/framework.Dn7lIAzt.js";import"./chunks/md5.vgHT5zCM.js";const P=JSON.parse('{"title":"C++的stack容器","description":"","frontmatter":{"title":"C++的stack容器","author":"阿源","date":"2023/02/10 21:29","categories":["C++基础快速入门"],"tags":["C++","C++基础","STL"]},"headers":[],"relativePath":"courses/c_plus/02-C++的STL/05-stack容器.md","filePath":"courses/c_plus/02-C++的STL/05-stack容器.md","lastUpdated":1713341239000}'),C={name:"courses/c_plus/02-C++的STL/05-stack容器.md"},f=e("h1",{id:"c-的stack栈容器",tabindex:"-1"},[k("C++的stack栈容器 "),e("a",{class:"header-anchor",href:"#c-的stack栈容器","aria-label":'Permalink to "C++的stack栈容器"'},"​")],-1),g=m(`<h2 id="stack栈容器" tabindex="-1">stack栈容器 <a class="header-anchor" href="#stack栈容器" aria-label="Permalink to &quot;stack栈容器&quot;">​</a></h2><p>stack是一种先进后出(First In Last Out,FILO)的数据结构。</p><p>操作数据的一端 叫栈顶。</p><p>top永远指向栈顶元素。</p><p><strong>栈容器没有迭代器。不支持遍历行为。</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark-dimmed vp-code"><code><span class="line"><span>1 3.4.3.1 stack构造函数</span></span>
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
<span class="line"><span>12 size();//返回堆栈的大小</span></span></code></pre></div>`,6);function T(a,S,b,v,N,V){const p=l,c=r("ClientOnly");return t(),i("div",null,[f,d(c,null,{default:_(()=>{var s,n;return[(((s=a.$frontmatter)==null?void 0:s.aside)??!0)&&(((n=a.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(t(),u(p,{key:0,article:a.$frontmatter},null,8,["article"])):h("",!0)]}),_:1}),g])}const A=o(C,[["render",T]]);export{P as __pageData,A as default};
