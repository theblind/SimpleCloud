/*cm_config.js*/
var current_conf = null;
var vm_cache = false;

var custom_switch = false;
var vm_config = {
    "business_strategy": {
        "value": "1"
    },
    "order_num": {
        "max": 99,
        "min": 1,
        "step": 1
    },
    "order_time": [{
        "max": 9,
        "min": 1,
        "step": 1,
        "unit": "month"
    }, {
        "max": 3,
        "min": 1,
        "step": 1,
        "unit": "year"
    }],
    "vm_bandwidth": [{
        "max": 204800,
        "min": 0,
        "step": 1024
    }],
    "vm_cpu": [{
        "text": "1 核",
        "value": "1"
    }, {
        "text": "2 核",
        "value": "2"
    }, {
        "text": "4 核",
        "value": "4"
    }, {
        "text": "8 核",
        "value": "8"
    }],
    "vm_cpu+vm_ram|vm_os": [{
        "cond": {
            "vm_cpu": "1",
            "vm_ram": "512"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  5.4 32位",
            "value": "centos5u4_32_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "2",
            "vm_ram": "8192"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "4",
            "vm_ram": "8192"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "4",
            "vm_ram": "12288"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "4",
            "vm_ram": "16384"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "8",
            "vm_ram": "8192"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "8",
            "vm_ram": "12288"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "8",
            "vm_ram": "16384"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "8",
            "vm_ram": "24576"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }, {
        "cond": {
            "vm_cpu": "8",
            "vm_ram": "32768"
        },
        "result": [{
            "enable": "1",
            "text": "CentOS  6.3 64位 安全加固版",
            "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位 安全加固版",
            "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.7 64位",
            "value": "centos5u7_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  5.8 64位",
            "value": "centos5u8_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "CentOS  6.3 64位",
            "value": "centos6u3_64_20G_alibase_20130816.vhd"
        }, {
            "enable": "1",
            "text": "Debian  6.0.6 64位",
            "value": "debian606_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Ubuntu  12.04 64位",
            "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位",
            "value": "rhel5u4_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.4 64位 安全加固版",
            "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Aliyun Linux  5.7 64位",
            "value": "rhel5u7_64_20G_alibase_20131121.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
            "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
            "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
            "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
        }, {
            "enable": "1",
            "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
            "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
        }]
    }],
    "vm_cpu|vm_ram": [{
        "cond": {
            "vm_cpu": "1"
        },
        "result": [{
            "enable": "1",
            "text": "512MB",
            "value": "512"
        }, {
            "enable": "1",
            "text": "1GB",
            "value": "1024"
        }, {
            "enable": "1",
            "text": "1.5GB",
            "value": "1536"
        }, {
            "enable": "1",
            "text": "2GB",
            "value": "2048"
        }, {
            "enable": "1",
            "text": "4GB",
            "value": "4096"
        }]
    }, {
        "cond": {
            "vm_cpu": "2"
        },
        "result": [{
            "enable": "1",
            "text": "1.5GB",
            "value": "1536"
        }, {
            "enable": "1",
            "text": "2GB",
            "value": "2048"
        }, {
            "enable": "1",
            "text": "2.5GB",
            "value": "2560"
        }, {
            "enable": "1",
            "text": "4GB",
            "value": "4096"
        }, {
            "enable": "1",
            "text": "8GB",
            "value": "8192"
        }]
    }, {
        "cond": {
            "vm_cpu": "4"
        },
        "result": [{
            "enable": "1",
            "text": "4GB",
            "value": "4096"
        }, {
            "enable": "1",
            "text": "8GB",
            "value": "8192"
        }, {
            "enable": "1",
            "text": "12GB",
            "value": "12288"
        }, {
            "enable": "1",
            "text": "16GB",
            "value": "16384"
        }]
    }, {
        "cond": {
            "vm_cpu": "8"
        },
        "result": [{
            "enable": "1",
            "text": "8GB",
            "value": "8192"
        }, {
            "enable": "1",
            "text": "12GB",
            "value": "12288"
        }, {
            "enable": "1",
            "text": "16GB",
            "value": "16384"
        }, {
            "enable": "1",
            "text": "24GB",
            "value": "24576"
        }, {
            "enable": "1",
            "text": "32GB",
            "value": "32768"
        }]
    }],
    "vm_cpu|vm_ssd_storage": [{
        "cond": {
            "vm_cpu": "1"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }, {
        "cond": {
            "vm_cpu": "2"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }, {
        "cond": {
            "vm_cpu": "4"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }, {
        "cond": {
            "vm_cpu": "8"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }],
    "vm_os": [{
        "text": "CentOS  5.4 32位",
        "value": "centos5u4_32_20G_alibase_20131121.vhd"
    }, {
        "text": "CentOS  6.3 64位 安全加固版",
        "value": "centos6u3_64_20G_aliaegis_20130816.vhd"
    }, {
        "text": "Ubuntu  12.04 64位 安全加固版",
        "value": "ubuntu1204_64_20G_aliaegis_20131121.vhd"
    }, {
        "text": "CentOS  5.7 64位",
        "value": "centos5u7_64_20G_alibase_20130816.vhd"
    }, {
        "text": "CentOS  5.8 64位",
        "value": "centos5u8_64_20G_alibase_20131121.vhd"
    }, {
        "text": "CentOS  6.3 64位",
        "value": "centos6u3_64_20G_alibase_20130816.vhd"
    }, {
        "text": "Debian  6.0.6 64位",
        "value": "debian606_64_20G_alibase_20131121.vhd"
    }, {
        "text": "Ubuntu  12.04 64位",
        "value": "ubuntu1204_64_20G_alibase_20131121.vhd"
    }, {
        "text": "Aliyun Linux  5.4 64位",
        "value": "rhel5u4_64_20G_alibase_20131121.vhd"
    }, {
        "text": "Aliyun Linux  5.4 64位 安全加固版",
        "value": "rhel5u4_64_20G_aliaegis_20131121.vhd"
    }, {
        "text": "Aliyun Linux  5.7 64位",
        "value": "rhel5u7_64_20G_alibase_20131121.vhd"
    }, {
        "text": "Windows Server  2003 R2 标准版 SP2 32位中文版 已加固激活",
        "value": "win2003_32_stand_r2_cn_40G_aliaegis_20130913.vhd"
    }, {
        "text": "Windows Server  2003 R2 标准版 SP2 64位 中文版 已激活",
        "value": "win2003_64_stand_r2_cn_40G_alibase_v02.vhd"
    }, {
        "text": "Windows Server  2003 R2 标准版 SP2 32位中文版 已激活",
        "value": "win2003_32_stand_r2_cn_40G_alibase_v01.vhd"
    }, {
        "text": "Windows Server  2003 R2 标准版 SP2 64位英文版 已激活",
        "value": "win2003_64_stand_r2_en_40G_alibase_v01.vhd"
    }, {
        "text": "Windows Server  2008 标准版 SP2 32位中文版 自动激活",
        "value": "win2008_32_stand_sp2_cn_40G_alibase_v01.vhd"
    }, {
        "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 自动激活",
        "value": "win2008_64_stand_r2_cn_40G_alibase_v01.vhd"
    }, {
        "text": "Windows Server  2008 R2 标准版 SP1 64位中文版 已加固激活",
        "value": "win2008_64_stand_r2_cn_40G_aliaegis_20130816.vhd"
    }],
    "vm_ram": [{
        "enable": "1",
        "text": "512MB",
        "value": "512"
    }, {
        "enable": "1",
        "text": "1GB",
        "value": "1024"
    }, {
        "enable": "1",
        "text": "1.5GB",
        "value": "1536"
    }, {
        "enable": "1",
        "text": "2GB",
        "value": "2048"
    }, {
        "enable": "1",
        "text": "4GB",
        "value": "4096"
    }],
    "vm_ram|vm_ssd_storage": [{
        "cond": {
            "vm_ram": "512"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }, {
        "cond": {
            "vm_ram": "1024"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }, {
        "cond": {
            "vm_ram": "1536"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }, {
        "cond": {
            "vm_ram": "4096"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }, {
        "cond": {
            "vm_ram": "2560"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }, {
        "cond": {
            "vm_ram": "4096"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }, {
        "cond": {
            "vm_ram": "8192"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }, {
        "cond": {
            "vm_ram": "12288"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }, {
        "cond": {
            "vm_ram": "16384"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }, {
        "cond": {
            "vm_ram": "20480"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }, {
        "cond": {
            "vm_ram": "24576"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }, {
        "cond": {
            "vm_ram": "32768"
        },
        "result": [{
            "enable": "1",
            "max": 300,
            "min": 100,
            "step": 1
        }]
    }],
    "vm_region_no": [{
        "text": "青岛",
        "value": "cn-qingdao-cm5-a01"
    }],
    "vm_region_no|vm_disk_type": [{
        "cond": {
            "vm_region_no": "cn-qingdao-cm5-a01"
        },
        "result": [{
            "text": "云磁盘",
            "value": "vm_yundisk_storage"
        }, {
            "text": "临时磁盘",
            "value": "vm_sata_storage"
        }]
    }],
    "vm_region_no|vm_zone_no": [{
        "cond": {
            "vm_region_no": "cn-qingdao-cm5-a01"
        },
        "result": []
    }, {
        "cond": {
            "vm_region_no": "cn-hangzhou-dg-a01"
        },
        "result": []
    }],
    "vm_reload_os": {
        "value": "1"
    },
    "vm_sata_num": [{
        "max": 4,
        "min": 1,
        "step": 1
    }],
    "vm_sata_storage_max": [{
        "max": 2008,
        "min": 0,
        "step": 1
    }],
    "vm_sata_storage|vm_ssd_storage": [{
        "cond": {
            "vm_sata_storage": "5-1024"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }],
    "vm_sata_storage|vm_yundisk_storage": [{
        "cond": {
            "vm_sata_storage": "5-1024"
        },
        "result": []
    }],
    "vm_ssd_num": [{
        "max": 4,
        "min": 1,
        "step": 1
    }],
    "vm_ssd_storage_max": [{
        "max": 984,
        "min": 0,
        "step": 1
    }],
    "vm_ssd_storage|vm_sata_storage": [{
        "cond": {
            "vm_ssd_storage": "100-300"
        },
        "result": []
    }],
    "vm_ssd_storage|vm_yundisk_storage": [{
        "cond": {
            "vm_ssd_storage": "100-300"
        },
        "result": []
    }],
    "vm_storage": [{
        "max": 2000,
        "min": 0,
        "step": 10
    }],
    "vm_yundisk_num": [{
        "max": 4,
        "min": 0,
        "step": 1
    }],
    "vm_yundisk_storage": [{
        "max": 2048,
        "min": 5,
        "step": 1
    }],
    "vm_yundisk_storage_max": [{
        "max": 2048,
        "min": 0,
        "step": 1
    }],
    "vm_yundisk_storage|vm_sata_storage": [{
        "cond": {
            "vm_yundisk_storage": "5-2048"
        },
        "result": []
    }],
    "vm_yundisk_storage|vm_ssd_storage": [{
        "cond": {
            "vm_yundisk_storage": "5-2048"
        },
        "result": [{
            "enable": "0",
            "text": "0",
            "value": "0"
        }]
    }],
    "vm_yundun_monitor": [{
        "text": "是",
        "value": "1"
    }, {
        "text": "否",
        "value": "0"
    }],
    "vm_yundun_service": [{
        "text": "是",
        "value": "1"
    }, {
        "text": "否",
        "value": "0"
    }]
};
