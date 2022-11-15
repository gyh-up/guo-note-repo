# 问题：相交链表

[哈希表](/classify/algorithm/基础数据结构-哈希表) | [链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针) 

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。

图示两个链表在节点 `c1` 开始相交：

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

题目数据 **保证** 整个链式结构中不存在环。

**注意**，函数返回结果后，链表必须 **保持其原始结构** 。

## 方法一：遍历法/哈希表

遍历所有节点，循环遍历两个链表，并将当前节点保存到一个哈希表，每次循环判断哈希表中是否已经出现过该节点，如果出现过，则说明该节点为两链表的相交节点。如果一直循环到两链表的尾部仍未出现重复节点，则说明两链表无相交节点。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getIntersectionNode(headA, headB *ListNode) *ListNode {
    // 新建哈希表，保存已出现过的节点
    node_map := make(map[*ListNode]int)
    for {
        // 判断A链表是否循环结束
        if headA != nil{
            // 判断节点是否已经出现，出现过则返回当前节点
            if node_map[headA] == 1{
                return headA
            }
            // 节点未出现，则节点保存至哈希表中，A链表指针下移
            node_map[headA] = 1
            headA = headA.Next
        } 
        // 判断B链表是否循环结束
        if headB != nil{
            // 判断节点是否已经出现，出现过则返回当前节点
            if node_map[headB] == 1{
                return headB
            }
            // 节点未出现，则节点保存至哈希表中，B链表指针下移
            node_map[headB] = 1
            headB = headB.Next
        } 
        // 两链表均移动到尾部，返回 nil
        if headA == nil && headB == nil {
            return nil
        }
    }
}
```

## 方法二：双指针 

情况一：两个链表相交

链表 `headA` 和 `headB` 的长度分别是 `m` 和 `n`。假设链表 `headA` 的不相交部分有 `a` 个节点，链表 `headB` 的不相交部分有 `b` 个节点，两个链表相交的部分有 `c` 个节点，则有 `a+c=m`，`b+c=n`。

如果 `a = b`，则两个指针会同时到达两个链表相交的节点，此时返回相交的节点；

如果 `a != b`，则指针 `pA` 会遍历完链表 `headA`，指针 `pB` 会遍历完链表 `headB`，两个指针不会同时到达链表的尾节点，然后指针 `pA `移到链表 `headB` 的头节点，指针 `pB` 移到链表 `headA` 的头节点，然后两个指针继续移动，在指针 `pA` 移动了 `a+c+b` 次、指针 `pB` 移动了 `b+c+a` 次之后，两个指针会同时到达两个链表相交的节点，该节点也是两个指针第一次同时指向的节点，此时返回相交的节点。

情况二：两个链表不相交

链表 `headA` 和 `headB` 的长度分别是 `m` 和 `n`。考虑当 `m=n` 和 `m != n` 时，两个指针分别会如何移动：

如果 `m = n`，则两个指针会同时到达两个链表的尾节点，然后同时变成空值 `null`，此时返回 `null`；

如果 `m != n`，则由于两个链表没有公共节点，两个指针也不会同时到达两个链表的尾节点，因此两个指针都会遍历完两个链表，在指针 `pA` 移动了 `m+n` 次、指针 `pB` 移动了 `n+m` 次之后，两个指针会同时变成空值 `null`，此时返回 `null`。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getIntersectionNode(headA, headB *ListNode) *ListNode {
    // 特殊情况，其中有一个链表为空的时候，返回 nil。也可以不加上此判断
    if headA == nil || headB == nil {
        return nil
    }
    // 定义pA 和 pB
    pA, pB := headA, headB
    for {
        // 同时为空时，返回 nil。两链表不相交
        if pA == nil && pB == nil {
            return nil
        // pA 走到 headA 链表尾部，重新指向 headB 头节点  
        } else if pA == nil && pB != nil {
            pA = headB
        // pB 走到 headB 链表尾部，重新指向 headA 头节点  
        } else if pB == nil && pA != nil {
            pB = headA
        }
        if pA == pB {
            return pA
        }   
        pA, pB = pA.Next, pB.Next
    }
}
```

## 方法三：双指针II

可以先计算两链表的长度差 `d`，将较长的链表先移动  `d` 个位置，然后再同时移动，如果两链表相交，则必定会出现两指针相等的情况。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
// 定义获取链表长度的函数
func Length(node *ListNode) int {
	if node == nil {
		return -1
	}
	i := 0
	for node.Next != nil {
		i++
		node = node.Next
	}
	return i
}
func getIntersectionNode(headA, headB *ListNode) *ListNode {
    // 分别获取两链表的长度
    lenA, lenB := Length(headA), Length(headB)
    // 新建辅助指针指向头节点
    pA, pB := headA, headB
    // 长的链表进行移动
    if lenA > lenB {
        d := lenA - lenB
        for i := 0;i < d; i++ {
            pA = pA.Next
        }
    }
    if lenA < lenB {
        d := lenB - lenA
        for i := 0;i < d; i++ {
            pB = pB.Next
        }
    }
    // 两指针同时移动，存在相同节点为相交节点，否则两节点都将移动到链表尾部，判断都为 nil，返回 nil
    for {
        if pA == pB {
            return pA
        }
        if pA == nil && pB == nil {
            return nil
        }
        pA, pB = pA.Next, pB.Next
    }

}
```



