# 问题：二叉树的前序遍历

[树](/classify/algorithm/基础数据结构-树) | [栈](/classify/algorithm/基础数据结构-栈) | [递归](/classify/algorithm/算法-递归) |  [迭代](/classify/algorithm/算法-迭代) | [深度优化搜索](/classify/algorithm/算法-深度优化搜索) | [哈希表](/classify/algorithm/基础数据结构-哈希表)

给你二叉树的根节点 `root` ，返回它节点值的 **前序** 遍历。

 **示例 1：**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

```
输入：root = [1,null,2,3]
输出：[1,2,3]
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

**示例 4：**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_5.jpg)

```
输入：root = [1,2]
输出：[1,2]
```

**示例 5：**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_4.jpg)

```
输入：root = [1,null,2]
输出：[1,2]
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
func preorderTraversal(root *TreeNode) []int {
    var ret []int
    var preorder func(root *TreeNode)
    preorder = func(root *TreeNode) {
        if root == nil {
            return 
        }
        // 当前节点值 返回切片中
        ret = append(ret, root.Val)
        // 递归左子树节点
        preorder(root.Left)
        // 递归右子树节点
        preorder(root.Right)
    }
    preorder(root)
    return ret
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
func preorderTraversal(root *TreeNode) []int {
    // 创建切片保存结点的值
    var ret []int
    // 创建栈
    var stack []*TreeNode
    // 1、当前节点值加入切片中
    // 2、当前节点入栈，迭代左子树；
    // 3、如果不存在左子树，则出栈取出节点，迭代右子树
    for root != nil || len(stack) > 0 {
        if root != nil {
            ret = append(ret, root.Val)
            stack = append(stack, root)
            root = root.Left
        } else {
            node := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            root = node.Right
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
func preorderTraversal(root *TreeNode) []int {
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
            stack = append(stack, node.Right, node.Left, node)
        } else {
            ret = append(ret, node.Val)
        }
    } 
    return ret
}
```