// filename: settings.js
/*mysql root: simplecloudisgoingon
vm jasonniu: kfniuchao88
*/
var conf = {
	// 爬虫配置信息
	// manufacture: ["aliyun", "azure", "amazon", "qcloud"],
	manufacture: ["aliyun", "qcloud"],
	mongodb:{
		/*腾讯云*/
		host: "203.195.187.64",
		/*本地虚拟机*/
		/*host: "192.168.56.101",*/
		username: "simplecloud",
		password: "simplecloud",
		// username: "serverUser",
		// password: "U2ltcGxlQ2xvdWQ=",
		db: "simplecloud",
		collection: "vm_price"
	},
	mysql: {
		/*腾讯云*/
		host: "203.195.187.64",
		/* 本地虚拟机 */
		// host: "192.168.56.101",
		username: "simplecloud",
		password: "simplecloud",
		// username: "serverUser", 
		// password: "U2ltcGxlQ2xvdWQ=",
		db: "simplecloud",
		table_inuse: "benchmark_inuseinstancetype",
		table_history: "benchmark_instancetype"
	}
}

module.exports = conf;
