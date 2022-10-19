# 问题：合并两个有序数组

```
给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。

示例 1：
输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]
解释：需要合并 [1,2,3] 和 [2,5,6] 。
合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。

示例 2：
输入：nums1 = [1], m = 1, nums2 = [], n = 0
输出：[1]
解释：需要合并 [1] 和 [] 。
合并结果是 [1] 。

示例 3：
输入：nums1 = [0], m = 0, nums2 = [1], n = 1
输出：[1]
解释：需要合并的数组是 [] 和 [1] 。
合并结果是 [1] 。
注意，因为 m = 0 ，所以 nums1 中没有元素。nums1 中仅存的 0 仅仅是为了确保合并结果可以顺利存放到 nums1 中。

提示：
nums1.length == m + n
nums2.length == n
0 <= m, n <= 200
1 <= m + n <= 200
-109 <= nums1[i], nums2[j] <= 109

进阶：你可以设计实现一个时间复杂度为 O(m + n) 的算法解决此问题吗？
```

## 方法一：直接合并后排序

时间复杂度：`O(m+n)`

```go
func merge(nums1 []int, m int, nums2 []int, _ int) {
    copy(nums1[m:], nums2) //合并
    sort.Ints(nums1) // 排序
}
```

## 方法二：双指针

依次比较两数组的元素

时间复杂度：`O(n)`

```go
func merge(nums1 []int, m int, nums2 []int, n int) []int {
	temp := make([]int, 0, m+n) // 定义临时切片
	m_index, n_index := 0, 0	
	for {
        // nums1 取完，直接合并 nums2剩下的元素
		if m_index == m {
			temp = append(temp, nums2[n_index:]...)
			break
		}
        // nums2 取完，直接合并 nums1剩下的元素
		if n_index == n {
			temp = append(temp, nums1[m_index:]...)
			break
		}
        // 比较大小，取较小的元素
		if nums1[m_index] >= nums2[n_index] {
			temp = append(temp, nums2[n_index])
			n_index++
		} else {
			temp = append(temp, nums1[m_index])
			m_index++
		}
	}
    // 题目要求必须返回 nums1，所以复制临时切片给 nums1
	copy(nums1, temp)
	return nums1
}
```

## 方法三：逆向双指针

方法二中，之所以要使用临时变量，是因为如果直接合并到数组 `nums1` 中，`nums1` 中的元素可能会在取出之前被覆盖。那么如何直接避免覆盖 `nums1` 中的元素呢？观察可知，`nums1` 的后半部分是空的，可以直接覆盖而不会影响结果。因此可以指针设置为从后向前遍历，每次取两者之中的较大者放进 `nums1` 的最后面。

```go
func merge(nums1 []int, m int, nums2 []int, n int) []int {
	for m_index, n_index, index := m-1, n-1, m+n-1; m_index >= 0 || n_index >= 0; index-- {
		switch {
		case m_index < 0 :
			nums1[index] = nums2[n_index]
			n_index--
		case n_index < 0:
			nums1[index] = nums1[m_index]
			m_index--
		case nums1[m_index] > nums2[n_index]:
			nums1[index] = nums1[m_index]
			m_index--
		case nums1[m_index] <= nums2[n_index]:
			nums1[index] = nums2[n_index]
			n_index--
		}
	}
	return nums1
}
```

