/*包含获取阿里云数据的方法、变量列表等*/
var http = require("http"),
	querystring = require("querystring"),
	iconv = require("iconv-lite"),
	BufferHelper = require("bufferhelper");
var Instance = require("../../model/instance.js");
var metadata = require("./metadata.js");
var CPU_RAM_LIST = metadata.config.CPU_RAM_LIST;

var os_choice = metadata.config.os_choice;

exports.description = "The module make way to get aliyun pricing.";
module.counter = 0;
module.success = 0;
module.fail = 0;

exports.getPrice = function(mongoHnd, updatetime, listener){
	for(var typeIndex in ["reserve", "ondemand"])
	{
		var rentType = ["reserve", "ondemand"][typeIndex];
		for(var ramByCpuIndex in CPU_RAM_LIST[rentType])
		{
			var ramByCpu = CPU_RAM_LIST[rentType][ramByCpuIndex];
			for(var ramIndex in ramByCpu["vm_ram"])
			{
				var informations = {
					"commodityCode": typeIndex === 0? "vm": "ecs",
					"data": {
						"vm_cpu": ramByCpu.vm_cpu,
						"vm_ram": ramByCpu.vm_ram[ramIndex],
						"vm_bandwidth": "0",
						"vm_region_no": "cn-qingdao-cm5-a01",
						"vm_os": "",
						"vm_disk": [],
						"duration": "1",
						"pricing_cycle": typeIndex === 0 ? "month" : "hour",
						"quantity": "1",
						"vm_yundun_monitor": "1",
						"vm_yundun_service": "1"
					}
				};
				for(var osIndex in os_choice){
					if(Number(informations.data.vm_ram) <= 512 && os_choice[osIndex].type === "windows"){
						continue;
					}
					// informations.data.vm_os = os_choice[ostype][osIndex].value;
					informations.data.vm_os = "";
					var instance = new Instance(mongoHnd, {
						"manufacture": "Aliyun", "alias_name": "Virtual Machine",
						"vcpu": Number(informations.data.vm_cpu),
						"vram": Number(informations.data.vm_ram)/1024,
						"os": os_choice[osIndex],
						"region": "cn-qingdao-cm5-a01",
						"pricing_type": rentType,
						"band_width": 0,
						"storage":0,
						"duration": informations.data.duration,
						"pricing_cycle": informations.data.pricing_cycle,
						"update_time": updatetime
					});
					module.counter++;
					var pre_data = JSON.stringify([informations]);
					CrawlPrice(instance, pre_data, listener);
				}
			}
		}
	}
};


function CrawlPrice(instance, pre_data, listener){
	var post_data = new Buffer(pre_data).toString("base64");
	var contents = querystring.stringify({data: post_data});
	var options = {
		host: "buy.aliyun.com",
		path: "/ajax/BillingAjax/getBuyPrice.json",
		method: "POST",
	};
	options["headers"] = {
		"Content-Type": "application/x-www-form-urlencoded",
		"Content-Length": contents.length
	};
	var retry_times = 5;
	sendrequest(instance, options, contents, retry_times, function(status){
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


function sendrequest(instance, options, contents, retry_times, callback) {
	/* retry timeout */
	if(retry_times < 0)
		return callback(false);
	var rawthis = this;
	var req = http.request(options, function(res) {
		var bufferHelper = new BufferHelper();
		res.on("data", function(chunk) {
			bufferHelper.concat(chunk);
		});
		res.on("end", function(){
			if(res.statusCode == 200){
				try{
					var bodyContent = JSON.parse(iconv.decode(bufferHelper.toBuffer(), "utf8"));
					// 数据入库
					if(!bodyContent["data"]["order"]){
						throw new Error("Wrong body content!");
					}
					/* 正常 */
					instance.instanceInfo.prices = {"RMB": bodyContent["data"]["order"]["tradeAmount"]};
					instance.save(function(err){
						console.log(instance.instanceInfo.os.text);
						/* if error happened, recall the sendrequest function */
						if(err){
							console.log("send request failed, %d times retry remain", retry_times);
							return sendrequest(instance, options, contents, retry_times-1, callback);
						}
						/* if send request successfully, then call the callback function */
						else {
							console.log("done!");
							return callback(true);
						}
					});
				}
				catch(err){
					/*爬虫获取的数据有问题*/
					console.dir({"Error": "ErrorPriceContent","Module": "Aliyun", "Message": bodyContent, "exception": err});
					return sendrequest(instance, options, contents, retry_times-1, callback);
				}
			}else {
				console.log("HTTP error status code is : "+res.statusCode);
				// console.log("Head is", res.headers);
				return sendrequest(instance, options, contents, retry_times-1, callback);
			}
		});
	});
	req.on("error", function(err) {
		console.dir({"Error": "CrawlingException", "Area":"Aliyun", "Message": err.message});
		// if(module.counter <= 0){
		// 	listener.emit("finished", "aliyun", module.success, module.fail);
		// }
		return sendrequest(instance, options, contents, retry_times-1, callback);
	});
	req.write(contents);
	req.end();
}