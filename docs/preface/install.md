---
typora-root-url: ..\public
title: 博客搭建
titleTemplate: VitePress + Github 搭建个人博客网站
description: VitePress + Github 搭建个人博客网站
---

参考文档：[VitePress | 由Vite、Vue驱动的静态网站生成器 (process1024.github.io)](https://process1024.github.io/vitepress/)

## 初始化项目

创建并进入新项目的目录

```
mkdir vitepress_blog
cd vitepress_blog
```

使用任意前端包管理工具进行初始化项目，这里使用 `yarn`，一直回车使用默认值即可

```
yarn init
```

添加`Vitepress`作为项目的开发依赖项

```
yarn add --dev vitepress
```

`package.json`添加以下scripts

```
"scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
}
```

创建第一个文档，项目会以 docs 为文档根目录

```
mkdir docs
cd docs
echo # Hello VitePress > index.md
```

此时目录结构如下

```
.
├─ docs 
│  └─ index.md
└─ package.json
```

启动本地服务

```
yarn docs:dev
```

`VitePress` 将在 `http://localhost:5173` 启动一个本地开发服务器，网页显示如下

![image-20221010142902339](/preface/image-20221010142902339.png)

## 应用配置

在docs目录下创建一个 `.vitepress`目录，在`.vitepress`中新建配置文件 `config.js`

目录结构如下

```
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  └─ index.md
└─ package.json
```

`config.js ` 常用配置如下，具体配置详细见注释

```
module.exports = {
    // --------------------- 应用配置 ---------------------
    //  标题
    title: "啊郭的博客",
    //  标题的后缀
    titleTemplate: "学技术博客，学习笔记，问题解决方案",
    //  网站的描述
    description: "啊郭的博客",
    //  站点的 lang 属性
    lang: 'en-US',  
    //  部署站点的 base URL
    base: '/guo-notes',  
    //  当设置为 true 时，VitePress 不会因为无效链接而导致构建失败。
    ignoreDeadLinks: true,  
    //  使用 git commit 获取时间戳，后续部署到 github 的时候会生效，本地第一次构架项目暂时看不到效果
    lastUpdated: true,
    // 	获取时间戳 展示格式
    lastUpdatedText: 'Updated Date',
    //  配置 Markdown 解析器选项
    markdown: {
        theme: 'material-palenight',
        //  在代码块中启用行号
        lineNumbers: true,
    }
}
```

此时网站展示如下

![image-20221010180606444](/preface/image-20221010180606444.png)

## 主体配置

在`docs`下新建图片文件夹 `public`，**网站用到的图片根目录均为`public`**

在`docs`下文件夹 `redis`，`mysql`，分别新增文档 `test1.md`， `test2.md`，文档访问链接默认根目录为 `docs`

目录结构如下

```
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
|  └─ public
|  |  └─ logo.png
|  └─ redis
|  |  └─ test1.md
|  └─ mysql
|  |  └─ test2.md
│  └─ index.md
└─ package.json
```

主体配置示例如下

```
module.exports = {
    // --------------------- 应用配置 ---------------------
    // ...............

    // --------------------- 主题配置 ---------------------
    themeConfig: {
        //  显示在导航栏中的logo文件，位于站点标题之前，图片保存在public文件夹中
        logo: '/logo.png',
        //  自定义此项以替换导航中的默认站点标题
        siteTitle: '啊郭的博客',
        //  导航菜单项的配置
        nav: [
            {
                text: "后端技术",
                link: "/",
            },
            {
                text: "后端技术",
                items: [
                    {
                        // text: "后端技术",
                        items: [
                            { text: "Redis", link: "/redis/test1" },
                        ],
                    },
                    {
                        items: [
                            { text: "mysql", link: "/mysql/test2" },
                        ],
                    },
                ],
            }
        ],
        // 社交链接socialLinks
        socialLinks: [
            { icon: 'github', link: 'https://github.com/gyh-up?tab=repositories'},
            { icon: {svg: '<embed src="https://g.csdnimg.cn/static/logo/favicon32.ico" style="border-radius: 100%;width: 20px;height: 20px;" />'}, 
            link: 'https://blog.csdn.net/weixin_42258523?spm=1000.2115.3001.5343'},
        ],
        // 侧边栏菜单项的配置
        sidebar: [
            {
                text: '我是一个侧边栏',
                //  侧边栏折叠
                collapsible: true,
                //  默认情况下，所有侧边栏都是展开的, 始页面加载时关闭
                collapsed: true,
                items: [
                    { text: 'Index', link: '/redis/test1' },
                    { text: 'One', link: '/' },
                    { text: 'Two', link: '/mysql/test2' }
                ],
            }
        ]
    }
}

```

此时网站显示如下

![image-20221010183847900](/preface/image-20221010183847900.png)



> 社交链接

使用`themeConfig.socialLinks`可以配置我们的社交链接，目前支持的有

```
type SocialLinkIcon =
  | 'discord'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'slack'
  | 'twitter'
  | 'youtube'
  | { svg: string }
```

> 多样侧边栏

您可能会根据页面路径显示不同的侧边栏。更新配置以定义每个部分的侧边栏，不同的是，这次配置的是一个对象而不是数组，每个键值对应的是页面路径。

```
themeConfig: {
    sidebar: {
      '/redis/test1': [
        {
          text: 'redis',
          items: [
            { text: 'Index', link: '/' },
            { text: 'One', link: '/' },
            { text: 'Two', link: '/' }
          ]
        }
      ],
      '/mysql/': [
        {
          text: 'mysql',
          items: [
            { text: 'Index', link: '/' },
            { text: 'Three', link: '/' },
            { text: 'Four', link: '/' } 
          ]
        }
      ]
    }
  }
```

本地项目就这样初步地搭建起来，想详细了解其他的配置功能的可以参考下文章开头的文档。

## 部署

`github`上新建仓库`vitepress_blog`

![image-20221010185803174](/preface/image-20221010185803174.png)

对仓库进行设置，如图，点击`save`按钮即可

![image-20221010185911891](/preface/image-20221010185911891.png)

保存后会生成一个站点地址，这就是你博客的地址

![image-20221010190539195](/preface/image-20221010190539195.png)

将`config.js`中的   `base ` 改为自己仓库的名称，如上图我的仓库名称为 `vitepress_blog`

```
base: '/vitepress_blog',
```

将本地项目构建打包

```
yarn docs:build
```

将打包的 `dist`项目`push`到你的仓库中，此处就不详细描述了，按个人习惯上传即可

![image-20221010191158030](/preface/image-20221010191158030.png)

访问上面生成的博客地址，成功看到如下界面， 那就恭喜你成功了~~~~

![image-20221010191037315](/preface/image-20221010191037315.png)