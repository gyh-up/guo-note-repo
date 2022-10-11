## `redis `介绍

**`redis`是一个`key-value`存储系统**。它支持存储的`value`类型相对更多，包括**`string`(字符串)、`list`(链表)、`set`(集合)、`zset`(`sorted set` -- 有序集合)和 `hash`（哈希类型）**。这些数据类型都支持`push/pop`、 `add/remove`及取交集并集和差集及更丰富的操作，而且这些操作都是原子性的。在此基础上，`redis`支持各种不同方式的排序。**为了保证效率，数据都是缓存在内存中 。**

书籍参考：《`Redis` 设计与实现》http://redisbook.com/index.html#

## 为什么会出现`redis`

对于网页来说数据来自于数据库，而数据库实际上是存在这性能的瓶颈（一般单表早期的瓶颈就在`2000w`了--[索引的优化效率瓶颈]）

即使是做了主从以及集群架构也依然还是会有速率的问题，因此这个时候以内存暂时存储数据的想法就横空出世了。

## **`redis`的特性**

- 速度快 

正常情况下，`Redis`执行命令的速度非常快，官方给出的数字是**读写性能可以达到10万/秒（读11万次/秒，写8万次/秒）**，当然这也取决于机器的性能，但这里先不讨论机器性能上的差异，只分析一下是什么造就了`Redis`除此之快的速度，可以大致归纳为以下四点：

1. `Redis`的**所有数据都是存放在内存中的**，所以把**数据放在内存中是`Redis`速度快**的最主要原因。 
2. `Redis`是用**`C`语言实现的，一般来说`C`语言实现的程序“距离”操作系统更近，执行速度相对会更快**，无需像`php`要先解析成`opcode`再编译成`machine code`。 
3. **`Redis`使用了单线程架构，预防了多线程可能产生的竞争问题**。 
4. 作者对于`Redis`源代码可以说是精打细磨，曾经有人评价`Redis`是少有的集性能和优雅于一身的开源代码。 

- 基于`key-value `

几乎所有的编程语言都提供了类似字典的功能，例如`Java`里的`map`、`Python`里的`dict`，类似于这种组织数据的方式叫作基于键值的方式，与很多键值对数据库不同的是，`Redis` 中的值不仅可以是字符串，而且还可以是具体的数据结构，这样不仅能便于在许多应用场景的开发，同时也能够提高开发效率。

`Redis` 的全称是`REmote Dictionary Server`，它主要提供了5种数据结构：字符串、哈希、列表、集合、有序集合，同时在字符串的基础之上演变出了位图( `Bitmaps`)和`HyperLogLog`两种神奇的“数据结构”，并且随着`LBS` ( `Location BasedService`，基于位置服务)的不断发展，`Redis 3.2`版本中加人有关`GEO` (地理信息定位)的功能，总之在这些数据结构的帮助下，开发者可以开发出各种“有意思”的应用。 

- 丰富的功能 


除了5种数据结构，`Redis`还提供了许多额外的功能: 

1. 提供了键过期功能，可以用来实现缓存。 
2. 供了发布订阅功能，可以用来实现消息系统。 
3. 支持`Lua`脚本功能，可以利用`Lua`创造出新的`Redis`命令。 
4. 提供了简单的事务功能，能在一定程度 上保证事务特性。 
5. 提供了流水线( `Pipeline`)功能，这样客户端能将-批命令-一次性传到`Redis`，减少网络的开销。 

## 数据类型介绍

### `string`类型

`string`类型是`redis`的最基础的数据结构，也是最经常使用到的类型。**而且其他的四种类型多多少少都是在字符串类型的基础上构建的，所以`String`类型是`redis`的基础**。 

**string 类型的值最大能存储 `512MB`**，这里的`string`类型可以是简单字符串、复杂的`xml/json`的字符串、二进制图像或者音频的字符串、以及可以是数字的字符串。 

> 常用命令

| **命令** | **描述**                                                     | **用法**                                              |
| -------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| SET      | （1）将字符串值Value关联到Key（2）Key已关联则覆盖，无视类型（3）原本Key带有生存时间TTL，那么TTL被清除 | SET key value [EX seconds] [PX milliseconds] [NX\|XX] |
| GET      | （1）返回key关联的字符串值（2）Key不存在返回nil（3）Key存储的不是字符串，返回错误，因为GET只用于处理字符串 | GET key                                               |
| MSET     | （1）同时设置一个或多个Key-Value键值对（2）某个给定Key已经存在，那么MSET新值会覆盖旧值（3）如果上面的覆盖不是希望的，那么使用MSETNX命令，所有Key都不存在才会进行覆盖（4）**MSET是一个原子性操作**，所有Key都会在同一时间被设置，不会存在有些更新有些没更新的情况 | MSET key value [key value ...]                        |
| MGET     | （1）返回一个或多个给定Key对应的Value（2）某个Key不存在那么这个Key返回nil | MGET key [key ...]                                    |
| SETEX    | （1）将Value关联到Key（2）设置Key生存时间为seconds，单位为秒（3）如果Key对应的Value已经存在，则覆盖旧值（4）SET也可以设置失效时间，但是不同在于SETNX是一个原子操作，即关联值与设置生存时间同一时间完成 | SETEX key seconds value                               |
| SETNX    | （1）将Key的值设置为Value，当且仅当Key不存在（2）若给定的Key已经存在，SEXNX不做任何动作 | SETNX key value                                       |

PS：

　　①、上面的 ttl 命令是返回 key 的剩余过期时间，单位为秒。

　　②、mset和mget这种批量处理命令，能够极大的提高操作效率。因为一次命令执行所需要的时间=1次网络传输时间+1次命令执行时间，n个命令耗时=n次网络传输时间+n次命令执行时间，而批量处理命令会将n次网络时间缩减为1次网络时间，也就是1次网络传输时间+n次命令处理时间。

　　但是需要注意的是，Redis是单线程的，如果一次批量处理命令过多，会造成Redis阻塞或网络拥塞（传输数据量大）。

　　③、setnx可以用于实现分布式锁，具体实现方式后面会介绍。

　　上面是 string 类型的基本命令，下面介绍几个自增自减操作，这在实际工作中还是特别有用的（分布式环境中统计系统的在线人数，利用Redis的高性能读写，在Redis中完成秒杀，而不是直接操作数据库）。

| **命令** | **描述**                                                     | **用法**             |
| -------- | ------------------------------------------------------------ | -------------------- |
| INCR     | （1）Key中存储的数字值+1，返回增加之后的值（2）Key不存在，那么Key的值被初始化为0再执行INCR（3）如果值包含错误类型或者字符串不能被表示为数字，那么返回错误（4）值限制在64位有符号数字表示之内，即-9223372036854775808~9223372036854775807 | INCR key             |
| DECR     | （1）Key中存储的数字值-1（2）其余同INCR                      | DECR key             |
| INCRBY   | （1）将key所存储的值加上增量返回增加之后的值（2）其余同INCR  | INCRBY key increment |
| DECRBY   | （1）将key所存储的值减去减量decrement（2）其余同INCR         | DECRBY key decrement |

更多`string`命令参考这里：https://www.runoob.com/redis/redis-strings.html

> string数据类型的应用 

- session共享 

一个分布式web服务将用户的Session信息(比如：登录信息)记录到各自服务器中，这样会出现一个问题，在负载均衡的情况下，服务器会将用户的访问均衡到不同的服务器上，用户刷新一次访问可能就会发现需要重新登录，这个问题对于用户体验来说是无法容忍的。 

为了解决这个问题我们会是使用Redis将用户的Session进行集中管理，这样就只需要保证redis的高可用以及扩展性，每次用户的登录或者查询登录都从Redis中获取Session信息。 

- setnx分布式锁

string类型的setnx的作用是“当key不存在时，设值并返回1，当key已经存在时，不设值并返回0”，“判断key是否存在”和“设值”两个操作是原子性地执行的，因此可以用string类型作为分布式锁，返回1表示获得锁，返回0表示没有获得锁。

​	例如，为了保证定时任务的高可用，往往会同时部署多个具备相同定时任务的服务，但是业务上只希望其中的某一台服务执行定时任务，当定时任务的时间点触发时，多个服务同时竞争一个分布式锁，获取到锁的执行定时任务，没获取到的放弃执行定时任务。定时任务执行完时通过del命令删除key即释放锁，如果担心del命令操作失败而导致锁一直未释放，可以通过expire命令给锁设置一个合理的自动过期时间，确保即使del命令失败，锁也能被释放。不过expire命令同样存在失败的可能性，如果你用的是Java语言，建议使用JedisCommands接口提供的String set(String key， String value， String nxxx， String expx， long time)方法，这个方法可以将setnx和expire原子性地执行，具体使用方式如下（相信其它语言的Redis客户端也应当提供了类似的方法）。

- 计数器 

​	decr 和incr 命令

- Redis限速 

​	在一些项目中为了保证安全会要求用户在登录的时候输入手机号进行验证码验证，但是为了保证短信接口不被频繁访问，会进行一定的限制。 

```php
<?php 
    $Redis = new Redis("192.168.29.108", 6379);
    $Redis->auth("root");
    $phonename = "176xxxx0888";
    $id = 1;
    $key = "user:$id:info:" . $phonename;
    $restful = $Redis->exists($key);
    if ($restful != null || $Redis->incr($key) <= 5) {
        return "OK";
    } else {
        echo "1分钟不能请求5次";
    }
?> 
```

上面的代码就是使用Redis实现了限速的功能，例如一些网站限制一个IP地址不能在1秒内访问超过n次也可以使用类似的思路。 

## `list`类型

list类型是用来存储多个有序的字符串的，列表当中的每一个字符看做一个元素，一个列表当中可以存储有一个或者多个元素，**redis的list支持存储 $ 2^{32}-1$个元素**。

redis可以从列表的**两端进行插入（pubsh）和 弹出（pop）元素，支持读取指定范围的元素集，或者读取指定下标的元素等操作。**redis列表是一种比较灵活的链表数据结构，它可以充当队列或者栈的角色。

redis列表是链表型的数据结构，所以它的元素是有序的，而且列表内的元素是可以重复的。意味着它可以根据链表的下标获取指定的元素和某个范围内的元素集。

### 常用命令 

| **命令**  | **描述**                                                     | **用法**                              |
| --------- | ------------------------------------------------------------ | ------------------------------------- |
| LPUSH     | （1）将一个或多个值value插入到列表key的表头（2）如果有多个value值，那么各个value值按从左到右的顺序依次插入表头<br />（3）key不存在，一个空列表会被创建并执行LPUSH操作（4）key存在但不是列表类型，返回错误 | LPUSH key value [value ...]           |
| LPUSHX    | （1）将值value插入到列表key的表头，当且晋档key存在且为一个列表（2）key不存在时，LPUSHX命令什么都不做 | LPUSHX key value                      |
| LPOP      | （1）移除并返回列表key的头元素                               | LPOP key                              |
| LRANGE    | （1）返回列表key中指定区间内的元素，区间以偏移量start和stop指定（2）start和stop都以0位底（3）可使用负数下标，-1表示列表最后一个元素，-2表示列表倒数第二个元素，以此类推（4）start大于列表最大下标，返回空列表（5）stop大于列表最大下标，stop=列表最大下标 | LRANGE key start stop                 |
| LREM      | （1）根据count的值，移除列表中与value相等的元素（2）count>0表示从头到尾搜索，移除与value相等的元素，数量为count（3）count<0表示从从尾到头搜索，移除与value相等的元素，数量为count（4）count=0表示移除表中所有与value相等的元素 | LREM key count value                  |
| LSET      | （1）将列表key下标为index的元素值设为value（2）index参数超出范围，或对一个空列表进行LSET时，返回错误 | LSET key index value                  |
| LINDEX    | （1）返回列表key中，下标为index的元素                        | LINDEX key index                      |
| LINSERT   | （1）将值value插入列表key中，位于pivot前面或者后面（2）pivot不存在于列表key时，不执行任何操作（3）key不存在，不执行任何操作 | LINSERT key BEFORE\|AFTER pivot value |
| LLEN      | （1）返回列表key的长度（2）key不存在，返回0                  | LLEN key                              |
| LTRIM     | （1）对一个列表进行修剪，让列表只返回指定区间内的元素，不存在指定区间内的都将被移除 | LTRIM key start stop                  |
| RPOP      | （1）移除并返回列表key的尾元素                               | RPOP key                              |
| RPOPLPUSH | 在一个原子时间内，执行两个动作：（1）将列表source中最后一个元素弹出并返回给客户端（2）将source弹出的元素插入到列表desination，作为destination列表的头元素 | RPOPLPUSH source destination          |
| RPUSH     | （1）将一个或多个值value插入到列表key的表尾                  | RPUSH key value [value ...]           |
| RPUSHX    | （1）将value插入到列表key的表尾，当且仅当key存在并且是一个列表（2）key不存在，RPUSHX什么都不做 | RPUSHX key value                      |

另外List还有BLPOP、BRPOP、BRPOPLPUSH三个命令没有说，它们是几个POP的阻塞版本，**即没有数据可以弹出的时候将阻塞客户端直到超时或者发现有可以弹出的元素为止**。

#### 更多string命令

可参考http://www.runoob.com/redis/redis-lists.html

### list类型应用场景

#### 队列-秒杀抢购 

list类型的lpop和rpush（或者反过来，lpush和rpop）能实现队列的功能，故而可以用Redis的list类型实现简单的点对点的消息队列。不过我不推荐在实战中这么使用，因为现在已经有Kafka、NSQ、RabbitMQ等成熟的消息队列了，它们的功能已经很完善了，除非是为了更深入地理解消息队列，不然我觉得没必要去重复造轮子。

#### 排行榜

list类型的lrange命令可以分页查看队列中的数据。可将每隔一段时间计算一次的排行榜存储在list类型中，如京东每日的手机销量排行、学校每次月考学生的成绩排名、斗鱼年终盛典主播排名等，每日计算一次，存储在list类型中，接口访问时，通过page和size分页获取打擂金曲。

但是，并不是所有的排行榜都能用list类型实现，只有定时计算的排行榜才适合使用list类型存储，与定时计算的排行榜相对应的是实时计算的排行榜，list类型不能支持实时计算的排行榜，之后在介绍有序集合sorted set的应用场景时会详细介绍实时计算的排行榜的实现。

#### 最新列表

　　list类型的lpush命令和lrange命令能实现最新列表的功能，每次通过lpush命令往列表里插入新的元素，然后通过lrange命令读取最新的元素列表，如朋友圈的点赞列表、评论列表。

　　但是，并不是所有的最新列表都能用list类型实现，因为对于频繁更新的列表，list类型的分页可能导致列表元素重复或漏掉，举个例子，当前列表里由表头到表尾依次有（E，D，C，B，A）五个元素，每页获取3个元素，用户第一次获取到（E，D，C）三个元素，然后表头新增了一个元素F，列表变成了（F，E，D，C，B，A），此时用户取第二页拿到（C，B，A），元素C重复了。只有不需要分页（比如每次都只取列表的前5个元素）或者更新频率低（比如每天凌晨更新一次）的列表才适合用list类型实现。对于需要分页并且会频繁更新的列表，需用使用有序集合sorted set类型实现。另外，需要通过时间范围查找的最新列表，list类型也实现不了，也需要通过有序集合sorted set类型实现，如以成交时间范围作为条件来查询的订单列表。之后在介绍有序集合sorted set类型的应用场景时会详细介绍sorted set类型如何实现最新列表。

#### 为何排行榜和列表不用sorted set

 那么问题来了，对于排行榜和最新列表两种应用场景，list类型能做到的sorted set类型都能做到，list类型做不到的sorted set类型也能做到，那为什么还要使用list类型去实现排行榜或最新列表呢，直接用sorted set类型不是更好吗？原因是sorted set类型占用的内存容量是list类型的数倍之多（之后会在容量章节详细介绍），对于列表数量不多的情况，可以用sorted set类型来实现，比如上文中举例的打擂金曲排行榜，每天全国只有一份，两种数据类型的内存容量差距可以忽略不计，但是如果要实现某首歌曲的翻唱作品地区排行榜，数百万的歌曲，300多个地区，会产生数量庞大的榜单，或者数量更加庞大的朋友圈点赞列表，就需要慎重地考虑容量的问题了。

## hash数据类型

### hash数据类型简介

Redis hash数据结构是一个键值对（key-value）集合，它是一个 string 类型的 field 和 value 的映射表，**redis本身就是一个key-value型数据库，因此hash数据结构相当于在value中又套了一层key-value型数据**。所以redis中hash数据结构特别**适合存储关系型对象**。比如用来存储学生基本信息，或者用户信息等。

### 常用命令

| **命令** | **描述**                                                     | **用法**                                |
| -------- | ------------------------------------------------------------ | --------------------------------------- |
| HSET     | （1）将哈希表Key中的域field的值设为value（2）key不存在，一个新的Hash表被创建（3）field已经存在，旧的值被覆盖 | HSET key field value                    |
| HGET     | （1）返回哈希表key中给定域field的值                          | HGET key field                          |
| HDEL     | （1）删除哈希表key中的一个或多个指定域（2）不存在的域将被忽略 | HDEL key filed [field ...]              |
| HEXISTS  | （1）查看哈希表key中，给定域field是否存在，存在返回1，不存在返回0 | HEXISTS key field                       |
| HGETALL  | （1）返回哈希表key中，所有的域和值                           | HGETALL key                             |
| HINCRBY  | （1）为哈希表key中的域field加上增量increment（2）其余同INCR命令 | HINCRYBY key filed increment            |
| HKEYS    | （1）返回哈希表key中的所有域                                 | HKEYS key                               |
| HLEN     | （1）返回哈希表key中域的数量                                 | HLEN key                                |
| HMGET    | （1）返回哈希表key中，一个或多个给定域的值（2）如果给定的域不存在于哈希表，那么返回一个nil值 | HMGET key field [field ...]             |
| HMSET    | （1）同时将多个field-value对设置到哈希表key中（2）会覆盖哈希表中已存在的域（3）key不存在，那么一个空哈希表会被创建并执行HMSET操作 | HMSET key field value [field value ...] |
| HVALS    | （1）返回哈希表key中所有的域和值                             | HVALS key                               |

#### 更多hash命令

可参考https://www.runoob.com/redis/redis-hashes.html

### hash数据类型应用场景

##### 购物车 

购物车功能主要是通过用户点击商品添加到购物车，前端会传递商品id以及用于需要购买的数据到后端，php通过前端传递的参数进而完成购物车的添加，增加或者减少购物车购买数量，删除或者清空购物车等功能。

如果说是使用redis来做我们可以以用户id为key，商品id为field，商品数量为value，恰好构成了购物车的3个要素。

##### 存储对象 

hash类型的(key， field， value)的结构与对象的(对象id， 属性， 值)的结构相似，也可以用来存储对象。

在介绍string类型的应用场景时有所介绍，string + json也是存储对象的一种方式，那么存储对象时，到底用string + json还是用hash呢？

|        | string + json | hash     |
| ------ | ------------- | -------- |
| 效率   | 很高          | 高       |
| 容量   | 低            | 低       |
| 灵活性 | **低**        | 高       |
| 序列化 | 简单          | **复杂** |

当对象的某个属性需要频繁修改时，不适合用string+json，因为它不够灵活，每次修改都需要重新将整个对象序列化并赋值，如果使用hash类型，则可以针对某个属性单独修改，没有序列化，也不需要修改整个对象。比如，商品的价格、销量、关注数、评价数等可能经常发生变化的属性，就适合存储在hash类型里。

　　当然，不常变化的属性存储在hash类型里也没有问题，比如商品名称、商品描述、上市日期等。但是，当对象的某个属性不是基本类型或字符串时，使用hash类型就必须手动进行复杂序列化，比如，商品的标签是一个标签对象的列表，商品可领取的优惠券是一个优惠券对象的列表（如下图所示）等，即使以coupons（优惠券）作为field，value想存储优惠券对象列表也还是要使用json来序列化，这样的话序列化工作就太繁琐了，不如直接用string + json的方式存储商品信息来的简单。

**综上，一般对象用string + json存储，对象中某些频繁变化的属性抽出来用hash存储。**



## set 数据类型

### set 数据类型简介

redis 集合（set）类型和list列表类型类似，都可以用来存储多个字符串元素的集合。**但是和 list 不同的是 set 集合当中不允许重复的元素**。而且 set 集合当中元素是没有顺序的，不存在元素下标。

redis 的 set 类型是使**用哈希表构造的**，因此复杂度是O(1)，它支持集合内的增删改查，并且支持多个集合间的**交集、并集、差集**操作。可以利用这些集合操作，解决程序开发过程当中很多数据集合间的问题。

### 常用命令

| **命令**    | **描述**                                                     | **用法**                              |
| ----------- | ------------------------------------------------------------ | ------------------------------------- |
| SADD        | （1）将一个或多个member元素加入到key中，已存在在集合的member将被忽略（2）假如key不存在，则只创建一个只包含member元素做成员的集合（3）当key不是集合类型时，将返回一个错误 | SADD key number [member ...]          |
| SCARD       | （1）返回key对应的集合中的元素数量                           | SCARD key                             |
| SDIFF       | （1）返回一个集合的全部成员，该集合是第一个Key对应的集合和后面key对应的集合的差集 | SDIFF key [key ...]                   |
| SDIFFSTORE  | （1）和SDIFF类似，但结果保存到destination集合而不是简单返回结果集（2） destination如果已存在，则覆盖 | SDIFFSTORE destionation key [key ...] |
| SINTER      | （1）返回一个集合的全部成员，该集合是所有给定集合的交集（2）不存在的key被视为空集 | SINTER key [key ...]                  |
| SINTERSTORE | （1）和SINTER类似，但结果保存早destination集合而不是简单返回结果集（2）如果destination已存在，则覆盖（3）destination可以是key本身 | SINTERSTORE destination key [key ...] |
| SISMEMBER   | （1）判断member元素是否key的成员，0表示不是，1表示是         | SISMEMBER key member                  |
| SMEMBERS    | （1）返回集合key中的所有成员（2）不存在的key被视为空集       | SMEMBERS key                          |
| SMOVE       | （1）原子性地将member元素从source集合移动到destination集合（2）source集合中不包含member元素，SMOVE命令不执行任何操作，仅返回0（3）destination中已包含member元素，SMOVE命令只是简单做source集合的member元素移除 | SMOVE source desination member        |
| SPOP        | （1）移除并返回集合中的一个随机元素，如果count不指定那么随机返回一个随机元素（2）count为正数且小于集合元素数量，那么返回一个count个元素的数组且数组中的**元素各不相同**（3）count为正数且大于等于集合元素数量，那么返回整个集合（4）count为负数那么命令返回一个数组，数组中的**元素可能重复多次**，数量为count的绝对值 | SPOP key [count]                      |
| SRANDMEMBER | （1）如果count不指定，那么返回集合中的一个随机元素（2）count同上 | SRANDMEMBER key [count]               |
| SREM        | （1）移除集合key中的一个或多个member元素，不存在的member将被忽略 | SREM key member [member ...]          |
| SUNION      | （1）返回一个集合的全部成员，该集合是所有给定集合的并集（2）不存在的key被视为空集 | SUNION key [key ...]                  |
| SUNIONSTORE | （1）类似SUNION，但结果保存到destination集合而不是简单返回结果集（2）destination已存在，覆盖旧值（3）destination可以是key本身 | SUNION destination key [key ...]      |



### set数据类型应用场景

#### 社交

利用集合的交并集特性，比如在社交领域，我们可以很方便的求出多个用户的共同好友，共同感兴趣的领域等。

####  抽奖 

sRandMember、sPop 

这两个命令功能非常相似，都是从集合中返回一个元素值。**不同的是，sRandMember不会从集合中删除返回的元素，但是sPop会删除。**

这两个命令可以分别实现不同的抽奖算法。 比如，集合中有100个元素，值从数字1到数字100.我们定义抽到的是数字1的话，即表示中奖。 使用sRandMember的话，不管之前抽过多少次，下次抽中的概率都是1%。而使用sPop的话，则每次抽中的概率都不一样。第一个人抽中概率是1%，当第一个人没抽中的话，第二个人抽中概率就是1/99，以此类推。

## zset数据类型

### zset数据类型简介

redis有序集合也是集合类型的一部分，所以它保留了集合中元素不能重复的特性，但是不同的是，有序集合给每个元素多设置了一个分数，利用该分数作为排序的依据。

有序集合可以利用分数进行从小到大的排序。虽然有序集合的成员是唯一的，但是分数(score)却可以重复。

就比如在一个班中，学生的学号是唯一的，但是每科成绩却是可以一样的，redis可以利用有序集合存储学 生成绩快速做成绩排名功能。

### 常用命令

| **命令**         | **描述**                                                     | **用法**                                                  |
| ---------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| ZADD             | （1）将一个或多个member元素及其score值加入有序集key中（2）如果member已经是有序集的成员，那么更新member对应的score并重新插入member保证member在正确的位置上（3）score可以是整数值或双精度浮点数 | ZADD key score member [[score member] [score member] ...] |
| ZCARD            | （1）返回有序集key的元素个数                                 | ZCARD key                                                 |
| ZCOUNT           | （1） 返回有序集key中，score值>=min且<=max的成员的数量       | ZCOUNT key min max                                        |
| ZRANGE           | （1）返回有序集key中指定区间内的成员，成员位置按score从小到大排序（2）具有相同score值的成员按字典序排列（3）需要成员按score从大到小排列，使用ZREVRANGE命令（4）下标参数start和stop都以0为底，也可以用负数，-1表示最后一个成员，-2表示倒数第二个成员（5）可通过WITHSCORES选项让成员和它的score值一并返回 | ZRANGE key start stop [WITHSCORES]                        |
| ZRANK            | （1）返回有序集key中成员member的排名，有序集成员按score值从小到大排列（2）排名以0为底，即score最小的成员排名为0（3）ZREVRANK命令可将成员按score值从大到小排名 | ZRANK key number                                          |
| ZREM             | （1）移除有序集key中的一个或多个成员，不存在的成员将被忽略（2）当key存在但不是有序集时，返回错误 | ZREM key member [member ...]                              |
| ZREMRANGEBYRANK  | （1）移除有序集key中指定排名区间内的所有成员                 | ZREMRANGEBYRANK key start stop                            |
| ZREMRANGEBYSCORE | （1）移除有序集key中，所有score值>=min且<=max之间的成员      | ZREMRANGEBYSCORE key min max                              |

### zset数据类型应用场景

#### 排行榜 

有序集合经典使用场景。例如视频网站需要对用户上传的视频做排行榜，榜单维护可能是多方面：按照时间、按照播放量、按照获得的赞数等。

## geo数据类型

#### geo数据类型简介

**GEO**功能在Redis3.2版本提供，支持存储地理位置信息用来实现诸如附近位置、摇一摇这类依赖于地理位置信息的功能。

#### 常用命令

| 命令              | 描述                                                         | 用法                                                         |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| geoadd            | 添加地理位置的坐标，可以将一个或多个经度(longitude)、纬度(latitude)、位置名称(member)添加到指定的 key 中 | GEOADD key longitude latitude member [longitude latitude member ...] |
| geopos            | 从给定的 key 里返回所有指定名称(member)的位置（经度和纬度），不存在的返回 nil | GEOPOS key member [member ...]                               |
| geodist           | 计算两个位置之间的距离                                       | GEODIST key member1 member2 [m\|km\|ft\|mi]                  |
| georadius         | 根据用户给定的经纬度坐标来获取指定范围内的地理位置集合       | GEORADIUS key longitude latitude radius m\|km\|ft\|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC\|DESC] [STORE key] [STOREDIST key] |
| georadiusbymember | 根据储存在位置集合里面的某个地点获取指定范围内的地理位置集合 | GEORADIUSBYMEMBER key member radius m\|km\|ft\|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC\|DESC] [STORE key] [STOREDIST key] |
| geohash           | 返回一个或多个位置对象的 geohash 值                          | GEOHASH key member [member ...]                              |
| zrem              | GEO没有提供删除成员的命令，但是因为GEO的底层实现是zset，所以可以借用zrem命令实现对地理位置信息的删除 | zrem key member                                              |

单位参数说明：

1. m ：米（默认单位）
2. km ：千米
3. mi ：英里
4. ft ：英尺
5. WITHDIST: 在返回位置元素的同时， 将位置元素与中心之间的距离也一并返回 
6. WITHCOORD: 将位置元素的经度和维度也一并返回
7. WITHHASH: 以 52 位有符号整数的形式， 返回位置元素经过原始 geohash 编码的有序集合分值。 这个选项主要用于底层应用或者调试， 实际中的作用并不大
8. COUNT 限定返回的记录数
9. ASC: 查找结果根据距离从近到远排序
10. DESC: 查找结果根据从远到近排序

#### geo数据类型应用场景

## hyperloglog数据类型

#### hyperloglog数据类型简介

Redis HyperLogLog 是用来**做基数统计的算法**，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。

在 Redis 里面，每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个**不同元素的基数**。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。

但是，因为 HyperLogLog 只会根据输入元素来计算基数，**而不会储存输入元素本身**，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。

比如数据集 {1， 3， 5， 7， 5， 7， 8}， 那么这个数据集的基数集为 {1， 3， 5 ，7， 8}， 基数(不重复元素)为5。 基数估计就是在误差可接受的范围内，快速计算基数。

#### 常用命令

| 命令    | 描述                                      | 用法                                       |
| ------- | ----------------------------------------- | ------------------------------------------ |
| pfadd   | 添加指定元素到 HyperLogLog 中             | PFADD key element [element ...\]           |
| pfcount | 返回给定 HyperLogLog 的基数估算值         | PFCOUNT key [key ...\]                     |
| pfmerge | 将多个 HyperLogLog 合并为一个 HyperLogLog | PFMERGE destkey sourcekey [sourcekey ...\] |

注意，它使用的是概率算法，通过存储元素的hash值的第一个1的位置，来计算元素数量，这样做存在误差，不适合绝对准确计数的场景。redis中实现的HyperLogLog，只需要12K内存，在标准误差0.81%的前提下，能够统计2的64次方个数据。

#### hyperloglog数据类型应用场景

##### 统计uv

###### 对比string

其实要是单纯的统计pv是比较好办的，直接用redis的incr就行，但是uv的话，它要去重，同一个用户一天之内的多次访问请求只能计数一次。这就要求每一个网页请求都需要带上用户的 ID，无论是登陆用户还是未登陆用户都需要一个唯一 ID 来标识。

###### 对比set

比较容易想到的是为每一个页面一个独立的 set 集合来存储所有当天访问过此页面的用户 ID。当一个请求过来时，我们使用 sadd 将用户 ID 塞进去就可以了。通过 scard 可以取出这个集合的大小，这个数字就是这个页面的 UV 数据。没错，这是一个非常简单的方案。

但是，如果你的页面访问量非常大，比如一个爆款页面几千万的 UV，你需要一个很大的 set 集合来统计，这就非常浪费空间。如果这样的页面很多，那所需要的存储空间是惊人的。

###### 对比hash

hash和set在处理uv的问题上其实类似，把用户id作为hash的key的确可以去重，但是如果访问量大了之后也会消耗很大的内存空间

###### 对比bitmap

bitmap同样是一种可以统计基数的方法，可以理解为用bit数组存储元素，例如01101001，表示的是[1，2，4，8]，bitmap中1的个数就是基数。bitmap也可以轻松合并多个集合，只需要将多个数组进行异或操作就可以了。bitmap相比于Set，Hash也大大节省了内存，我们来粗略计算一下，统计1亿个数据的基数，需要的内存是：100000000/8/1024/1024 ≈ 12M。

虽然bitmap在节省空间方面已经有了不错的表现，但是如果需要统计1000个对象，就需要大约12G的内存，显然这个结果仍然不能令我们满意。在这种情况下，HyperLogLog将会出来拯救我们。

###### 使用HyperLogLog

使用pfadd和pfcount来实现，pfadd 用法和 set 集合的 sadd 是一样的，来一个用户 ID，就将用户 ID 塞进去就是。pfcount 和 scard 用法是一样的，直接获取计数值。关键是它非常省空间，载统计海量uv的时候，只占用了12k的空间

## bitmap数据类型

### bitmap数据类型简介

Redis从2.2.0版本开始新增了`setbit`，`getbit`，`bitcount`等几个bitmap相关命令。虽然是新命令，但是并没有新增新的数据类型，因为`setbit`等命令只不过是在`set`上的扩展。这里把它当作一种数据类型来写。

**在一台2010MacBook Pro上，offset为 $2^{32}-1$​（分配512MB）需要～300ms，offset为 $2^{30}-1$​(分配128MB)需要～80ms，offset为 $2^{28}-1$​（分配32MB）需要～30ms，offset为 $2^{26}-1$​​（分配8MB）需要8ms。<来自官方文档>**

通过一个bit位来表示某个元素对应的值或者状态，其中的key就是对应元素本身。我们知道8个bit可以组成一个Byte，所以bitmap本身会极大的节省储存空间。同string类型，bitmap最大存储512M，即约43亿的位，不过建议每个键值的位数都控制下，因为读取时候时间复杂度O(n)，越大的串读的时间花销越多。

```
512 M = 512*1024 KB = 524288 KB = 524288*1024 B = 536870912*8 bit = 4294967296 bit
```

优点：

1. 基于最小的单位bit进行存储，所以非常省空间。
2. 设置时候时间复杂度O(1)、读取时候时间复杂度O(n)，操作是非常快的。
3. 二进制数据的存储，进行相关计算的时候非常快。
4. 方便扩容

### 常用命令

| 命令     | 描述                                                         | 用法                              |
| -------- | ------------------------------------------------------------ | --------------------------------- |
| getbit   | 对key所存储的字符串值，获取指定偏移量上的位（bit）           | getbit key offset                 |
| setbit   | 对key所存储的字符串值，设置或清除指定偏移量上的位（bit）<br />（1）返回值为该位在setbit之前的值<br/>（2）value只能取0或1<br/>（3）offset从0开始，即使原位图只能10位，offset可以取1000 | setbit key offset value           |
| bitcount | 获取位图指定范围中位值为1的个数，如果不指定start与end，则取所有 | bitcount key [start end]          |
| bitop    | 做多个BitMap的and（交集）、or（并集）、not（非）、xor（异或）操作并将结果保存在destKey中 | bitop op destKey key1 [key2...]   |
| bitpos   | 计算位图指定范围第一个偏移量对应的的值等于targetBit的位置（1）找不到返回-1（2）start与end没有设置，则取全部（3）targetBit只能取0或者1 | bitpos key tartgetBit [start end] |

### setbit数据类型应用场景

##### 用户在线状态

使用bitmap是一个节约空间效率又高的一种方法，只需要一个key，然后用户id为偏移量offset，如果在线就设置为1，不在线就设置为0，3亿用户只需要36MB的空间。

```
$status = 1;
$redis->setBit('online',$uid,$status);
$redis->getBit('online',$uid);
```

#### 统计用户活跃情况

使用时间作为缓存的key，然后用户id为offset，如果当日活跃过就设置为1。之后通过bitOp进行二进制计算算出在某段时间内用户的活跃情况。

```
$status = 1;
$redis->setBit('active_20170708', $uid, $status);
$redis->setBit('active_20170709', $uid, $status);

$redis->bitOp('AND', 'active', 'active_20170708', 'active_2017070'); 
```

#### 用户签到

使用redis的bitmap，由于是长尾的记录，所以key主要由uid组成，设定一个初始时间，往后没加一天即对应value中的offset的位置。

```
$start_date = '20170708';
$end_date = '20170709';
$offset = floor((strtotime($start_date) - strtotime($end_date)) / 86400);
$redis->setBit('sign_123456', $offset, 1);
//算活跃天数
$redis->bitCount('sign_123456', 0, -1)
```

无需分片，一年365天，3亿用户约占300000000*365/8/1000/1000/1000=13.68g。存储成本是不是很低。

#### 布隆过滤器

解决缓存穿透的方法之一就是设置布隆过滤器，而布隆过滤器的原理就是一个hashtable，对键值进行多个hash_fun，然后根据得出的值，在对应的位置上的设置值为1。实际上也可以用bitmap来记录位置的值。

#### 权限设置

#### 使用bitmap过程中可能会遇到的坑

##### bitcout的陷阱

如果你有仔细看前文的用法，会发现有这么一个备注“返回一个指定key中位的值为1的个数(是以byte为单位不是bit)”，这就是坑的所在。

有图有真相：

![这里写图片描述](C:/Users/Administrator/Desktop/learn/PDF/public/images/redis-bitcount的陷阱.png)

所以bitcount 0 0 那么就应该是第一个字节中1的数量的，注意是字节，第一个字节也就是1，2，3，4，5，6，7，8这八个位置上。