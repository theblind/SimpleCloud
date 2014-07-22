
// return the list of instance type
var http = require("http");
var requerystring = require("querystring");
var iconv =require("iconv-lite");
var BufferHelper = require("bufferhelper");

var tools = require("../../lib");

var inst_category = {
	"ondemand": [
		{
			os_type: "linux",
			os_text: "linux",
			os_value: "linux",
			filename: "linux-od"
		},
		{
			os_type: "windows",
			os_text: "Microsoft Windows",
			os_value: "mswin",
			filename: "mswin-od"
		},
		{
			os_type: "linux",
			os_text: "Red Hat Enterprice Linux",
			os_value: "rhel",
			filename: "rhel-od"
		},
		{
			os_type: "linux",
			os_text: "sles",
			os_value: "sles",
			filename: "sles-od"
		},
		{
			os_type: "windows",
			os_text: "MS Windows SQL Server",
			os_value: "mswinSQL",
			filename: "mswinSQL-od"
		},
		{
			os_type: "windows",
			os_test: "MS Windows SQL Web Server",
			os_value: "mswinSQLWeb",
			filename: "mswinSQLWeb-od"
		}
	]
}
var options = {
	host: "a0.awsstatic.com",
	/*empty for path*/
	method: "GET",
	headers: {
		"Host": "a0.awsstatic.com",
		"Connection": "keep-alive",
		"Cache-Control": "no-cache",
		"Accept": "*/*",
		"Pragma": "no-cache",
		"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36",
		"Referer": "http://aws.amazon.com/en/ec2/pricing/",
		"Accept-Language": "en;q=0.8",
	}
}
var manufacture = 'ec2';

module.counter = inst_category["ondemand"].length;

function request_group(callback_func){
	for(price_type in inst_category){
		for(index in inst_category[price_type]){
			var category_item = inst_category[price_type][index];
			var instance_info = {
				"os": {
					"type": category_item["os_type"],
					"text": category_item["os_text"],
					"value": category_item["os_value"]
				},
				"pricing_type": price_type
			};
			options.path = "/pricing/1/ec2/"+category_item["filename"]+".min.js?callback=callback&_=1405998219070";
			request_file(4, options, instance_info, function(err, bodyContent, extra_info){
				if(err){
					console.log("failed to crawl one file:'%s.min.js', kill the process now... ", category_item["filename"]);
					process.exit(1);	/*failure*/
				}
				else{
					module.counter--;
					return callback_func(module.counter, extra_info, bodyContent);
				}
			});
		}
	}
}

function request_file(timeout, options, extra_info, callback_func){
	// request the single js file
	if(timeout < 0)
		return callback_func("fail");
	var req = http.get(options, function(res){
		var buffer_helper = new BufferHelper();
		res.on("data", function(chunk){
			buffer_helper.concat(chunk);
		});
		res.on("end", function(){
			if(res.statusCode === 200){
				var bodyContent = eval(iconv.decode(buffer_helper.toBuffer(), "utf8"));
				return callback_func(null, bodyContent, extra_info);
			}
			else {
				console.log("fail to request %s.min.js, statusCode:%d.", category_item["filename"], res.statusCode);
				console.log("crawler will try to request it again...");
				return request_file(timeout-1, options, extra_info, callback_func);
			}
		});
	});
	req.on("error", function(err){
		console.log("error happened while requesting %s.min.js:%s", category_item["filename"], err);
		console.log("crawler will try to request it again...");
		return request_file(timeout-1, options, extra_info, callback_func);
	});
}

// get the json body content
function callback(param){
	return param['config'];
}
exports.get_instancetype_list = function(callback_func) {
	var instancetype_list = [];
	request_group(function(counter, instance_info, bodyContent){
		if(counter == 0){
			return callback_func(instancetype_list);
		}
		// analysis the bodyContent object
		for(index_by_region in bodyContent["regions"]){
			var item_by_region = bodyContent["regions"][index_by_region];
			var region = item_by_region["region"];
			for(var type_index in item_by_region["instanceTypes"]){
				var size_list = item_by_region["instanceTypes"][type_index]["sizes"];
				for(var size_index in size_list){
					var size_item = size_list[size_index];
					var instancetype = {
						"manufacture": "ec2",
						"alias_name": size_item["size"],
						"vcpu": Number(size_item["vCPU"]),
						"vram": Number(size_item["memoryGiB"]),
						"storage": 0,
						"band_width": 0,
						"region": region,
						"os_type": instance_info.os.type,
						"os_text": instance_info.os.text,
						"os_value": instance_info.os.value,
						"update_time": 123456
					};
					instancetype_list.push(instancetype);
				}
			}
		}
	});
	return false;
}

// return the list of instance price
exports.get_instanceprice_list = function(callback_func) {
	var instanceprice_list = [];
	request_group(function(counter, instance_info, bodyContent){
		if(counter == 0){
			return callback_func(instanceprice_list);
		}
		// analysis the bodyContent object
		for(index_by_region in bodyContent["regions"]){
			var item_by_region = bodyContent["regions"][index_by_region];
			var region = item_by_region["region"];
			for(var type_index in item_by_region["instanceTypes"]){
				var size_list = item_by_region["instanceTypes"][type_index]["sizes"];
				for(var size_index in size_list){
					var size_item = size_list[size_index];

					// tools.mergeobject(instanceprice, instance_info);
					var instanceprice = {
						"manufacture": manufacture,
						"alias_name": size_item["size"],
						"vcpu": Number(size_item["vCPU"]),
						"vram": Number(size_item["memoryGiB"]),
						"os": {
							"type": instance_info.os.type,
							"text": instance_info.os.text,
							"value": instance_info.os.value
						},
						"region": region,
						"pricing_type": instance_info.pricing_type,
						"band_width": 0.0,
						"storage": 0,
						"prices": size_item["valueColumns"][0]["prices"],
						"duration": 1,
						"pricing_cycle": "hour",
						"update_time": null
					};

					instanceprice_list.push(instanceprice);
				}
			}
		}
	});
}