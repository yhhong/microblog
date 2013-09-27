
/*
 * GET home page.
 */

exports.index = function(req, res){
	//res.render 的功能是调用模板引擎，并将其产生的页面直接返回给客户端
  	res.render('index', { title: 'Express' });//调用视图模板 index，传递 title 变量。最终视图模板生成 HTML 页面，返回给浏览器
};
exports.hello = function(req, res) { 
 	res.send('The time is ' + new Date().toString()); 
};

exports.user = function(req, res) { 
}; 
exports.post = function(req, res) { 
}; 
exports.reg = function(req, res) { 
}; 
exports.doReg = function(req, res) { 
}; 
exports.login = function(req, res) { 
}; 
exports.doLogin = function(req, res) { 
}; 
exports.logout = function(req, res) { 
};