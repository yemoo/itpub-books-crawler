<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>{{pagetitle}}</title>
<style type="text/css">
    body{
        background: url('../bg.png') repeat 0 0;
    }
    li{
        line-height: 1.5;
    }
    body, a{
        font-family: Consolas, monospace, 微软雅黑;
        color: #fff;
        font-size: 14px
    }
    .wrapper{
        margin: 1em;
        padding: 0 0.5em;
        overflow: hidden;
        background: rgba(75, 75, 75, 0.5);
        _background: #4B4B4B;
        -webkit-border-radius: 4px;
        border-radius: 4px;
    }
    .date{
        color: #93C763;
        padding-right: 0.3em;
    }
    .title{
        text-decoration: none;
        color: #85ADF5
    }
    .title:hover{
        text-decoration: underline;
        color: #F66
    }
    h1{
        padding: 0 30px;
        margin: 0.3em 0;
    }
    h2{
        padding: 0 50px;
        margin: 0.3em 0;
        color: #999;
        font-size: 16px;
        font-style: italic;
    }
    h2:before{
        content:"“";
    }
    h2:after{
        content:"”";
    }
</style>
</head>
<body>
<h1>{{pagetitle}}</h1>
<h2>{{info}}</h2>
<div class="wrapper">
<ol>
{{#books}}
<li><span class="date">[{{date}}]</span><a href="{{url}}" target="_blank" class="title">{{title}}</a>&nbsp;</li>
{{/books}}
</ol>
</div>
</body>
</html>
