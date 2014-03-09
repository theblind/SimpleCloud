var http = require("http");
var querystring = require("querystring");
var iconv = require("iconv-lite");
var BufferHelper = require("bufferhelper");
var cheerio = require("cheerio");

var azure_config = new Object();
var vm_switch = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"];
var os_switch = {
	"windows": "Windows",
	"linux": "Linux",
	"sql-server": "SQL Server",
	"biztalk-server": "Biztalk Server",
	// "oracle": "Oracle"
};

var options = {
	host: "www.windowsazure.com",
	path: "/en-us/pricing/details/virtual-machines/",
	headers: {
		"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0",
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		"Accept-Language": "en-us;q=0.8,en;q=0.3",
		"Connection": "keep-alive"
	}
}

function get_config(){
	return null;
}

function updatetoMongo(mongoHnd, $pricingDetail, vm_info){
	var dateTime = new Date().toLocaleString();
	var recordLine = {
		1: "A0",
		2: "A1",
		3: "A2",
		4: "A3",
		5: "A4",
		7: "A5",
		8: "A6",
		9: "A7"
	};
	for(var index in recordLine){
		console.log("index is "+index);
		var $line = $pricingDetail.find("tr").eq(index);
		// console.log($line.html());
		console.log($line.find("td").eq(1).text());
		console.log($line.find("td").eq(2).text());
		console.log($line.find("td").eq(3).find("span").eq(0).text());
		var mongo_data = {
			"mark_data": {
				"manufacture": "azure",
				"alias_name": recordLine[index],
				"vcpu": Number($line.find("td").eq(1).text()),
				"vram": Number($line.find("td").eq(2).text()),
				"os": {
					"text": os_switch[vm_info["os"]],
					"value": vm_info["os"]
				},
				"region": "Asia",
				"pricing_type": vm_info["pricing_type"],
			},
			"add_config": {
				"band-width": "",
				"Storage": ["1TB"],
			},
			"core_data":{
				"prices": $line.find("td").eq(2).find("span").eq(0).text(),
				"duration": "1",
				"pricing_cycle": "hour",
				"update_time": dateTime,
			}
		};
		mongoHnd.insertUpdate(mongo_data, function(err, docs){
			if(err){
				console.log(err);
			}
			else{
				console.log("Successfully update record "+docs._id);
			}
		});
	}
}

exports.getPrice = function(mongoHnd){
	http.get(options, function(res) {
		var bufferHelper = new BufferHelper();
		var data = "";
		res.on("data", function(chunk){
			bufferHelper.concat(chunk);
			data += chunk;
		});
		res.on("end", function() {
			if(res.statusCode == 200){
				console.log("Successfully...statusCode is: 200");
				console.log("Head is :", res.headers);
				var bodyContent = iconv.decode(bufferHelper.toBuffer(), "utf8");
				// 数据入库
				// var $html = $(bodyContent);
				var $ = cheerio.load(bodyContent);
				// console.log(bodyContent);
				for(var vmType in os_switch){
					var $pricingDetail = $(".paygo."+vmType);
					// console.log($pricingDetail.text());
					var vm_info = {
						"os": vmType,
						"pricing_type": ["ondemand"]
					}
					updatetoMongo(mongoHnd, $pricingDetail, vm_info);
					console.log("vmType is "+vmType);
				}
			}
			else{
				console.log("End with statusCode: ", res.statusCode);
				console.log(">>>> headers: ",res.headers);
			}
		});

		res.on("error", function(e){
			console.log("Got an error", e.message);
		});
	});
};