# 问题：二叉树的中序遍历

[哈希表](/classify/algorithm/基础数据结构-哈希表) | [链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针) | [相遇问题](/classify/algorithm/数学-相遇问题)

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
        inorder(node.Left)
        result = append(result, node.Val)
        inorder(node.Right)
	}
	inorder(root)
    return result
}
```

## 方法二：栈/迭代

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
        // 1、如果存在左子树，则左子树入栈；
        //
        
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

