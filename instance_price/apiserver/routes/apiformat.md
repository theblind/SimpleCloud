API 格式规定
============

API的功能是根据前段传输的VM配置数据，返回各厂商的参数最接近的机型对应的配置、价格等信息。API的格式对顶如下：

1. 参数格式：

    {
    	"method": "vm_price",
    	"allocation": {
    		"os": "Linux",
    		"vcpu": "4",
    		"vram": "4096",
    		"storage": "250"	/* 可选 */
    	}
    }

2. 返回数据格式：

    {
    	"method": "vm_price",
    	"status": "success",
    	"result": {
    		"aliyun": {},
    		"zmazon": {},
    		"azure": {},
    		"qcloud": {}
    	}
    }