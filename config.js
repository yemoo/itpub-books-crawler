module.exports = {
    /* 要排除的关键词 */
    excludes: ['求', '寻', '吐槽', '垃圾', '帮忙', '日记', '吐槽', '期待', '兴趣', '悬赏', 'request book', 'look for', 'c++', '电子', '操作系统', '获赠', '连环画', '交换机', '大会', '下载',
        'abap', 'c#', 'wf', 'wpf', 'wcf', 'silverlight', 'indesign', 'tomcat', 'jsp', 'varnish', 'analog', 'electronic', 'xml',
        '.net', 'autocad', 'java', 'jbpm', 'oracle', 'crm', 'opencv', 'ccie', '[faq]', 'matlab', 'vhdl', 'fpga', 'verilog', 'digital',
        'domain-driven', 'sharepoint', 'antenna', 'cabel', 'television', 'satellite', 'terrestrial', 'iptv', 'mathematical', 'embed', 'osgi',
        'vlsi', 'ccna', 'ccent', 'lego', 'domains', 'cmos', 'intel', 'xeon', 'testng', 'biological', 'pathways', 'geometry', 'exam', 'outcasts',
        'arquillian', 'concrete', 'homology'
    ],
    /* 要匹配的关键字，默认主要为移动开发，前端开发及 PHP 类WEB图书 */
    includes: ['cloud', 'ios ', 'iphone', 'android', 'mobile', 'phonegap', 'html', 'css', 'script', 'js', 'ajax', 'php', 'flash', 'flex',
        'nginx', 'apache', 'mvc', 'git', 'dart', 'dom', 'architecture', 'go ', 'design', 'web', 'performance', 'ruby', 'rails', 'node', 'python',
        'mysql', 'seo', 'usability', 'extjs', 'yui', 'dojo', 'jquery', 'webgl', ' gui', 'gui ', 'gui-', ' ui', 'ui ', 'animation', 'mongodb',
        'framework', 'drupal', 'joomla', 'wordpress', '性能', '优化', 'interaction', 'face', 'actionscript', 'presentation', 'experience',
        'google', 'facebook', 'twitter', 'test', 'expressions', 'cache', 'chrome', 'firefox', 'objective-c', 'linux', 'backbone', 'starter',
        'aptana', 'firebug', 'mapreduce', 'sencha', 'hadoop', 'express', 'connect', 'angular',
    ],
    /* itpub 论坛账号密码 */
    account: {
        username: 'YOUR USERNAME',
        password: 'YOUR PASSWORd'
    },
    // 分析和抓取的页数
    pagecount: 50,
    // 渲染图书列表的页面模板名称
    template: 'list.tpl',
    bookdir: 'books'
};
