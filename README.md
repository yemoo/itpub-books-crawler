ITPUB 电子书列表爬取程序
============

基于 Nodejs 实现的根据用户配置抓取 [ITPUB电子书板块](http://www.itpub.net/forum-61-1.html) 书籍列表的脚本（只捕获列表不下载图书）。


启动方法
-----------
```
// 使用前请确保使用 npm install 安装过依赖
node index.js [参数配置]
// 示例
// node index.js
// node index.js --lastupdate 2016-04-27
// node index.js -d 2016-04-27
// node index.js -p 40 -d 2016-04-27 -U xxxx -P xxxx
```

主要参数说明
------------
- -h, --help 参数说明
- -d, --lastupdate  抓取图书的最晚发布日期(格式YYYY-MM-DD)，默认为最后一次抓取的日期或一个月前的日期
- -p, --pagecount  要分析的页数，默认为 50 页
- -U, --username ITPUB 用户名
- -P, --password ITPUB 密码

文件结构说明
-------------
```
.
├── README.md  // 说明文件
├── bg.png     // 图书列表页需要的背景图
├── books      // 生成的抓取列表文件存放目录
├── config.js  // 配置文件，配置关键词，账号密码等
├── index.js   // 入口文件
├── list.tpl   // 渲染列表页的模板文件，使用 mustache 语法
├── node_modules // 依赖程序
└── package.json // node package.js
```

配置说明`(config.js)`
---------------------
- excludes：配置要排除的关键词列表（含该关键词列表的图书会优先排除掉）
- includes：配置要匹配的关键词列表（只有含该关键词列表的文章会被记录）
- account：配置 ITPUB 论坛的账号密码（只有登录才能查看文章列表）
- pagecount：抓取的页数，默认为50页
- template：渲染图书列表的模板文件路径，默认为 list.tpl
- bookdir：生成的图书列表的保存目录，默认为 books

mustache 模板变量
----------------------
- *pagetitle*: 页面标题
- *info*：抓取相关基本信息
- *books*：图书列表
 - *date*：图书发布时间
 - *title*：图书标题
 - *url*：图书链接地址

其他说明
-----------
1. 账号密码为必需项，可通过配置文件设置或者通过命令行参数传入
2. 默认的关键词配置主要为移动开发，前端开发及 PHP 类WEB图书
