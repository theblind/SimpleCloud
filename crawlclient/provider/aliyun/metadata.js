var cpu_ram_list = {
	"reserve": [
		{
			"vm_cpu": "1",
			"vm_ram":["512", "1024", "1536", "2048", "4096"],
		},
		{
			"vm_cpu": "2",
			"vm_ram":["2048", "4096", "8192"],
		},
		{
			"vm_cpu": "4",
			"vm_ram": ["4096", "8192", "16384"],
		},
		{
			"vm_cpu": "8",
			"vm_ram": ["8192", "16384", "32768"],
		},
		{
			"vm_cpu": "16",
			"vm_ram": ["65536"]
		}
	],
	"ondemand": [
		{
			"vm_cpu": "1",
			"vm_ram": ["512"]
		},
		{
			"vm_cpu": "2",
			"vm_ram": ["2048", "4096", "8192"]
		},
		{
			"vm_cpu": "4",
			"vm_ram": ["8192", "16384"]
		}
	]
};

var os_choice = [
	{
		"type": "linux",
        "text": "CentOS  6.3 64位 安全加固版",
        "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
    },
    {
    	"type": "linux",
        "text": "Ubuntu  12.04 64位 安全加固版",
        "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
    },
    {
    	"type": "linux",
        "text": "CentOS  5.7 64位",
        "value": "centos5u7_64_20G_alibase_20130816.vhd"
    },
    {
    	"type": "linux",
        "text": "CentOS  5.8 64位",
        "value": "centos5u8_64_20G_alibase_20131121.vhd"
    },
    {
    	"type": "linux",
        "text": "CentOS  6.3 64位",
        "value": "centos6u3_64_20G_alibase_20130816.vhd"
    },
    {
    	"type": "linux",
        "text": "Debian  6.0.6 64位",
        "value": "debian606_64_20G_alibase_20131121.vhd"
    },
    {
    	"type": "linux",
        "text": "Ubuntu  12.04 64位",
        "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
    },
    {
    	"type": "linux",
        "text": "Aliyun Linux  5.4 64位",
        "value": "rhel5u4_64_20G_alibase_20131121.vhd"
    },
    {
    	"type": "linux",
        "text": "Aliyun Linux  5.4 64位 安全加固版",
        "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
    },
    {
    	"type": "linux",
        "text": "Aliyun Linux  5.7 64位",
        "value": "rhel5u7_64_20G_alibase_20131121.vhd"
    },

    /* choices of windows operating system */
    {
    	"type": "windows",
        "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
        "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
    },
    {
    	"type": "windows",
        "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
        "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
    },
    {
    	"type": "windows",
        "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
        "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
    },
    {
    	"type": "windows",
        "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
        "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
    },
];

var regions = [	
	"cn-qingdao-cm5-a01"
];
exports.config = {
	"manufacture": "Aliyun",
	"CPU_RAM_LIST": cpu_ram_list,
	"os_choice": os_choice,
	'region': regions
};

exports.get_instancetype_list = function(){
	var instancetype_list = [];
	for(var price_type in cpu_ram_list){
		for(var cpuram_index in cpu_ram_list[price_type]){
			for(var os_index in os_choice){
				for(var region_index in regions){
					for(var ram_index in cpu_ram_list[price_type][cpuram_index]["vm_ram"]){
                        if(cpu_ram_list[price_type][cpuram_index]["vm_ram"][ram_index] <= 512
                            && os_choice[os_index]["type"] === "windows")
                            continue;
						instancetype_list.push({
							"manufacture": exports.config["manufacture"],
							"alias_name": "Virtual Machine",
							"vcpu": Number(cpu_ram_list[price_type][cpuram_index]["vm_cpu"]),
							"vram": Number(cpu_ram_list[price_type][cpuram_index]["vm_ram"][ram_index])/1024,
							"storage": 0,
							"band_width": 0.0,
							"region": regions[region_index],
							"os_type": os_choice[os_index]["type"],
							"os_text": os_choice[os_index]["text"],
							"os_value": os_choice[os_index]["value"],
							"update_time": 123456
						});
					}
				}
			}
		}
	}
	return instancetype_list;
}