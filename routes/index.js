
var fs = require('fs'),
    path = require('path');
var Blowfish = require('blowfish');
var User = require('../models/user.js');
module.exports = function(app){
	
	app.get('/upload', function (req, res) {
		res.render('upload', {
			title: '文件上传'
		});
	});	
	app.post('/upload', function (req, res) {
		if (!req.files){
		} else {	
			var date = new Date();
			var type = req.files.file.type;	
			if(type.indexOf("image")>=0){
				var typepath = "images/";
			}else{
				var typepath = "audios/";
			}
			var dateurl=typepath + req.body.name +"/"+ date.getFullYear() + (date.getMonth() + 1) + date.getDate()+"/";
			var target_path =  './public/' +dateurl;
			mkdir(target_path);
 			fs.rename(req.files.file.path, target_path + req.files.file.name,function(err){
				if(err){
					res.json(500,{ status: 'error' });
				}else{
					res.json(200,{ 
						status: 'success' ,
						uri:  'http://14.23.162.138:3000/'+ dateurl + req.files.file.name
					});
				}
			});
		}
	});
	
	//请求注册页面
	app.get('/reg',function(req,res){
		res.render('reg',{
			title: '注册'
		});
	});
	//发送注册信息
	app.post('/reg',function(req,res){
		
		var username = req.body.username,
			name = req.body.name,
			password = req.body.password,
			email = req.body.email;
		if(username==""){
			res.json(400,{ 
				resultNumber: 2,
				resultMessage:  '用户名不能为空'
			});
			return;
		}
		if(password==""){
			res.json(400,{ 
				resultNumber: 2,
				resultMessage:  '密码不能为空'
			});
			return;
		}
		var newUser = new User({
			username: req.body.username,
			name: req.body.name,
			password: password,
			email: req.body.email
		});
		//查询账户是否已经注册
		User.get(newUser.username,function(err,results){
			if(err){
				res.json(400,{ 
					resultNumber: 1,
					resultMessage:  err
				});
			}
			if(results.length>0){
				res.json(400,{ 
					resultNumber: 1,
					resultMessage:  '用户已存在'
				});
			}
			//如果不存在则新增用户
			newUser.save(function(err,results){
				if(err){
					res.json(400,{ 
						resultNumber: 1,
						resultMessage:  err
					});
				}
				res.json(200,{ 
					resultNumber: 0,
					resultMessage: '注册成功!'
				});
			});
		});
	});
	// 
	// //请求查询页面
	// app.get('/find',function(req,res){
	// 	res.render('find',{
	// 		title: '查询'
	// 	});
	// });
	// //查询用户信息
	// app.post('/find',function(req,res){
	// 	var username =req.body.username;
	// 	if(username==""){
	// 		res.json(400,{ 
	// 			resultNumber:  2,
	// 			resultMessage:  '用户名不能为空'
	// 		});
	// 	}
	// 	//查询账户
	// 	User.get(username,function(err,results){
	// 		if(err){
	// 			res.json(400,{ 
	// 				resultNumber: 1,
	// 				resultMessage:  err
	// 			});
	// 		}
	// 		if(results.length==0){
	// 			res.json(400,{ 
	// 				resultNumber: 1,
	// 				resultMessage:  '用户不存在'
	// 			});
	// 		}
	// 		var name = results[name];
	// 		res.json(200,{ 
	// 			resultNumber: 0,
	// 			resultMessage:  '查询成功',
	// 			name: results[0].name,
	// 			username: results[0].username,
	// 			email: results[0].email
	// 		});
	// 	});
	// });
	// 
	// //删除页面
	// app.get('/remove',function(req,res){
	// 	res.render('remove',{
	// 		title: '注销'
	// 	});
	// });
	// //删除用户信息
	// app.post('/remove',function(req,res){
	// 	var username =req.body.username;	
	// 	if(username==""){
	// 		res.json(400,{ 
	// 			resultNumber: 2,
	// 			resultMessage:  '用户名不能为空'
	// 		});
	// 	}
	// 	User.remove(username,function(err,results){
	// 		if(err){
	// 			res.json(400,{ 
	// 				resultNumber: 1,
	// 				resultMessage:  err
	// 			});
	// 		}
	// 		res.json(200,{ 
	// 			resultNumber: 0,
	// 			resultMessage:  '删除成功',
	// 		});
	// 	});
	// });
	// 
	// 
	// 
	function mkdir(dirpath,dirname){
			//判断是否是第一次调用
		if(typeof dirname === "undefined"){ 
			if(fs.existsSync(dirpath)){
				return;
			}else{
				mkdir(dirpath,path.dirname(dirpath));
			}
		}else{
			//判断第二个参数是否正常，避免调用时传入错误参数
			if(dirname !== path.dirname(dirpath)){ 
				mkdir(dirpath);
				return;
			}
			if(fs.existsSync(dirname)){
				fs.mkdirSync(dirpath)
			}else{
				mkdir(dirname,path.dirname(dirname));
				fs.mkdirSync(dirpath);
			}
		}
	}
};
