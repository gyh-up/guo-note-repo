# 问题：二叉树的最大深度

[树](/classify/algorithm/基础数据结构-树) | [栈](/classify/algorithm/基础数据结构-栈) | [递归](/classify/algorithm/算法-递归) |  [迭代](/classify/algorithm/算法-迭代) | [深度优先搜索](/classify/algorithm/算法-深度优先搜索) | [广度优先搜索](/classify/algorithm/算法-广度优先搜索)

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**说明:** 叶子节点是指没有子节点的节点。

**示例：**
给定二叉树 `[3,9,20,null,null,15,7]`，

```
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最大深度 3 。

## 方法一：深度优先搜索

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
// 1、当前节点的深度为 左右孩子节点深度的最大值+1
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    return max(maxDepth(root.Left), maxDepth(root.Right)) + 1
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}
```

## 方法二：广度优先搜索

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    var stack []*TreeNode
    stack = append(stack, root)
    depth := 0
	// 1、因为后续的孩子节点也要加入到中，所以先记录切片长度；循环当前切片长度的次数，用来取出当前切片的全部元素；
    // 2、若存在左右孩子节点，则将孩子节点入栈
    // 3、深度+1
    for len(stack) > 0 {
        len := len(stack)
        for len > 0 {
            node := stack[0]
            stack = stack[1:]
            if node.Left != nil {
                stack = append(stack, node.Left)
            }
            if node.Right != nil {
                stack = append(stack, node.Right)
            }
            len--
        }
        depth++
    }
    return depth

}
```

