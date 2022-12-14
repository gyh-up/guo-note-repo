---
typora-root-url: ..\..\public
---

# redis的底层数据结构

以下命令是用来显示数据类型的底层数据结构。

```
OBJECT ENCODING key 
```

## 简单动态字符串`SDS`

`Redis` 是用 `C` 语言写的，但是对于 `Redis` 的字符串，却不是 `C` 语言中的字符串（即以空字符’\0’结尾的字符数组），它是自己构建了一种名为 简单动态字符串（`simple dynamic string`，`SDS`）的抽象类型，并将 `SDS` 作为 `Redis` 的默认字符串表示。

### `SDS` 结构定义

```c
struct sdshdr{
    int len;	//记录buf数组中已使用字节的数量，即等于 SDS 当前保存字符串的长度	
    int free;	//记录 buf 数组中未使用字节的数量
    char buf[];	//字节数组，用于保存字符串
}
```

![](/redis/redis-用sds保存字符串示例.png)

`SDS` 数据类型的定义：

1. **`len` 保存了 `SDS` 保存字符串的长度，也就是已经使用了的字节数量**
2. **`buf[] `数组用来保存字符串的每个元素**
3. **`free` 记录了 `buf` 数组中未使用的字节**

### `SDS` 特性

上面的定义相对于 `C` 语言对于字符串的定义，多出了 `len` 属性以及 `free` 属性。为什么不使用 `C` 语言字符串实现，而是使用 `SDS` 呢？这样实现有什么好处？

#### 常数复杂度获取字符串长度

由于 `len` 属性的存在，我们获取 `SDS` 字符串的长度只需要读取 `len` 属性，事件复杂度为 `O(1)`。而对于 `C` 语言，获取字符串的长度通常是经历遍历计数来实现的，事件复杂度为 `O(n)`。通过 `strlen key` 命令可获取 `key` 的字符串长度。

#### 杜绝缓冲区溢出

我们知道在 `C` 语言中使用 `strcat` 函数来进行两个字符串的拼接，一旦没有分配足够长度的内存空间，就会造成缓冲区溢出。而对于 `SDS` 数据类型，在进行字符修改的时候，会首先根据记录的 `len` 属性检查内存空间是否满足需求，如果不满足，会进行相应的空间扩展，然后再进行修改操作，所以不会出现缓存区溢出。

#### 减少修改字符串的内存重新分配次数

`C` 语言由于不记录字符串的长度，所以如果要修改字符串，必须要重新分配内存（先释放再申请），因为如果没有重新分配，字符串长度增大时会造成内存缓存区溢出，字符串长度减小时会造成内存泄漏。

而对于 `SDS`，由于 `len` 属性和 `free` 属性的存在，对于修改字符串 `SDS` 实现了**空间预分配和惰性空间释放**两种策略：

1. 空间预分配：对字符串进行空间扩展的时候，扩展的内存比实际需要的多，这样可以减少连续执行字符串增长操作所需要的内存重新分配次数
2. 惰性空间释放：对字符串进行缩短操作时，程序不立即使用内存重新分配来回收缩短后多余的字节，而是使用 `free` 属性将这些字节的数量记录下来，等待后续使用。（当然 `SDS` 也提供了相对应的 `API`，当我们有需要时，也可以手动释放这些未使用的空间）

#### 二进制安全

因为 `C` 字符串以空字符作为字符串结束的标识，而对于一些二进制文件（如图片等），内容可能包括空字符串，因此 `C` 字符串无法正确存取；而所有 `SDS` 的`API` 都是以处理二进制的方式来处理 `buf` 里面的元素，并且 `SDS` 不是以空字符串来判断是否结束，而是以 `len` 属性表示的长度来判断字符串是否结束。

#### 兼容部分 C 字符串函数

虽然 `SDS` 是二进制安全的，但是一样遵从每个字符串都是**以空字符串结尾的惯例**，这样可以重用 C 语言库 `<string.h>`  中的一部分函数。

#### 总结：C 字符串和 `SDS` 之间的区别

|                      C 字符串                      |                       `SDS`                        |
| :------------------------------------------------: | :------------------------------------------------: |
|           获取字符串长度的复杂度为 O(n)            |           获取字符串长度的复杂度为 O(1)            |
|       `API` 是不安全的，可能会造成缓冲区溢出       |         `API` 是安全的，不会造成缓冲区溢出         |
| 修改字符串长度 N 次**必然需要**执行 N 次内存重分配 | 修改字符串长度 N 次**最多需要**执行 N 次内存重分配 |
|                  只能保存文本数据                  |              可以保存文本或二进制数据              |
|       可以使用所有的 `<string.h>` 库中的函数       |      可以使用一部分的 `<string.h>` 库中的函数      |

一般来说，`SDS` 除了保存数据库中的字符串值以外，`SDS` 还可以作为缓冲区`buffer` ：**包括 `AOF` 模块中的 `AOF` 缓冲区以及客户端状态中的输入缓冲区**。后面在介绍 `Redis` 的持久化时会进行介绍。

## 链表 `list`

链表是一种常用的数据结构，`C` 语言内部是没有内置这种数据结构的实现，所以 `Redis` 自己构建了链表的实现

### 链表结构定义

```c
typedef  struct listNode{
    struct listNode *prev;	//前置节点指针
    struct listNode *next;	//后置节点指针
    void *value;  	//节点的值
}listNode

```

通过多个 `listNode` 结构就可以组成链表，这是一个双向链表，`Redis` 还提供了操作链表的数据结构：

```c
typedef struct list{
    listNode *head;	//表头节点指针
    listNode *tail;	//表尾节点指针
    unsigned long len;	//链表所包含的节点数量
    void (*free) (void *ptr);	//节点值复制函数
    void (*free) (void *ptr);	//节点值释放函数
    int (*match) (void *ptr,void *key);	//节点值对比函数
}list;

```

![](/redis/redis-链表结构图.png)

### 特性

1. 双端：链表具有前置节点和后置节点的引用，获取这两个节点时间复杂度都为 `O(1)`。
2. 无环：表头节点的 `prev` 指针和表尾节点的 `next` 指针都指向 `NULL`，对链表的访问都是以 `NULL` 结束。　　
3. 带链表长度计数器：通过 `len`  属性获取链表长度的时间复杂度为 O(1)。
4. 多态：链表节点使用 void* 指针来保存节点值，可以保存各种不同类型的值。

## 字典 `dictht`

字典又称为符号表或者关联数组、或映射 `map`，是一种用于保存键值对的抽象数据结构。字典中的每一个键 `key` 都是唯一的，通过 `key` 可以对值来进行查找或修改。`C` 语言中没有内置这种数据结构的实现，所以字典依然是 `Redis` 自己构建的。

`Redis` 的字典使用哈希表作为底层实现。

### 哈希表结构定义

```c
typedef struct dictht{
     dictEntry **table;	//哈希表数组
     unsigned long size;	//哈希表大小
     unsigned long sizemask;	//哈希表大小掩码，用于计算索引值；总是等于 size-1
     unsigned long used;	//该哈希表已有节点的数量
}dictht
```

哈希表是由数组 `table` 组成，`table` 中每个元素都是指向 `dict.h/dictEntry` 结构，`dictEntry` 结构定义如下：

```c
typedef struct dictEntry{
    void *key;	//键
    union{	//值
        void *val;
        uint64_tu64;
        int64_ts64;
    }v;
    struct dictEntry *next;	//指向下一个哈希表节点，形成链表
}dictEntry

```

`key` 用来保存键，`val` 属性用来保存值，值可以是一个指针，也可以是 `uint64_t` 整数，也可以是 `int64_t` 整数。

注意这里还有一个指向下一个哈希表节点的指针，我们知道哈希表最大的问题是存在哈希冲突，如何解决哈希冲突，**有开放地址法和链地址法**。这里采用的便是链地址法，通过 `next` 这个指针可以将多个哈希值相同的键值对连接在一起，用来解决**哈希冲突**。

![](/redis/redis-字典结构.png)

`ht` 属性是一个包含两个项的数组， 数组中的每个项都是一个 `dictht` 哈希表， 一般情况下， 字典只使用 `ht[0]` 哈希表， `ht[1]` 哈希表只会在对 `ht[0]` 哈希表进行 `rehash` 时使用。

除了 `ht[1]` 之外， 另一个和 `rehash` 有关的属性就是 `rehashidx` ： 它记录了 `rehash` 目前的进度， 如果目前没有在进行 `rehash` ， 那么它的值为 `-1` 。

![](/redis/redis-普通状态下（没有进行 rehash）的哈希表.png)

### 哈希算法

#### 哈希算法

`Redis` 计算哈希值和索引值方法如下：

```php
//1、使用字典设置的哈希函数，计算键 key 的哈希值
hash = dict->type->hashFunction(key);
//2、使用哈希表的sizemask属性和第一步得到的哈希值，计算索引值
index = hash & dict->ht[x].sizemask;
```

![](/redis/redis-哈希算法.png)

举个例子， 对于图 4-4 所示的字典来说， 如果我们要将一个键值对 `k0` 和 `v0` 添加到字典里面， 那么程序会先使用语句：

```
hash = dict->type->hashFunction(k0);
```

计算键 `k0` 的哈希值。

假设计算得出的哈希值为 `8` ， 那么程序会继续使用语句：

```
index = hash & dict->ht[0].sizemask = 8 & 3 = 0;
```

计算出键 `k0` 的索引值 `0` ， 这表示包含键值对 `k0` 和 `v0` 的节点应该被放置到哈希表数组的索引 `0` 位置上。

**当字典被用作数据库的底层实现， 或者哈希键的底层实现时， `Redis` 使用 `MurmurHash2` 算法来计算键的哈希值。**

**`MurmurHash` 算法最初由 `Austin Appleby` 于 `2008` 年发明， 这种算法的优点在于， 即使输入的键是有规律的， 算法仍能给出一个很好的随机分布性， 并且算法的计算速度也非常快。**

#### 解决哈希冲突

这个问题上面我们介绍了，方法是**链地址法**。通过字典里面的 `*next` 指针指向下一个具有相同索引值的哈希表节点。

#### 扩容和收缩

当哈希表保存的键值对太多或者太少时，就要通过 `rerehash`（重新散列）来对哈希表进行相应的扩展或者收缩。

### 哈希表的 `rehash` （重新散列）

**`Redis` 的字典使用哈希表作为底层实现，** 一个哈希表里面可以有多个哈希表节点， 而每个哈希表节点就保存了字典中的一个键值对。

 **哈希表中的键值对随着不断进行的操作增加或减少，为了将哈希表的负载因子维持在较为合理的范围内，程序需对哈希表的大小进行相应的扩展或者收缩，而`rehash`（重新散列）操作就可以完成这项工作。**

#### `Rehash`

##### `rehash` 的步骤

`Redis` 对字典的哈希表执行 `rehash` 的步骤如下:

1. 为字典的 `ht[1]` 哈希表分配空间， 这个哈希表的空间大小取决于要执行的操作， 以及 `ht[0]` 当前包含的键值对数量 （也即是 `ht[0].used` 属性的值）：

   - 如果执行的是扩展操作， 那么 `ht[1]` 的大小为第一个大于等于 `ht[0].used * 2` 的 `2^n` ；

   - 如果执行的是收缩操作， 那么 `ht[1]` 的大小为第一个大于等于 `ht[0].used` 的 `2^n` 。

2. 将保存在 `ht[0]` 中的所有键值对 `rehash` 到 `ht[1]` 上面： **`rehash` 指的是重新计算键的哈希值和索引值，** 然后将键值对放置到 `ht[1]` 哈希表的指定位置上。

3. 当 `ht[0]` 包含的所有键值对都迁移到了 `ht[1]` 之后 （`ht[0]` 变为空表）**， 释放 `ht[0]` ， 将 `ht[1]` 设置为 `ht[0]` ， 并在 `ht[1]` 新创建一个空白哈希表， 为下一次 `rehash` 做准备。**

   **举个例子，** 假设程序要对图 `4-8` 所示字典的 `ht[0]` 进行扩展操作， 那么程序将执行以下步骤：

   1. `ht[0].used` 当前的值为 `4` ， `4 * 2 = 8` ， 而 `8` （2^3）恰好是第一个大于等于 `4` 的 `2` 的 `n` 次方， 所以程序会将 `ht[1]` 哈希表的大小设置为 `8` 。 图 `4-9` 展示了 `ht[1]` 在分配空间之后， 字典的样子。
   2. 将 `ht[0]` 包含的四个键值对都 `rehash` 到 `ht[1]` ， 如图 `4-10` 所示。
   3. 释放 `ht[0]` ，并将 `ht[1]` 设置为 `ht[0]` ，然后为 `ht[1]` 分配一个空白哈希表，如图 `4-11` 所示。

   至此， 对哈希表的扩展操作执行完毕， 程序成功将哈希表的大小从原来的 `4` 改为了现在的 `8` 。

   ![img](/redis/redis-执行rehash之前的字典.png)

   ![img](/redis/redis-rehash时为字典的ht[1]哈希表分配空间.png)

   ![img](/redis/redis-ht[0]的所有键值对都已经被迁移到ht[1].png)

   ![img](/redis/redis-完成rehash之后的字典.png)

##### **`rehash` 执行条件**

**当以下条件中的任意一个被满足时， 程序会自动开始对哈希表执行扩展操作：**

- **服务器目前没有在执行 `BGSAVE` 命令或者 `BGREWRITEAOF` 命令， 并且哈希表的负载因子大于等于 1 ；**

- **服务器目前正在执行 `BGSAVE` 命令或者 `BGREWRITEAOF` 命令， 并且哈希表的负载因子大于等于 5 ；**

**其中哈希表的负载因子可以通过公式：`负载因子 = 哈希表已保存节点数量 / 哈希表大小`**

**`load_factor = ht[0].used / ht[0].size` 计算得出。**

比如说， 对于一个大小为 4 ， 包含 4 个键值对的哈希表来说， 这个哈希表的负载因子为：load_factor = 4 / 4 = 1

又比如说， 对于一个大小为 512 ， 包含 256 个键值对的哈希表来说， 这个哈希表的负载因子为：load_factor = 256 / 512 = 0.5

根据 `BGSAVE` 命令或 `BGREWRITEAOF` 命令是否正在执行， 服务器执行扩展操作所需的负载因子并不相同，这是因为在执行 `BGSAVE` 命令或 `BGREWRITEAOF` 命令的过程中， `Redis` 需要创建当前服务器进程的子进程。 而大多数操作系统都采用写时复制（copy-on-write）技术来优化子进程的使用效率， 所以在子进程存在期间， 服务器会提高执行扩展操作所需的负载因子， 从而尽可能地避免在子进程存在期间进行哈希表扩展操作， 这可以避免不必要的内存写入操作， 最大限度地节约内存。

**另一方面， 当哈希表的负载因子小于 0.1 时， 程序自动开始对哈希表执行收缩操作。**

#### **Rehashing**

  **`rehash` 动作是分多次、渐进式地完成的。**原因在于， 如果 `ht[0]` 里只保存着四个键值对， 那么服务器可以在瞬间就将这些键值对全部 `rehash` 到 `ht[1] `； 但是， 如果哈希表里保存的键值对数量不是四个， 而是四百万、四千万甚至四亿个键值对， 那么要一次性将这些键值对全部 `rehash` 到 `ht[1]` 的话， 庞大的计算量可能会导致服务器在一段时间内停止服务。

 因此， 为了避免 `rehash` 对服务器性能造成影响， 服务器不是一次性将 `ht[0]` 里面的所有键值对全部 `rehash` 到 `ht[1]` ， 而是分多次、渐进式地将 `ht[0]` 里面的键值对慢慢地 rehash 到 `ht[1]` 。

##### `Rehashing` 的步骤

 以下是哈希表渐进式 `rehash` 的详细步骤：

1. 为 `ht[1]` 分配空间， 让字典同时持有 `ht[0]` 和 `ht[1]` 两个哈希表。
2. 在字典中维持一个索引计数器变量 `rehashidx` ， 并将它的值设置为 `0` ， 表示 `rehash` 工作正式开始。
3. 在 `rehash` 进行期间， 每次对字典执行添加、删除、查找或者更新操作时， 程序除了执行指定的操作以外， 还会顺带将 `ht[0]` 哈希表在 `rehashidx` 索引上的所有键值对 `rehash` 到 `ht[1]` ， 当 `rehash` 工作完成之后， 程序将 `rehashidx` 属性的值增一。
4. 随着字典操作的不断执行， 最终在某个时间点上， `ht[0]` 的所有键值对都会被 `rehash` 至 `ht[1]` ， 这时程序将 `rehashidx` 属性的值设为 `-1` ， 表示 `rehash` 操作已完成。

渐进式 `rehash` 的好处在于它采取分而治之的方式， 将 `rehash` 键值对所需的计算工作均滩到对字典的每个添加、删除、查找和更新操作上， 从而避免了集中式 `rehash` 而带来的庞大计算量。

##### `Rehashing` 的过程时如何操作

因为在进行渐进式 `rehash` 的过程中， 字典会同时使用 `ht[0]` 和 `ht[1]` 两个哈希表， 所以在渐进式 `rehash` 进行期间， 字典的删除（delete）、查找（find）、更新（update）等操作会在两个哈希表上进行： 比如说， 要在字典里面查找一个键的话， **程序会先在 `ht[0]` 里面进行查找， 如果没找到的话， 就会继续到 `ht[1]` 里面进行查找， 诸如此类。**

另外， **在渐进式 `rehash` 执行期间， 新添加到字典的键值对一律会被保存到 `ht[1]` 里面， 而 `ht[0]` 则不再进行任何添加操作**；这一措施保证了 `ht[0]` 包含的键值对数量会只减不增， 并随着 rehash 操作的执行而最终变成空表。

## **跳跃表 `skiplist`**

跳跃表 `skiplist` 是一种有序数据结构，它通过在每个节点中维持多个指向其它节点的指针，从而达到快速访问节点的目的。

### **跳跃表**定义

![](/redis/redis-跳跃表结构.png)

跳跃表节点结构：

```c
typedef struct zskiplistNode {
    //层
    struct zskiplistLevel{
        struct zskiplistNode *forward;	//前进指针
        unsigned int span;	//跨度
    }level[];
    struct zskiplistNode *backward;	//后退指针
    double score;	//分值
    robj *obj;	//成员对象
} zskiplistNode
```

多个跳跃表节点构成一个跳跃表：

```c
typedef struct zskiplist{
    structz skiplistNode *header, *tail;	//表头节点和表尾节点
    unsigned long length;	//表中节点的数量
    int level;	//表中层数最大的节点的层数
}zskiplist;
```

### 表操作

搜索：从最高层的链表节点开始，如果比当前节点要大和比当前层的下一个节点要小，那么则往下找，也就是和当前层的下一层的节点的下一个节点进行比较，以此类推，一直找到最底层的最后一个节点，如果找到则返回，反之则返回空。

插入：首先确定插入的层数，有一种方法是假设抛一枚硬币，如果是正面就累加，直到遇见反面为止，最后记录正面的次数作为插入的层数。当确定插入的层数k后，则需要将新元素插入到从底层到k层。

删除：在各个层中找到包含指定值的节点，然后将节点从链表中删除即可，如果删除以后只剩下头尾两个节点，则删除这一层。

### 特性

1. 由很多层结构组成；
2. 每一层都是一个有序的链表，排列顺序为由高层到底层，都至少包含两个链表节点，**分别是前面的 `head` 节点和后面的 `nil` 节点；**
3. 最底层的链表包含了所有的元素；
4. 如果一个元素出现在某一层的链表中，那么在该层之下的链表也全都会出现（上一层的元素是当前层的元素的子集）；
5. **链表中的每个节点都包含两个指针，一个指向同一层的下一个链表节点，另一个指向下一层的同一个链表节点**；

## 整数集合 `inset`

整数集合 `intset` 是 `Redis`  用于保存整数值的集合抽象数据类型，它可以保存类型为 `int16_t`、`int32_t ` 或者 `int64_t `  的整数值，并且保证集合中不会出现重复元素。

### **整数集合**结构定义

```c
typedef struct intset{
    uint32_t encoding;	//编码方式
    uint32_t length;	//集合包含的元素数量
    int8_t contents[];	//保存元素的数组
}intset;
```

整数集合的每个元素都是 `contents` 数组的一个数据项，它们按照从小到大的顺序排列，并且不包含任何重复项。

`length` 属性记录了 `contents` 数组的大小。

需要注意的是虽然 `contents` 数组声明为 `int8_t` 类型，但是实际上 `contents` 数组并不保存任何 `int8_t` 类型的值，其真正类型有 `encoding` 来决定。

### 特性

#### 升级

当我们新增的元素类型比原集合元素类型的长度要大时，需要对整数集合进行升级，才能将新元素放入整数集合中。

具体步骤：

1. 根据新元素类型，扩展整数集合底层数组的大小，并为新元素分配空间。
2. 将底层数组现有的所有元素都转成与新元素相同类型的元素，并将转换后的元素放到正确的位置，放置过程中，维持整个元素顺序都是有序的。
3. 将新元素添加到整数集合中（保证有序）。



举个例子， 假设现在有一个 `INTSET_ENC_INT16` 编码的整数集合， 集合中包含三个 `int16_t` 类型的元素， 如图 `6-3` 所示。

![](/redis/redis-intset升级1.png)

因为每个元素都占用 `16` 位空间， 所以整数集合底层数组的大小为 `3 * 16 = 48` 位， 图 `6-4` 展示了整数集合的三个元素在这 `48` 位里的位置。

![](/redis/redis-intset升级2.png)

现在， 假设我们要将类型为 `int32_t` 的整数值 `65535` 添加到整数集合里面， 因为 `65535` 的类型 `int32_t` 比整数集合当前所有元素的类型都要长， 所以在将 `65535` 添加到整数集合之前， 程序需要先对整数集合进行升级。

升级首先要做的是， 根据新类型的长度， 以及集合元素的数量（包括要添加的新元素在内）， 对底层数组进行空间重分配。

整数集合目前有三个元素， 再加上新元素 `65535` ， 整数集合需要分配四个元素的空间， 因为每个 `int32_t` 整数值需要占用 `32` 位空间， 所以在空间重分配之后， 底层数组的大小将是 `32 * 4 = 128` 位， 如图 6-5 所示。

![](/redis/redis-intset升级3.png)

虽然程序对底层数组进行了空间重分配， 但数组原有的三个元素 `1` 、 `2` 、 `3` 仍然是 `int16_t` 类型， 这些元素还保存在数组的前 `48` 位里面， 所以程序接下来要做的就是将这三个元素转换成 `int32_t` 类型， 并将转换后的元素放置到正确的位上面， 而且在放置元素的过程中， 需要维持底层数组的有序性质不变。

首先， 因为元素 `3` 在 `1` 、 `2` 、 `3` 、 `65535` 四个元素中排名第三， 所以它将被移动到 `contents` 数组的索引 `2` 位置上， 也即是数组 `64` 位至 `95` 位的空间内， 如图 6-6 所示。

![](/redis/redis-intset升级4.png)

接着， 因为元素 `2` 在 `1` 、 `2` 、 `3` 、 `65535` 四个元素中排名第二， 所以它将被移动到 `contents` 数组的索引 `1` 位置上， 也即是数组的 `32` 位至 `63` 位的空间内， 如图 6-7 所示。

![](/redis/redis-intset升级5.png)

之后， 因为元素 `1` 在 `1` 、 `2` 、 `3` 、 `65535` 四个元素中排名第一， 所以它将被移动到 `contents` 数组的索引 `0` 位置上， 也即是数组的 `0` 位至 `31` 位的空间内， 如图 6-8 所示。

![](/redis/redis-intset升级6.png)

然后， 因为元素 `65535` 在 `1` 、 `2` 、 `3` 、 `65535` 四个元素中排名第四， 所以它将被添加到 `contents` 数组的索引 `3` 位置上， 也即是数组的 `96` 位至 `127` 位的空间内， 如图 6-9 所示。

![](/redis/redis-intset升级7.png)

最后， 程序将整数集合 `encoding` 属性的值从 `INTSET_ENC_INT16` 改为 `INTSET_ENC_INT32` ， 并将 `length` 属性的值从 `3` 改为 `4` ， 设置完成之后的整数集合如图 6-10 所示。

![](/redis/redis-intset升级8.png)

因为每次向整数集合添加新元素都可能会引起升级， 而每次升级都需要对底层数组中已有的所有元素进行类型转换， 所以向整数集合添加新元素的时间复杂度为 `O(N)`。

其他类型的升级操作， 比如从 `INTSET_ENC_INT16` 编码升级为 `INTSET_ENC_INT64` 编码， 或者从 `INTSET_ENC_INT32` 编码升级为 `INTSET_ENC_INT64` 编码， 升级的过程都和上面展示的升级过程类似。

**升级能极大地节省内存。**

#### 降级

整数集合不支持降级操作，一旦对数组进行了升级，编码就会一直保持升级后的状态。

## **压缩列表 `ziplist`** 

压缩列表 `ziplist` 是 `Redis` 为了节省内存而开发的，是由一系列特殊编码的连续内存块组成的顺序型数据结构，一个压缩列表可以包含任意多个节点 `entry`，每个节点可以保存一个字节数组或者一个整数值。

**压缩列表的原理：压缩列表并不是对数据利用某种算法进行压缩，而是将数据按照一定规则编码在一块连续的内存区域，目的是节省内存。**

### **压缩列表**结构定义

![](/redis/redis-ziplist压缩列表结构.png)

| 属性      | 类型       | 长度     | 用途                                                         |
| :-------- | :--------- | :------- | :----------------------------------------------------------- |
| `zlbytes` | `uint32_t` | `4` 字节 | 记录整个压缩列表占用的内存字节数：在对压缩列表进行内存重分配， 或者计算 `zlend` 的位置时使用。 |
| `zltail`  | `uint32_t` | `4` 字节 | 记录压缩列表表尾节点距离压缩列表的起始地址有多少字节： 通过这个偏移量，程序无须遍历整个压缩列表就可以确定表尾节点的地址。 |
| `zllen`   | `uint16_t` | `2` 字节 | 记录了压缩列表包含的节点数量： 当这个属性的值小于 `UINT16_MAX` （`65535`）时， 这个属性的值就是压缩列表包含节点的数量； 当这个值等于 `UINT16_MAX` 时， 节点的真实数量需要遍历整个压缩列表才能计算得出。 |
| `entryX`  | 列表节点   | 不定     | 压缩列表包含的各个节点，节点的长度由节点保存的内容决定。     |
| `zlend`   | `uint8_t`  | `1` 字节 | 特殊值 `0xFF` （十进制 `255` ），用于标记压缩列表的末端。    |

压缩列表示例：

- 列表 `zlbytes` 属性的值为 `0x50` （十进制 `80`）， 表示压缩列表的总长为 `80` 字节。

- 列表 `zltail` 属性的值为 `0x3c` （十进制 `60`）， 这表示如果我们有一个指向压缩列表起始地址的指针 `p` ， 那么只要用指针 `p` 加上偏移量 `60` ， 就可以计算出表尾节点 `entry3` 的地址。

- 列表 `zllen` 属性的值为 `0x3` （十进制 `3`）， 表示压缩列表包含三个节点。

  ![](/redis/redis-ziplist压缩列表示例.png)

压缩列表的每个节点构成如下：

![](/redis/redis-ziplist压缩列表节点结构.png)

**`previous_entry_ength`**：节点的 `previous_entry_length` 属性以字节为单位，记录压缩列表前一个字节的长度。

`previous_entry_ength` 的长度可能是 1 个字节或者是 5 个字节：

- 如果上一个节点的长度小于 254，则该节点只需要一个字节就可以表示前一个节点的长度了，
- 如果前一个节点的长度大于等于 254，则 `previous length` 的第一个字节为 254，后面用四个字节表示当前节点前一个节点的长度。

利用此原理即当前节点位置减去上一个节点的长度即得到上一个节点的起始位置，压缩列表可以从尾部向头部遍历。这么做很有效地减少了内存的浪费。

如果我们有一个指向当前节点起始地址的指针 `c` ， 那么我们只要用指针 `c` 减去当前节点 `previous_entry_length` 属性的值， 就可以得出一个指向前一个节点起始地址的指针 `p`

![](/redis/redis-ziplist压缩列表图4.png)

**`encoding`：**节点的 `encoding` 属性记录了节点的 `content` 属性所保存数据的类型以及长度

- 一字节、两字节或者五字节长， 值的最高位为 `00` 、 `01` 或者 `10` 的是**字节数组编码**： 这种编码表示节点的 `content` 属性保存着字节数组， 数组的长度由编码除去最高两位之后的其他位记录；
- 一字节长， 值的最高位以 `11` 开头的是**整数编码**： 这种编码表示节点的 `content` 属性保存着整数值， 整数值的类型和长度由编码除去最高两位之后的其他位记录；

**`content`：**节点的 `content` 属性负责保存节点的值， 节点值可以是一个字节数组或者整数， 值的类型和长度由节点的 `encoding` 属性决定。

## 总结

大多数情况下，`Redis` 使用简单字符串 `SDS` 作为字符串的表示，相对于 `C` 语言字符串，`SDS` 具有常数复杂度获取字符串长度，杜绝了缓存区的溢出，减少了修改字符串长度时所需的内存重分配次数，以及二进制安全能存储各种类型的文件，并且还兼容部分 `C` 函数。

通过为链表设置不同类型的特定函数，`Redis` 链表可以保存各种不同类型的值，**除了用作列表键，还在发布与订阅、慢查询、监视器等方面发挥作用。**

`Redis` 的字典底层使用哈希表实现，每个字典通常有两个哈希表，一个平时使用，另一个用于 `rehash` 时使用，使用链地址法解决哈希冲突。

跳跃表通常是有序集合的底层实现之一，表中的节点按照分值大小进行排序。

整数集合是集合键的底层实现之一，底层由数组构成，升级特性能尽可能的节省内存。

压缩列表是 `Redis` 为节省内存而开发的顺序型数据结构，通常作为列表键和哈希键的底层实现之一。