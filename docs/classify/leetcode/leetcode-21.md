# 问题：合并两个有序链表

```
将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

示例 1：
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]

示例 2：
输入：l1 = [], l2 = []
输出：[]

示例 3：
输入：l1 = [], l2 = [0]
输出：[0]

提示：
两个链表的节点数目范围是 [0, 50]
-100 <= Node.val <= 100
l1 和 l2 均按非递减顺序排列
```



## 方法一：循环迭代

 定义一个辅助指针 p，用来做指针的移动。判断当前节点与下一节点的值是否相等，如果相等，则当前节点的下一节点指针指向下下节点的位置，否则辅助指针向下移动。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    head := &ListNode{}
    p := head
    for list1 != nil && list2 != nil {
        if list1.Val > list2.Val {
            p.Next = list2
            list2 = list2.Next
        } else {
            p.Next = list1
            list1 = list1.Next
        }
        p = p.Next
    }

    if list1 == nil {
        p.Next = list2
    }
    if list2 == nil {
        p.Next = list1
    }
    return head.Next
}
```

## 方法二：递归

逻辑跟方法一类似，只是用了递归的思想

时间复杂度为 O(m+n)

```go
/**
 * Definition for singly-linked list. // 用一个结构体来表示节点
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    head := &ListNode{}
    p := head
    merge(list1, list2, p)
    return head.Next
}

func merge(list1 *ListNode, list2 *ListNode, p *ListNode) {
    if list1 != nil && list2 != nil {
        if list1.Val > list2.Val {
            p.Next, list2 = list2, list2.Next
            merge(list1, list2, p.Next)
        } else {
            p.Next, list1 = list1, list1.Next
            merge(list1, list2, p.Next)
        }
    } else if list1 == nil {
        p.Next = list2
    } else if list2 == nil {
        p.Next = list1
    }
}
```

## *方法三：编织递归

不需要新建节点，指针要两个链表之间进行编织，考验对指针的了解和应用

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    if list1 == nil {
        return list2
    } else if list2 == nil {
        return list1
    } else if list1.Val < list2.Val {
        list1.Next = mergeTwoLists(list1.Next, list2)
        return list1
    } else {
        list2.Next = mergeTwoLists(list1, list2.Next)
        return list2
    }
}
```

