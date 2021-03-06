
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var partials = require('express-partials');
var http = require('http');
var path = require('path');

var app = express(); 

// 添加会话支持
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings'); 

var flash = require('connect-flash');
app.use(flash());

app.use(express.cookieParser());// Cookie解析的中间件
app.use(express.session({secret: settings.cookieSecret,	store: new MongoStore({db: settings.db})}));//提供会话支持	

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');//设置页面模板的位置
app.set('view engine', 'ejs');//设置模板引擎(页面模板+数据=>HTML)可运行在服务端或者客户端(浏览器)，这里运行在服务端
app.use(partials());//使用express-partials模块
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));//配置了静态文件服务器，因此/stylesheets/style.css 会定向到 app.js 所在目录的子目录中的文件 public/stylesheets/style.css

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);//规定路径为“/”的 GET 请求由 routes.index 函数处理
// app.get('/users', user.list);
// app.get('/hello', routes.hello);
// app.get('/user/:username', function(req, res) { 
//  res.send('user: ' + req.params.username); 
// });
// app.get('/list', function(req, res) { 
// 	res.render('list', { 
// 		title: 'List', 
// 		items: [1991, 'byvoid', 'express', 'Node.js'],
// 		layout: 'template'
// 	}); 
// });




// var util = require('util'); 
// app.locals({ 
// 	inspect: function(obj) { 
// 	return util.inspect(obj, true); 
//  } 
// }); 
// // https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
// // dynamicHelpers 换成 middleware 中间件
// // app.dynamicHelpers({ 
// // 	headers: function(req, res) { 
// // 	return req.headers; 
// //  } 
// // }); 
// app.use(function(req, res, next){
//   // res.locals.req = req;
//   res.locals.headers = req.headers;
//   next();
// });
// // app.use(app.router);
// app.get('/helper', function(req, res) { 
// 	res.render('helper', { 
// 	title: 'Helpers' 
//  }); 
// }); 

// //路由
// app.get('/u/:user', routes.user);
// app.post('/post', routes.post); 
// app.get('/reg', routes.reg);
// app.post('/reg', routes.doReg);
// app.get('/login', routes.login);
// app.post('/login', routes.doLogin);
// app.get('/logout', routes.logout); 


// app.dynamicHelpers({
//     user: function(req, res) {
//         return req.session.user;
//     },
//     error: function(req, res) {
//         var err = req.flash('error');
//         if (err.length) return err;
//         else return null;
//     },
//     success: function(req, res) {
//         var succ = req.flash('success');
//         if (succ.length) return succ;
//         else return null;
//     },
// });

// 必须放置在app.use(app.router)前
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.flash('error');
    if (err.length){
        res.locals.error = err;
    }else{
        res.locals.error = null;
    }    
    var success = req.flash('success');
    if (success.length){
        res.locals.success = success;
    }else{
        res.locals.success = null;
    }
    next();
});
app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);