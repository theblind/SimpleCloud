var http = require("http");
var requerystring = require("querystring");
var iconv =require("iconv-lite");
var BufferHelper = require("bufferhelper");
var Instance = require("../../model/instance.js");

var request_switch = [
	"linux-od", "mswin-od", "rhel-od", "sles-od", "mswinSQL-od", "mswinSQLWeb-od",
	"linux-ri-light", "mswin-ri-light", "rhel-ri-light", "sles-ri-light", "mswinSQL-ri-light", "mswinSQLWeb-ri-light",
	"linux-ri-medium", "mswin-ri-medium", "rhel-ri-medium", "sles-ri-medium", "mswinSQL-ri-medium", "mswinSQLWeb-ri-medium",
	"linux-ri-heavy", "mswin-ri-heavy", "rhel-ri-heavy", "sles-ri-heavy", "mswinSQL-ri-heavy", "mswinSQLWeb-ri-heavy"
];
var query_path = "/pricing/ec2/";
var options = {
	host: "aws-assets-pricing-prod.s3.amazonaws.com",
	/*empty for path*/
	method: "GET",
	headers: {
		"Host": "aws-assets-pricing-prod.s3.amazonaws.com",
		"Connection": "keep-alive",
		"Cache-Control": "no-cache",
		"Accept": "*/*",
		"Pragma": "no-cache",
		"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36",
		"Referer": "http://aws.amazon.com/en/ec2/pricing/",
		"Accept-Language": "en;q=0.8",
	}
};

exports.getPrice = function(mongoHnd, updatetime){
	var counter = 0;
	for(var item in request_switch){
		// organize the query path
		options.path = query_path+request_switch[item]+".js?callback=callback&_=1390053649305";
		console.log("request path is ", options.path);
		http.get(options, function(res) {
			var bufferHelper = new BufferHelper();
			res.on("data", function(chunk) {
				bufferHelper.concat(chunk);
			});
			res.on("end", function(){
				if(res.statusCode === 200){
					console.log("Crawl AWS data successfully...statusCode is: 200");
					// console.log("Response.request is:", res.requests);
					try{
						var bodyContent = eval(iconv.decode(bufferHelper.toBuffer(), "utf8"));
						// 数据入库
						updatetoMongo(mongoHnd, bodyContent, updatetime);
					}catch(err){
						console.log("decode error "+err);
						// console.log(iconv.decode(bufferHelper.toBuffer(), "utf8"));
					}
					finally{
						console.log("Amazon EC2 %d categories crawled!", ++counter);
					}
				}else{
					console.dir({"Error": "HTTP Error", "Area": "Amazon EC2", "statusCode": res.statusCode});
					// console.log("Response body is :", iconv.decode(bufferHelper.toBuffer(), "utf8"));
				}
			});
			res.on("error", function(e){
				console.dir({"Error": "CrawlingException", "Area": "EC2", "Message": e});
			});
		});
	}
}

function updatetoMongo(mongoHnd, bodyContent, updateTime){
	for(var regionIndex in bodyContent["regions"]){
		var instsByRegion = bodyContent["regions"][regionIndex];
		var region = instsByRegion["region"];
		for(var typeIndex in instsByRegion["instanceTypes"]){
			var instType = instsByRegion["instanceTypes"][typeIndex];
			for(var instIndex in instType["sizes"]){
				var vmitem = instType["sizes"][instIndex];
				// console.log("数据入库");
				var instance = new Instance(mongoHnd, {
					manufacture: "Amazon EC2",
					alias_name: vmitem.size,
					vcpu: Number(vmitem.vCPU),
					vram: Number(vmitem.memoryGiB),
					os: {
						type: null,
						text: vmitem.valueColumns.name,
						value: vmitem.valueColumns.name
					},
					region: region,
					pricing_type: ["reserve"],
					band_width: null,
					storage: vmitem.storageGB,
					prices: vmitem.valueColumns.prices,
					duration: 1,
					pricing_cycle: "hour",
					update_time: updateTime
				});
				if(bodyContent["rate"] == "perhr"){
					instance.instanceInfo.duration = 1;
					instance.instanceInfo.pricing_cycle = "hour";
				}
				if(!instance.instanceInfo.prices){
					console.log("Error in analyzing Amazon EC2 prices, alias_name:%s", instance.instanceInfo.alias_name);
					console.dir(instance.instanceInfo);
					return;
				}
				instance.save();
			}
		}
	}
}

function callback(content){
	return content["config"];
}