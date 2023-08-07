import{_ as e}from"./chunks/ArticleMetadata.59a467b2.js";import{_ as c,v as l,b as r,t as i,O as _,F as p,L as y,R as u,M as F,C as E,B as A}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const D=JSON.parse('{"title":"修改Git所有提交记录中的作者和邮箱","description":"","frontmatter":{"title":"修改Git所有提交记录中的作者和邮箱","author":"查尔斯","date":"2022/03/27 13:00","isOriginal":false,"categories":["碎片化知识点"],"tags":["Git"]},"headers":[],"relativePath":"categories/fragments/2022/03/27/修改Git所有提交记录中的作者和邮箱.md","filePath":"categories/fragments/2022/03/27/修改Git所有提交记录中的作者和邮箱.md","lastUpdated":1691397650000}'),q={name:"categories/fragments/2022/03/27/修改Git所有提交记录中的作者和邮箱.md"},M=p("h1",{id:"修改git所有提交记录中的作者和邮箱",tabindex:"-1"},[y("修改Git所有提交记录中的作者和邮箱 "),p("a",{class:"header-anchor",href:"#修改git所有提交记录中的作者和邮箱","aria-label":'Permalink to "修改Git所有提交记录中的作者和邮箱"'},"​")],-1),h=u(`<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p><strong>C：</strong> 上一篇，笔者介绍了怎么修改 Git 最后一次提交的作者和邮箱信息。那如果你是已经提交了很多次的记录，难道一个个的回退过去修改吗？显然不可能，所以本篇笔者带着大家认识一下如何批量修改 Git 提交记录中的作者和邮箱信息。</p><h2 id="问题解决" tabindex="-1">问题解决 <a class="header-anchor" href="#问题解决" aria-label="Permalink to &quot;问题解决&quot;">​</a></h2><p>解决方法其实就是编写一个脚本来进行批量替换。</p><ol><li><p>新建一个 sh / bat 格式的脚本文件（如果你是在 cmd 中执行，那就用 bat 格式，如果是在 git bash 中执行就用 sh）</p></li><li><p>复制下方脚本内容到脚本文件中，然后编辑替换好错误邮箱、正确作者和邮箱（如果是在 cmd 中执行，#!/bin/sh 就替换为 #!/bin/bat）</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">#!/bin/sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F69D50;">git</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">filter-branch</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">--env-filter</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;</span></span>
<span class="line"><span style="color:#96D0FF;">WRONG_EMAIL=&quot;错误的邮箱&quot;</span></span>
<span class="line"><span style="color:#96D0FF;">NEW_NAME=&quot;正确的作者名&quot;</span></span>
<span class="line"><span style="color:#96D0FF;">NEW_EMAIL=&quot;正确的邮箱&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#96D0FF;">if [ &quot;$GIT_COMMITTER_EMAIL&quot; = &quot;$WRONG_EMAIL&quot; ]</span></span>
<span class="line"><span style="color:#96D0FF;">then</span></span>
<span class="line"><span style="color:#96D0FF;">    export GIT_COMMITTER_NAME=&quot;$NEW_NAME&quot;</span></span>
<span class="line"><span style="color:#96D0FF;">    export GIT_COMMITTER_EMAIL=&quot;$NEW_EMAIL&quot;</span></span>
<span class="line"><span style="color:#96D0FF;">fi</span></span>
<span class="line"><span style="color:#96D0FF;">if [ &quot;$GIT_AUTHOR_EMAIL&quot; = &quot;$WRONG_EMAIL&quot; ]</span></span>
<span class="line"><span style="color:#96D0FF;">then</span></span>
<span class="line"><span style="color:#96D0FF;">    export GIT_AUTHOR_NAME=&quot;$NEW_NAME&quot;</span></span>
<span class="line"><span style="color:#96D0FF;">    export GIT_AUTHOR_EMAIL=&quot;$NEW_EMAIL&quot;</span></span>
<span class="line"><span style="color:#96D0FF;">fi</span></span>
<span class="line"><span style="color:#96D0FF;">&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">--tag-name-filter</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">cat</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">--</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">--branches</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">--tags</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">#!/bin/sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">filter-branch</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--env-filter</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;</span></span>
<span class="line"><span style="color:#032F62;">WRONG_EMAIL=&quot;错误的邮箱&quot;</span></span>
<span class="line"><span style="color:#032F62;">NEW_NAME=&quot;正确的作者名&quot;</span></span>
<span class="line"><span style="color:#032F62;">NEW_EMAIL=&quot;正确的邮箱&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#032F62;">if [ &quot;$GIT_COMMITTER_EMAIL&quot; = &quot;$WRONG_EMAIL&quot; ]</span></span>
<span class="line"><span style="color:#032F62;">then</span></span>
<span class="line"><span style="color:#032F62;">    export GIT_COMMITTER_NAME=&quot;$NEW_NAME&quot;</span></span>
<span class="line"><span style="color:#032F62;">    export GIT_COMMITTER_EMAIL=&quot;$NEW_EMAIL&quot;</span></span>
<span class="line"><span style="color:#032F62;">fi</span></span>
<span class="line"><span style="color:#032F62;">if [ &quot;$GIT_AUTHOR_EMAIL&quot; = &quot;$WRONG_EMAIL&quot; ]</span></span>
<span class="line"><span style="color:#032F62;">then</span></span>
<span class="line"><span style="color:#032F62;">    export GIT_AUTHOR_NAME=&quot;$NEW_NAME&quot;</span></span>
<span class="line"><span style="color:#032F62;">    export GIT_AUTHOR_EMAIL=&quot;$NEW_EMAIL&quot;</span></span>
<span class="line"><span style="color:#032F62;">fi</span></span>
<span class="line"><span style="color:#032F62;">&#39;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--tag-name-filter</span><span style="color:#24292E;"> </span><span style="color:#032F62;">cat</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--branches</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--tags</span></span></code></pre></div></li><li><p>保存脚本</p></li><li><p>将脚本文件放到要批量修改提交记录的 Git 仓库中（根目录就行）</p></li><li><p>执行脚本</p></li></ol><p>随后你就会看到，先是提示一个 warn 警告，然后它会一条条的修改以往提交记录，如果错误的提交比较多，那就耐心等一会儿吧。</p>`,6);function d(s,I,C,f,T,m){const t=e,o=F("ClientOnly");return l(),r("div",null,[M,i(o,null,{default:_(()=>{var a,n;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((n=s.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(l(),E(t,{key:0,article:s.$frontmatter},null,8,["article"])):A("",!0)]}),_:1}),h])}const b=c(q,[["render",d]]);export{D as __pageData,b as default};
