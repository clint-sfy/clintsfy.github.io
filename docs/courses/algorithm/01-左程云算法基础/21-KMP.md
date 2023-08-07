---
title: KMP
author: 阿源
date: 2023/03/21 12:00
categories:
 - 数据结构与算法
tags:
 - 数据结构与算法
 - KMP
---
# KMP

## 1. kmp

### 简介

字符串匹配

为了找到字符串匹配的子串 o(n)

重点 判断next[i]匹配的时候

### 代码核心

```java
	public static int[] getNextArray(char[] str2) {
		if (str2.length == 1) {
			return new int[] { -1 };
		}
		int[] next = new int[str2.length];
		next[0] = -1;
		next[1] = 0;
		int i = 2; // 目前在哪个位置上求next数组的值
		int cn = 0; // 当前是哪个位置的值再和i-1位置的字符比较
		while (i < next.length) {
            // 前缀和后缀相等时 都加
			if (str2[i - 1] == str2[cn]) { // 配成功的时候
				next[i++] = ++cn;
			} else if (cn > 0) {
				cn = next[cn];
			} else {
				next[i++] = 0;
			}
		}
		return next;
	}
```

```java
public static int getIndexOf(String s1, String s2) {
		if (s1 == null || s2 == null || s2.length() < 1 || s1.length() < s2.length()) {
			return -1;
		}
		char[] str1 = s1.toCharArray();
		char[] str2 = s2.toCharArray();
		int x = 0;
		int y = 0;
		// O(M) m <= n
		int[] next = getNextArray(str2);
		// O(N)
		while (x < str1.length && y < str2.length) {
			if (str1[x] == str2[y]) {
				x++;
				y++;
			} else if (next[y] == -1) { // y == 0
				x++;
			} else {
				y = next[y];
			}
		}
		return y == str2.length ? x - y : -1;
}
```

