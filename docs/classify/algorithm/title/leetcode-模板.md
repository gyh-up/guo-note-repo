# 问题：环形链表

[哈希表](/classify/algorithm/基础数据结构-哈希表) | [链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针) | [相遇问题](/classify/algorithm/数学-相遇问题)

给你一个链表的头节点 head ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。

如果链表中存在环 ，则返回 true 。 否则，返回 false 。

提示：
链表中节点的数目范围是 [0, 104]
-105 <= Node.val <= 105
pos 为 -1 或者链表中的一个 有效索引 。

进阶：你能用 O(1)（即，常量）内存解决此问题吗？

## 方法一：遍历法/哈希表

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
    // 新建哈希表
    node_map := make(map[*ListNode]int)
    // 循环遍历所有节点
    for head != nil {
        // 判断节点值是否出现过
        if node_map[head] == 1 {
            // 出现过则返回 true
            return true
        }
        // 未出现过的节点值做标记
        node_map[head] = 1
        // 指针下移
        head = head.Next
    }
    return false
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
    // 排除特殊情况，空链表或者只有一个节点
    if head == nil || head.Next == nil {
        return false
    }
    // 新建快慢指针
    fastNode := head
    slowNode := head
    for {
        // 如果无环，快指针会达到链表尾部
        if fastNode == nil || fastNode.Next == nil{
            // 返回false
            return false
        }
		// 快指针走两步，慢指针走一步
        fastNode, slowNode = fastNode.Next.Next, slowNode.Next
        // 判断快慢指针是否重合
        if fastNode == slowNode {
            // 重合返回 true
            return true
        }
    }
} 
```

