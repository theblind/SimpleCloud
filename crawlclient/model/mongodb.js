/*filename: mongodb.js
* usage: implement the mongodb operation*/
var MongoClient = require("mongodb").MongoClient;
var settings = require("../settings");
var dbconf = settings.mongodb;

/*callback function has two  params: err, dbHandle*/
exports.initdb = function(callback){
	console.log("Connecting mongodb.....");
	MongoClient.connect("mongodb://"+dbconf.username+":"+dbconf.password+"@"+dbconf.host+":27017/"+dbconf.db, function(err, db){
		if(err)
			return callback(err, null);
		var mongoHnd = new MongoHnd(db);
		// 遍历句柄，执行爬虫和入库操作
		return callback(null, mongoHnd);
	});
}

/* the database Object */
function MongoHnd(db){
	console.log("init MongoHnd......");
	this.db = db;
	this.crawled = 0;
	this.updated = 0;
	this.colle = db.collection(dbconf.collection);
}

MongoHnd.prototype.insertUpdate = function(instanceinfo, callback){
	this.colle.update({"manufacture": instanceinfo.manufacture, "alias_name": instanceinfo.alias_name,
			"vcpu": instanceinfo.vcpu, "vram": instanceinfo.vram, "os": instanceinfo.os, "region": instanceinfo.region,
			"pricing_type": instanceinfo.pricing_type}, {"$set": instanceinfo}, {upsert: true}, function(err){
		if(err){
			console.log("Error happened when updating "+util.inspect(instanceinfo));
			return callback("fail to upsert data.");
		}
		else{
			return callback(null);
			// console.log("update successfully:", JSON.stringify(instanceinfo["alias_name"]));
		}
	});
}
