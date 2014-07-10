// mysqlInstance.js
var util = require("util");
var tool = require("../lib"),
	mysqlConf = require("../settings").mysql;
function SyncInstance(instance, mysqlHnd){
	this.mysqlHnd = mysqlHnd;
	this.rawinstance = instance;
	/* 参数检查 */
	this.instanceInfo = {
		// "manufacture_id": null,
		// "alias_name": instance.alias_name, 
		// "vcpu": instance.vcpu,
		// "vram": instance.vram,
		// "storage": instance.storage,
		// "band_width": instance.band_width,
		// "os_type": instance.os.type,
		// "os_text": instance.os.text,
		// "os_value": instance.os.value,
		// "region": null,
		"instancetype_id": null,
		"pricing_type": instance.pricing_type,
		"monetary_unit": "RMB" in instance.prices ? "RMB" : "USD",
		"prices": "RMB" in instance.prices ? instance.prices.RMB : instance.prices.USD,
		"duration": instance.duration,
		"pricing_cycle": instance.pricing_cycle,
		"update_time": instance.update_time
	};
}

SyncInstance.prototype.init = function(callback){
	var str = util.format("select * from benchmark_instancetype where manufacture_id = '%s' and vcpu = %d and vram = %d and os_value = '%s' and region = '%s';",
		this.rawinstance.manufacture,
		this.rawinstance.vcpu,
		this.rawinstance.vram,
		this.rawinstance.os.value,
		this.rawinstance.region
	);
	var rawthis = this;
	this.mysqlHnd.query(str, function(err, rows){
		if(err){
			rawthis.instanceInfo.instancetype_id = -2;
			return console.log("error while querying manufacture_id of "+rawthis.rawinstance.manufacture+" error:"+err);

		}
		if(rows.length == 0){
			rawthis.instanceInfo.instancetype_id = -1;
			console.log(str);
			return console.log("no instance type matched in benchmark_instancetype, manufacture: %s", rawthis.rawinstance.manufacture);
		}
		rawthis.instanceInfo.instancetype_id = rows[0].id || -3;
		return callback();
	});
}

SyncInstance.prototype.__formatInsertSentence__ = function(tableName){
	var str = util.format("insert into %s values (default, %d, '%s', '%s', %s, %s, '%s', %s);",
		tableName,
		this.instanceInfo.instancetype_id,
		this.instanceInfo.pricing_type,
		this.instanceInfo.monetary_unit, 
		this.instanceInfo.prices,
		this.instanceInfo.duration,
		this.instanceInfo.pricing_cycle,
		this.instanceInfo.update_time
	);
	return str;
}
SyncInstance.prototype.insert = function(){
	var insertString = this.__formatInsertSentence__(mysqlConf.table_history);
	this.mysqlHnd.query(insertString, function(err, rows){
		return callback(err, rows);
	});
}

SyncInstance.prototype.syncIntoHistory = function(callback){
	var querystring = this.__formatInsertSentence__(mysqlConf.table_history);

	this.mysqlHnd.query(querystring, function(err, result){
		if(err){
			// console.log("syncIntoHistory error: "+querystring);
			return callback(err +" querystring:"+querystring, 0);
		}
		else
			return callback(null, result.affectedRows);
	});
}

SyncInstance.prototype.syncIntoInuse = function(callback){
	
	var querystring = this.__formatInsertSentence__(mysqlConf.table_inuse);
	this.mysqlHnd.query(querystring, function(err, result){
		if(err){
			// console.log("syncIntoInuse error: "+querystring);
			return callback(err+" querystring:"+querystring, 0);
		}
		else
			return callback(null, result.affectedRows);
	});
}

module.exports = SyncInstance;