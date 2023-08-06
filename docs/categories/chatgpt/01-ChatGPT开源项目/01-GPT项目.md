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

## 1. Gpt4 本地版
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
