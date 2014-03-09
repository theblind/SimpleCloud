var mongoAgent = require("../../lib/mongodb");

module.exports = function(app){
	app.get("/", function(req, res){
		res.send({"status": "error", "result": "Hello, world!"});
	});

	app.get("/pricing", function(req, res){
		var method = req.query.method;
		var alloc = req.query.alloc;
		console.log("alloc:", alloc);
		try{
			var vcpu = Number(alloc["vcpu"]);
			var vram = Number(alloc["vram"]);
			var operatingSystem = alloc["os"];
		}catch(err){
			return res.send({
				"method": method || "Unknown",
				"status": "error"
			});
		}
		/* get the matched data from mongodb */
		mongoAgent.matchInstance({
			vcpu: vcpu,
			cram: vram,
			os: operatingSystem
		}, function(err, docs){
			console.log(err, docs);
			var queryResult = {
				"method": "vm_price",
				"status": null
			};
			if(err){
				console.log("查询失败！", err);
				queryResult["status"] = "fail";
			}else {
				queryResult["status"] = "success";
				queryResult["result"] = docs;
			}
			res.send(queryResult);
		});
	});
};