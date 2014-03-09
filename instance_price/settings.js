// filename: settings.js
/*mysql root: simplecloudisgoingon
vm jasonniu: kfniuchao88
*/
var conf = {
	// API Server 配置信息
	apiserver: {
		port: 6789,
	},

	// 爬虫配置信息
	manufacture: ["aliyun", "azure", "amazon", "qcloud"],
	mongodb:{
		host: "42.159.133.71",
		username: "server",
		password: "simplecloudisgoingon",
		db: "simplecloud",
		collection: "vm_price"
	},
	//  腾讯云配置信息
	qcloudConf: {
		operatingSystem: {
			"CentOS": "centos6.2-64bit",
			"Ubuntu": "ubuntu12-64bit",
			"Windows": "Xserver+V8.1_64"
		},
		CPUNumber: [1, 2, 4, 8, 12],
		RAMSize: [1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60]
	},

	// 阿里云配置信息
	aliyunConf: {
		
	},

	// Windows Azure配置信息
	azureConf: {
		
	},

	// Amazon EC2配置信息
	amazonConf: {
		
	},
}

module.exports = conf;
