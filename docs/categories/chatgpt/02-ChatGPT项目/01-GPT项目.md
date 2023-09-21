---
title: Gpt项目
author: 阿源
date: 2023/07/05 21:29
categories:
 - 有趣的项目
tags:
 - ChatGPT
 - AI
---
# Gpt项目
## Gpt 常用项目
### 项目1：免费的gpt3项目
Free ChatGPT API Key，免费ChatGPT API，支持GPT4 API（低价），ChatGPT国内可用免费转发API，直连无需代理。可以搭配ChatBox等软件/插件使用，极大降低接口使用成本。国内即可无限制畅快聊天。
::: tip 关于本项目
- 项目地址：https://github.com/chatanywhere/GPT_API_free
- 接口地址：https://api.chatanywhere.com.cn
- 申请key地址: https://api.chatanywhere.org/v1/oauth/free/github/render
- 申请地址后：可以在我的网站gpt.clint-sfy.cn使用，需要替换掉接口地址和自己的密钥
:::
需要免费3.5的api的人（为了调用插件）可以在github中搜索gpt-api-free项目，项目地址是https://github.com/chatanywhere/GPT_API_free，gpt-api-free项目不用部署，你直接去项目那点下获取免费api就可以获得一个免费的api，限制是每小时60次，主要可用在各种可用插件的项目中，此api的端点是https://api.chatanywhere.com.cn


### 项目2: 免费的gpt4项目
novaai官网免费提供
::: tip 关于本项目
- 项目地址：https://laogou717.com/page/GPT4FREE/GPT4Free.html
- 申请key地址: https://api.nova-oss.com/v1/chat/completions
- 申请地址后：可以在我的网站gpt.clint-sfy.cn使用，需要替换掉接口地址和自己的密钥
:::


::: tip 关于本项目
- 项目地址：https://openai.sjnh.me:8888/
- 注册送50额度，作者说用完可以联系他续杯，我目前没用多少，不知道是不是真的，但50额度可以用很久了。可以用4，可以用插件
- 可以去试试
:::


## 1. Gpt4 本地版 （已失效 8月份被爆破了）
::: tip 关于本项目
- 项目地址：https://github.com/hihumanzone/fgpt
- 部署参考：https://laogou717.com/page/GPT4FREE/GPT4Free.html
:::

::: warning 注意

- 需要科学上网
- Get your API key from the ChimeraGPT Discord.
- GPT4的key：Discord上免费  一分钟只能发十条  一天1000条
:::

### 项目截图
![](https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/project/chatgptfgpt.png)

### 支持model

```
gpt-3.5-turbo
gpt-3.5-turbo-0301
gpt-3.5-turbo-16k
gpt-4
gpt-4-0314
gpt-4-32k
llama-2-70b-chat
```

### 如何获取key

https://laogou717.com/index.html

本地手机号注册是可以的

###  项目部署

```bash
git clone https://github.com/hihumanzone/fgpt.git
cd fgpt
npm install
```

```
项目根目录创建名为.env.local文件，写入：
# Chatbot UI
DEFAULT_MODEL=gpt-3.5-turbo
NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT=You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.
OPENAI_API_HOST=https://chimeragpt.adventblocks.cc/api
OPENAI_API_KEY=YOUR_KEY

# Google
GOOGLE_API_KEY=YOUR_API_KEY
GOOGLE_CSE_ID=YOUR_ENGINE_ID
```

```bash
npm run dev
```
## 2. Gpt4 部署版

::: tip 关于本项目
- 项目地址：https://github.com/Yidadaa/ChatGPT-Next-Web
- 免费镜像容器: https://vercel.com/
- 部署参考：https://laogou717.com/page/GPT4FREE/GPT4Free.html
- 这个项目可以设置密码，可以防止别人用你的额度
:::

::: warning 注意

- 需要科学上网
- 需要你有github账号
- 需要你有域名
- 部署完后，通过域名访问，就不需要科学上网了
- Get your API key from the ChimeraGPT Discord.
- GPT4的key：Discord上免费  一分钟只能发十条  一天1000条
:::


### 项目截图
![](https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/project/chatgptgpt4%E9%83%A8%E7%BD%B2.png)

### 项目部署
直接拉去github上的项目，一键部署
需要设置的环境变量有：
```
HIDE_BALANCE_QUERY
HIDE_USER_API_KEY
OPENAI_API_KEY
BASE_URL
CODE
```

环境变量设置好后，在Deployments -> 项目最右边三个点 -> Redeploy
至此，部署完成
