# 问题：字符串解码

[栈](/classify/algorithm/基础数据结构-栈) | [数组](/classify/algorithm/基础数据结构-数组) | [递归](/classify/algorithm/算法-递归) 

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

**示例 1：**

```
输入：s = "3[a]2[bc]"
输出："aaabcbc"
```

**示例 2：**

```
输入：s = "3[a2[c]]"
输出："accaccacc"
```

**示例 3：**

```
输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"
```

**示例 4：**

```
输入：s = "abc3[cd]xyz"
输出："abccdcdcdxyz"
```

## 方法一：栈

遍历字符串，通过判断当前值做相应的入栈出栈操作。

```go
func decodeString(s string) string {
    // 创建切片作为栈来使用
    stack := make([]string, 0)
    // 字符串索引
    i := 0
    // 保存数字
    var num string
    for i < len(s) {
        cur := s[i]
        switch {
        // 0-9，拼接，且判断是否需要入栈
        case cur >= '0' && cur <= '9' :
            // 拼接
            num += string(cur)
            i++
            // 如果下一个不是 0-9，则入栈，num 置为空
            if !(s[i] >= '0' && s[i] <= '9') {
                stack = append(stack, num)
                num = ""
            }
        // a-z,A-Z,[ 直接入栈
        case (cur >= 'a' && cur <= 'z') || (cur >= 'a' && cur <= 'z') || cur == '[' :
            stack = append(stack, string(cur))
            i+
        // ]，出栈
        case cur == ']' :
            var t string
            // 循环出栈，直到[
            for stack[len(stack) - 1] != "[" {
                t = stack[len(stack) - 1] + t
                stack = stack[:len(stack) - 1]
            }
            // 删除 [
            stack = stack[:len(stack) - 1]
            // 取出数字
            repeatNum, _ := strconv.Atoi(stack[len(stack) - 1])
            // 删除数字
            stack = stack[:len(stack) - 1]
            // 重复输出
            t = strings.Repeat(t, repeatNum)
            // 入栈
            stack = append(stack, t)
            i++
        }
    }
    var ret string
    for _, v := range stack {
        ret += v
    }
    return ret
}
```

## 方法二：递归

很容易联想到递归算法，每次都将分解成更小的加密字符串进行处理。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func hasCycle(head *ListNode) bool {
   
} 
```

