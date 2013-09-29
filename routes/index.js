
/*
 * GET home page.
 */

// exports.index = function(req, res){
// 	//res.render 的功能是调用模板引擎，并将其产生的页面直接返回给客户端
//   	res.render('index', { title: 'Express' });//调用视图模板 index，传递 title 变量。最终视图模板生成 HTML 页面，返回给浏览器
// };
// exports.hello = function(req, res) { 
//  	res.send('The time is ' + new Date().toString()); 
// };

// exports.user = function(req, res) { 
// }; 
// exports.post = function(req, res) { 
// }; 
// exports.reg = function(req, res) { 
// }; 
// exports.doReg = function(req, res) { 
// }; 
// exports.login = function(req, res) { 
// }; 
// exports.doLogin = function(req, res) { 
// }; 
// exports.logout = function(req, res) { 
// };

var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

module.exports = function(app) {
	// app.get('/',function(req, res) {res.render('index', {title: '首页'});});

	app.get('/',function(req, res) {
	    Post.get(null,function(err, posts) {
	        if (err) {
	            posts = [];
	        }
	        //不解的地方，需要再套一层
	        var postss = [];
	        postss.push(posts);
	        res.render('index', {
	            title: '首页',
	            posts: postss
	        });
	    });
	});
	app.get('/reg', checkNotLogin);
	app.get('/reg',function(req, res) {res.render('reg', {title: '用户注册'});});
	app.post('/reg', checkNotLogin);
	app.post('/reg',function(req, res) {
	    //检验用户两次输入的口令是否一致
	    if (req.body['password-repeat'] != req.body['password']) {//req.body 就是 POST 请求信息解析过后的对象，例如我们要访问用户传递的password 域的值，只需访问 req.body['password'] 即可
	        req.flash('error', '两次输入的口令不一致');//req.flash 是 Express 提供的一个奇妙的工具，通过它保存的变量只会在用户当前和下一次的请求中被访问，之后会被清除，通过它我们可以很方便地实现页面的通知和错误信息显示功能。
	        return res.redirect('/reg');//res.redirect 是重定向功能，通过它会向用户返回一个 303 See Other 状态，通知浏览器转向相应页面。
	    }
	    //生成口令的散列值
	    var md5 = crypto.createHash('md5');//crypto 是 Node.js 的一个核心模块，功能是加密并生成各种散列
	    var password = md5.update(req.body.password).digest('base64');
	    var newUser = new User({
	        name: req.body.username,
	        password: password,
	    });
	    //检查用户名是否已经存在
	    User.get(newUser.name,function(err, user) {
	        if (user) err = 'Username already exists.';
	        if (err) {
	            req.flash('error', err);
	            return res.redirect('/reg');
	        }
	        //如果不存在则新增用户
	        newUser.save(function(err) {
	            if (err) {
	                req.flash('error', err);
	                return res.redirect('/reg');
	            }
	            req.session.user = newUser;
	            req.flash('success', '注册成功');
	            res.redirect('/');
	        });
	    });
	});
	app.get('/login', checkNotLogin);
	app.get('/login',function(req, res) {
	    res.render('login', {
	        title: '用户登入',
	    });
	});
	app.post('/login', checkNotLogin); 
	app.post('/login',function(req, res) {
	    //生成口令的散列值
	    var md5 = crypto.createHash('md5');
	    var password = md5.update(req.body.password).digest('base64');
	    User.get(req.body.username,
	    function(err, user) {
	        if (!user) {
	            req.flash('error', '用户不存在');
	            return res.redirect('/login');
	        }
	        if (user.password != password) {
	            req.flash('error', '用户口令错误');
	            return res.redirect('/login');
	        }
	        req.session.user = user;
	        req.flash('success', '登入成功');
	        res.redirect('/');
	    });
	});
	app.get('/logout', checkLogin); 
	app.get('/logout',function(req, res) {
	    req.session.user = null;
	    req.flash('success', '登出成功');
	    res.redirect('/');
	});
	app.post('/post', checkLogin);
	app.post('/post',function(req, res) {
	    var currentUser = req.session.user;
	    var post = new Post(currentUser.name, req.body.post);
	    post.save(function(err) {
	        if (err) {
	            req.flash('error', err);
	            return res.redirect('/');
	        }
	        req.flash('success', '发表成功');
	        res.redirect('/u/' + currentUser.name);
	    });
	});	
	app.get('/u/:user', function(req, res) {
	    User.get(req.params.user, function(err, user) {
	        if (!user) {
	            req.flash('error', '用户不存在');
	            return res.redirect('/');
	        }
	        Post.get(user.name, function(err, posts) {
	            if (err) {
	                req.flash('error', err);
	                return res.redirect('/');
	            }
	            //不解的地方，需要再套一层
		        var postss = [];
		        postss.push(posts)
	            res.render('user', {
	                title: user.name,
	                posts: postss
	            });
	        });
	    });
	});
}; 
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}