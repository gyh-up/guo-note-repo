# 问题：对称二叉树

[树](/classify/algorithm/基础数据结构-树)  | [递归](/classify/algorithm/算法-递归) | [深度优先搜索](/classify/algorithm/算法-深度优先搜索)

给定一个二叉树，判断它是否是高度平衡的二叉树。

本题中，一棵高度平衡二叉树定义为：

一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1 。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/10/06/balance_1.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：true
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2020/10/06/balance_2.jpg)

```
输入：root = [1,2,2,3,3,null,null,4,4]
输出：false
```

**示例 3：**

```
输入：root = []
输出：true
```

**提示：**

- 树中的节点数在范围 `[0, 5000]` 内
- `-104 <= Node.val <= 104`

## 方法一：自底向上的递归

平衡二叉树每个子树都是平衡二叉树，所以可以用递归的方式来解决。递归到后面的节点，然后从下往上判断，如果有为非平衡二叉树，则返回 -1

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isBalanced(root *TreeNode) bool {
    return depthDiff(root) >= 0 
}

// 1、递归左右子树
// 2、如果左右子树高度差大于1，则返回-1
func depthDiff(root *TreeNode) int {
    if root == nil {
        return 0
    }

    ld := depthDiff(root.Left)
    rd := depthDiff(root.Right)

    if ld > rd + 1 || rd > ld + 1 || ld == -1 || rd == -1{
        return -1
    }

    return max(ld, rd) + 1
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}
```

## 方法二：自顶向下的递归



```go
func isBalanced(root *TreeNode) bool {
    if root == nil {
        return true
    }
    return abs(height(root.Left) - height(root.Right)) <= 1 && isBalanced(root.Left) && isBalanced(root.Right)
}

func height(root *TreeNode) int {
    if root == nil {
        return 0
    }
    return max(height(root.Left), height(root.Right)) + 1
}

func max(x, y int) int {
    if x > y {
        return x
    }
    return y
}

func abs(x int) int {
    if x < 0 {
        return -1 * x
    }
    return x
}
```

