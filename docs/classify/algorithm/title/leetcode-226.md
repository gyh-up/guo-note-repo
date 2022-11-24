# 问题：翻转二叉树

[树](/classify/algorithm/基础数据结构-树)  | [递归](/classify/algorithm/算法-递归) | [深度优先搜索](/classify/algorithm/算法-深度优先搜索)

给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

 

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/03/14/invert1-tree.jpg)

```
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
```

**示例 2：**
![img](https://assets.leetcode.com/uploads/2021/03/14/invert2-tree.jpg)

```
输入：root = [2,1,3]
输出：[2,3,1]
```

**示例 3：**

```
输入：root = []
输出：[]
```

## 方法一：递归

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
// 1、递归把根节点的左右子树都进行翻转
func invertTree(root *TreeNode) *TreeNode {
    if root == nil {
        return nil
    }
    invertTree(root.Left)
    invertTree(root.Right)
    root.Left, root.Right = root.Right, root.Left
    return root
}
```
