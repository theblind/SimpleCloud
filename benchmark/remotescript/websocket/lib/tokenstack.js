// keep a  stack of token, the length is passed by params
var crypto = require("crypto");

module.exports = BenchmarkToken;

function BenchmarkToken(stacksize){
	this.tokens = [];
	this.currentsize = 0;
	this.stacksize = stacksize;
}

BenchmarkToken.prototype.init = function(){
	var rawthis = this;
	rawthis.tokens = [];
	for(var index = 0; index < rawthis.stacksize; index++){
		rawthis.addToken();
	}
	rawthis.currentsize = rawthis.stacksize;
}

BenchmarkToken.prototype.addToken = function(){
	var rawthis = this;
	var md5 = crypto.createHash("md5");
	md5.update(Date.now().toString());
	var hashedText = md5.digest("hex");
	rawthis.tokens.push(hashedText);
	rawthis.currentsize++;
}

BenchmarkToken.prototype.deleteToken = function(){
	var rawthis = this;
	rawthis.tokens.pop();
	rawthis.currentsize--;
	return rawthis.currentsize;
}

BenchmarkToken.prototype.getCurrent = function(){
	return this.tokens[this.currentsize-1];
}

BenchmarkToken.prototype.tokenpool = [];
