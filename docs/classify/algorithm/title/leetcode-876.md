# 问题：链表的中间节点

[链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针)

给定一个头结点为 `head` 的非空单链表，返回链表的中间结点。

如果有两个中间结点，则返回第二个中间结点。

## 方法一：遍历法

先循环获取链表的长度，然后根据链表长度获取中间节点

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func middleNode(head *ListNode) *ListNode {
    // 定义辅助指针
    currentNode := head
    len := 0
    // 计算链表长度
    for currentNode != nil {
        len ++
        currentNode = currentNode.Next
    }
	// 获取中间节点
    for i := 0; i < len/2; i++ {
        head = head.Next
    }
    return head
}
```

## 方法二：快慢指针 

快指针每次移动两步，慢指针每次移动一步，当快指针到达链表结尾时，慢指针刚好到达中间节点。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func middleNode(head *ListNode) *ListNode {
    // 定义快慢指针
    slowNode, fastNode := head, head
    // 快指针每次移动两步，慢指针每次移动一步
    for fastNode != nil && fastNode.Next != nil {
        fastNode, slowNode = fastNode.Next.Next, slowNode.Next
    }
    return slowNode
    
}
```

