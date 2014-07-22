// filename: index.js
var util = require("util");
var SyncInstance = require("../model/mysqlInstance"),
	MongoInstance = require("../model/instance"),
	mongodb = require("../model/mongodb"),
	mysqldb = require("../model/mysqldb"),
	mysqlConf = require("../settings").mysql;

/*initialize the counter */
module.counter = 0;
module.success = 0;
module.fail = 0;

module.onlineCC = 0;
module.onlineFail = 0;

exports.sync = function(listener) {
	mongodb.initdb(function(err, mongoHnd){
		if(err)
			throw new Error("can`t connect to mongodb in synchronizing prices");
		mysqldb.initdb(function(err, conn){
			if(err){
				throw new Error("fail to connect to mysql");
			};
			pickoutInstance(mongoHnd, conn, listener);
		});
	})
}

function pickoutInstance(mongoHnd, conn, listener){
	var updateTime = listener.updateTime;
	console.log("update_time is: %d", listener.updateTime);
	mongoHnd.find({update_time: updateTime}, {manufacture: 1}, function(err, docs){
		/*出错了*/
		if(err){
			return callback("fail to search in mongodb with "+updateTime, 0);
		}
		/*没有匹配的新增记录，也是出错了*/
		console.log("docs` length is: %d", docs.length);
		if(docs.length == 0){
			return callback(null, 0);
		}
		docs.forEach(function(record, index){
			var freshedInst = new SyncInstance(record, conn);
			module.counter++;
			// 更新进历史价格表中
			freshedInst.init(function(){
				updatetoMySQL(freshedInst, conn, listener);
			});
		});
	});
}

function updatetoMySQL(freshedInst, conn, listener){
	var updateTime = listener.updateTime;
	freshedInst.syncIntoHistory(function(err, affected){
		/*变更计数器*/
		module.counter--;
		if(err){
			console.log("[history] fail to update pricing information to history table: "+err);
			module.fail++;
		}
		else{
			console.log("CC history "+freshedInst.instanceInfo.instancetype_id);
			module.success++;
		}
		/*替换线上的数据*/
		freshedInst.syncIntoInuse(function(err, affected){
			if(err){
				console.log("[inuse] fail to upload pricing information into inuse table: "+err);
				module.onlineCC++;
			}
			else{
				console.log("CC inuse "+freshedInst.instanceInfo.instancetype_id);
				module.onlineFail++;
			}
			/*检查是否完成*/
			if(module.counter == 0){
				var querystring = util.format("delete from %s where update_time <> %d;", mysqlConf.table_inuse, updateTime);
				conn.query(querystring, function(err){
					/*end*/
					if(err)
						console.log("fail to delete old data: "+err);
					listener.emit("synchronized", module.success, module.fail);
				});
			}
		});
	});
}
