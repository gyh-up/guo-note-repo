# redis慢查询和管道

## Redis慢查询

许多存储系统（例如 `MySQL`）提供慢查询日志帮助开发和运维人员定位系统存在的慢操作。

所谓慢查询日志就是系统在命令执行前后计算每条命令的执行时间，当超过预设阈值，就将这条命令的相关信息（例如：发生时间、耗时、命令的详细信息）记录下来，`Redis` 也提供了类似的功能。

> `redis` 命令的执行过程慢查询日志的参数：

`slowlog-log-slower-than`：指定执行时间超过多少微秒( `1` 秒等于 `1000000` 微秒) 的命令请求会被记录到日志上 

举个例子，如果这个选项值为 `100`，那么执行时间超过 `100` 微秒的命令就会被记录到慢查询日志；如果这个选项值为 `500`，那么执行时间超过 `500` 微秒的命令就会被记录到慢查询日志

`slowlog-max-len`：指定服务器最多保存多少条慢查询操作，服务器先进先出的方式保存多条慢查询日志，当服务器存储的慢查询数量等于 `slowlog-log-len` 选项值时，服务器在添加一条新的慢查询日志之前，会先将对旧的一条慢日志先删除

> 实际现象如下：
>

先使用 `config set` 命令将 `slow-log-slower-than` 参数的设置为 `0` 微秒，这样 `redis` 服务器执行的任何命令都会记录到慢查询日志中。

接着把 `slowlog-max-len` 参数的值设置的 `5`，让服务器最多只保存 `5` 条慢查询记录

慢查询日志的保存 

服务器状态中包含了几个慢查询日志功能有关的属性：

```c
struct redisServer { 
    //... 
    //下一个慢查询日志的ID 
    long long slowlog_entry_id; 
    //保存了所有查询日志的链表 
    list *slowlog; 
    //服务器配置slowlog-log-slower-than选项的值 
    long long slowlog_log_slower_than; 
    //服务器配置slowlog-max-len的值 
    unsigned long slowlog_max_len; 
    //... 
} 
```

`slowlog_entry_id` 属性的初始值为 `0`，每当创建一天新的慢查询日志时，这个属性值就会作用到新日志的 `id` 值，之后程序会对这个属性的值增一。

## pipeline（管道）

我们知道 `redis` 的客户端和服务器之间是通过 `TCP` 协议连接的，不论是客户端向 `redis` 发送命令还是客户端接收 `redis` 的执行结果，都需要网络通信，都需要一定时间，由于网络性能的不同往返时间也不同，大致的来说这个时间相当于 `redis` 处理一条简单命令（比如插入一个值到链表）的时间。如果我们执行较多的命令，一来一回，这个往返时间累加起来还是对性能有一定影响的。

由于 `redis` 是单线程，所以在执行多个命令时，都需要等待上一条命令执行完，才能执行下一条命令。因此，`redis` 底层通信协议提供了对管道技术的支持。**通过管道可以一次性发送多条命令并在执行完后一次性将结果返回，当一组命令中每条命令都不依赖于之前命令的执行结果时就可以将这组命令一起通过管道发出。管道通过减少客户端与 `Redis` 的通信次数来实现降低往返时延累计值的目的**



```php
//不使用管道
<?php 
    $stime=microtime(true); //获取程序开始执行的时间
    echo '开始内存：'.memory_get_usage(), ''; echo PHP_EOL; 
    $redis = new \Redis(); 
    $redis->connect('192.168.29.108',6379);
    $redis->auth("root");
    $t1 = time(); 
    for($i= 0; $i<10000 ; $i++) { 
        $redis->set("key::$i",str_pad($i,4,'0',0)); 
        $redis->get("key::$i"); 
    }
    $etime=microtime(true);//获取程序执行结束的时间 
    $total=($etime-$stime); //计算差值 
    echo "[页面执行时间：{$total} ]s"; echo PHP_EOL; 
    echo '运行后内存：'.memory_get_usage(), ''; echo PHP_EOL; 
?>


//使用管道
<?php 
    $stime=microtime(true); //获取程序开始执行的时间
    echo '开始内存：'.memory_get_usage(), ''; echo PHP_EOL; 
    $redis = new \Redis(); 
    $redis->connect('192.168.29.108',6379);
    $redis->auth("root");
    //$pipe=$redis->multi($redis::PIPELINE);//将多个操作当成一个事务执行 
    $pipe=$redis->pipeline();//（多条）执行命令简单的，更加快速的发送给服务器，但是没有任何原子性的保证
    for($i= 0; $i<10000 ; $i++) { 
        $pipe->set("key::$i",str_pad($i,4,'0',0)); 
        $pipe->get("key::$i"); 
    }
    $replies=$pipe->exec();
    $etime=microtime(true);//获取程序执行结束的时间 
    $total=($etime-$stime); //计算差值 
    echo "[页面执行时间：{$total} ]s"; echo PHP_EOL; 
    echo '运行后内存：'.memory_get_usage(), ''; echo PHP_EOL; 
?> 
```

 