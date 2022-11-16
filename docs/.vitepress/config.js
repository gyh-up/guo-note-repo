module.exports = {
    // --------------------- 应用配置 ---------------------
    //  标题
    title: "啊郭的博客",
    //  标题的后缀
    titleTemplate: "技术博客，知识分享，学习笔记，问题解决方案",
    //  描述
    description: "啊郭的博客",
    //  站点的 lang 属性
    lang: 'en-US',  
    //  部署站点的 base URL
    base: '/guo-notes',  
    //  当设置为 true 时，VitePress 不会因为无效链接而导致构建失败。
    ignoreDeadLinks: true,  
    //  使用 git commit 获取时间戳
    lastUpdated: true,
    lastUpdatedText: 'Updated Date',
    //  配置 Markdown 解析器选项
    markdown: {
        theme: 'material-palenight',
        //  在代码块中启用行号
        lineNumbers: true,
    },

    // --------------------- 主题配置 ---------------------
    themeConfig: {
        //  显示在导航栏中的logo文件，位于站点标题之前
        // logo: '/logo.png',
        //  自定义此项以替换导航中的默认站点标题
        siteTitle: '啊郭的博客',
        //  导航菜单项的配置
        nav: [
            {
                text: "后端技术",
                items: [
                    {
                        // text: "后端技术",
                        items: [
                            { text: "Redis", link: "/classify/redis/redis介绍" },
                        ],
                    }
                ]
            },
            {
                text: "计算机基础",
                items: [
                    {
                        items: [
                            { text: "计算机网络", link: "/classify/计算机基础/计算机网络/" },
                        ],
                    }
                ],
            },
            {
                text: "算法", link: "/classify/algorithm/"
            }
        ],
        // 外链
        socialLinks: [
            { icon: 'github', link: 'https://github.com/gyh-up?tab=repositories'},
            { icon: {svg: '<embed src="https://g.csdnimg.cn/static/logo/favicon32.ico" style="border-radius: 100%;width: 20px;height: 20px;" />'}, 
            link: 'https://blog.csdn.net/weixin_42258523?spm=1000.2115.3001.5343'},
        ],
        // 侧边栏菜单项的配置
        sidebar: {
            '/classify/redis/': [
                {
                    text: 'Redis 学习笔记',
                    collapsible: true,  //  侧边栏折叠
                    collapsed: true,    //  默认情况下，所有侧边栏都是展开的, 始页面加载时关闭
                    items: sidebar_of_redis(),
                }
            ],
            '/classify/计算机基础/计算机网络/': [
                {
                    text: '计算机网络学习笔记',
                    collapsible: true,
                    items: sidebar_of_computerNet(),
                }
            ],
            '/classify/algorithm/': [
                {
                    text: '算法题',
                    collapsible: true,
                    items: sidebar_of_algorithm_title(),
                }
            ],
        }
    }
}


function sidebar_of_redis() {
    return [
        { text: '一、介绍', link: '/classify/redis/redis介绍' },
        { text: '二、数据类型简介', link: '/classify/redis/redis数据类型简介' },
        { text: '三、底层数据结构', link: '/classify/redis/redis底层数据结构' },
        { text: '四、五大数据类型实现原理', link: '/classify/redis/redis五大数据类型实现原理' },
        { text: '五、redis内存淘汰策略', link: '/classify/redis/redis内存淘汰策略' },
        { text: '六、redis内存回收', link: '/classify/redis/redis内存回收' },
        { text: '七、redis内存碎片率', link: '/classify/redis/redis内存碎片率' },
        { text: '八、redis缓存击穿、穿透、雪崩', link: '/classify/redis/redis缓存击穿、穿透、雪崩' },
        { text: '九、redis慢查询和管道', link: '/classify/redis/redis慢查询和管道' },
        { text: '十、redis持久化', link: '/classify/redis/redis持久化' },
        { text: '十一、redis事务', link: '/classify/redis/redis事务' },
        { text: '十二、redis分布式锁', link: '/classify/redis/redis分布式锁' },
        { text: '十三、redis主从', link: '/classify/redis/redis主从' },
        { text: '十四、redis哨兵', link: '/classify/redis/redis哨兵' },
        { text: '十五、redis集群', link: '/classify/redis/redis集群' },
    ];
}

function sidebar_of_computerNet() {
    return [
        { text: '一、IO模型', link: '/classify/计算机基础/计算机网络/IO模型' },
    ];
    
}

function sidebar_of_algorithm_title() {
    return [
        { text: 'leetcode-70（爬楼梯）', link: '/classify/algorithm/title/leetcode-70' },
        { text: 'leetcode-1（两数之和）', link: '/classify/algorithm/title/leetcode-1' },
        { text: 'leetcode-88（合并两个有序数组）', link: '/classify/algorithm/title/leetcode-88' },
        { text: 'leetcode-283（移动零）', link: '/classify/algorithm/title/leetcode-283' },
        { text: 'leetcode-448（找到所有数组中消失的数字）', link: '/classify/algorithm/title/leetcode-448' },
        { text: 'leetcode-21（合并两个有序链表）', link: '/classify/algorithm/title/leetcode-21' },
        { text: 'leetcode-83（删除排序链表中的重复元素）', link: '/classify/algorithm/title/leetcode-83' },
        { text: 'leetcode-141（环形链表）', link: '/classify/algorithm/title/leetcode-141' },
        { text: 'leetcode-142（环形链表II）', link: '/classify/algorithm/title/leetcode-142' },
        { text: 'leetcode-160（相交链表）', link: '/classify/algorithm/title/leetcode-160' },
        { text: 'leetcode-206（反转链表）', link: '/classify/algorithm/title/leetcode-206' },
        { text: 'leetcode-234（回文链表）', link: '/classify/algorithm/title/leetcode-234' },
        { text: 'leetcode-876（链表的中间节点）', link: '/classify/algorithm/title/leetcode-876' },
        { text: '剑指Offer-22（链表中倒数第K个节点）', link: '/classify/algorithm/title/剑指Offer-22' },
        { text: 'leetcode-394（字符串解码）', link: '/classify/algorithm/title/leetcode-394' },
    ];
}