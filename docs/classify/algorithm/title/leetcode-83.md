# 问题：删除排序链表中的重复元素

[链表](/classify/algorithm/基础数据结构-链表) | [哈希表](/classify/algorithm/基础数据结构-哈希表) | [迭代](/classify/algorithm/算法-迭代)

给定一个已排序的链表的头 head，删除所有重复的元素，使每个元素只出现一次。返回已排序的链表。

**示例 1：**

```
输入：head = [1,1,2]
输出：[1,2]
```

**示例 2：**

```

输入：head = [1,1,2,3,3]
输出：[1,2,3]
```

## 方法一：循环迭代

```go
func deleteDuplicates(head *ListNode) *ListNode {
    // 排除特殊情况
    if head == nil {
        return head
    }
    p := head
    // 循环链表，比较当前节点值和下一节点值，相同则跳过下一节点，将当前节点的下一节点指向下下节点
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



## *方法二：递归/栈

每次比较后链表都缩短了，符合递归的定义。相当于由后往前推算

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
