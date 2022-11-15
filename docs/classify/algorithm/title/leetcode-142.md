# 问题：环形链表II

[哈希表](/classify/algorithm/基础数据结构-哈希表) | [链表](/classify/algorithm/基础数据结构-链表) | [双指针](/classify/algorithm/技巧-双指针) | [相遇问题](/classify/algorithm/数学-相遇问题)

给定一个链表的头节点  `head` ，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 `0 `开始）。如果 `pos` 是 -1，则在该链表中没有环。注意：`pos` 不作为参数进行传递，仅仅是为了标识链表的实际情况。

**不允许修改**链表。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png)

> ```
> 输入：head = [3,2,0,-4], pos = 1
> 输出：返回索引为 1 的链表节点
> 解释：链表中有一个环，其尾部连接到第二个节点。
> ```

**示例 2：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```
输入：head = [1,2], pos = 0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例 3：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```
输入：head = [1], pos = -1
输出：返回 null
解释：链表中没有环。
```

提示：

链表中节点的数目范围在范围 [0, 104] 内
-105 <= Node.val <= 105
pos 的值为 -1 或者链表中的一个有效索引


进阶：你是否可以使用 O(1) 空间解决此题？

## 方法一：遍历法/哈希表

遍历所有节点，每次遍历到一个节点时，使用哈希表来存储当前节点。每次我们到达一个节点，如果该节点已经存在于哈希表中，则说明该链表是环形链表，返回该节点；否则就将该节点加入哈希表中。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func detectCycle(head *ListNode) *ListNode {
    // 新建哈希表
    node_map := make(map[*ListNode]int)
    // 循环遍历所有节点
    for head != nil {
        // 判断节点值是否出现过
        if _, ok := node_map[head]; ok {
            // 出现过则返回节点
            return head
        }
        // 未出现过的节点值做标记
        node_map[head] = 1
        // 指针下移
        head = head.Next
    }
    return nil
}
```

## *方法二：快慢指针 

与初中数学相遇问题同理，两人跑步速度不一样，同时绕操场跑步，便会有相遇的时候。

我们使用两个指针，`fast` 与 `slow`。它们起始都位于链表的头部。随后，`slow` 指针每次向后移动一个位置，而 `fast` 指针向后移动两个位置。如果链表中存在环，则 `fast` 指针最终将再次与 `slow` 指针在环中相遇。

如下图所示，设链表中环外部分的长度为` a`。`slow` 指针进入环后，又走了 `b` 的距离与 `fast `相遇。此时，`fast` 指针已经走完了环的 `n` 圈，因此它走过的总距离为 

`a+n(b+c)+b=a+(n+1)b+nca+n(b+c)+b=a+(n+1)b+nc`

![fig1](https://assets.leetcode-cn.com/solution-static/142/142_fig1.png)

根据题意，任意时刻，`fast` 指针走过的距离都为 `slow` 指针的 `2` 倍。因此，我们有

`a+(n+1)b+nc=2(a+b) =>	a=c+(n−1)(b+c)`

有了 `a=c+(n-1)(b+c)` 的等量关系，我们会发现：从相遇点到入环点的距离加上 `n−1` 圈的环长，恰好等于从链表头部到入环点的距离。

因此，当发现 `slow` 与 `fast` 相遇时，我们再额外使用一个指针 `ptr`。起始，它指向链表头部；随后，它和 `slow` 每次向后移动一个位置。最终，它们会在入环点相遇。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func detectCycle (head *ListNode) *ListNode {
    // 排除特殊情况，空链表或者只有一个节点
    if head == nil || head.Next == nil {
        return nil
    }
    // 新建快慢指针
    fastNode := head
    slowNode := head
    for {
        // 如果无环，快指针会达到链表尾部
        if fastNode == nil || fastNode.Next == nil{
            // 返回 nil
            return nil
        }
		// 快指针走两步，慢指针走一步
        fastNode, slowNode = fastNode.Next.Next, slowNode.Next
        // 判断快慢指针是否重合
        if fastNode == slowNode {
            // 将快指针指向头节点
            fastNode = head
            break;
        }
    }

    for {
        // 如果快慢指针重合，则为环形链表起始节点
        if fastNode == slowNode {
            return slowNode
        }
        // 快指针走两一步，慢指针走一步
        fastNode, slowNode = fastNode.Next, slowNode.Next
    }
} 
```

