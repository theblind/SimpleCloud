/*mongodb.js*/
var MongoClient = require("mongodb").MongoClient;

module.exports = MongoDB;

function MongoDB(){
	this.db = null;
	this.queue = [];
}

MongoDB.prototype.__init__ = function(){
	var rawthis = this;
	console.log("connecting to mongodb...");
	MongoClient.connect("mongodb://127.0.0.1:27017/benchmark", function(err, db){
		if(err)
			throw err;
		rawthis.db = db;
		rawthis.pickout();
		console.log("mongodb connected successfully.....");
	});
};
/*pickout the stored request in queue and deal with then*/
MongoDB.prototype.pickout = function(){
	var rawthis = this;
	rawthis.queue.forEach(function(query, index){
		if(query.operate == "save")
			rawthis.save(query.colle, query.params[0], query.callback);
	});
};

MongoDB.prototype.save = function(collection, criteria, callback){
	var rawthis = this;
	if(rawthis.db == null){
		rawthis.queue.push({
			operate: "save",
			colle: collection,
			params: [criteria,],
			callback: callback
		});
		console.log("mongodb query has been stored");
		return;
	}
	var colle  = rawthis.db.collection(collection);
	return colle.insert(criteria, callback);
}

MongoDB.prototype.getall = function(collection, criteria,callback){
	var rawthis = this;
	if(rawthis == null){
		console.log("mongodb query has been stored");
		return rawthis.queue.push({
			operate: "getall",
			colle: collection,
			params: [criteria,],
			callback: callback
		});
	}
	var colle = rawthis.db.collection(collection);
	return colle.find(criteria,callback);
}