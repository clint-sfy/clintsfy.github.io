---
title: Morris遍历
author: 阿源
date: 2023/03/24 12:00
categories:
 - 数据结构与算法
tags:
 - 数据结构与算法
---
# Morris遍历
 Morris遍历细节
 假设来到当前节点cur,开始时cur来到头节点位置
 1)如果cur没有左孩子，cur向右移动(cur = cur,right)
 2)如果cur有左孩子，找到左子树上最右的节点mostRight : 
      a.如果mostRight的右指针指向空，让其指向cur,然后cur向左移动(cur = cur.left)
      b.如果mostRight的右指针指向cur,让其指向null,然后cur向右移动(cur = cur.right)
 3) cur为空时遍历停止
 
 某个节点有左树一定会到两次，且第二次时左树已经遍历完毕
 

```
一种遍历二叉树的方式，并且时间复杂度0(N)， 额外空间复杂度0(1)
通过利用原树中大量空闲指针的方式，达到节省空间的目的
```

```java
	public static void morris(Node head) {
		if (head == null) {
			return;
		}
		Node cur = head;
		Node mostRight = null;
		while (cur != null) {
			mostRight = cur.left;
            // 当前节点有左孩子
			if (mostRight != null) {
                // 左树的右指针不为空  左树的有指针不能指向自己
				while (mostRight.right != null && mostRight.right != cur) {
					mostRight = mostRight.right;
				}
				if (mostRight.right == null) {
					mostRight.right = cur;
					cur = cur.left;
					continue;
				} else { //mostRight.right == cur
					mostRight.right = null;
				}
			}
			cur = cur.right;
		}
	}
```

```java
	// 先序  有左树时第一次遇到打印， 没左树时直接打印
    public static void morrisPre(Node head) {
		if (head == null) {
			return;
		}
		Node cur = head;
		Node mostRight = null;
		while (cur != null) {
			mostRight = cur.left;
			if (mostRight != null) {
				while (mostRight.right != null && mostRight.right != cur) {
					mostRight = mostRight.right;
				}
				if (mostRight.right == null) {
					System.out.print(cur.value + " ");
					mostRight.right = cur;
					cur = cur.left;
					continue;
				} else {
					mostRight.right = null;
				}
			} else {
				System.out.print(cur.value + " ");
			}
			cur = cur.right;
		}
		System.out.println();
	}
```

```java
    // 中序  第二次出现的时候打印  
	public static void morrisIn(Node head) {
		if (head == null) {
			return;
		}
		Node cur = head;
		Node mostRight = null;
		while (cur != null) {
			mostRight = cur.left;
			if (mostRight != null) {
				while (mostRight.right != null && mostRight.right != cur) {
					mostRight = mostRight.right;
				}
				if (mostRight.right == null) {
					mostRight.right = cur;
					cur = cur.left;
					continue;
				} else {
					mostRight.right = null;
				}
			}
			System.out.print(cur.value + " ");
			cur = cur.right;
		}
		System.out.println();
	}
```

```java
	public static void morrisPos(Node head) {
		if (head == null) {
			return;
		}
		Node cur = head;
		Node mostRight = null;
		while (cur != null) {
			mostRight = cur.left;
			if (mostRight != null) {
				while (mostRight.right != null && mostRight.right != cur) {
					mostRight = mostRight.right;
				}
				if (mostRight.right == null) {
					mostRight.right = cur;
					cur = cur.left;
					continue;
				} else {
					mostRight.right = null;
                    // 逆序打印第二次出现节点的左边界
					printEdge(cur.left);
				}
			}
			cur = cur.right;
		}
        // 打印整体
		printEdge(head);
		System.out.println();
	}
	public static void printEdge(Node head) {
		Node tail = reverseEdge(head);
		Node cur = tail;
		while (cur != null) {
			System.out.print(cur.value + " ");
			cur = cur.right;
		}
		reverseEdge(tail);
	}
	public static Node reverseEdge(Node from) {
		Node pre = null;
		Node next = null;
		while (from != null) {
			next = from.right;
			from.right = pre;
			pre = from;
			from = next;
		}
		return pre;
	}
```

### 题目

给定一棵二叉树的头节点head
求以head为头的树中，最小深度是多少?

```java
	public static class Node {
		public int val;
		public Node left;
		public Node right;

		public Node(int x) {
			val = x;
		}
	}
```

```java
	public static int minHeight1(Node head) {
		if (head == null) {
			return 0;
		}
		return p(head);
	}

	// 返回x为头的树，最小深度是多少
	public static int p(Node x) {
		if (x.left == null && x.right == null) {
			return 1;
		}
		// 左右子树起码有一个不为空
		int leftH = Integer.MAX_VALUE;
		if (x.left != null) {
			leftH = p(x.left);
		}
		int rightH = Integer.MAX_VALUE;
		if (x.right != null) {
			rightH = p(x.right);
		}
		return 1 + Math.min(leftH, rightH);
	}
```

```java
	// 根据morris遍历改写
    // 由于改动过指针  层数怎么正确更新  当前节点是否是叶节点
    // 对于层数，需要看
    // 第二次回到的节点，看恢复的节点是否是叶节点
	public static int minHeight2(Node head) {
		if (head == null) {
			return 0;
		}
		Node cur = head;
		Node mostRight = null;
		int curLevel = 0; // 当前节点的层数
		int minHeight = Integer.MAX_VALUE;
		while (cur != null) {
			mostRight = cur.left;
			if (mostRight != null) {
				int rightBoardSize = 1;
				while (mostRight.right != null && mostRight.right != cur) {
					rightBoardSize++;
					mostRight = mostRight.right;
				}
				if (mostRight.right == null) { // 第一次到达
					curLevel++;
					mostRight.right = cur;
					cur = cur.left;
					continue;
				} else { // 第二次到达
					if (mostRight.left == null) {
						minHeight = Math.min(minHeight, curLevel);
					}
					curLevel -= rightBoardSize;
					mostRight.right = null;
				}
			} else { // 只有一次到达
				curLevel++;
			}
			cur = cur.right;
		}
		int finalRight = 1;
		cur = head;
		while (cur.right != null) {
			finalRight++;
			cur = cur.right;
		}
		if (cur.left == null && cur.right == null) {
			minHeight = Math.min(minHeight, finalRight);
		}
		return minHeight;
	}
```

