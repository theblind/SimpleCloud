var http = require("http")
	,querystring = require("querystring")
	,iconv = require("iconv-lite")
	,BufferHelper = require("bufferhelper");

var qcloudConf = require("../../settings");


/*准备虚拟机配置信息*/
var operatingSystem = qcloudConf.operatingSystem;
var CPUNumber = qcloudConf.CPUNumber;
var RAMSize = qcloudConf.RAMSize;

var options = {
	host: "manage.qcloud.com",
	path: "",
	method: "GET",
	headers:{
		"Host": "manage.qcloud.com",
		"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0",
		"Accept": "application/json, text/javascript, */*; q=0.01",
		"Accept-Language": "en-us,zh-cn;q=0.8,zh;q=0.5,en;q=0.3",
		"Accept-Encoding": "deflate",
		"X-Requested-With": "XMLHttpRequest",
		"Referer": "http://manage.qcloud.com/shoppingcart/shop.php?tab=cvm",
		"Cookie": "PHPSESSID=olm5j2g5hgcml5m0ifcfkc3vb1; PHPSESSID=olm5j2g5hgcml5m0ifcfkc3vb1; pgv_pvi=74093568; pgv_si=s7831986176",
		"Connection": "keep-alive"
	}
};

var queryContent = {
	"mc_gtk": "",
	"goodsInfoArray[0][goodsCategoryId]": 1,
	"goodsInfoArray[0][goodsDetail][type]": "VSELF",
	"goodsInfoArray[0][goodsDetail][cpu]": 0,
	"goodsInfoArray[0][goodsDetail][mem]": 0,
	"goodsInfoArray[0][goodsDetail][storage]": 0, 		//本地磁盘容量是10的倍数
	"goodsInfoArray[0][goodsDetail][bandwidth]": 0,
	"goodsInfoArray[0][goodsDetail][wanIp]": 1,
	"goodsInfoArray[0][goodsDetail][os]": "",
	"goodsInfoArray[0][goodsDetail][curDeadline]": "0000-00-00",
	"goodsInfoArray[0][goodsDetail][timeSpan]": 1,
	"goodsInfoArray[0][goodsDetail][hasOnion]": true,
	"goodsInfoArray[0][goodsNum]": 0,
	"goodsInfoArray[0][payMode]": 1,
	"magic": 1,
	"payMode": 1
/**********************************************************************
	goodsInfoArray: [
		{
			goodsCategoryId: 1,
			goodsDetail: {
				type: "VSELF",
				cpu: 0,
				mem: 0,
				storage: 0,
				bandwidth: 0,
				wanIp: 1,
				os: "",
				curDeadline: "0000-00-00",
				timeSpan: 0,
				hasOnion: true
			},
			goodsNum: 0
		}
	],
	magic: 1,
	payMode: 1
**********************************************************************/
};

// var paramsString = querystring.stringify(queryContent);
// console.log(paramsString);

exports.getPrice = function(mongoHnd){
	var dateTime = new Date().toLocaleString();
	var path = "/ajax/shoppingcart/queryPrice.php";
	for(var cpu in CPUNumber){
		queryContent["goodsInfoArray[0][goodsDetail][cpu]"] = cpu || 0;
		for(var mem in RAMSize){
			// 内存容量值必须必CPU个数的值大
			if(mem < cpu)
				continue;
			queryContent["goodsInfoArray[0][goodsDetail][mem]"] = mem || 0;
			// queryContent["goodsInfoArray[0][goodsDetail][storage]"] = storage || 0;
			for(var os in operatingSystem){
				queryContent["goodsInfoArray[0][goodsDetail][os]"] = operatingSystem[os];
				//创建用于插入数据的对象
				var mongoData = {
					"mark_data": {
						"manufacture": "tencent",
						"alias_name": "qcloud",
						"vcpu": Number(cpu),
						"vram": Number(mem),
						"os": {"text": os, "value": operatingSystem[os]},
						"region": null,
						"pricing_type": ["ondemand"],
					},
					"add_config": {
						"band-width": "",
						"storage": {"type": "localdisk", "size": 0},
					},
					"core_data": {
						"prices": {"RMB": 0.0},
						"duration": 1,
						"pricing_cycle": "month",
						"update_time": dateTime,
					}
				};
				/*组成虚拟机配置描述字符串，用于后面输出日志*/
				var instanceDesc = "Qcloud instance: CPU:"+mongoData["mark_data"]["vcpu"]
									+" RAM:"+mongoData["mark_data"]["vram"]
									+" OS:"+mongoData["mark_data"]["os"]["text"];
				var paramsString = querystring.stringify(queryContent);
				options.path = path+"?"+paramsString;
				http.get(options, function(res){
					var bufferHelper = new BufferHelper();
					res.on("data", function(chunk) {
						bufferHelper.concat(chunk);
					});

					res.on("end", function() {
						if(res.statusCode === 200){
							console.log("Crawl qcloud successfully... statusCode: 200");
							try{
								/*将返回的字符串内容转化成json，并提取有效部分*/
								var contentObj = JSON.parse(iconv.decode(bufferHelper.toBuffer(), "utf8"));
								if(contentObj["retcode"] !== 0)
									throw new Error("Qcloud crawl failed!");
								uploadtoMongo(mongoHnd, formateData(mongoData, contentObj["data"][0]));
								/*输出正确结果日志*/
								console.log("[Success] "+instanceDesc);
							}catch(err) {
								/*输出错误日志*/
								console.log("[Fail] "+instanceDesc+err);
							}finally {
								/*无操作*/
							}
						}
					});
					res.on("error", function(error){
						console.log("Crawl qcloud failed! Error is: "+error);
					});
				});
			}
		}
	}
}

function uploadtoMongo(mongoHnd, mongoData) {
	// 写入数据库
	mongoHnd.insertUpdate(mongoData, function(err){
		if(err)
			console.log("Update MongoDB failed! "+err);
	});
}

function formateData(mongoData, priceData) {
	mongoData["core_data"]["prices"]["RMB"] = priceData["realCost"]/100.0;
	return mongoData;
}
