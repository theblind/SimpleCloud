// response a data block according to the request buffsize
var BenchmarkToken = require("../lib/tokenstack");

global.wstoken = new BenchmarkToken(100);
wstoken.init();

exports.index = function(req, res){
	 if(req.method !== "GET"){
	 	return res.send({status: "error", msg: "invalid method"});
	 }
	 try{
		 var buffsize = Number(req.query.buffsize);
		 console.log("buffsize is %d", buffsize);
		 var datablock = generate_block(buffsize);
		 console.log("generated data block size is %d", datablock.length);
		 var data = wstoken.getCurrent();
		 data = data + datablock;
		 res.send(data);
		 wstoken.addTokenPool();
		 return;
	 }
	 catch(err){
	 	return res.send({"status": "fail", "msg": "bad params"});
	 }
}

function generate_block(length){
	if(typeof length !== "number" || length < 0){
		throw new Error("invalid buffer length...");
	}
	var buffer = new Array(length+1);

	var data = buffer.toString();
	return data;
}