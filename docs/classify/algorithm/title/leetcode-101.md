# 问题：对称二叉树

[哈希表](/classify/algorithm/基础数据结构-哈希表) | [链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针) | [相遇问题](/classify/algorithm/数学-相遇问题)

给你一个二叉树的根节点 `root` ， 检查它是否轴对称。

 

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg)

```
输入：root = [1,2,2,3,4,4,3]
输出：true
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2021/02/19/symtree2.jpg)

```
输入：root = [1,2,2,null,3,null,3]
输出：false
```

**提示：**

- 树中节点数目在范围 `[1, 1000]` 内
- `-100 <= Node.val <= 100`

**进阶：你可以运用递归和迭代两种方法解决这个问题吗？**



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
func isSymmetric(root *TreeNode) bool {
    return check(root.Left, root.Right)
}

func check(l, r *TreeNode) bool {
    if l == nil && r == nil {
        return true
    }

    if l == nil || r == nil {
        return false
    }

    if l.Val != r.Val {
        return false
    }

    return check(l.Left, r.Right) && check(l.Right, r.Left)
}
```

## *方法二：快慢指针 

。。。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func hasCycle(head *ListNode) bool {
   
} 
```

