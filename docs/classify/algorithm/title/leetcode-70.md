# 问题：爬楼梯

[递归](/classify/algorithm/算法-递归) | [动态规划](/classify/algorithm/算法-动态规划) | [斐波那契数列](/classify/algorithm/数学-斐波那契数列) | [迭代](/classify/algorithm/算法-迭代)

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

**示例 1：**

```
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶
```

**示例 2：**

```
输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

提示：
1 <= n <= 45

## 方法一：递归法

根据 `f(n) = f(n-1) + f(n-2)`，也就是斐波那契数列。

定义一个 `map`表来记录已经计算出来的 `f(n)` 对应的值，减少算法的计算量，减低复杂度，解决递归算法的超时问题

时间复杂度：`O(n)`

```go
var numberMap map[int]int // 存储已经计算出来的数值，减少计算次数
func climbStairs(n int) int {
	numberMap = make(map[int]int)
	return climb(n)
}

// 递归函数
func climb(n int) int {
	if n <= 2 {
		return n
	}
	if numberMap[n] != 0 {
		return numberMap[n]
	} else {
		result := climb(n - 1) + climb(n - 2)
		numberMap[n] = result
		return result
	}
}
```

## *方法二：自下而上循环计算

也就是动态规划

时间复杂度：`O(n)`

```go
func climbStairs(n int) int {
	a, b, c := 0, 0, 1
	for i := 1; i <= n; i++ {
		a = b
		b = c
		c = a + b
	}
	return c
}
```

## 方法三：迭代

```go
func climbStairs(n int) int {
    fbMap := make(map[int]int)
    fbMap[1] = 1
    fbMap[2] = 2

    for i := 3; i <= n; i++ {
        fbMap[i] = fbMap[i-1] + fbMap[i-2]
    } 

    return fbMap[n]
}
```

