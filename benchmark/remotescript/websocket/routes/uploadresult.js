/*deal with the uploaded benchmark result*/
var mongodb = new require("../lib/mongodb");

exports.index = function(req, res) {
	if(req.method == "GET") {
		return res.send({
			statue: "error",
			msg: "bad method"
		});
	}
	/*the reght method */
	try{
		var result = {
			type: req.body.type,
			buffsize: req.body.buffsize,
			rtt: req.body.rtt,
			timestamp: Date.now()
		}
		mongodb.save("rttbench", result, function(err, docs){
			if(err)
				return console.log("fail to insert new benchmark result: ", err);
		});
	}
	catch(err){
		console.log("fail to deal with benchmark result, content:");
		var content = JSON.stringify({type: req.body.type, buffsize: req.body.buffsize, rtt: req.body.rtt});
		console.log(content);
	}
}