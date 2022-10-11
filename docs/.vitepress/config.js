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
    // lastUpdated: true,
    // lastUpdatedText: 'Updated Date',
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
                            { text: "Redis", link: "/" },
                        ],
                    },
                    {
                        items: [
                            { text: "mysql", link: "/" },
                        ],
                    },
                ],
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
                    text: 'Redis',
                    //  侧边栏折叠
                    collapsible: true,
                    //  默认情况下，所有侧边栏都是展开的, 始页面加载时关闭
                    collapsed: true,
                    items: [
                        { text: 'redis介绍', link: '/classify/redis/redis介绍' },
                        { text: 'redis数据类型简介', link: '/classify/redis/redis数据类型简介' },
                        { text: 'redis底层数据结构', link: '/classify/redis/redis底层数据结构' },
                        { text: 'redis五大数据类型实现原理', link: '/classify/redis/redis五大数据类型实现原理' },
                        { text: 'redis内存淘汰策略', link: '/classify/redis/redis内存淘汰策略' },
                        { text: 'redis内存回收', link: '/classify/redis/redis内存回收' },
                        { text: 'redis内存碎片率', link: '/classify/redis/redis内存碎片率' },
                        { text: 'redis缓存击穿、穿透、雪崩', link: '/classify/redis/redis缓存击穿、穿透、雪崩' },
                        { text: 'redis慢查询和管道', link: '/classify/redis/redis慢查询和管道' },
                        { text: 'redis持久化', link: '/classify/redis/redis持久化' },
                        { text: 'redis事务', link: '/classify/redis/redis事务' },
                        { text: 'redis分布式锁', link: '/classify/redis/redis分布式锁' },
                        { text: 'redis主从', link: '/classify/redis/redis主从' },
                        { text: 'redis哨兵', link: '/classify/redis/redis哨兵' },
                        { text: 'redis集群', link: '/classify/redis/redis集群' },
                    ],
                }
            ]
        }
    }
}
