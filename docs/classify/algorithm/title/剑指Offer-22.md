# 问题：链表中倒数第k个节点

[哈希表](/classify/algorithm/基础数据结构-哈希表) | [链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针)

输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。

例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

**示例：**

```
给定一个链表: 1->2->3->4->5, 和 k = 2.

返回链表 4->5.
```

## 方法一：哈希表

创建一个哈希表，用来保存当前节点的位置和节点本身。时间复杂度和空间复杂度均为 O(n)

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getKthFromEnd(head *ListNode, k int) *ListNode {
    // 特殊情况
    if head == nil {
        return nil
    }
    // 创建哈希表
    nodeMap := make(map[int]*ListNode)
    // 保存链表长度
    i := 0;
    for head != nil {
        nodeMap[i] = head
        head = head.Next
        i++
    }
    // 倒数第k个指针，即为正数第 i-k
    return nodeMap[i-k]
}
```

## 方法二：循环 

实际逻辑跟方法一是一样的，只是用了两个循环，把空间复杂度变成 O(1)

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getKthFromEnd(head *ListNode, k int) *ListNode {
    // 特殊情况
    if head == nil {
        return nil
    }
    ptr := head
    i := 0;
    // 循环计算链表长度
    for head != nil {
        head = head.Next
        i++
    }
    // 倒数第k个指针，即为正数第 i-k
    for j := 0; j < i -k ; j++ {
        ptr = ptr.Next
    }
    return ptr
}
```

## 方法三：快慢指针

创建快慢两个指针，其中快指针先移动 k-1 个位置，然后快慢指针再同时移动，当快指针到达最后的节点时，慢指针刚好到达倒数第 k 个节点的位置。

```
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getKthFromEnd(head *ListNode, k int) *ListNode {
	// 创建快慢指针
    fastPtr, slowPtr := head, head
    // 快指针先后移 k-1 个位置
    for i := 0; i < k - 1; i++ {
        fastPtr = fastPtr.Next
    }
	// 快慢指针一起移动
    for fastPtr.Next != nil {
        fastPtr, slowPtr = fastPtr.Next, slowPtr.Next
    }
    return slowPtr
}
```

