var pool = require('../models/db.js');

function User(user){
	this.username = user.username;//账号
	this.name = user.name;    //昵称
	this.password = user.password;
	this.email = user.email;
};
module.exports = User;

//公共方法读取用户信息
User.get = function(username,callback){
	var getSQL = 'select * from ofUser where username = ?';
	pool.getConnection(function(err,conn){
		if (err) {
			conn.release();
			return callback(err);
		}
		conn.query(getSQL,[username],function(err,results){
			conn.release();
			if (err){
				return callback(err);
			}
			return callback(null,results);
		});
	});
};
//储存用户信息
User.prototype.save = function(callback){
	
	//要存入数据库的用户文档
	var user = {
		username: this.username,
		name: this.name,
		password: this.password,
		email: this.email
	};
	//打开数据库
	var insertSQL = 'insert into ofUser (username,name,plainPassword,email,creationDate,modificationDate) values (?,?,?,?,?,?)';
	pool.getConnection(function(err,conn){
		if (err) {
			conn.release();
			return callback(err);
		}
		var now = new Date();
		var nowlocalms = now.getTime();
		conn.query(insertSQL,[user.username,user.name,user.password,user.email,nowlocalms,nowlocalms],function(err,rows){
			conn.release();
			if (err) {
				return callback(err);
			}		
			return callback(null,rows);
		});
	});
};

//删除用户信息
User.remove = function(username,callback){
	var deleteSQL = 'delete from ofUser where  username = ?';
	pool.getConnection(function(err,conn){
		if (err) {
			conn.release();
			return callback(err);
		}
		conn.query(deleteSQL,[username],function(err,results){
			conn.release();
			if (err){
				return callback(err);
			}
			return callback(null,results);
		});
	});
};
//修改用户信息
User.edit = function(user,callback){
	var updateSQL = 'update  ofUser set plainPassword = ? , name = ? , email = ? where 1=1 and username = ?';
	pool.getConnection(function(err,conn){
		if (err) {
			conn.release();
			return callback(err);
		}
		conn.query(updateSQL,[user.password,user.name,user.email,user.username],function(err,results){
			conn.release();
			if (err){
				return callback(err);
			}
			return callback(null,results);
		});
	});
};
//获取用户列表
User.getlist = function(user,callback){
	var getListSQL = 'select * from ofUser where 1=2  ';
	var params = new Array();
	if(user.name !=""){
		getListSQL = getListSQL + " or name = ? ";
		params.push(user.name);
	}
	if(user.username !=""){
		getListSQL = getListSQL + " or username = ?";
		params.push(user.username);
	}
	if(user.email !=""){
		getListSQL = getListSQL + " or email = ?";
		params.push(user.email);
	}
	console.log(getListSQL);
	console.log(params);
	pool.getConnection(function(err,conn){
		if (err) {
			conn.release();
			return callback('查询异常，请稍后尝试或联系管理员');
		}
		conn.query(getListSQL,params,function(err,results){
			conn.release();
			if (err){
				return callback('查询异常，请稍后尝试或联系管理员');
			}
			for (var i=0;i<results.length;i++){
				results[i].plainPassword ="";
				results[i].encryptedPassword ="";
			}
			return callback(null,results);
		});
	});
};