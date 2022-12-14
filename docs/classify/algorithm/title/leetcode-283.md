# 问题：移动零

[双指针](/classify/algorithm/技巧-双指针) | [数组](/classify/algorithm/基础数据结构-数组)

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
请注意 ，必须在不复制数组的情况下原地对数组进行操作。

**示例 1:**

```
输入: nums = [0,1,0,3,12]
输出: [1,3,12,0,0]
```

**示例 2:**

```
输入: nums = [0]
输出: [0]
```

进阶：你能尽量减少完成的操作次数吗？

## *方法一：双指针

循环数组，将不为 0 的值往前移动，移动后的位置替换成 0，然后记录当前非 0 的个数来确认当前非 0 值要替换的位置。

注意要避免极端情况，就是刚好排在最前面的一个或者多个值都是非 0 的，往前移动后再置为 0，实际还是会把原来的值给置 0了。

```go
func moveZeroes(nums []int)  {
    // 记录非0值的个数
	index := 0 
	for i,num := range nums {
        // 如果不为0，则前移，移动到的位置为非 0 值个数对应下表位置
		if num != 0 { 
			nums[index] = num
            // 将移动后的位置置位0，加该判断为了防止数组刚好前面的值都是非0 的情况
			if i != index {	
				nums[i] = 0
			}
            index++
		}
	}
}
```

