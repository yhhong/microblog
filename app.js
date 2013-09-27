
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express(); 

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');//设置页面模板的位置
app.set('view engine', 'ejs');//设置模板引擎(页面模板+数据=>HTML)可运行在服务端或者客户端(浏览器)，这里运行在服务端
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));//配置了静态文件服务器，因此/stylesheets/style.css 会定向到 app.js 所在目录的子目录中的文件 public/stylesheets/style.css

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);//规定路径为“/”的 GET 请求由 routes.index 函数处理
app.get('/users', user.list);
app.get('/hello', routes.hello);
app.get('/user/:username', function(req, res) { 
 res.send('user: ' + req.params.username); 
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
