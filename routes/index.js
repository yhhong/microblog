
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

module.exports = function(app) {
	app.get('/',function(req, res) {res.render('index', {title: '首页'});});
	app.get('/reg',function(req, res) {res.render('reg', {title: '用户注册'});});
	app.post('/reg',function(req, res) {
	    //检验用户两次输入的口令是否一致
	    if (req.body['password-repeat'] != req.body['password']) {
	        req.flash('error', '两次输入的口令不一致');
	        return res.redirect('/reg');
	    }
	    //生成口令的散列值
	    var md5 = crypto.createHash('md5');
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



	app.get('/login',function(req, res) {res.render('login', {title: '用户注册'});});
}; 