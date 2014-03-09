var MongoClient = require("mongodb").MongoClient;
var settings = require("../settings");
var util = require("util");

var dbconf = settings.mongodb;
// 遍历配置中的提供商，获取相应的模块句柄
var providerList = [];
for(var index in settings.manufacture){
	console.log(settings.manufacture[index]);
	providerList[index] = require("./"+settings.manufacture[index]);
}

console.log("Connecting MongoDB....");

// azure.getPrice(null);
MongoClient.connect("mongodb://server:"+dbconf.password+"@"+dbconf.host+":27017/"+dbconf.db, function(err, db){
	if(err) throw err;
	var mongoHnd = new MongoHnd(db);
	console.log(util.inspect(mongoHnd.colle));
	// 遍历句柄，执行爬虫和入库操作
	for(var index in providerList){
		console.log("Getting the price of manufacture: "+providerList[index]);
		providerList[index].getPrice(mongoHnd);
	}
	// aliyun.getPrice(null);
	// azure.getPrice(null);
	// amazon.getPrice(null);
});

function MongoHnd(db){
	console.log("init MongoHnd......");
	this.collection = db.collection(dbconf.collection);
}

MongoHnd.prototype.insertUpdate = function(mongo_data, callback){
	var colle = this.collection;
	colle.update({"mark_data": mongo_data["mark_data"]}, {"$set": mongo_data}, {upsert: true}, function(err){
		if(err){
			console.log("Error happened when updating "+util.inspect(mongo_data));
			throw new Error(err);
		}
		else
			callback(err, {_id: "null"});
	});
	/************
	var cursoe = colle.findOne({"mark_data": mongo_data["mark_data"]}, function(err, docs){
		if(err){
			console.log("error to findOne while updating");
			callback(err, null);
		}
		else if(docs){
			// update
			var id = docs._id;
			colle.update({"_id": id},
				{$set: {"core_data": mongo_data["core_data"]}}, 
				{upsert: false},
				function(err){
					if(err) callback("update error in id "+id+ " "+err);
					else callback(null, docs);
				}
			);	
		}
		else{
			// insert
			colle.insert(mongo_data, function(err, docs){
				if(err){
					callback("insert error: "+err);
				} else {
					callback(null, docs);
				}
			})
		}
	});
	******************/
}
