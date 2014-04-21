/* the entry of the project */
var util = require("util"),
	events = require("events");

var settings = require("./settings"),
	dbhandle = require("./model/mongodb.js");

function Listener(providerNumber){
	var rawthis = this;
	events.EventEmitter.call(this);
	this.number = providerNumber;
	this.on("finished", function(manufacture, success, fail){
		/*status表示实例的爬取与存储状态*/
		rawthis.number -=1;
		console.log("%s crawler finished, succeed: %d, failed: %d", manufacture, success, fail);
		if(rawthis.number <= 0){
			console.log("crawling client finished...");
			process.exit(0);	/*爬虫任务完成，成功退出*/
		}
	})
}
util.inherits(Listener, events.EventEmitter);
// 遍历配置中的提供商，获取相应的模块句柄
var provider_list = [];
settings.manufacture.forEach(function(manu, index, array){
	console.log(manu);
	provider_list[index] = require("./"+manu);
});

/*初始化数据库连接，然后进行后续操作。*/
var listener = new Listener(provider_list.length);
dbhandle.initdb(function(err, mongoHnd){
	if(err)
		return console.log("Error in initializing database handle:", err);
	else{
		/*连接数据库成功，开始爬取数据*/ 
		var updateTime = Math.round(Date.now()/1000);
		provider_list.forEach(function(provider, index){
			console.log("Getting the price of manufacture: ", provider);
			provider.getPrice(mongoHnd, updateTime, listener);
		});
	}
});