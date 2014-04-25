// index.js

/* merge the attribution in extraobject into rawobject */
exports.mergeobject = function(rawobject, extraobject) {
	if(rawobject.constructor.name != "Object" || extraobject.constructor.name != "Object"){
		throw new Error("params must be Object type, but "+rawobject.constructor.name +" "
			+extraobject.constructor.name+" is given!");
	}
	for(var item in extraobject){
		rawobject[item] = extraobject[item];
	}
	return true;
}