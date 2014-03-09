/*包含获取阿里云数据的方法、变量列表等*/
var http = require("http");
var querystring = require("querystring");

var iconv = require("iconv-lite");
var BufferHelper = require("bufferhelper")

var vm_config = {
	"commodityCode": "vm",
	"data": {
		"vm_cpu": "4",
		"vm_ram": "2048",
		"vm_bandwidth": "0",
		"vm_region_no": "cn-qingdao-cm5-a01",
		"vm_os": "",
		"vm_disk": [],
		"duration": "1",
		"pricing_cycle": "month",
		"quantity": "1",
		"vm_yundun_monitor": "1",
		"vm_yundun_service": "1"
	}
};

var cpu_ram_choice = [
	{
		"vm_cpu": "1",
		"vm_ram":["512", "1024", "1536", "2048", "4096"],
	},
	{
		"vm_cpu": "2",
		"vm_ram":["1536", "2048", "2560", "4096", "8192"],
	},
	{
		"vm_cpu": "4",
		"vm_ram": ["4096", "8192", "12288", "16384"],
	},
	{
		"vm_cpu": "8",
		"vm_ram": ["8192", "12288", "16284", "24576", "32768"],
	}
];

var os_choice = {
	"linux":[
		{
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        },
        {
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        },
        {
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        },
        {
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        },
        {
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        },
        {
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        },
        {
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        },
        {
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        },
        {
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        },
        {
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        },

    ],
	"windows":[
        {
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        },
        {
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        },
        {
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        },
        {
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        },
	]
};
var cpu_ram = {
	"size1": {"vm_cpu": "1", "vm_ram": "2048"},
	"size2": {"vm_cpu": "2", "vm_ram": "4096"},
	"size3": {"vm_cpu": "4", "vm_ram": "8192"},
	"size4": {"vm_cpu": "8", "vm_ram": "16384"}
};

var options = {
	host: "buy.aliyun.com",
	path: "/ajax/BillingAjax/getBuyPrice.json",
	method: "POST",
};

function request_price(mongoHnd, options, contents, config){
	options["headers"] = {
		"Content-Type": "application/x-www-form-urlencoded",
		"Content-Length": contents.length
	};
	var dateTime = new Date().toLocaleString();
	var req = http.request(options, function(res) {

		var bufferHelper = new BufferHelper();

		res.on("data", function(chunk) {
			bufferHelper.concat(chunk);
		});

		res.on("end", function(){
			if(res.statusCode == 200){
				console.log("Successfully....Status Code is 200");
				// console.log("Head is", res.headers);
				var bodyContent = JSON.parse(iconv.decode(bufferHelper.toBuffer(), "utf8"));
				console.log(bodyContent);
				// 数据入库
				var mongo_data = {
					"mark_data": {
						"manufacture": "aliyun",
						"alias_name": "Virtual Machine",
						"vcpu": Number(config["vm_cpu"]),
						"vram": Number(config["vm_ram"]),
						"os": config["vm_os"],
						"region": "qingdao",
						"pricing_type": ["ondemand", "reserve"],
					},
					"add_config": {
						"band-width": "",
						"Storage":[],
					},
					"core_data": {
						"prices": {"RMB": bodyContent["data"]["order"]["tradeAmount"]},
						"duration": config["duration"],
						"pricing_cycle": config["pricing_cycle"],
						"update_time": dateTime,
					}
				};
				updateToMongo(mongoHnd, mongo_data);
				// console.log(mongo_data);
			}else {
				console.log("Status code is : "+res.statusCode);
				console.log("Head is", res.headers);
			}
		});

		res.on("error", function(err) {
			console.log(err);
		});
	});
	req.write(contents);
	req.end();
}

function updateToMongo(mongoHnd, mongo_data){
	mongoHnd.insertUpdate(mongo_data, function(err, docs){
		if(err){
			console.log(err);
		}
		else {
			console.log("Successfully update aliyun vm prices!")
		}
	});
}

exports.description = "The module make way to get aliyun pricing.";

exports.getPrice = function(mongoHnd){
	for(var index in cpu_ram_choice){
		var ram_by_cpu = cpu_ram_choice[index];
		for(var ram_size in ram_by_cpu["vm_ram"]){
			vm_config["data"]["vm_cpu"] = ram_by_cpu["vm_cpu"];
			vm_config["data"]["vm_ram"] = ram_by_cpu["vm_ram"][index];

			for(var os_index in os_choice["linux"]){
				var config = new Object();
				config["vm_ram"] = vm_config["data"]["vm_ram"];
				config["vm_cpu"] = vm_config["data"]["vm_cpu"];
				config["vm_os"] = os_choice["linux"][os_index];

				config["duration"] = vm_config["data"]["duration"];
				config["pricing_cycle"] = vm_config["data"]["pricing_cycle"];

				// vm_config["data"]["vm_os"] = os_choice["linux"][os_index]["value"];
				vm_config["data"]["vm_os"] = "";
				var pre_data = JSON.stringify([vm_config,]);
				var post_data = new Buffer(pre_data).toString("base64");
				var contents = querystring.stringify({data: post_data});
				request_price(mongoHnd, options, contents, config);
			}
			for(var os_index in os_choice["windows"]){
				// 512M内存不支持Windows系统。
				if(vm_config["data"]["vm_ram"] === "512")
					continue;
				var config = new Object();
				config["vm_ram"] = vm_config["data"]["vm_ram"];
				config["vm_cpu"] = vm_config["data"]["vm_cpu"];
				config["vm_os"] = os_choice["linux"][os_index];
				config["duration"] = vm_config["data"]["duration"];
				config["pricing_cycle"] = vm_config["data"]["pricing_cycle"];

				// vm_config["data"]["vm_os"] = os_choice["linux"][os_index]["value"];
				vm_config["data"]["vm_os"] = "";

				var pre_data = JSON.stringify([vm_config,]);
				var post_data = new Buffer(pre_data).toString("base64");
				var contents = querystring.stringify({data: post_data});
				request_price(mongoHnd, options, contents, config);
			}
		}
	}
};
