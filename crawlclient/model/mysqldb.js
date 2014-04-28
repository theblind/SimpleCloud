// filename: mysqldb.js
// usage: basic lib for mysql operating
var mysql = require("mysql");
var mysqlConf = require("../settings").mysql;

exports.initdb = function(callback){
	var conn = mysql.createConnection({
		host: mysqlConf.host,
		user: mysqlConf.username,
		password: mysqlConf.password,
		database: mysqlConf.db,
	});
	conn.connect(function(err){
		return callback(err, conn);
	});
}