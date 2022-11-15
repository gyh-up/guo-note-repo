

# 问题：回文链表

[链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针) | [栈](/classify/algorithm/基础数据结构-栈)  | [递归](/classify/algorithm/算法-递归) 

给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/03/03/pal1linked-list.jpg)

```
输入：head = [1,2,2,1]
输出：true
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2021/03/03/pal2linked-list.jpg)

```
输入：head = [1,2]
输出：false
```


提示：

链表中节点数目在范围[1, 105] 内
`0 <= Node.val <= 9`

**进阶：你能否用 `O(n)` 时间复杂度和 `O(1)` 空间复杂度解决此题？**

## 方法一：存入数组

存入数组后，将第 i 个元素 和 第 n-1-i 个元素做比较

```
func isPalindrome(head *ListNode) bool {
    vals := []int{}
    // 循环，存入数组
    for ; head != nil; head = head.Next {
        vals = append(vals, head.Val)
    }
    n := len(vals)
    // 循环，将第 i 个元素 和 第 n-1-i 个元素做比较
    for i, v := range vals[:n/2] {
        if v != vals[n-1-i] {
            return false
        }
    }
    return true
}
```



## 方法二：双指针

B站相关视频解析：https://www.bilibili.com/video/BV1eg411w7gn/?p=17&spm_id_from=pageDriver&vd_source=2365b1baf9eff4a0af3aabdb705341bd

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func isPalindrome(head *ListNode) bool {
    // 定义快慢指针
    fastPtr, slowPtr := head, head
    // 指针移动过
    for fastPtr != nil && fastPtr.Next != nil {
        fastPtr = fastPtr.Next.Next
        slowPtr = slowPtr.Next
    }
    // 节点数量奇偶判断处理
    if fastPtr != nil {
        slowPtr = slowPtr.Next
    }
    // 后半段链表进行反转
    slowPtr = reverseList(slowPtr)
    fastPtr = head
	// 比较
    for slowPtr != nil {
        if slowPtr.Val != fastPtr.Val {
            return false
        }
        fastPtr, slowPtr = fastPtr.Next, slowPtr.Next
    }
    return true
}

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

## 方法三：递归/栈

```
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
 
var frontPointer *ListNode
func isPalindrome(head *ListNode) bool {
    frontPointer = head
    return recursivelyCheck(head)
}

func recursivelyCheck(curNode *ListNode) bool {
    if curNode != nil {
        if !recursivelyCheck(curNode.Next) {
            return false
        }
        if curNode.Val != frontPointer.Val {
            return false
        }
        frontPointer = frontPointer.Next
    }
    return true
}
```

