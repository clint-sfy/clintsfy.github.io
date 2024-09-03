<!--
 * @Descripttion: sfy_code
 * @version: 
 * @Author: Fengyuan Shen
 * @Date: 2024-09-03 14:55:54
 * @LastEditors: Fengyuan Shen
 * @LastEditTime: 2024-09-03 15:44:36
-->
---
title: jupyterlab添加虚拟环境并添加到ipykernel
author: 阿源
date: 2024/09/03 14:30
categories:
 - Bug万象集
tags:
 - linux
---
# jupyterlab添加虚拟环境并添加到ipykernel

临时使用

```
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple 
```

jupyterlab默认情况下使用base作为虚拟环境，但是不能自由切换虚拟环境。可以通过以下方法切换使用内核：

```bash
conda create -n work ipykernel python==3.9.16
```
```bash
conda activate work
```
```bash
python -m ipykernel install --name work --display-name work
```
如果提示permission denied，则是因为root用户，在最后添加–user即可成功。
```bash
python -m ipykernel install --name work --display-name work --user
```
最后刷新jupyterlab，可以看见自己创建的ipykernel已经可以使用。

注：对于python 3.11.0版本可能还会提示其他错误，在python后面添加-Xfrozen_modules=off可以解决。

移除kernel

```
jupyter kernelspec list
```

查看所有ipykernel

```
jupyter kernelspec remove work
```
移除虚拟环境
```bash
conda remove -n work --all
```
