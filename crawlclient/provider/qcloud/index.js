var http = require("http")
	,querystring = require("querystring")
	,iconv = require("iconv-lite")
	,BufferHelper = require("bufferhelper"),
	util = require("util");

var Instance = require("../../model/instance.js");

/*准备虚拟机配置信息*/
var operatingSystem = {
	"CentOS": "centos6.2-64bit",
	"SUSE": "SUSE Linux Enterprise Server 10 (x86_64)",
	"Ubuntu": "ubuntu12-64bit",
	"Windows": "Xserver V8.1_64"
}
var CPUNumber = [1, 2, 4, 8, 12];
var RAMSize = [1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];

// var paramsString = querystring.stringify(queryContent);
// console.log(paramsString);
module.counter = 0;		/*记录的计数器*/
module.success = 0;
module.fail = 0;
exports.getPrice = function(mongoHnd, updateTime, listener){
	for(var cpu_index in CPUNumber){
		var cpu = CPUNumber[cpu_index];
		for(var ram_index in RAMSize){
			var mem = RAMSize[ram_index]
			// 内存容量值必须必CPU个数的值大
			if(mem < cpu)
				continue;
			// queryContent["goodsInfoArray[0][goodsDetail][storage]"] = storage || 0;
			for(var os in operatingSystem){
				var queryContent = {
					"mc_gtk": "",
					"goodsInfoArray[0][goodsCategoryId]": 1,
					"goodsInfoArray[0][goodsDetail][type]": "VSELF",
					"goodsInfoArray[0][goodsDetail][cpu]": cpu || 0,
					"goodsInfoArray[0][goodsDetail][mem]": mem || 0,
					"goodsInfoArray[0][goodsDetail][storage]": 0, 		//本地磁盘容量是10的倍数
					"goodsInfoArray[0][goodsDetail][bandwidth]": 0,
					"goodsInfoArray[0][goodsDetail][wanIp]": 1,
					"goodsInfoArray[0][goodsDetail][os]": operatingSystem[os],
					"goodsInfoArray[0][goodsDetail][curDeadline]": "0000-00-00",
					"goodsInfoArray[0][goodsDetail][timeSpan]": 1,
					"goodsInfoArray[0][goodsDetail][hasOnion]": true,
					"goodsInfoArray[0][goodsNum]": 1,
					"goodsInfoArray[0][payMode]": 1,
					"magic": 1,
					"payMode": 1
				};
				//创建用于插入数据的对象
				var instance = new Instance(mongoHnd, {
					manufacture: "QCloud",
					alias_name: "qcloud",
					vcpu: Number(cpu),
					vram: Number(mem),
					os:{
						type: os === "Windows" ? "windows" : "linux",
						text: os,
						value: operatingSystem[os]
					},
					region: null,
					pricing_type: ["ondemind"],
					band_width: 0,
					// storage: [{type: "localdisk", size: 0}],
					storage: 0,
					prices: {"RMB": 0.0},
					duration: 1,
					pricing_cycle: "month",
					update_time: updateTime
				});
				module.counter ++;
				/*组成虚拟机配置描述字符串，用于后面输出日志*/
				var paramsString = querystring.stringify(queryContent);
				/* call the CrawlPrice function */
				CrawlPrice(instance, paramsString, listener);
			}
		}
	}
}

/* Crawl the isntance pricing data and save into mongodb */
function CrawlPrice(instance, paramsString, listener){
	var path = "/ajax/shoppingcart/queryPrice.php";
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
			// "Cookie": "PHPSESSID=olm5j2g5hgcml5m0ifcfkc3vb1; PHPSESSID=olm5j2g5hgcml5m0ifcfkc3vb1; pgv_pvi=74093568; pgv_si=s7831986176",
			"Connection": "keep-alive"
		}
	};
	options.path = path+"?"+paramsString;
	sendrequest(instance, options, 5, function(status){
		module.counter--;
		if(status == true)
			module.success++;
		else if(status == false){
			console.log("retry timeout, instance is %s!", instance.instanceInfo.os.text);
			module.fail++;
		}
		if(module.counter <= 0){
			listener.emit("finished", "aliyun", module.success, module.fail);
		}
	});
}

function sendrequest(instance, options, retry_times, callback){
	if(retry_times < 0)
		return callback(false);
	var instanceDesc = "Qcloud instance: CPU:"+instance.instanceInfo.vcpu
			+" RAM:"+instance.instanceInfo.vram
			+" OS:"+instance.instanceInfo.os.text;
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
					if(contentObj["retcode"] !== 0){
						console.log("body content is:", contentObj);
						throw new Error(" Qcloud crawl failed!");
					}
					instance.instanceInfo.prices["RMB"] = contentObj["data"][0]["realCost"] / 100;
					instance.save(function(err){
						if(err){
							console.log("send request failed, %d times retry remain..", retry_times-1);
							return sendrequest(instance, options, retry_times-1, callback);
						}
						else{
							console.log("[Success] "+instanceDesc);
							return callback(true);
						}
					});
				}catch(err) {
					/*输出错误日志*/
					console.log("[Fail] "+instanceDesc+err+" bodyContent:"+JSON.stringify(contentObj));
					return sendrequest(instance, options, retry_times-1, callback);
				}
			}
		});
	}).on("error", function(error){
		console.log("Crawl qcloud failed! Error is: "+error.message);
		return sendrequest(instance, options, retry_times-1, callback);
	});
}