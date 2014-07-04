#!/bin/bash


. lib.sh

while [[ getopts "u:p:h:t:b:" arg]]; do
	case $arg in
		# public parameters
		u)
			unset username
			username=$OPTARG
			;;
		p)
			unset password
			password=$OPTARG
			;;
		h)
			unset hostip
			hostip=$OPTARG
			;;
		t)
			unset token
			token=$OPTARG
			;;
		b)
			unset benchlist
			benchlist=$OPTARG
			;;
# private parameters
		c)
			unset role
			role=0
			;;
		s)
			role=1
			;;
		d)
			unset destination
			destination=$OPTARG
	esac
done

# check the public parameters
if [[ -z "$username" || -z "$password" || -z "$hostip" || "$token"]]; then
	echo "lack of public parameters: -u, -p, -h, -t"
fi

# chech benchmark list
echo "following benchmark script will be copy to remote instance: "
if [[ -z "$benchlist" ]]; then
	input_list=("iperf" "bonnie" "unixbench" "delay")
	echo "iperf,bonnie,unixbench,delay"
else
	OLD_IFS=$IFS
	IFS=","
	input_list=(benchlist)
	IFS=$OLD_IFS
	echo benchlist
fi


# invalidate the parameters, check which benchmark can be executed
declear -a benchmark_list
index=0
for input_item in ${input_list[@]}; do
	case $input_item in
		iperf )
			if [[ role -eq 0 && -z "${destination}" ]]; then
				echo "lack the destination parameters while iperf benchmark runs as client"
			else
				benchmark_list[index]="iperf"
			fi
			let "index=$idnex+1"
			;;
		bonnie | unixbench | delay )
			benchmark_list[index]="$input_item"
			let "index=$idnex+1"
			;;
	esac
done

# copy pub key to destination machine using scp and expect
copy_publickey ${username} ${password} ${hostip}
copy_result=$?	# get the result of the 

echo ${copy_result}
if [[ ${copy_result} != "ok" ]]; then
	echo "copy_publickey result infomation: ${copy_result}"
fi

# delete old file on remote instance
ssh -tt ${username}@${hostip} <<SSHEND
rm -rfv ./jianyun-benchmark
mkdir jianyun-benchmark
exit 1
SSHEND

# copy the benchmark autorun script to destination machine
for benchmark_dir in ${benchmark_list[@]}; do
	copy_script $username $hostip $benchmark_dir
done

# login to the destination instance and run the benchmarks one by one
ssh -tt ${username}@${hostip} <<SSHCMD
echo $(date "+%Y-%m-%d %H:%M %p") >> record.txt
cd ./jianyun-benchmark

for bm_item in $benchmark_list[@]; do
	cd ./${bm_item}
	case $bm_item in
		 "unixbench" | "bonnie" | "delay" )
			bash ./run.sh -u $username -p $password -t $token
			;;
		"iperf" )
			if [[ $role -eq 0 ]]; then
				bash ./run.sh -u $username -p $password -t $token -d $destination
			elif [[ $role -eq 1 ]]; then
				bash ./run.sh -u $username -p $password -t $token
			fi
			;;
	esac
	cd ../
done
exit
SSHCMD
