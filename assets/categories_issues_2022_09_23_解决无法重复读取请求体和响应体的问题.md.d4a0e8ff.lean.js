import{_ as t}from"./chunks/ArticleMetadata.e10718d6.js";import{_ as r,v as p,b as c,E as y,O as i,F as l,L as A,R as D,M as C,C as d,B as u}from"./chunks/framework.2aeb816e.js";import"./chunks/md5.772bbdf1.js";const O=JSON.parse('{"title":"解决无法重复读取请求体和响应体的问题","description":"","frontmatter":{"title":"解决无法重复读取请求体和响应体的问题","author":"查尔斯","date":"2022/09/23 20:55","isOriginal":false,"categories":["Bug万象集"],"tags":["Java","Spring Boot","过滤器"]},"headers":[],"relativePath":"categories/issues/2022/09/23/解决无法重复读取请求体和响应体的问题.md","filePath":"categories/issues/2022/09/23/解决无法重复读取请求体和响应体的问题.md","lastUpdated":1691397650000}'),B={name:"categories/issues/2022/09/23/解决无法重复读取请求体和响应体的问题.md"},F=l("h1",{id:"解决无法重复读取请求体和响应体的问题",tabindex:"-1"},[A("解决无法重复读取请求体和响应体的问题 "),l("a",{class:"header-anchor",href:"#解决无法重复读取请求体和响应体的问题","aria-label":'Permalink to "解决无法重复读取请求体和响应体的问题"'},"​")],-1),h=D(`<h2 id="项目场景" tabindex="-1">项目场景 <a class="header-anchor" href="#项目场景" aria-label="Permalink to &quot;项目场景&quot;">​</a></h2><p><strong>C：</strong> 这两天实现了一个操作日志功能，需求是要记录指定操作的请求 URL，请求方式、请求头、请求体、响应码、响应头、响应体、请求耗时、操作人、操作IP、操作地址等信息。</p><p>考虑了几种方案，结合以前的经验，排掉了 AOP，综合评估后这次采用的是 Spring 拦截器的方式来记录，大体的实现流程是：</p><ol><li>提供一个 <code>@Log</code> 注解</li><li>在需要记录操作日志的接口类及方法上添加 <code>@Log</code> 注解，指定好资源名称和操作类型（具体为什么要在类和方法上都加，是考虑复用操作的资源名称）</li><li>提供一个拦截器，在拦截器中判断当前 Handler 是否存在 <code>@Log</code> 注解</li><li>存在该注解，就在 <code>preHandle()</code> 中开始计时，在 <code>afterCompletion()</code> 中结束计时并获取请求和响应信息</li><li>将请求和响应信息异步存储到数据库中</li></ol><h2 id="问题描述" tabindex="-1">问题描述 <a class="header-anchor" href="#问题描述" aria-label="Permalink to &quot;问题描述&quot;">​</a></h2><p>流程很简单，但是在获取 requestBody（请求体）和 responseBody（响应体）时出了些问题。如果我在 <code>preHandle()</code> 中获取了请求体信息，那么对应 Handler 就无法获取了，反之如果我是在 <code>afterCompletion</code> 中获取请求体信息，那么就获取不到了。而对于响应体，在我获取完之后，向前端响应就没内容了。</p><h2 id="原因分析" tabindex="-1">原因分析 <a class="header-anchor" href="#原因分析" aria-label="Permalink to &quot;原因分析&quot;">​</a></h2><p>之所以如此，是由于请求体和响应体分别对应的是 InputStream 和 OutputStream，由于流的特性，使用完之后就无法再被使用了。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * Retrieves the body of the request as binary data using a {@link ServletInputStream}. Either this method or</span></span>
<span class="line"><span style="color:#768390;"> * {@link #getReader} may be called to read the body, not both.</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@return</span><span style="color:#768390;"> a {@link ServletInputStream} object containing the body of the request</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@exception</span><span style="color:#768390;"> </span><span style="color:#F69D50;">IllegalStateException</span><span style="color:#768390;"> if the {@link #getReader} method has already been called for this request</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@exception</span><span style="color:#768390;"> </span><span style="color:#F69D50;">IOException</span><span style="color:#768390;">           if an input or output exception occurred</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> ServletInputStream </span><span style="color:#DCBDFB;">getInputStream</span><span style="color:#ADBAC7;">() throws IOException;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Retrieves the body of the request as binary data using a {@link ServletInputStream}. Either this method or</span></span>
<span class="line"><span style="color:#6A737D;"> * {@link #getReader} may be called to read the body, not both.</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> a {@link ServletInputStream} object containing the body of the request</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@exception</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">IllegalStateException</span><span style="color:#6A737D;"> if the {@link #getReader} method has already been called for this request</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@exception</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">IOException</span><span style="color:#6A737D;">           if an input or output exception occurred</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> ServletInputStream </span><span style="color:#6F42C1;">getInputStream</span><span style="color:#24292E;">() throws IOException;</span></span></code></pre></div><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * Returns a {@link ServletOutputStream} suitable for writing binary data in the response. The servlet container</span></span>
<span class="line"><span style="color:#768390;"> * does not encode the binary data.</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * &lt;p&gt;</span></span>
<span class="line"><span style="color:#768390;"> * Calling flush() on the ServletOutputStream commits the response.</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * Either this method or {@link #getWriter} may be called to write the body, not both, except when {@link #reset}</span></span>
<span class="line"><span style="color:#768390;"> * has been called.</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@return</span><span style="color:#768390;"> a {@link ServletOutputStream} for writing binary data</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@exception</span><span style="color:#768390;"> </span><span style="color:#F69D50;">IllegalStateException</span><span style="color:#768390;"> if the &lt;code&gt;getWriter&lt;/code&gt; method has been called on this response</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@exception</span><span style="color:#768390;"> </span><span style="color:#F69D50;">IOException</span><span style="color:#768390;">           if an input or output exception occurred</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@see</span><span style="color:#768390;"> #getWriter</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@see</span><span style="color:#768390;"> #reset</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> ServletOutputStream </span><span style="color:#DCBDFB;">getOutputStream</span><span style="color:#ADBAC7;">() throws IOException;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Returns a {@link ServletOutputStream} suitable for writing binary data in the response. The servlet container</span></span>
<span class="line"><span style="color:#6A737D;"> * does not encode the binary data.</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * &lt;p&gt;</span></span>
<span class="line"><span style="color:#6A737D;"> * Calling flush() on the ServletOutputStream commits the response.</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * Either this method or {@link #getWriter} may be called to write the body, not both, except when {@link #reset}</span></span>
<span class="line"><span style="color:#6A737D;"> * has been called.</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> a {@link ServletOutputStream} for writing binary data</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@exception</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">IllegalStateException</span><span style="color:#6A737D;"> if the &lt;code&gt;getWriter&lt;/code&gt; method has been called on this response</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@exception</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">IOException</span><span style="color:#6A737D;">           if an input or output exception occurred</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@see</span><span style="color:#6A737D;"> #getWriter</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@see</span><span style="color:#6A737D;"> #reset</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> ServletOutputStream </span><span style="color:#6F42C1;">getOutputStream</span><span style="color:#24292E;">() throws IOException;</span></span></code></pre></div><p>想要解决的话就要想办法把这信息使用完再“塞回去”，直接“塞回去”是不可能的。</p><h2 id="解决方案" tabindex="-1">解决方案 <a class="header-anchor" href="#解决方案" aria-label="Permalink to &quot;解决方案&quot;">​</a></h2><p>为了解决这个问题，Servlet 提供了两个类 HttpServletRequestWrapper、HttpServletResponseWrapper，我们可以继承它们来实现请求体和响应体内容的缓存，达到重复读取请求体和响应体的目的。</p><p>不过既然我们在使用 Spring 框架，贴心的 Spring 也提供了两个实现类：ContentCachingRequestWrapper、ContentCachingResponseWrapper，这样我们就无需再自行定义相应 Wrapper 直接使用它们就可以解决这个问题了。</p><p>下面是在过滤器中对请求对象和响应对象进行包装处理的代码段：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> org.springframework.core.Ordered;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> org.springframework.stereotype.Component;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> org.springframework.web.filter.OncePerRequestFilter;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> org.springframework.web.util.ContentCachingRequestWrapper;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> org.springframework.web.util.ContentCachingResponseWrapper;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> org.springframework.web.util.WebUtils;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> javax.servlet.FilterChain;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> javax.servlet.ServletException;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> javax.servlet.http.HttpServletRequest;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> javax.servlet.http.HttpServletResponse;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> java.io.IOException;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> java.util.Objects;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * 缓存请求体和响应体过滤器</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * &lt;p&gt;</span></span>
<span class="line"><span style="color:#768390;"> * 由于 requestBody 和 responseBody 分别对应的是 InputStream 和 OutputStream，由于流的特性，读取完之后就无法再被使用了。</span></span>
<span class="line"><span style="color:#768390;"> * 所以，需要额外缓存一次流信息。</span></span>
<span class="line"><span style="color:#768390;"> * &lt;/p&gt;</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@author</span><span style="color:#768390;"> Charles7c</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@since</span><span style="color:#768390;"> 2022/9/22 16:33</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#ADBAC7;">@</span><span style="color:#F47067;">Component</span></span>
<span class="line"><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">class</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">ContentCachingWrapperFilter</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">extends</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">OncePerRequestFilter</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">implements</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Ordered</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Override</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">public</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">int</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getOrder</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> Ordered.LOWEST_PRECEDENCE </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">10</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    @</span><span style="color:#F47067;">Override</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">protected</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">doFilterInternal</span><span style="color:#ADBAC7;">(HttpServletRequest </span><span style="color:#F69D50;">request</span><span style="color:#ADBAC7;">, HttpServletResponse </span><span style="color:#F69D50;">response</span><span style="color:#ADBAC7;">, FilterChain </span><span style="color:#F69D50;">filterChain</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">throws</span><span style="color:#ADBAC7;"> ServletException, IOException {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#768390;">// 包装流，可重复读取</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">(request </span><span style="color:#F47067;">instanceof</span><span style="color:#ADBAC7;"> ContentCachingRequestWrapper)) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            request </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ContentCachingRequestWrapper</span><span style="color:#ADBAC7;">(request);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">(response </span><span style="color:#F47067;">instanceof</span><span style="color:#ADBAC7;"> ContentCachingResponseWrapper)) {</span></span>
<span class="line"><span style="color:#ADBAC7;">            response </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ContentCachingResponseWrapper</span><span style="color:#ADBAC7;">(response);</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">        filterChain.</span><span style="color:#DCBDFB;">doFilter</span><span style="color:#ADBAC7;">(request, response);</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">updateResponse</span><span style="color:#ADBAC7;">(response);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">    /**</span></span>
<span class="line"><span style="color:#768390;">     * 更新响应（不操作这一步，会导致接口响应空白）</span></span>
<span class="line"><span style="color:#768390;">     *</span></span>
<span class="line"><span style="color:#768390;">     * </span><span style="color:#F47067;">@param</span><span style="color:#768390;"> </span><span style="color:#F69D50;">response</span><span style="color:#768390;"> 响应对象</span></span>
<span class="line"><span style="color:#768390;">     * </span><span style="color:#F47067;">@throws</span><span style="color:#768390;"> </span><span style="color:#F69D50;">IOException</span><span style="color:#768390;"> /</span></span>
<span class="line"><span style="color:#768390;">     */</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">void</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">updateResponse</span><span style="color:#ADBAC7;">(HttpServletResponse </span><span style="color:#F69D50;">response</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">throws</span><span style="color:#ADBAC7;"> IOException {</span></span>
<span class="line"><span style="color:#ADBAC7;">        ContentCachingResponseWrapper</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">responseWrapper</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> WebUtils.</span><span style="color:#DCBDFB;">getNativeResponse</span><span style="color:#ADBAC7;">(response, ContentCachingResponseWrapper.class);</span></span>
<span class="line"><span style="color:#ADBAC7;">        Objects.</span><span style="color:#DCBDFB;">requireNonNull</span><span style="color:#ADBAC7;">(responseWrapper).</span><span style="color:#DCBDFB;">copyBodyToResponse</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> org.springframework.core.Ordered;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> org.springframework.stereotype.Component;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> org.springframework.web.filter.OncePerRequestFilter;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> org.springframework.web.util.ContentCachingRequestWrapper;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> org.springframework.web.util.ContentCachingResponseWrapper;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> org.springframework.web.util.WebUtils;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> javax.servlet.FilterChain;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> javax.servlet.ServletException;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> javax.servlet.http.HttpServletRequest;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> javax.servlet.http.HttpServletResponse;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> java.io.IOException;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> java.util.Objects;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * 缓存请求体和响应体过滤器</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * &lt;p&gt;</span></span>
<span class="line"><span style="color:#6A737D;"> * 由于 requestBody 和 responseBody 分别对应的是 InputStream 和 OutputStream，由于流的特性，读取完之后就无法再被使用了。</span></span>
<span class="line"><span style="color:#6A737D;"> * 所以，需要额外缓存一次流信息。</span></span>
<span class="line"><span style="color:#6A737D;"> * &lt;/p&gt;</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@author</span><span style="color:#6A737D;"> Charles7c</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@since</span><span style="color:#6A737D;"> 2022/9/22 16:33</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#24292E;">@</span><span style="color:#D73A49;">Component</span></span>
<span class="line"><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ContentCachingWrapperFilter</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OncePerRequestFilter</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">implements</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Ordered</span><span style="color:#24292E;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Override</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">int</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getOrder</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> Ordered.LOWEST_PRECEDENCE </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    @</span><span style="color:#D73A49;">Override</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">protected</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">doFilterInternal</span><span style="color:#24292E;">(HttpServletRequest </span><span style="color:#E36209;">request</span><span style="color:#24292E;">, HttpServletResponse </span><span style="color:#E36209;">response</span><span style="color:#24292E;">, FilterChain </span><span style="color:#E36209;">filterChain</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">throws</span><span style="color:#24292E;"> ServletException, IOException {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 包装流，可重复读取</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">(request </span><span style="color:#D73A49;">instanceof</span><span style="color:#24292E;"> ContentCachingRequestWrapper)) {</span></span>
<span class="line"><span style="color:#24292E;">            request </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ContentCachingRequestWrapper</span><span style="color:#24292E;">(request);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">(response </span><span style="color:#D73A49;">instanceof</span><span style="color:#24292E;"> ContentCachingResponseWrapper)) {</span></span>
<span class="line"><span style="color:#24292E;">            response </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ContentCachingResponseWrapper</span><span style="color:#24292E;">(response);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        filterChain.</span><span style="color:#6F42C1;">doFilter</span><span style="color:#24292E;">(request, response);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">updateResponse</span><span style="color:#24292E;">(response);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 更新响应（不操作这一步，会导致接口响应空白）</span></span>
<span class="line"><span style="color:#6A737D;">     *</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">response</span><span style="color:#6A737D;"> 响应对象</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@throws</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">IOException</span><span style="color:#6A737D;"> /</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">updateResponse</span><span style="color:#24292E;">(HttpServletResponse </span><span style="color:#E36209;">response</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">throws</span><span style="color:#24292E;"> IOException {</span></span>
<span class="line"><span style="color:#24292E;">        ContentCachingResponseWrapper responseWrapper </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> WebUtils.</span><span style="color:#6F42C1;">getNativeResponse</span><span style="color:#24292E;">(response, ContentCachingResponseWrapper.class);</span></span>
<span class="line"><span style="color:#24292E;">        Objects.</span><span style="color:#6F42C1;">requireNonNull</span><span style="color:#24292E;">(responseWrapper).</span><span style="color:#6F42C1;">copyBodyToResponse</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>下面是使用缓存对象来获取请求体或响应体的代码段，在你需要的地方使用就可以了：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> org.apache.commons.io.IOUtils;</span></span>
<span class="line"><span style="color:#768390;">// --------------------------------------------</span></span>
<span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * 获取请求体</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@param</span><span style="color:#768390;"> </span><span style="color:#F69D50;">request</span><span style="color:#768390;"> 请求对象</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@return</span><span style="color:#768390;"> 请求体</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> String </span><span style="color:#DCBDFB;">getRequestBody</span><span style="color:#ADBAC7;">(HttpServletRequest request) {</span></span>
<span class="line"><span style="color:#ADBAC7;">    String</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">requestBody</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ContentCachingRequestWrapper</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">wrapper</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> WebUtils.</span><span style="color:#DCBDFB;">getNativeRequest</span><span style="color:#ADBAC7;">(request, ContentCachingRequestWrapper.class);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (wrapper </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">null</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        requestBody </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> IOUtils.</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">(wrapper.</span><span style="color:#DCBDFB;">getContentAsByteArray</span><span style="color:#ADBAC7;">(), StandardCharsets.UTF_8.</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> requestBody;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">/**</span></span>
<span class="line"><span style="color:#768390;"> * 获取响应体</span></span>
<span class="line"><span style="color:#768390;"> *</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@param</span><span style="color:#768390;"> </span><span style="color:#F69D50;">response</span><span style="color:#768390;"> 响应对象</span></span>
<span class="line"><span style="color:#768390;"> * </span><span style="color:#F47067;">@return</span><span style="color:#768390;"> 响应体</span></span>
<span class="line"><span style="color:#768390;"> */</span></span>
<span class="line"><span style="color:#F47067;">private</span><span style="color:#ADBAC7;"> String </span><span style="color:#DCBDFB;">getResponseBody</span><span style="color:#ADBAC7;">(HttpServletResponse response) {</span></span>
<span class="line"><span style="color:#ADBAC7;">    String</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">responseBody</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;&quot;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    ContentCachingResponseWrapper</span><span style="color:#F69D50;"> </span><span style="color:#ADBAC7;">wrapper</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> WebUtils.</span><span style="color:#DCBDFB;">getNativeResponse</span><span style="color:#ADBAC7;">(response, ContentCachingResponseWrapper.class);</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (wrapper </span><span style="color:#F47067;">!=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">null</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">        responseBody </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> IOUtils.</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">(wrapper.</span><span style="color:#DCBDFB;">getContentAsByteArray</span><span style="color:#ADBAC7;">(), StandardCharsets.UTF_8.</span><span style="color:#DCBDFB;">toString</span><span style="color:#ADBAC7;">());</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> responseBody;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> org.apache.commons.io.IOUtils;</span></span>
<span class="line"><span style="color:#6A737D;">// --------------------------------------------</span></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * 获取请求体</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">request</span><span style="color:#6A737D;"> 请求对象</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> 请求体</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> String </span><span style="color:#6F42C1;">getRequestBody</span><span style="color:#24292E;">(HttpServletRequest request) {</span></span>
<span class="line"><span style="color:#24292E;">    String requestBody </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    ContentCachingRequestWrapper wrapper </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> WebUtils.</span><span style="color:#6F42C1;">getNativeRequest</span><span style="color:#24292E;">(request, ContentCachingRequestWrapper.class);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (wrapper </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        requestBody </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> IOUtils.</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">(wrapper.</span><span style="color:#6F42C1;">getContentAsByteArray</span><span style="color:#24292E;">(), StandardCharsets.UTF_8.</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> requestBody;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * 获取响应体</span></span>
<span class="line"><span style="color:#6A737D;"> *</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E36209;">response</span><span style="color:#6A737D;"> 响应对象</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@return</span><span style="color:#6A737D;"> 响应体</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">private</span><span style="color:#24292E;"> String </span><span style="color:#6F42C1;">getResponseBody</span><span style="color:#24292E;">(HttpServletResponse response) {</span></span>
<span class="line"><span style="color:#24292E;">    String responseBody </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    ContentCachingResponseWrapper wrapper </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> WebUtils.</span><span style="color:#6F42C1;">getNativeResponse</span><span style="color:#24292E;">(response, ContentCachingResponseWrapper.class);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (wrapper </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        responseBody </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> IOUtils.</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">(wrapper.</span><span style="color:#6F42C1;">getContentAsByteArray</span><span style="color:#24292E;">(), StandardCharsets.UTF_8.</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> responseBody;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,18);function E(s,g,m,v,b,S){const e=t,o=C("ClientOnly");return p(),c("div",null,[F,y(o,null,{default:i(()=>{var n,a;return[(((n=s.$frontmatter)==null?void 0:n.aside)??!0)&&(((a=s.$frontmatter)==null?void 0:a.showArticleMetadata)??!0)?(p(),d(e,{key:0,article:s.$frontmatter},null,8,["article"])):u("",!0)]}),_:1}),h])}const w=r(B,[["render",E]]);export{O as __pageData,w as default};
