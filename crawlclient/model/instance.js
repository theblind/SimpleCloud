/* base.js*/
var util = require("util");

function Instance(dbHandle, initObj){
	this.instanceInfo = {
		"manufacture": null,
		"alias_name": null, 
		"vcpu": null,
		"vram": null,
		"os":null,
		"region": null,
		"pricing_type": [],
		"band_width": null,
		"storage": null,
		"prices": null,
		"duration": null,
		"pricing_cycle": null,
		"update_time": null
	};
	this.db = dbHandle;
	this.__init__(initObj);
}

Instance.prototype.__init__ = function(initObj){
	if(typeof initObj !== "object" || util.isArray(initObj))
		return false;
	for(var item in this.instanceInfo){
		if(item in initObj)
			this.instanceInfo[item] = initObj[item];
	}
	return true;
}

/*save操作完成后，执行回调函数*/
Instance.prototype.save = function(callback){
	if(!this.db){
		console.log("Error: No DB Handle, instance: %s, %s", this.instanceInfo.manufacture, this.instanceInfo.alias_name);
		console.dir(this);
		return callback("datebase not initialized!");
	}
	if(this.instanceInfo.vcpu && this.instanceInfo.vram &&this.instanceInfo.os && this.instanceInfo.prices){
		this.db.insertUpdate(this.instanceInfo, function(err){
			return callback(err);
		});
	}else{
		console.log("Instance information is not valid:");
		console.dir(this.instanceInfo);
		return callback("pricing information not valid");
	}
}

Instance.prototype.update = function(extrainfo){
	if(extrainfo.constructor.name !== "Object")
		return;			/*Invalid param*/
	for(var item in extrainfo){
		self.instanceInfo[item] = extrainfo[item];
	}
	return;
}
module.exports = Instance;