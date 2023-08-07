---
title: Manacher
author: 阿源
date: 2023/03/22 12:00
categories:
 - 数据结构与算法
tags:
 - 数据结构与算法
 - Manacher
---
# Manacher

## 简介

找到一个字符串中最长回文子串（一定要连续）

奇数和偶数不一样  所以要做预处理

121aaaa23

#1#2#1#a#a#a#a#2#3#

如果用原始串中出现的字符做预处理字符，是否会干扰？不会

## 代码 O(n)

1.  回文半径   （12321 半径3）
2.  回文半径数组 （每个位置i 向左右扩的回文半径）
3. 最右回文变量 int  （每个位置右扩 刷新最右的位置）

第一种情况 i在R外  暴力扩  不优化 O(R)

第二种情况  i在R内

i撇在LR内   

i撇不在LR内

第三种情况 i撇压线 O(R)

[ L     i撇     c    i    R]

```java
	public static int manacher(String s) {
		if (s == null || s.length() == 0) {
			return 0;
		}
		// "12132" -> "#1#2#1#3#2#"
		char[] str = manacherString(s);
		// 回文半径的大小
		int[] pArr = new int[str.length];
        // R对应的中心点
		int C = -1;
		// 讲述中：R代表最右的扩成功的位置
		// coding：最右的扩成功位置的，再下一个位置
		int R = -1;
		int max = Integer.MIN_VALUE;
		for (int i = 0; i < str.length; i++) { // 0 1 2
			// R第一个违规的位置，i>= R
			// i位置扩出来的答案，i位置扩的区域，至少是多大。
            // i在R内 ， 两种情况  i撇回文半径长度
			pArr[i] = R > i ? Math.min(pArr[2 * C - i], R - i) : 1;
			while (i + pArr[i] < str.length && i - pArr[i] > -1) {
				if (str[i + pArr[i]] == str[i - pArr[i]])
					pArr[i]++;
				else {
					break;
				}
			}
			if (i + pArr[i] > R) {
				R = i + pArr[i];
				C = i;
			}
			max = Math.max(max, pArr[i]);
		}
		return max - 1;
	}

	public static char[] manacherString(String str) {
		char[] charArr = str.toCharArray();
		char[] res = new char[str.length() * 2 + 1];
		int index = 0;
		for (int i = 0; i != res.length; i++) {
			res[i] = (i & 1) == 0 ? '#' : charArr[index++];
		}
		return res;
	}

```

## 其他题目

