/*deal with the uploaded benchmark result*/
var MongoDB = new require("../lib/mongodb");
var mongodb = new MongoDB();
mongodb.__init__();
exports.index = function(req, res) {
	if(req.method == "GET") {
		return res.send({
			statue: "error",
			msg: "bad method"
		});
	}
	/*the reght method */
	try{
		var token = req.body.token;
		var index = wstoken.tokenpool.indexOf(token)
		if( index < 0){
			return res.send({"status": "fail", "msg": "invalid token"});
		}
		/*delete the token from token pool */
		wstoken.tokenpool.splice(index, 1);
		var result = {
			type: req.body.type,
			buffsize: req.body.buffsize,
			rtt: req.body.rtt,
			address: req.ip,
			timestamp: Date.now() / 1000
		}
		console.log("authorized token successfully");
		mongodb.save("rttbench", result, function(err, docs){
			if(err)
				return console.log("fail to insert new benchmark result: ", err);

		});
		return res.send({"status": "success", "msg": "record saved"});
	}
	catch(err){
		console.log("fail to deal with benchmark result, content:");
		var content = JSON.stringify({type: req.body.type, buffsize: req.body.buffsize, rtt: req.body.rtt});
		console.log(content);
		return res.send({"status": "fail", "msg": "exception happened"});
	}
}