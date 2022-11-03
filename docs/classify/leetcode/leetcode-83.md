# 问题：删除排序链表中的重复元素

```
给定一个已排序的链表的头 head，删除所有重复的元素，使每个元素只出现一次。返回已排序的链表。

示例 1：
输入：head = [1,1,2]
输出：[1,2]

示例 2：
输入：head = [1,1,2,3,3]
输出：[1,2,3]

提示：
链表中节点数目在范围 [0, 300] 内
-100 <= Node.val <= 100
题目数据保证链表已经按升序排列
```

## 方法一：循环

```go
func deleteDuplicates(head *ListNode) *ListNode {
    if head == nil {
        return head
    }
    p := head
    for p.Next != nil {
        if p.Val == p.Next.Val {
            p.Next = p.Next.Next
        } else {
            p = p.Next
        }
    }
    return head
}
```



## 方法二：递归

每次比较后链表都缩短了，符合递归的定义

时间复杂度：O(N)

```go
func deleteDuplicates(head *ListNode) *ListNode {
    if head == nil || head.Next == nil {
        return head
    }
    head.Next = deleteDuplicates(head.Next)
    if head.Val == head.Next.Val {
        return head.Next
    } else {
        return head 
    }
}
```

 注：一开始觉得可以先排序，用双指针来解决，但是如果做了排序，那下标也就变化了，跟题目要求不符。