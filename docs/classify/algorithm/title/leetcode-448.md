# 问题：找到所有数组中消失的数字

[哈希表](/classify/algorithm/基础数据结构-哈希表)

给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果。

**示例 1：**

```
输入：nums = [4,3,2,7,8,2,3,1]
输出：[5,6]
```

**示例 2：**

```
输入：nums = [1,1]
输出：[2]
```

进阶：你能在不使用额外空间且时间复杂度为 O(n) 的情况下解决这个问题吗? 你可以假定返回的数组不算在额外空间内。

## 解析

这道题的重点是不使用额外空间且 时间复杂度为O(n)。解题思路是在原数组上，对已经出现过的值打上一个标签，因为数组取值在 `1~n`之间，而数组下标取值在 `0~(n-1)`之间，可以把当前值减去一后，得到的值对应的下标的值设置为负数，表示该值出现过。

## *方法一：鸽笼法

```go
func findDisappearedNumbers(nums []int) []int {
	for _, num := range nums {
		index := int(math.Abs(float64(num))) -1
		nums[index] = int(math.Abs(float64(nums[index]))) * -1
	}

	ans := []int{}
	for i, num := range nums{
		if num >= 0 {
			ans = append(ans, i+1)
		}
	}
	return ans
}
```

## *方法二：增量法

```go
func findDisappearedNumbers(nums []int) []int {
	n := len(nums)
	for _, num := range nums {
		index := (num - 1) % n
		nums[index] += n
	}

	ans := []int{}
	for i, num := range nums{
		if num <= n {
			ans = append(ans, i+1)
		}
	}

	return ans
}
```

两种方法的思维逻辑其实是类似的，都是想办法把出现过的值标记出来，最后再遍历一次数组，根据未标记的位置得到未出现的数字。