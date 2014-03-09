/* mongodb base operate */

var MongoClient = require("mongodb").MongoClient;
var format = require("util").format;

var dbsetting = require("../settings").mongodb;

function MongoBase(){
	this.__init__();
}

MongoBase.prototype.db = null;

MongoBase.prototype.__init__ = function(){
	// var new Db(dbsetting.db, new Server(dbsetting.host, Connection.DEFAULT_PORT), {safe: true});
	var connectString = format("mongodb://%s:%s@%s:%d/%s",dbsetting.username, dbsetting.password, dbsetting.host, 27017, dbsetting.db);
	var rawthis = this;
	MongoClient.connect(connectString, function(err, db){
		if (err) {
			throw err;
		};
		rawthis.db = db;
		console.log("Successfully connect to the Mongodb!", rawthis.db);
	});
};

MongoBase.prototype.matchInstance = function(alloc, callback){
	if(!this.db){
		console.log("Database has not already initialized:", this.db);
		callback("Database Not Ready!");
		return;
	}
	console.log("alloc(mongodb):", alloc);
	var colle = this.db.collection(dbsetting.collection);

	/* 需要根据传入的参数，模糊查询，模糊查询的原理是，在传入参数的上下1GB、0.5GHz范围内浮动 */
	colle.find({
		"mark_data.vcpu": {$gte: alloc.vcpu-0.5, $lte: alloc.vcpu+0.5},
		"mark_data.vram": {$gte: alloc.vram-1024, $lte: alloc.vram+1024}
		/* 更多查询条件 */
	}).toArray(function(err, docs){
		callback(err, docs);
	});
};

module.exports = new MongoBase();