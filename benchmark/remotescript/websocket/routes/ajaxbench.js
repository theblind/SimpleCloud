// response a data block according to the request buffsize

exports.index = function(req, res){
	 if(req.method !== "GET"){
	 	return res.send({status: "error", msg: "invalid method"});
	 }
	 try{
		 var buffsize = req.query.buffsize;
		 var datablock = generate_block(buffsize);
		 return res.send(datablock);
	 }
	 catch(err){
	 	return res.send({"status": "fail", "msg": "bad params"});
	 }
}

function generate_block(buffsize){
	var buffer = new Array(buffsize+1);
	return buffer.toString();
}