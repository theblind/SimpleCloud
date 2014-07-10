
var operating_system = {
	"CentOS": "centos6.2-64bit",
	"SUSE": "SUSE Linux Enterprise Server 10 (x86_64)",
	"Ubuntu": "ubuntu12-64bit",
	"Windows": "Xserver V8.1_64"
};
var cpu_list = [1, 2, 4, 8, 12];
var ram_size = [1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];

exports.operatingSystem = operating_system;
exports.CPUNumber = cpu_list;
exports.RAMSize = ram_size;

exports.get_instancetype_list = function(){
	var instancetype_list = [];

	var mem = 0;
	var cpu = 0;
	for(var cpu_index in cpu_list){
		cpu = cpu_list[cpu_index];

		for(var ram_index in ram_size){
			mem = ram_size[ram_index];
			if(mem < cpu)
				continue;
			for(var os in operating_system){
				instancetype_list.push({
					manufacture: "QCloud",
					alias_name: "qcloud",
					vcpu: Number(cpu),
					vram: Number(mem),
					storage: 0,
					band_width: 0,
					region: null,
					os_type: os === "Windows" ? "windows" : "linux",
					os_text: os,
					os_value: operating_system[os],
					update_time: 1234567
				});
			}
		}
	}
	return instancetype_list;
}