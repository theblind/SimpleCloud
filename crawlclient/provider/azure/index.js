var http = require("http");
var querystring = require("querystring");
var iconv = require("iconv-lite");
var BufferHelper = require("bufferhelper");
var cheerio = require("cheerio");
var Instance = require("../../model/instance.js");

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

exports.getPrice = function(mongoHnd, updateTime){
	http.get(options, function(res) {
		var bufferHelper = new BufferHelper();
		// var data = "";
		res.on("data", function(chunk){
			bufferHelper.concat(chunk);
			// data += chunk;
		});
		res.on("end", function() {
			if(res.statusCode == 200){
				console.log("Crawling azure pricing page successfully...statusCode is: 200");
				var bodyContent = iconv.decode(bufferHelper.toBuffer(), "utf8");
				// 组织数据
				var $ = cheerio.load(bodyContent);
				// console.log(bodyContent);
				for(var vmType in os_switch){
					var $pricingDetail = $(".paygo."+vmType);
					// console.log($pricingDetail.text());
					var instance = new Instance(mongoHnd, {
						os: {
							manufacture: "Windows Azure",
							type: vmType,
							text: os_switch[vmType],
							value: vmType
						},
						pricing_type: ["ondemand"]
					});
					organizeDate(instance, $pricingDetail, updateTime);
				}
			}
			else{
				console.dir({"Error": "HTTPError", "Area": "Azure", "statusCode": res.statusCode});
			}
		});

		res.on("error", function(e){
			console.log("Got an error", e.message);
		});
	});
};

/* Organize the instance information and pricing information from dom elements
*  and save into mongodb
*/
function organizeDate(instance, $pricingDetail, updateTime){
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
		instance.update({
			alias_name: recordLine[index],
			vcpu: Number($line.find("td").eq(1).text()),
			vram: Number($line.find("td").eq(2).text()),
			region: "Asia",
			band_width: null,
			storage: ["1TB"],
			prices: $line.find("td").eq(2).find("span").eq(0).text(),
			duration: 1,
			pricing_cycle: "hour",
			update_time: updateTime
		});
		instance.save();
	}
}