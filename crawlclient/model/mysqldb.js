// filename: mysqldb.js
// usage: basic lib for mysql operating
var mysql = require("mysql");
var mysqlConf = require("../settings").mysql;

exports.initdb = initdb;
function initdb(callback, timeout){
	if(timeout == null)
		timeout = 3;
	var conn = mysql.createConnection({
		host: mysqlConf.host,
		user: mysqlConf.username,
		password: mysqlConf.password,
		database: mysqlConf.db,
	});
	conn.connect(function(err){
		if(err){
			if(timeout <= 0)
				return callback(err, null);	/* failed, timeout */
			else
				return initdb(callback, timeout-1); /* failed, and retry */
		}
		else
			return callback(null, conn);	/* connect successfully */
	});
}