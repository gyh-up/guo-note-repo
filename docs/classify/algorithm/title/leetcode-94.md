# 问题：二叉树的中序遍历

[树](/classify/algorithm/基础数据结构-树) | [栈](/classify/algorithm/基础数据结构-栈) | [递归](/classify/algorithm/算法-递归) |  [迭代](/classify/algorithm/算法-迭代) | [深度优先搜索](/classify/algorithm/算法-深度优先搜索) | [哈希表](/classify/algorithm/基础数据结构-哈希表)

给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。

 **示例 1：**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

```
输入：root = [1,null,2,3]
输出：[1,3,2]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [1]
输出：[1]
```

**提示：**

- 树中节点数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

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
func inorderTraversal(root *TreeNode) []int {
    var inorder func(node *TreeNode)
    var result []int
	inorder = func(node *TreeNode) {
        if node == nil {
			return
		}
        // 递归左子树节点
        inorder(node.Left)
        // 当前节点值 返回切片中
        result = append(result, node.Val)
        // 递归右子树节点
        inorder(node.Right)
	}
	inorder(root)
    return result
}
```

## 方法二：栈

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func inorderTraversal(root *TreeNode) []int {
    // 创建栈
	var stack []*TreeNode
    // 创建切片保存结点的值
    var ret []int
    for root != nil || len(stack) > 0 {
        // 1、如果存在左子树，则当前节点入栈，迭代左子树；
        // 2.1、如果不存在左子树，则出栈取出节点，当前节点值 返回切片中
        // 2.2 如果当前节点存在右子树，迭代右子树；
        if root != nil {
            stack = append(stack, root)
            root = root.Left
        } else {
            root = stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            ret = append(ret, root.Val)
            root = root.Right
        }
    }
    return ret
}
```

## 方法三：标记法/ 哈希表

该方法适用于二叉树的前中后序遍历，只需修改一下入栈的顺序即可

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func inorderTraversal(root *TreeNode) []int {
    var ret []int
    var stack []*TreeNode
	// 哈希表用来保存当前节点的状态，是否已经经过；经过则不再做入栈操作
    nodeAccess := make(map[*TreeNode]int)
    nodeAccess[root] = 0
    stack = append(stack, root)

    for len(stack) > 0 {
        node := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        if node == nil {
            continue
        }
        if nodeAccess[node] == 0 {
            nodeAccess[node] = 1
            stack = append(stack, node.Right, node, node.Left)
        } else {
            ret = append(ret, node.Val)
        }
    } 
    return ret
}
```

