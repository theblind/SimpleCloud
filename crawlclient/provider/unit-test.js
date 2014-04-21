var util = require("util"),
	events = require("events");

var settings = require("../settings"),
	dbhandle = require("../model/mongodb.js");
console.log(process.argv[2]);
var provider = require(process.argv[2]);

function Listener(providerNumber){
	var rawthis = this;
	events.EventEmitter.call(this);
	this.number = providerNumber;
	this.on("finished", function(manufacture, success, fail){
		/*status表示实例的爬取与存储状态*/
		rawthis.number -=1;
		console.log("%s crawler finished, %d succeed, %d failed!", manufacture, success, fail);
		if(rawthis.number <= 0){
			console.log("crawling client finished...");
			process.exit(0);	/*爬虫任务完成，成功退出*/
		}
	})
}
util.inherits(Listener, events.EventEmitter);
var listener = new Listener(1);

dbhandle.initdb(function(err, mongoHnd){
	if(err)
		return console.log("Error in initializing database handle:", err);
	else{
		/*连接数据库成功，开始爬取数据*/ 
		var updateTime = Math.round(Date.now()/1000);
		console.log("Getting the price of manufacture: ", provider);
		provider.getPrice(mongoHnd, updateTime, listener);
	}
})