var fs = require('fs');

var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var moment = require('moment');
var mustache = require('mustache');
var extend = require('node.extend');
var program = require('commander');
var pngStringify = require('console-png');
var prompt = require('prompt');

var request = require('request');
request = request.defaults({
    jar: true,
    encoding: null
});

var config = require('./config.js');

// 读取页数
var pageCount;
// 当前页
var curPage = 0;
// 域名
var host = 'http://www.itpub.net/';
// 列表页url
var listPageUrl = host + 'forum-61-{page}.html';
// 登陆页url
var loginUrl = host + 'member.php?mod=logging&action=login&infloat=yes&frommessage';
// 保存有效的书籍
var books = [];

// 获取某页的url
function getPageUrl(curPage) {
    if (curPage > pageCount) return false;
    curPage = Math.max(curPage, 1);
    return listPageUrl.replace(/\{page\}/, curPage);
}

function doParse() {
    var pageUrl = getPageUrl(++curPage);
    var count = 0;
    if (pageUrl) {
        request.get(pageUrl, function(error, response, body) {
            var $ = cheerio.load(iconv.decode(body, 'GBK'));
            var excludes = config.excludes;
            var includes = config.includes;

            // 循环列表
            $('#threadlist table tbody tr:has("td")').each(function() {
                var self = $(this);
                var link = self.find('a.xst');
                var title = link.text();
                var href = host + link.attr('href');
                var pubdate = moment(self.find('td').eq(1).find('em').text(), "YYYY-M-D");

                // 是否有效
                var isvalidBook = pubdate.diff(moment(lastUpdate)) >= 0;
                var titleLowercase = title.toLowerCase();
                if (isvalidBook) {
                    // 先过滤无效的书籍
                    excludes.forEach(function(keyword) {
                        if (titleLowercase.indexOf(keyword) > -1) {
                            isvalidBook = false;
                            return false;
                        }
                    });
                }
                if (isvalidBook) {
                    // 先默认为无效
                    isvalidBook = false;
                    // 剩余部分包含includes的关键字认为有效
                    includes.forEach(function(keyword) {
                        if (titleLowercase.indexOf(keyword) > -1) {
                            isvalidBook = true;
                            return false;
                        }
                    });
                }
                if (isvalidBook) {
                    count += 1;
                    books.push({
                        date: pubdate.format('YYYY-MM-DD'),
                        title: title,
                        url: href
                    });
                }
            });

            console.log('第 ' + curPage + ' 页找到 ' + count + ' 本符合条件的图书，一共 ' + books.length + ' 本符合条件的图书');
            doParse();
        });
    } else {
        console.log('图书已抓取完成，共有 ' + books.length + ' 本图书!');
        if (books.length > 0) {
            if (!fs.existsSync(config.template)) {
                console.log('未找到列表渲染模板文件：' + config.template);
                return false;
            }
            var tpl = fs.readFileSync(config.template).toString();
            books.sort(function(a, b) {
                return moment(b.date).diff(moment(a.date));
            });

            var today = moment();
            if (!fs.existsSync(config.bookdir + '/')) {
                fs.mkdirSync(config.bookdir);
            }
            var filename = config.bookdir + '/list-' + today.format('YYYYMMDD') + '.html';
            fs.writeFileSync(filename, mustache.render(tpl, {
                pagetitle: 'Book list Render At ' + today.format('YYYY-MM-DD'),
                books: books,
                info: 'From itpub list page 1 to ' + pageCount + ', publish after ' + lastUpdate
            }));
            console.log('图书列表已经生成到文件：' + filename);
        }

        // 更新最后更新时间
        fs.writeFileSync(tmpFile, today.subtract(1, 'days').format('YYYY-MM-DD'));
        console.log('========================== 抓取完成 ==========================\n');
    }
}

program
    .version('0.0.1')
    .option('-d, --lastupdate <lastupdate>', '抓取图书的最晚发布日期(格式YYYY-MM-DD)，默认为最后一次抓取的日期或一个月前的日期')
    .option('-p, --pagecount <pagecount>', '要分析的页数，默认为 50 页', parseInt)
    .option('-U, --username <username>', 'ITPUB 用户名')
    .option('-P, --password <password>', 'ITPUB 密码')
    .parse(process.argv);

var monthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
// 读取命令行参数
console.log('\n[欢迎使用 ITPUB 电子书抓取程序--@author 闫威]');

var tmpFile = '.lastupdate';
var lastUpdate = program.lastupdate || (fs.existsSync(tmpFile) && fs.readFileSync(tmpFile).toString()) || monthAgo;
// 最多读取的页数
var pageCount = program.pagecount || config.pagecount || 50;
// 设置日期格式无效
if (!moment(lastUpdate).isValid()) {
    console.error("无效的lastUpdate参数, 请使用 YYYY-MM-DD 格式。", 1);
    process.exit(1);
}
// 输出抓取参数
console.log('抓取参数：lastupdate=' + lastUpdate + '  pagecount=' + pageCount);

var username = program.username || config.account.username;
var password = program.password || config.account.password;

if (!username || !password || username == 'YOUR USERNAME' || password == 'YOUR PASSWORD') {
    console.error('\n请配置 config.js 中的 ITPUB 账号密码，或通过命令行参数传入账号密码。');
    process.exit(1);
}

// 登陆
console.log('\n账号登陆中，请稍后......');

request.get(loginUrl, function(error, response, body) {
    var $ = cheerio.load(iconv.decode(body, 'GBK'));
    var loginForm = $('form[name=login]');
    var loginUrl = host + loginForm.attr('action');
    var seccodehash = /updateseccode\('(\w+)'/.test(loginForm.find('[reload="1"]').text()) && RegExp.$1;
    var loginParams = {};
    loginForm.serializeArray().forEach(function(item) {
        loginParams[item.name] = item.value;
    });
    extend(loginParams, config.account, {
        referer: getPageUrl(1),
        seccodemodid: 'member::logging',
        seccodehash: seccodehash,
        loginsubmit: true
    });
    // 请求验证码
    request.get('http://www.itpub.net/misc.php?mod=seccode&update=21342&idhash=' + seccodehash, {
        headers: {
            'referer': getPageUrl(1)
        }
    }, function(error, response, body) {
        // 控制台打印验证码
        pngStringify(body, function (err, string) {
            if (err) throw err;
            // 打印验证码
            console.log(string);
            prompt.start();
            // 获取用户输入的验证码
            prompt.get(['secCode'], function(err, result) {
                loginParams.seccodeverify = result.secCode;
                request.post({
                    url: loginUrl,
                    form: loginParams
                }, function(err, response, body) {
                    var $ = cheerio.load(iconv.decode(body, 'GBK'));
                    if ($('.alert_error').length) {
                        console.log($('.alert_error p').text());
                    } else {
                        console.log('登陆成功，开始图书分析及抓取！');
                        console.log('');
                        console.log('========================= 抓取开始 =========================');
                        // 开始抓取
                        doParse();
                    }
                });
            });
        });
    });
});
