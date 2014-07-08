/*包含获取阿里云数据的方法、变量列表等*/
var http = require("http"),
	querystring = require("querystring"),
	iconv = require("iconv-lite"),
	BufferHelper = require("bufferhelper");
var Instance = require("../../model/instance.js");

var CPU_RAM_LIST = {
	"reserve": [
		{
			"vm_cpu": "1",
			"vm_ram":["512", "1024", "1536", "2048", "4096"],
		},
		{
			"vm_cpu": "2",
			"vm_ram":["2048", "4096", "8192"],
		},
		{
			"vm_cpu": "4",
			"vm_ram": ["4096", "8192", "16384"],
		},
		{
			"vm_cpu": "8",
			"vm_ram": ["8192", "16384", "32768"],
		},
		{
			"vm_cpu": "16",
			"vm_ram": ["65536"]
		}
	],
	"ondemand": [
		{
			"vm_cpu": "1",
			"vm_ram": ["512"]
		},
		{
			"vm_cpu": "2",
			"vm_ram": ["2048", "4096", "8192"]
		},
		{
			"vm_cpu": "4",
			"vm_ram": ["8192", "16384"]
		}
	]
}



var os_choice = {
	"linux":[
		{
			"type": "linux",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        },
        {
        	"type": "linux",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        },
        {
        	"type": "linux",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        },
        {
        	"type": "linux",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        },
        {
        	"type": "linux",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        },
        {
        	"type": "linux",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        },
        {
        	"type": "linux",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        },
        {
        	"type": "linux",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        },
        {
        	"type": "linux",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        },
        {
        	"type": "linux",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        },

    ],
	"windows":[
        {
        	"type": "windows",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        },
        {
        	"type": "windows",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        },
        {
        	"type": "windows",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        },
        {
        	"type": "windows",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        },
	]
};

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
				for(var ostype in os_choice){
					for(var osIndex in os_choice[ostype]){
						if(Number(informations.data.vm_ram) <= 512 && ostype === "windows"){
							break;
						}
						// informations.data.vm_os = os_choice[ostype][osIndex].value;
						informations.data.vm_os = "";
						var instance = new Instance(mongoHnd, {
							"manufacture": "Aliyun", "alias_name": "Virtual Machine",
							"vcpu": Number(informations.data.vm_cpu),
							"vram": Number(informations.data.vm_ram)/1024,
							"os": os_choice[ostype][osIndex],
							"region": "qingdao",
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