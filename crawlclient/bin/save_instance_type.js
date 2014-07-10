/* this script collect all the instance type information of all manufactures,
and save into benchmark_instancetype table*/
var path = require("path");
var util = require("util");

var settings = require("../settings");
var mysqldb = require("../model/mysqldb.js");


var provider_meta = [];
/* get the model */
for(var item in settings.manufacture){
	provider_meta.push(
		require(path.join("../","provider", settings.manufacture[item], "metadata.js"))
	);
}
console.log("%d providers has been collected!", provider_meta.length);

/* push all instance type item into array */
var instancetype_array = [];
for(var index in provider_meta){
	instancetype_array = instancetype_array.concat(
		provider_meta[index].get_instancetype_list()
	);
}

var totle = instancetype_array.length;
var updated = 0;
console.log("collected %d instance type totally!", totle);

var update_time = Math.round(Date.now()/1000);
/* connect to the mysql, use transition */
mysqldb.initdb(function(err, conn){
	if(err){
		return console.log("failed to connct to mysql, error: "+err);
	}
	for(var index in instancetype_array){
		instancetype_array[index].update_time = update_time;
		var str = util.format("insert into benchmark_instancetype values(default, '%s', '%s', %s, %s, %d, %d, '%s', '%s', '%s', '%s', %d);",
			instancetype_array[index].manufacture,
			instancetype_array[index].alias_name,
			instancetype_array[index].vcpu,
			instancetype_array[index].vram,
			instancetype_array[index].storage,
			instancetype_array[index].band_width,
			instancetype_array[index].region,
			instancetype_array[index].os_type,
			instancetype_array[index].os_text,
			instancetype_array[index].os_value,
			instancetype_array[index].update_time
		);

		insert_record(conn, str, null, function(status){
			/* the callback function will be called whem all instancetype
			items were inserted successfully*/
			if(status == true){
				/* delete the old record */
				var delete_str = util.format("delete from benchmark_instancetype where update_time <> %d;", update_time);
				conn.query(delete_str, function(err){
					if(err)
						console.log("fail to delete old instancetype record");
					else
						console.log("successfully delete the old record");
					process.exit(1);
				})
			}
		});
	}
});

function insert_record(conn, querystring, retry, callback){
	if(retry == null)
		retry = 3;
	else if(retry > 0)
		console.log("retrying...");
	conn.query(querystring, function(err, result){
		if(err){
			/* if fail to insert */
			console.log("error while insert new record: "+err);
			if(retry <= 0){
				throw "retry timeout...";
			}
			else
				return insert_record(conn, querystring, retry-1);
		}
		/* insert query executed successfully */
		updated++;
		if(updated >= totle){
			/* all instancetype item have been isnerted */
			console.log("all items has been inserted, old record will be deleted.");
			return callback(true);
		}
	});
}