# 问题：两数之和

[哈希表](/classify/algorithm/基础数据结构-哈希表)

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那 两个整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
你可以按任意顺序返回答案。

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

进阶：你可以想出一个时间复杂度小于 O(n2) 的算法吗？

## 方法一：暴力穷举法

两次循环嵌套，不详述

## 方法二：哈希表

用一个哈希表来保存已经出现过的值和对应下表，可以将寻找 `target - number` 的时间复杂度降低到从 O(N) 降低到 O(1)。

时间复杂度：O(N)

```go
func twoSum(nums []int, target int) []int {
    // 新建哈希表
	var numberMap = make(map[int]int)
    // 循环数组
	for i, number := range nums {
        // 计算目标值和当前值的差值，即与当前志对于的另一个值
		diff := target - number
        // 判断差值是否存在
		if j, ok := numberMap[diff]; ok {
            // 存在返回两值的下标
			return []int{j, i}
		} else {
            // 不存在则将当前值和下标 作为键值对 保存在哈希表中
			numberMap[number] = i
		}
	}
	return []int{}
}
```

 注：一开始觉得可以先排序，用双指针来解决，但是如果做了排序，那下标也就变化了，跟题目要求不符。