import{_ as c}from"./chunks/ArticleMetadata.efdb5e9a.js";import{_ as o,v as p,b as r,t as i,O as d,F as t,L as k,R as y,M as m,C as u,B as _}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const M=JSON.parse('{"title":"C++的stack容器","description":"","frontmatter":{"title":"C++的stack容器","author":"阿源","date":"2023/02/10 21:29","categories":["C++基础快速入门"],"tags":["C++","C++基础","STL"]},"headers":[],"relativePath":"courses/c_plus/02-C++的STL/05-stack容器.md","filePath":"courses/c_plus/02-C++的STL/05-stack容器.md","lastUpdated":1691397650000}'),h={name:"courses/c_plus/02-C++的STL/05-stack容器.md"},b=t("h1",{id:"c-的stack栈容器",tabindex:"-1"},[k("C++的stack栈容器 "),t("a",{class:"header-anchor",href:"#c-的stack栈容器","aria-label":'Permalink to "C++的stack栈容器"'},"​")],-1),C=y(`<h2 id="stack栈容器" tabindex="-1">stack栈容器 <a class="header-anchor" href="#stack栈容器" aria-label="Permalink to &quot;stack栈容器&quot;">​</a></h2><p>stack是一种先进后出(First In Last Out,FILO)的数据结构。</p><p>操作数据的一端 叫栈顶。</p><p>top永远指向栈顶元素。</p><p><strong>栈容器没有迭代器。不支持遍历行为。</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">1 3.4.3.1 stack构造函数</span></span>
<span class="line"><span style="color:#adbac7;">2 stack&lt;T&gt; stkT;//stack采用模板类实现， stack对象的默认构造形式：</span></span>
<span class="line"><span style="color:#adbac7;">3 stack(const stack &amp;stk);//拷贝构造函数</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">4 3.4.3.2 stack赋值操作</span></span>
<span class="line"><span style="color:#adbac7;">5 stack&amp; operator=(const stack &amp;stk);//重载等号操作符</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">6 3.4.3.3 stack数据存取操作</span></span>
<span class="line"><span style="color:#adbac7;">7 push(elem);//向栈顶添加元素</span></span>
<span class="line"><span style="color:#adbac7;">8 pop();//从栈顶移除第一个元素</span></span>
<span class="line"><span style="color:#adbac7;">9 top();//返回栈顶元素</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">10 3.4.3.4 stack大小操作</span></span>
<span class="line"><span style="color:#adbac7;">11 empty();//判断堆栈是否为空</span></span>
<span class="line"><span style="color:#adbac7;">12 size();//返回堆栈的大小</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">1 3.4.3.1 stack构造函数</span></span>
<span class="line"><span style="color:#24292e;">2 stack&lt;T&gt; stkT;//stack采用模板类实现， stack对象的默认构造形式：</span></span>
<span class="line"><span style="color:#24292e;">3 stack(const stack &amp;stk);//拷贝构造函数</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">4 3.4.3.2 stack赋值操作</span></span>
<span class="line"><span style="color:#24292e;">5 stack&amp; operator=(const stack &amp;stk);//重载等号操作符</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">6 3.4.3.3 stack数据存取操作</span></span>
<span class="line"><span style="color:#24292e;">7 push(elem);//向栈顶添加元素</span></span>
<span class="line"><span style="color:#24292e;">8 pop();//从栈顶移除第一个元素</span></span>
<span class="line"><span style="color:#24292e;">9 top();//返回栈顶元素</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">10 3.4.3.4 stack大小操作</span></span>
<span class="line"><span style="color:#24292e;">11 empty();//判断堆栈是否为空</span></span>
<span class="line"><span style="color:#24292e;">12 size();//返回堆栈的大小</span></span></code></pre></div>`,6);function f(s,g,v,T,L,O){const l=c,e=m("ClientOnly");return p(),r("div",null,[b,i(e,null,{default:d(()=>{var a,n;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((n=s.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(p(),u(l,{key:0,article:s.$frontmatter},null,8,["article"])):_("",!0)]}),_:1}),C])}const P=o(h,[["render",f]]);export{M as __pageData,P as default};
