var settings = require('../settings');
var	mysql = require('mysql');
var pool = mysql.createPool(settings);//mysql线程池
module.exports =  pool;