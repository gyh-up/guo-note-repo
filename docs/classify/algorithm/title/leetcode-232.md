# 问题：环形链表

[栈](/classify/algorithm/基础数据结构-栈)  | [队列](/classify/algorithm/基础数据结构-队列)  | [设计](/classify/algorithm/其他-设计)

请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（push、pop、peek、empty）：

实现 MyQueue 类：

- void push(int x) 将元素 x 推到队列的末尾
- int pop() 从队列的开头移除并返回元素
- int peek() 返回队列开头的元素
- boolean empty() 如果队列为空，返回 true ；否则，返回 false

说明：

- 你 只能 使用标准的栈操作 —— 也就是只有 push to top, peek/pop from top, size, 和 is empty 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。



## 方法一：双栈

用两个切片模拟栈

```go
type MyQueue struct {
    inStack []int
    outStack []int
}


func Constructor() MyQueue {
    return MyQueue{}
}


func (this *MyQueue) Push(x int)  {
    this.inStack = append(this.inStack, x)
}

func (this *MyQueue) inToOut() {
    for len(this.inStack) > 0 {
        this.outStack = append(this.outStack, this.inStack[len(this.inStack) - 1])
        this.inStack = this.inStack[:len(this.inStack) - 1]
    }
}

func (this *MyQueue) Pop() int {
    if len(this.outStack) == 0 {
        this.inToOut()
    }
    x := this.outStack[len(this.outStack) - 1]
    this.outStack = this.outStack[:len(this.outStack) - 1]
    return x
}


func (this *MyQueue) Peek() int {
    if len(this.outStack) == 0 {
        this.inToOut()
    }
    return this.outStack[len(this.outStack)-1]
}


func (this *MyQueue) Empty() bool {
    return len(this.inStack) == 0 && len(this.outStack) == 0
}


/**
 * Your MyQueue object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Push(x);
 * param_2 := obj.Pop();
 * param_3 := obj.Peek();
 * param_4 := obj.Empty();
 */
```

