---
title: Linux代理bug
author: 阿源
date: 2024/07/02 19:30
categories:
 - Bug万象集
tags:
 - linux
---
# Linux代理bug

问题：gnutls_handshake() failed: The TLS connection was non-properly terminated.

## 代理问题
```sh
git config --global  --unset https.https://github.com.proxy 

git config --global  --unset http.https://github.com.proxy 

git config --global https.proxy http://127.0.0.1:7890

git config --global https.proxy https://127.0.0.1:7890

git config --global --unset http.proxy

git config --global --unset https.proxy
```

## 仓库重新设置：

```sh
git remote rm origin
git remote add origin git@github.com:clint-sfy/sfy_ros.git
git push origin main
```