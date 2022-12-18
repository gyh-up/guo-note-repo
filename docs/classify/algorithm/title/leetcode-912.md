# 问题：排序数组

[排序算法](/classify/algorithm/算法-排序) | [数组](/classify/algorithm/基础数据结构-数组)

给你一个整数数组 nums，请你将该数组升序排列。

**示例 1：**

```
输入：nums = [5,2,3,1]
输出：[1,2,3,5]
```

**示例 2：**

```
输入：nums = [5,1,1,2,0,0]
输出：[0,0,1,1,2,5]
```

使用十大经典排序算法实现，有些因为时间复杂度导致超出时间限制，不过纯粹为了实现一下算法逻辑。[点击查看排序算法介绍](/classify/algorithm/concept/算法-排序算法)。

## 方法一：冒泡排序

循环将数组的值依次跟后面所有的值进行比较，发现更小值便交换两个位置的值。

```go
func sortArray(nums []int) []int {
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            if nums[i] > nums[j] {
                nums[i], nums[j] = nums[j], nums[i]
            }
        }
    }
    return nums
}
```

## 方法二：选择排序

逻辑跟冒泡排序差不多，只是冒泡排序每次都要交换值，选择排序是先把下标保存起来，比较完全部数之后再进行交换。

```go
func sortArray(nums []int) []int {
    for i := 0; i < len(nums); i++ {
        temp := i
        for j := i + 1; j < len(nums); j++ {
            if nums[temp] > nums[j] {
                temp = j
            }
        }
        nums[i], nums[temp] = nums[temp], nums[i]
    }
    return nums
}
```

