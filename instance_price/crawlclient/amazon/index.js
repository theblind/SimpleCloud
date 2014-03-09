var http = require("http");
var requerystring = require("querystring");
var iconv =require("iconv-lite");
var BufferHelper = require("bufferhelper");
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
		// "Host": "aws.amazon.com",
		// "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0",
		// "Accept": "application/json, text/javascript, */*; q=0.01",
		// "Accept-Language": "en-us;q=0.8,,en;q=0.3",
		// "X-Requested-With": "XMLHttpRequest",
		// "Referer": "http://aws.amazon.com/en/ec2/pricing",
		// "Connection": "keep-alive"
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

function updatetoMongo(mongoHnd, bodyContent){

	var dateTime = new Date().toLocaleString();
	for(var regionIndex in bodyContent["regions"]){
		var instsByRegion = bodyContent["regions"][regionIndex];
		var region = instsByRegion["region"];
		for(var typeIndex in instsByRegion["instanceTypes"]){
			var instType = instsByRegion["instanceTypes"][typeIndex];
			for(var instIndex in instType["sizes"]){
				var instance = instType["sizes"][instIndex];
				console.log("数据入库");
				var mongo_data = {
					"mark_data": {
						"manufacture": "amazon",
						"alias_name": instance["size"],
						"vcpu": Number(instance["vCPU"]),
						"vram": Number(instance["memoryGiB"]),
						"os": {"text": instance["valueColumns"]["name"], "value": instance["valueColumns"]["name"]},
						"region": region,
						"pricing_type": ["ondemand"],
					},
					"add_config": {
						"band-width": "",
						"Storage": [instance["storageGB"]],
					},
					"core_data":{
						"prices": instance["valueColumns"]["prices"],
						"duration": 1,
						"pricing_cycle": "hour",
						"update_time": dateTime,
					}
				};
				if(bodyContent["rate"] == "perhr"){
					mongo_data["core_data"]["duration"] = "1";
					mongo_data["core_data"]["pricing_cycle"] = "hour";
				}
				console.log("$$$$ mongo_data is: "+mongo_data);
				mongoHnd.insertUpdate(mongo_data, function(err, docs){
					if(err){
						console.log(err);
					}
					else{
						console.log("Successfully update data of "+docs._id);
					}
				});
			}
			
		}
	}
}

function callback(content){
	return content["config"];
}
exports.getPrice = function(mongoHnd) {
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
						
						updatetoMongo(mongoHnd, bodyContent);
					}catch(err){
						console.log("decode error "+err);
						// console.log(iconv.decode(bufferHelper.toBuffer(), "utf8"));
					}
					finally{
						console.log("subsite is "+counter+"\n");
						counter++;
					}
				}else{
					console.log("Status code is :", res.statusCode);
					console.log("Response headers is :", res.headers);
					// console.log("Response body is :", iconv.decode(bufferHelper.toBuffer(), "utf8"));
				}
			});
			res.on("error", function(e){
				console.log("Error happened: ", e);
			});
		});
	}
}
