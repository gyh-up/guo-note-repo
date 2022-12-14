# redis内存回收

因为 C 语言并不具备自动的内存回收功能， 所以 `Redis` 在自己的对象系统中构建了一个**引用计数**（[reference counting](http://en.wikipedia.org/wiki/Reference_counting)）技术实现的内存回收机制， 通过这一机制， 程序可以通过跟踪对象的引用计数信息， 在适当的时候自动释放对象并进行内存回收。

每个对象的引用计数信息由 `redisObject` 结构的 `refcount` 属性记录：

```c
typedef struct redisObject {
    // ...
    // 引用计数
    int refcount;
    // ...
} robj;
```

对象的引用计数信息会随着对象的使用状态而不断变化：

- 在创建一个**新对象**时， 引用计数的值会被初始化为 **1**；
- 当对象被**一个新程序使用时**， 它的引用计数值会被**增一**；
- 当对象**不再被一个程序使用时**， 它的引用计数值会被**减一**；
- 当对象的**引用计数值变为 0 时**， 对象所占用的**内存会被释放**。

下表列出了修改对象引用计数的 `API `， 这些 `API` 分别用于增加、减少、重置对象的引用计数。

| 函数            | 作用                                                         |
| :-------------- | :----------------------------------------------------------- |
| `incrRefCount`  | 将对象的引用计数值增一。                                     |
| `decrRefCount`  | 将对象的引用计数值减一， 当对象的引用计数值等于 `0` 时， 释放对象。 |
| `resetRefCount` | 将对象的引用计数值设置为 `0` ， 但并不释放对象， 这个函数通常在需要重新设置对象的引用计数值时使用。 |

对象的整个生命周期可以划分为创建对象、操作对象、释放对象三个阶段。