---
title: ac自动机
author: 阿源
date: 2023/03/26 12:00
categories:
 - 数据结构与算法
tags:
 - 数据结构与算法
 - ac自动机
---
# ac自动机
```
[1 2 3 4 5 6 7]

[1 12 3 1234 5 56 7 12345678]

第8个位置管 00001 - 01000
```

```java
	// 下标从1开始！
	public static class IndexTree {

		private int[] tree;
		private int N;

		// 0位置弃而不用！
		public IndexTree(int size) {
			N = size;
			tree = new int[N + 1];
		}

		// 1~index 累加和是多少？
		public int sum(int index) {
			int ret = 0;
			while (index > 0) {
				ret += tree[index];
                // 从右往左依次取1
				index -= index & -index;
			}
			return ret;
		}

		// index & -index : 提取出index最右侧的1出来
		// index :           0011001000
		// index & -index :  0000001000
		public void add(int index, int d) {
			while (index <= N) {
				tree[index] += d;
				index += index & -index;
			}
		}
	}
```

```java
// 测试链接：https://leetcode.com/problems/range-sum-query-2d-mutable
// 但这个题是付费题目
// 提交时把类名、构造函数名从Code02_IndexTree2D改成NumMatrix
public class Code02_IndexTree2D {
	private int[][] tree;
	private int[][] nums;
	private int N;
	private int M;

	public Code02_IndexTree2D(int[][] matrix) {
		if (matrix.length == 0 || matrix[0].length == 0) {
			return;
		}
		N = matrix.length;
		M = matrix[0].length;
		tree = new int[N + 1][M + 1];
		nums = new int[N][M];
		for (int i = 0; i < N; i++) {
			for (int j = 0; j < M; j++) {
				update(i, j, matrix[i][j]);
			}
		}
	}

	private int sum(int row, int col) {
		int sum = 0;
		for (int i = row + 1; i > 0; i -= i & (-i)) {
			for (int j = col + 1; j > 0; j -= j & (-j)) {
				sum += tree[i][j];
			}
		}
		return sum;
	}

	public void update(int row, int col, int val) {
		if (N == 0 || M == 0) {
			return;
		}
		int add = val - nums[row][col];
		nums[row][col] = val;
		for (int i = row + 1; i <= N; i += i & (-i)) {
			for (int j = col + 1; j <= M; j += j & (-j)) {
				tree[i][j] += add;
			}
		}
	}

	public int sumRegion(int row1, int col1, int row2, int col2) {
		if (N == 0 || M == 0) {
			return 0;
		}
		return sum(row2, col2) + sum(row1 - 1, col1 - 1) - sum(row1 - 1, col2) - sum(row2, col1 - 1);
	}

}
```

