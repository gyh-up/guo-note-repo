# 问题：反转链表

[动态规划](/classify/algorithm/算法-动态规划) | [链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针) | [递归](/classify/algorithm/算法-递归)

给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/02/19/rev1ex1.jpg)

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2021/02/19/rev1ex2.jpg)

```
输入：head = [1,2]
输出：[2,1]
```

**示例 3：**

```
输入：head = []
输出：[]
```


提示：

链表中节点的数目范围是 [0, 5000]

`-5000 <= Node.val <= 5000`


进阶：链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？

## 方法一：迭代/动态规划

循环链表，因为每次都会将当前节点指向上一节点，所以要提前保存下一节点，否则定位不到下一节点。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func reverseList(head *ListNode) *ListNode {
    // 定义上一节点和下一节点
    var pre_node, next_node *ListNode
    // 判断是否到链表尾部
    for head != nil {
        // 提前保存下一节点
        next_node = head.Next
        // 当前节点指向上一节点，如果是第一个节点，将会指向一个空节点
        head.Next = pre_node
        // 节点向后移动
        pre_node, head = head, next_node
    }
    return pre_node
}
```

## *方法二：递归

本质上就是递归到链表尾部，然后再将指针指向倒转过来。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func reverseList(head *ListNode) *ListNode {
    //  判断尾部
    if head == nil || head.Next == nil {
        return head
    }
    // 递归函数
    newHead := reverseList(head.Next)
    // 指针倒转
    head.Next.Next = head
    head.Next = nil
    return newHead
}
```

