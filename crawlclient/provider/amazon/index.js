var http = require("http");

var Instance = require("../../model/instance.js");

var awsmeta = require("./metadata.js");


module.counter = 0;
module.success = 0;
module.fail = 0;

exports.getPrice = function(mongoHnd, updatetime, listener) {
	awsmeta.get_instanceprice_list(function(instancetype_list){
		module.counter = instancetype_list.length;
		console.log("%d instance type totally", module.counter);
		instancetype_list.forEach(function(element, index, raw_array){
			element.update_time = updatetime;
			var instance = new Instance(mongoHnd, element);

			instance.save(function(err){
				if(err){
					console.log("fail to save instance price into mongodb..");
					module.fail++;
				}
				else {
					module.success++;
				}
				module.counter--;
				if(module.counter <= 0){
					listener.emit("finished", "amazon", module.success, module.fail);
				}
			})
		})
	})
}
// exports.getPrice = function(mongoHnd, updatetime){
// 	var counter = 0;
// 	for(var item in request_switch){
// 		// organize the query path
// 		options.path = query_path+request_switch[item]+".js?callback=callback&_=1390053649305";
// 		console.log("request path is ", options.path);
// 		http.get(options, function(res) {
// 			var bufferHelper = new BufferHelper();
// 			res.on("data", function(chunk) {
// 				bufferHelper.concat(chunk);
// 			});
// 			res.on("end", function(){
// 				if(res.statusCode === 200){
// 					console.log("Crawl AWS data successfully...statusCode is: 200");
// 					// console.log("Response.request is:", res.requests);
// 					try{
// 						var bodyContent = eval(iconv.decode(bufferHelper.toBuffer(), "utf8"));
// 						// 数据入库
// 						updatetoMongo(mongoHnd, bodyContent, updatetime);
// 					}catch(err){
// 						console.log("decode error "+err);
// 						// console.log(iconv.decode(bufferHelper.toBuffer(), "utf8"));
// 					}
// 					finally{
// 						console.log("Amazon EC2 %d categories crawled!", ++counter);
// 					}
// 				}else{
// 					console.dir({"Error": "HTTP Error", "Area": "Amazon EC2", "statusCode": res.statusCode});
// 					// console.log("Response body is :", iconv.decode(bufferHelper.toBuffer(), "utf8"));
// 				}
// 			});
// 			res.on("error", function(e){
// 				console.dir({"Error": "CrawlingException", "Area": "EC2", "Message": e});
// 			});
// 		});
// 	}
// }

// function updatetoMongo(mongoHnd, bodyContent, updateTime){
// 	for(var regionIndex in bodyContent["regions"]){
// 		var instsByRegion = bodyContent["regions"][regionIndex];
// 		var region = instsByRegion["region"];
// 		for(var typeIndex in instsByRegion["instanceTypes"]){
// 			var instType = instsByRegion["instanceTypes"][typeIndex];
// 			for(var instIndex in instType["sizes"]){
// 				var vmitem = instType["sizes"][instIndex];
// 				// console.log("数据入库");
// 				var instance = new Instance(mongoHnd, {
// 					manufacture: "Amazon EC2",
// 					alias_name: vmitem.size,
// 					vcpu: Number(vmitem.vCPU),
// 					vram: Number(vmitem.memoryGiB),
// 					os: {
// 						type: null,
// 						text: vmitem.valueColumns.name,
// 						value: vmitem.valueColumns.name
// 					},
// 					region: region,
// 					pricing_type: ["reserve"],
// 					band_width: null,
// 					storage: vmitem.storageGB,
// 					prices: vmitem.valueColumns.prices,
// 					duration: 1,
// 					pricing_cycle: "hour",
// 					update_time: updateTime
// 				});
// 				if(bodyContent["rate"] == "perhr"){
// 					instance.instanceInfo.duration = 1;
// 					instance.instanceInfo.pricing_cycle = "hour";
// 				}
// 				if(!instance.instanceInfo.prices){
// 					console.log("Error in analyzing Amazon EC2 prices, alias_name:%s", instance.instanceInfo.alias_name);
// 					console.dir(instance.instanceInfo);
// 					return;
// 				}
// 				instance.save();
// 			}
// 		}
// 	}
// }

// function callback(content){
// 	return content["config"];
// }