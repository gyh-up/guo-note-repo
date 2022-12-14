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

前三种算法在 leetcode 中均超出时间限制，可以说明性能不佳

## 方法一：冒泡排序

**比较交换，稳定算法，时间O(n^2)，空间O(1)** 

每一轮遍历将当前值跟下一个值进行比较，将该轮比较的较大值放到后面，较小值放到前面。

```go
func sortArray(nums []int) []int {
    // 第一次遍历，用来循环每个元素
    for i := 0; i < len(nums); i++ {
        // 第二次遍历，用来做比较，可做剪枝
        for j := 0; j < len(nums) - 1 - i; j++ {
            // 比较当前元素和下一个元素的大小
            if nums[j] > nums[j+1] {
                nums[j], nums[j+1] = nums[j+1], nums[j]
            }
        }
    }
    return nums
}
```

## 方法二：选择排序

**比较交换，不稳定算法，时间O(n^2)，空间O(1)**

遍历数组，将当前元素和未排序数组部分进行比较，先把下标保存起来，比较完全部数之后再进行交换，减少交换次数。

```go
func sortArray(nums []int) []int {
    // 第一次遍历，循环每个元素
    for i := 0; i < len(nums); i++ {
        // 用来保存较小值的下标
        min := i
        // 遍历后续的元素，将较小值的下标赋值给 min
        for j := i + 1; j < len(nums); j++ {
            if nums[min] > nums[j] {
                min = j
            }
        }
        // 交换当前值和较小值的
        nums[i], nums[min] = nums[min], nums[i]
    }
    return nums
}
```

## 方法三：插入排序

**比较交换，稳定算法，时间O(n^2)，空间O(1)**
每轮从后往前，找到合适位置插入进去。**数据规模小的时候，或基本有序，效率高，常作为希尔排序的中间方法。**

```go
func sortArray(nums []int) []int {
    // 第一次遍历，用来循环每个元素
    for i := 1; i < len(nums); i++ {
    	// 保存当前值，因为后续的元素后退会覆盖该值
        temp := nums[i]
        // 获取前一个元素的下标
        j := i - 1
        // 依次和前面元素做比较并根据比较结果进行交换位置
        for j >= 0 {
            if nums[j] > temp {
                nums[j + 1], nums[j] = nums[j], nums[j+1]
                j--
            } else {
                break
            }
        }
    }
    return nums
}
```

## 方法四：希尔排序

**比较交换，不稳定算法，时间复杂度O(nlog2n)，最坏O(n^2)，空间O(1)**
每一轮中，按照某个增量将数据**分割成较小的若干组，每一组内部进行插入排序**；各组排序完毕后，减小增量，进行下一轮的内部排序。
这里使用增量序列为每轮长度数组长度的一半，还有其他增量序列，可以参考[希尔排序中的增量序列](/classify/algorithm/concept/算法-排序算法#希尔排序中的增量序列)

```go
func sortArray(nums []int) []int {
    // 初始化增量值
    tag := len(nums)/2
    for tag > 0 {
        for i := tag; i < len(nums); i++ {
            // 保存当前值，因为后续的元素后退会覆盖该值
            tmp := nums[i]
            // 确定分组上一个值的位置，用当前下标减去增量值，实际逻辑跟插入排序一样
            j := i - tag
            for j >= 0 {
                if nums[j] > tmp {
                    nums[j + tag],nums[j] = nums[j], nums[j + tag]
                	j = j - tag
                } else {
                    break
                }
            }
        }
        tag = tag/2
    }
    return nums
}
```

## 方法五：归并排序

```go
func sortArray(nums []int) []int {
    var merge func(left []int, right []int) []int
    merge = func (left []int, right []int) []int {
        // 左区归并
        if len(left) > 1 {
            left = merge(left[:len(left)/2], left[len(left)/2:])
        }
        // 右区归并
        if len(right) > 1 {
            right = merge(right[:len(right)/2], right[len(right)/2:])
        }
		
        // 初始化左右区下标
        l, r := 0, 0
        // 临时存储切片
        tmp := make([]int, len(left) + len(right))
        // 归并的逻辑，依次比较左右区的第一个为排序元素
        for l < len(left) && r < len(right) {
            if left[l] < right[r] {
                tmp[l+r] = left[l]
                l++
            } else {
                tmp[l+r] = right[r]
                r++
            }
        }
        // 其中一个区的元素排序完成，另一区剩余元素直接追加
        if l < len(left) {
            tmp = append(tmp[:l+r], left[l:]...)
        }
        if r < len(right) {
            tmp = append(tmp[:l+r], right[r:]...)
        }
        return tmp
    }

    return merge(nums[:len(nums)/2], nums[len(nums)/2:])
}
```

## 方法六：快速排序

```go
func sortArray(nums []int) []int {
	var quick func(left, right int) []int
	quick = func(left, right int) []int {
		// 递归终止条件
		if left > right {
			return nil
		}
		// 左右指针及主元
		i, j, pivot := left, right, nums[right]
		for i < j {
            // 寻找大于主元的左边元素
			for i < j && nums[i] <= pivot {
				i++
			}
			// 寻找小于主元的右边元素
			for i < j && nums[j] >= pivot {
				j--
			}
			// 交换i/j下标元素
			nums[i], nums[j] = nums[j], nums[i]
		}
		// 交换元素
		nums[i], nums[right] = nums[right], nums[i]
		quick(left, i-1)
		quick(i+1, right)
		return nums
	}
	return quick(0, len(nums)-1)
}
```

## 方法七：堆排序

```go
// 创建最大堆，然后将堆顶元素与最后一个未排序元素交换位置，当前未排序元素中的最大元素就后置
// 缩小堆（去除上一步骤排序好的元素）继续调整堆
func sortArray(nums []int) []int {
    n := len(nums)
	var heapify func(root, end int)
    heapify = func(root, end int){
        left_child := root * 2 + 1
        right_child := root * 2 + 2
        largest := root 
        if left_child <= end && nums[left_child] > nums[largest] {
            largest = left_child
        }
        if right_child <= end && nums[right_child] > nums[largest] {
            largest = right_child
        }
        if root != largest {
            nums[root], nums[largest] = nums[largest], nums[root]
            heapify(largest, end)
        }

    }

    // 初始化最大堆
    for i := n/2 - 1; i >= 0; i--{
        heapify(i, n - 1)
    }

	// 依次弹出元素，然后再堆化，相当于依次把最大值放入尾部
	for i := n - 1; i > 0; i--{
        nums[0], nums[i] = nums[i], nums[0]
        heapify(0, i - 1)
    }
    return nums 
}

```

方法八：计数排序

```go
func sortArray(nums []int) []int {
    if len(nums) == 0 {
		return nums
	}
    var getMinMax func(nums []int) (min int, max int)
    getMinMax = func(nums []int) (min int, max int) {
        min = math.MaxInt32
		max = math.MinInt32
        for i:=0; i < len(nums); i++ {
            if nums[i] < min {
                min = nums[i]
            }
            if nums[i] > max {
                max = nums[i]
            }
        }
        return min, max
    }
    // 获取最大最小值
    min, max := getMinMax(nums)
    // 创建桶
    tmpNums := make([]int, max - min + 1)
    // 数据入桶
    for i:=0; i < len(nums); i++ {
        tmpNums[nums[i]-min]++
    }
    // 数据出桶
    j := 0
    for i, v := range tmpNums {
        for v > 0 {
            nums[j] = i + min
            j++
            v--
        }
    }
    return nums
}
```

