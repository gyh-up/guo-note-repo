---
typora-root-url: ..\..\public
---

# redis的五大数据类型实现原理

`Redis` 底层有**六种数据结构**，在 `Redis` 中，并没**有直接使用这些数据结构来实现键值对数据库，而是基于这些数据结构创建了一个对象系统**，这些对象系统也就是前面说的五大数据类型，**每一种数据类型都至少用到了一种数据结构**。

通过这五种不同类型的对象，`Redis` 可以在执行命令之前，根据对象的类型判断一个对象是否可以执行给定的命令，而且**可以针对不同的场景，为对象设置多种不同的数据结构，从而优化对象在不同场景下的使用效率。**

## 对象的类型与编码

`Redis` 使用五大数据类型来表示键和值，每次在 `Redis` 数据库中创建一个键值对时，至少会创建两个对象，一个是键对象，一个是值对象，而 `Redis` 中的每个对象都是由 `redisObject` 结构来表示：

```c
typedef struct redisObject{
    unsigned type:4;	//类型
    unsigned encoding:4;	//编码
    void *ptr;	//指向底层数据结构的指针
    int refcount;	//引用计数
    unsigned lru:22;	//记录最后一次被程序访问的时间
}robj
```

### **type 属性**

对象的 `type` 属性记录了对象的类型，这个类型就是五大数据类型

| 类型常量       | 对象的名称       |
| :------------- | :--------------- |
| `REDIS_STRING` | **字符串**对象   |
| `REDIS_LIST`   | **列表**对象     |
| `REDIS_HASH`   | **哈希**对象     |
| `REDIS_SET`    | **集合**对象     |
| `REDIS_ZSET`   | **有序集合**对象 |

对于 `Redis` 数据库保存的键值对来说， 键总是一个字符串对象， 而值则可以是字符串对象、列表对象、哈希对象、集合对象或者有序集合对象的其中一种， 因此：

- 当我们称呼一个数据库键为“字符串键”时， 我们指的是“这个数据库键所对应的值为字符串对象”；
- 当我们称呼一个键为“列表键”时， 我们指的是“这个数据库键所对应的值为列表对象”

### encoding 属性和 `*prt` 指针

对象的 `ptr` 指针指向对象的底层实现数据结构， 而这些数据结构由对象的 `encoding` 属性决定。

| 编码常量                    | 编码所对应的底层数据结构      |
| :-------------------------- | :---------------------------- |
| `REDIS_ENCODING_INT`        | `long` 类型的整数             |
| `REDIS_ENCODING_EMBSTR`     | `embstr` 编码的简单动态字符串 |
| `REDIS_ENCODING_RAW`        | 简单动态字符串                |
| `REDIS_ENCODING_HT`         | 字典                          |
| `REDIS_ENCODING_LINKEDLIST` | 双端链表                      |
| `REDIS_ENCODING_ZIPLIST`    | 压缩列表                      |
| `REDIS_ENCODING_INTSET`     | 整数集合                      |
| `REDIS_ENCODING_SKIPLIST`   | 跳跃表和字典                  |

每种类型的对象都至少使用了两种不同的编码。

| 类型           | 编码                        | 对象                                                 |
| :------------- | :-------------------------- | :--------------------------------------------------- |
| `REDIS_STRING` | `REDIS_ENCODING_INT`        | 使用整数值实现的字符串对象。                         |
| `REDIS_STRING` | `REDIS_ENCODING_EMBSTR`     | 使用 `embstr` 编码的简单动态字符串实现的字符串对象。 |
| `REDIS_STRING` | `REDIS_ENCODING_RAW`        | 使用简单动态字符串实现的字符串对象。                 |
| `REDIS_LIST`   | `REDIS_ENCODING_ZIPLIST`    | 使用压缩列表实现的列表对象。                         |
| `REDIS_LIST`   | `REDIS_ENCODING_LINKEDLIST` | 使用双端链表实现的列表对象。                         |
| `REDIS_HASH`   | `REDIS_ENCODING_ZIPLIST`    | 使用压缩列表实现的哈希对象。                         |
| `REDIS_HASH`   | `REDIS_ENCODING_HT`         | 使用字典实现的哈希对象。                             |
| `REDIS_SET`    | `REDIS_ENCODING_INTSET`     | 使用整数集合实现的集合对象。                         |
| `REDIS_SET`    | `REDIS_ENCODING_HT`         | 使用字典实现的集合对象。                             |
| `REDIS_ZSET`   | `REDIS_ENCODING_ZIPLIST`    | 使用压缩列表实现的有序集合对象。                     |
| `REDIS_ZSET`   | `REDIS_ENCODING_SKIPLIST`   | 使用跳跃表和字典实现的有序集合对象。                 |
| `REDIS_ZSET`   | `REDIS_ENCODING_HT`         | 使用跳跃表和字典实现的有序集合对象。                 |

<img src="/redis/redis数据类型映射.png" style="zoom:80%;" />

可以通过如下命令查看值对象的编码：

```
OBJECT ENCODING key
```

## **字符串对象**

字符串是 `Redis` 最基本的数据类型，不仅所有 `key` 都是字符串类型，其它几种数据类型构成的元素也是字符串。注意字符串的长度不能超过 `512M`。

### 编码

字符串对象的编码可以是 `int`，`raw` 或者 `embstr`。

1. `int` 编码：保存的是可以用 `long` 类型表示的整数值。
2. `raw` 编码：保存长度大于 ` 44` 字节的字符串（`redis3.2` 版本之前是 `39` 字节，之后是 `44` 字节）。
3. `embstr` 编码：保存长度小于 `44` 字节的字符串（`redis3.2` 版本之前是 `39` 字节，之后是 `44` 字节）。

由上可以看出，`int` 编码是用来保存整数值，`raw` 编码是用来保存长字符串，而 `embstr` 是用来保存短字符串。其实 `embstr` 编码是专门用来保存短字符串的一种优化编码。

![](/redis/redis-sds1.png)

![](/redis/redis-sds2.png)

![](/redis/redis-sds3.png)

![](/redis/redis-sds4.png)

`embstr`  与 `raw`  都使用 `redisObject` 和 `sds` 保存数据，区别在于，**`embstr` 的使用只分配一次内存空间**（因此 `redisObject` 和 `sds` 是连续的），**而 `raw` 需要分配两次内存空间**（分别为 `redisObject` 和 `sds` 分配空间）。因此与 `raw` 相比，`embstr` 的好处在于**创建时少分配一次空间，删除时少释放一次空间**，以及对象的所有数据连在一起，寻找方便。而 `embstr` 的坏处也很明显，如果字符串的长度增加需要重新分配内存时，整个 `redisObject` 和 `sds` 都需要重新分配空间，**因此 `redis` 中的 `embstr` 实现为只读。**

**`ps`：`Redis` 中对于浮点数类型也是作为字符串保存的，在需要的时候再将其转换成浮点数类型。**

### 编码的转换

当 `int` 编码保存的值不再是整数，或大小超过了 `long` 的范围时，自动转化为 `raw`。

对于 `embstr` 编码，由于 `Redis` 没有对其编写任何的修改程序（`embstr` 是只读的），在对 `embstr` 对象进行修改时，都会先转化为`raw` 再进行修改，因此，只要是修改 `embstr` 对象，修改后的对象一定是 `raw` 的，无论是否达到了 `44` 个字节。

## **列表对象**

`list` 列表，它是简单的字符串列表，按照插入顺序排序，你可以添加一个元素到列表的头部（左边）或者尾部（右边），它的底层实际上是个链表结构。

### 编码

列表对象的编码可以是 `ziplist`（压缩列表） 和 `linkedlist` （双端链表）。 

#### ziplist 压缩列表

`ziplist` 编码的列表对象使用压缩列表作为底层实现， 每个压缩列表节点（entry）保存了一个列表元素。

举个例子， 如果我们执行以下 `RPUSH` 命令， 那么服务器将创建一个列表对象作为 `numbers` 键的值：

```bash
redis> RPUSH numbers 1 "three" 5
(integer) 3
```

如果 `numbers` 键的值对象使用的是 `ziplist` 编码， 这个这个值对象将会是图 8-5 所展示的样子。

![](/redis/redis-list1.png)

#### linkedlist 双端链表

 `linkedlist` 编码的列表对象使用双端链表作为底层实现， 每个双端链表节点（node）都保存了一个字符串对象， 而每个字符串对象都保存了一个列表元素。

举个例子， 如果前面所说的 `numbers` 键创建的列表对象使用的不是 `ziplist` 编码， 而是 `linkedlist` 编码， 那么 `numbers` 键的值对象将是图 8-6 所示的样子。

![](/redis/redis-list2.png)

注意， `linkedlist` 编码的列表对象在底层的双端链表结构中包含了多个字符串对象， 这种嵌套字符串对象的行为在稍后介绍的哈希对象、集合对象和有序集合对象中都会出现， **字符串对象是 `Redis` 五种类型的对象中唯一一种会被其他四种类型对象嵌套的对象。**

为了简化字符串对象的表示， 我们在图 `8-6` 使用了一个带有 `StringObject` 字样的格子来表示一个字符串对象， 而 `StringObject` 字样下面的是字符串对象所保存的值。

比如说， 图 `8-7` 代表的就是一个包含了字符串值 `"three"` 的字符串对象， 它是 8-8 的简化表示。

![](/redis/redis-list3.png)

![](/redis/redis-list4.png)

### 编码的转换

当同时满足下面两个条件时，使用 `ziplist`（压缩列表）编码：

1. 列表保存元素个数小于 512 个
2. 每个元素长度小于 64 字节

不能满足这两个条件的时候使用 `linkedlist` 编码。

上面两个条件可以在 `redis.conf` 配置文件中的 `list-max-ziplist-value` 选项和 `list-max-ziplist-entries` 选项进行配置。

## **哈希对象**

哈希对象的键是一个字符串类型，值是一个键值对集合。

### 编码

哈希对象的编码可以是 `ziplist` 或者 `hashtable` 。

#### ziplist 压缩列表

`ziplist` 编码的哈希对象使用压缩列表作为底层实现， 每当有新的键值对要加入到哈希对象时， 程序会先将保存了键的压缩列表节点推入到压缩列表表尾， 然后再将保存了值的压缩列表节点推入到压缩列表表尾， 因此：

- 保存了同一键值对的两个节点总是紧挨在一起， 保存键的节点在前， 保存值的节点在后；
- 先添加到哈希对象中的键值对会被放在压缩列表的表头方向， 而后来添加到哈希对象中的键值对会被放在压缩列表的表尾方向。

举个例子， 如果我们执行以下 `HSET` 命令， 那么服务器将创建一个列表对象作为 `profile` 键的值：

```
redis> HSET profile name "Tom"
(integer) 1

redis> HSET profile age 25
(integer) 1

redis> HSET profile career "Programmer"
(integer) 1
```

如果 `profile` 键的值对象使用的是 `ziplist` 编码， 那么这个值对象将会是图 8-9 所示的样子， 其中对象所使用的压缩列表如图 8-10 所示。

![](/redis/redis-hash1.png)

![](/redis/redis-hash2.png)

#### hashtable 字典

`hashtable` 编码的哈希对象使用字典作为底层实现， 哈希对象中的每个键值对都使用一个字典键值对来保存：

- 字典的每个键都是一个字符串对象， 对象中保存了键值对的键；
- 字典的每个值都是一个字符串对象， 对象中保存了键值对的值。

举个例子， 如果前面 `profile` 键创建的不是 `ziplist` 编码的哈希对象， 而是 `hashtable` 编码的哈希对象， 那么这个哈希对象应该会是图 8-11 所示的样子。

![](/redis/redis-hash3.png)

`hashtable` 编码的哈希表对象底层使用字典数据结构，哈希对象中的每个键值对都使用一个字典键值对。

在前面介绍压缩列表时，我们介绍过压缩列表是 `Redis`为了节省内存而开发的，是由一系列特殊编码的连续内存块组成的顺序型数据结构，**相对于字典数据结构，压缩列表用于元素个数少、元素长度小的场景**。其优势在于集中存储，节省空间。

### 编码的转换

和上面列表对象使用 `ziplist` 编码一样，当同时满足下面两个条件时，使用 `ziplist`（压缩列表）编码：

1. 列表保存元素个数小于 512 个
2. 每个元素长度小于 64 字节

不能满足这两个条件的时候使用 `hashtable` 编码。

上面两个条件可以通过配置文件中的 `hash-max-ziplist-value` 选项和 `hash-max-ziplist-entries` 选项进行修改。

## **集合对象**

集合对象 `set` 是 `string` 类型（整数也会转换成 `string` 类型进行存储）的无序集合。注意集合和列表的区别：集合中的元素是无序的，因此不能通过索引来操作元素；集合中的元素不能有重复。

### 编码

#### intset 整数集合

`intset` 编码的集合对象使用整数集合作为底层实现， 集合对象包含的所有元素都被保存在整数集合里面。

举个例子， 以下代码将创建一个如图 8-12 所示的 `intset` 编码集合对象：

```
redis> SADD numbers 1 3 5
(integer) 3
```

![](/redis/redis-set1.png)

#### hashtable 字典

 `hashtable` 编码的集合对象使用字典作为底层实现， 字典的每个键都是一个字符串对象， 每个字符串对象包含了一个集合元素， 而字典的值则全部被设置为 `NULL` 。

举个例子， 以下代码将创建一个如图 8-13 所示的 `hashtable` 编码集合对象：

```
redis> SADD fruits "apple" "banana" "cherry"
(integer) 3
```

![](/redis/redis-set2.png)

### 编码的转换

当集合同时满足以下两个条件时，使用 `intset` 编码：

1. 集合对象中所有元素都是整数
2. 集合对象所有元素数量不超过 512

不能满足这两个条件的就使用 `hashtable` 编码。

第二个条件可以通过配置文件的 `set-max-intset-entries` 进行配置。

## **有序集合对象**

和上面的集合对象相比，有序集合对象是有序的。与列表使用索引下标作为排序依据不同，有序集合为每个元素设置一个分数（score）作为排序依据。

### 编码

有序集合的编码可以是 `ziplist` 或者 `skiplist` 。

#### ziplist 压缩列表

`ziplist` 编码的有序集合对象使用压缩列表作为底层实现， 每个集合元素使用两个紧挨在一起的压缩列表节点来保存， 第一个节点保存元素的成员（member）， 而第二个元素则保存元素的分值（score）。

压缩列表内的集合元素按分值从小到大进行排序， 分值较小的元素被放置在靠近表头的方向， 而分值较大的元素则被放置在靠近表尾的方向。

举个例子， 如果我们执行以下 `ZADD` 命令， 那么服务器将创建一个有序集合对象作为 `price` 键的值：

```
redis> ZADD price 8.5 apple 5.0 banana 6.0 cherry
(integer) 3
```

如果 `price` 键的值对象使用的是 `ziplist` 编码， 那么这个值对象将会是图 8-14 所示的样子， 而对象所使用的压缩列表则会是 8-15 所示的样子。

![](/redis/redis-zset1.png)

![](/redis/redis-zset2.png)

#### skiplist 跳跃表

`skiplist` 编码的有序集合对象使用 `zset` 结构作为底层实现， **一个 `zset` 结构同时包含一个字典和一个跳跃表：**

```c
typedef struct zset {
    zskiplist *zsl;
    dict *dict;
} zset;
```

说明：其实有序集合单独使用字典或跳跃表其中一种数据结构都可以实现，但是这里使用两种数据结构组合起来，原因是假如我们单独使用字典，虽然能以 O(1) 的时间复杂度查找成员的分值，但是因为**字典是以无序的方式来保存集合元素，所以每次进行范围操作的时候都要进行排序**；假如我们单独使用跳跃表来实现，虽然能执行范围操作，但是查找操作由 `O(1)` 的复杂度变为了 `O(logN)`。

因此 `Redis` 使用了两种数据结构来共同实现有序集合。**字典可用于查找，而跳跃表可用于执行范围操作。**

### 编码的转换

当有序集合对象同时满足以下两个条件时，对象使用 `ziplist` 编码：

1. 保存的元素数量小于 128；
2. 保存的所有元素长度都小于 64 字节。

不能满足上面两个条件的使用 `skiplist `编码。

以上两个条件也可以通过 `Redis` 配置文件 `zset-max-ziplist-entries` 选项和 `zset-max-ziplist-value` 进行修改。