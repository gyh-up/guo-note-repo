module.exports = {
    // --------------------- 应用配置 ---------------------
    //  标题
    title: "啊郭的博客",
    //  标题的后缀
    titleTemplate: "学习记录",
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
            { text: "components", link: "/components/" },
            { text: "componentsTest", link: "/components/test" },
            { text: "gitee", link: "https://gitee.com/geeksdidi" },
            {
                text: "Drop Menu",
                items: [
                { text: 'Item A', link: '/item-1' },
                { text: 'Item B', link: '/item-2' },
                { text: 'Item C', link: '/item-3' }
                ]
            }
        ],
        // 外链
        socialLinks: [
            { icon: 'github', link: 'https://github.com/gyh-up/guo-note'},
            { icon: {svg: '<embed src="https://g.csdnimg.cn/static/logo/favicon32.ico" style="border-radius: 100%;width: 20px;height: 20px;" />'}, 
            link: 'https://blog.csdn.net/weixin_42258523?spm=1000.2115.3001.5343'},
        ],
        // 侧边栏菜单项的配置
        sidebar: {
            '/components/button': [
                {
                    text: 'Guide',
                    //  侧边栏折叠
                    collapsible: true,
                    //  默认情况下，所有侧边栏都是展开的, 始页面加载时关闭
                    collapsed: true,
                    items: [
                        { text: 'Index', link: '/components/button/' },
                        { text: 'One', link: '/' },
                        { text: 'Two', link: '/components/button/' }
                    ],
                }
            ],
            '/': [
                {
                    text: "更新日志",
                    items: [{
                        text: "新特性",
                        link: "/components/log/ "
                    }]
                },
                {
                    text: "快速开始",
                    link: "/",
                    items: []
                },
                {
                    text: "基础组件",
                    collapsible: true,
                    items: [
                        {text: "Button按钮", link: "/components/button/"},
                        {text: "Icon图标", link: "/components/icon/"}
                    ],
                }
            ]
        },
        editLink: {
            pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        }
    }
}
