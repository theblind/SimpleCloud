/* the entry of the project */
var util = require("util"),
	events = require("events");

var settings = require("./settings"),
	dbhandle = require("./model/mongodb.js"),
	synchronize = require("./crawlsync");

function Listener(providerNumber, updateTime){
	var rawthis = this;
	events.EventEmitter.call(this);
	this.updateTime = updateTime;
	this.number = providerNumber;
	this.on("finished", function(manufacture, success, fail){
		/*status表示实例的爬取与存储状态*/
		rawthis.number -=1;
		console.log("%s crawler finished, succeed: %d, failed: %d", manufacture, success, fail);
		if(rawthis.number == 0){
			console.log("crawling clients all finished...");
			/*执行爬虫数据同步操作*/
			synchronize.sync(rawthis);
		}
	});
	this.on("synchronized", function(success, fail){
		console.log("synchronized successfully! total:%d, success:%d, fail:%d", success+fail, success, fail);
		process.exit(0);	/*爬虫任务完成，成功退出*/
	});
}
util.inherits(Listener, events.EventEmitter);
// 遍历配置中的提供商，获取相应的模块句柄
var provider_list = [];
settings.manufacture.forEach(function(manu, index, array){
	console.log(manu);
	provider_list[index] = require("./provider/"+manu);
});

/*初始化数据库连接，然后进行后续操作。*/
var updateTime = Math.round(Date.now()/1000);
var listener = new Listener(provider_list.length, updateTime);
dbhandle.initdb(function(err, mongoHnd){
	if(err)
		return console.log("Error in initializing database handle:", err);
	else{
		/*连接数据库成功，开始爬取数据*/ 
		provider_list.forEach(function(provider, index){
			console.log("Getting the price of manufacture: ", provider);
			provider.getPrice(mongoHnd, updateTime, listener);
		});
	}
});