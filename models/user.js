var pool = require('../models/db.js');

function User(user){
	this.username = user.username;//账号
	this.name = user.name;    //昵称
	this.password = user.password;
	this.email = user.email;
};
module.exports = User;

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
		conn.query(insertSQL,[user.username,user.name,user.password,user.email,'001394719839570','001394719839570'],function(err,rows){
			conn.release();
			if (err) {
				return callback(err);
			}		
			return callback(null,rows);
		});
	});

};
//读取用户信息
User.get = function(username,callback){
	var insertSQL = 'select * from ofUser where username = ?';
	pool.getConnection(function(err,conn){
		if (err) {
			conn.release();
			return callback(err);
		}
		conn.query(insertSQL,[username],function(err,results){
			conn.release();
			if (err){
				return callback(err);
			}
			return callback(null,results);
		});
	});

};
//删除用户信息
User.remove = function(username,callback){
	var deleteSQL = 'delete from  openfire.ofUser where  username = ?';
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
