# redis 内存碎片率

`Redis` 的一个很重要的性能指标 —— `mem_fragmentation_ratio`**（内存碎片率）**
`mem_fragmentation_ratio` 是通过以下的公式计算出来的

```
mem_fragmentation_ratio = used_memory_rss / used_memory
```

可以直接以下命令查看得到

```
# redis-cli -h localhost -p 6379 info
used_memory:1949752
used_memory_human:1.86M
used_memory_rss:9281536
used_memory_peak:1994224
used_memory_peak_human:1.90M
mem_fragmentation_ratio:4.76
```

可以看到内存碎片率已经达到了 `4.76`，**内存碎片率略高于 `1` 是属于正常，但超出 `1.5` 的时候就说明 `redis` 的内存管理变差了**

**内存碎片率高的原因**

分析实际环境，因为该 `redis` 主要是存储频繁更新的数据，每次更新数据之前，`redis` 会删除旧的数据，实际上，由于 `redis` 释放了内存块，**但内存分配器并没有返回内存给操作系统**，这个内存分配器是在编译时指定的，可以是 `libc`、`jemalloc` 或者 `tcmalloc`。`used_memory_rss` 会越来越大，导致 `mem_fragmentation_ratio` 越来越高

遇到变长 `key-value` 负载：存储的数据长短差异较大，频繁更新，`redis` 的每个 `k-v` 对初始化的内存大小是最适合的，当修改的 `value` 改变的并且原来内存大小不适用的时候，就需要重新分配内存。重新分配之后，就会有一部分内存 `redis` 无法正常回收，一直占用着。

`maxmemory` 限制导致key被回收删除

`redis` 写入大量数据，这些数据的 `key` 和原来的数据很多不一致，数据超过 `maxmemory` 限制后 `redis` 会通过 `key` 的回收策略将部分旧数据淘汰，而被淘汰的数据本身占用的内存却没有被 `redis` 进程释放，导致 `redis` 内存的有效数据虽然没有超过最大内存，但是整个进程的内存在一直增长。

**解决方法**

1、重启 `Redis` 服务器可以让额外产生的内存碎片失效并重新作为新内存来使用，使操作系统恢复高效的内存管理修改内存分配器。

2、`redis` 支持 `glibc’s malloc`、`jemalloc11`、`tcmalloc` 几种不同的内存分配器，每个分配器在内存分配和碎片上都有不同的实现。不建议普通管理员修改 `Redis` 默认内存分配器，因为这需要完全理解这几种内存分配器的差异，也要重新编译 `Redis`

3、`redis4.0` 以上可以使用新增指令来手动回收内存碎片，配置监控使用性能更佳。警告此功能是实验性的。然而，即使在生产中也进行了压力测试，并且由多个工程师手动测试了一段时间。

