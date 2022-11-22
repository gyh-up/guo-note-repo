# 问题：对称二叉树

[树](/classify/algorithm/基础数据结构-树) | [栈](/classify/algorithm/基础数据结构-栈) | [递归](/classify/algorithm/算法-递归) |  [迭代](/classify/algorithm/算法-迭代) | [深度优先搜索](/classify/algorithm/算法-深度优先搜索)

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
    // 递归终止条件
    // 1、左右子树都为空
    // 2、在条件1的前提下，左右子树有一个为空
    // 3、左右孩子节点的值不相等
    if l == nil && r == nil {
        return true
    }
    if l == nil || r == nil {
        return false
    }
    if l.Val != r.Val {
        return false
    }
	// 递归比较
    // 左孩子节点的左子树 和 右孩子节点的右子树
    // 左孩子节点的右子树 和 右孩子节点的左子树	
    return check(l.Left, r.Right) && check(l.Right, r.Left)
}
```

## 方法二：迭代



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
    // 1.1、创建切片stack 作为栈来使用
    // 1.2、初始化存入 root 的左右子节点
    var stack []*TreeNode
    stack = append(stack, root.Left, root.Right)
    // 2.1、终止条件，栈为空
    for len(stack) > 0 {
        // 2.2、一次性从切片中取出两个元素，切片重新赋值
        // 2.3、左右子树都为空，继续下次循环
        // 2.4、在条件2.2不成立的前提下，左右子树有一个为空，返回false
        // 2.5、左右孩子节点的值不相等,返回false
        // 2.6、将当前节点 的左孩子节点的左子树和右孩子节点的右子树，左孩子节点的右子树 和 右孩子节点的左子树分别入栈
        l, r := stack[len(stack)-1], stack[len(stack)-2]
        stack = stack[:len(stack)-2]
        
        if l == nil && r == nil {
            continue;
        }
        if l == nil || r == nil {
            return false
        }
        if l.Val != r.Val {
            return false
        }
        stack = append(stack, l.Left, r.Right, l.Right, r.Left)
    }
    // 3、切片取完，且没有不对称的情况，则返回 true
    return true
}

```

