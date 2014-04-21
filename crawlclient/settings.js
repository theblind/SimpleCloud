// filename: settings.js
/*mysql root: simplecloudisgoingon
vm jasonniu: kfniuchao88
*/
var conf = {
	// 爬虫配置信息
	manufacture: ["aliyun", "azure", "amazon", "qcloud"],
	mongodb:{
		// host: "42.159.133.71",
		host: "192.168.56.101",
		username: "serverUser",
		password: "simplecloudisgoingon",
		db: "simplecloud",
		collection: "vm_price"
	}
}

module.exports = conf;
