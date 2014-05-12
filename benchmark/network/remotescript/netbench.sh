#!/bin/bash

# 2 or 3 parameters needed for this script
# $1: runserver
# $2: password
# or
# $1: runclient
# $2: password
# $3: serverip

webserver="www.webserver.com/api/netbench"

# install iperf under debian like linux
# $1: password
function debian_setup
{
	echo $1 | sudo -S apt-get install iperf
}

function redhat_setup
{
	echo $1 | sudo -S yum install iperf
}

# extract the iperf result from $line
# $1: $line
function upload_result
{
	echo "uploading result to server...."
	if [[ $# -ne 6 ]]; then
		echo "invalid params in upload_result"
		echo $@
	fi
	bandwidth=$1
	bandwidth_unit=$2
	delay=$3
	lossrate=$5
	lossrate_percentage=$6

	for (( i = 0; i < 3; i++ )); do
		# try for 3 times is failed
		result=`curl http://$webserver?bw=${bandwidth}&bwu=${bandwidth_unit}&dl=$delay&lr=${lossrate_percentage}`
		if [[ $result == "success" ]]; then
			break
		fi
		echo "retry ${i}th time..."
	done
	exit 1
}

function extract_result
{
	line=$1
	# example of $line is+
	# [ 3] 0.0-30.0 sec 357 MBytes 99.9 Mbits/sec 0.057 ms 223/255020 (0.087%)
	INDEX_A=$(expr match "$line" ".*MBytes")
	INDEX_B=$(expr match "$line" ".*Mbits/sec")
	INDEX_C=$(expr match "$line" ".*ms")
	INDEX_D=$(expr match "$line" ".*(.*)")

	bandwidth_length=`expr $INDEX_B - $INDEX_A`
	delay_length=`expr $INDEX_C	- $INDEX_B`
	lossrate_length=`expr $INDEX_D - $INDEX_C`

	# extract the result information
	receive_bandwidth=`echo ${line:$INDEX_A:bandwidth_length}`
	delay=`echo ${line:$INDEX_B:delay_length}`
	lossrate=`echo ${line:$INDEX_C:lossrate_length}`

	upload_result $receive_bandwidth $delay $lossrate
}
# install iperf and run benchmark as client
# $1: password
function run_client
{
	echo "installing iperf on destination machine"
	debian_setup $1
	iperf_server=$2
	echo "running iperf benchmark...."
	filename="iperfclient_result.log"
	iperf -c ${iperf_server} -u -b 100M -t 60 > ${filename}
	echo "iperf benchmark done"
	echo "analynizing result......."
	while read line; do
		echo $line
		# check the flag
		if [[ $flag -eq 200 ]]; then
			# deal with the result
			extract_result $line
		fi
		# flag is not ready, go on matching the line
		index=$(expr match "$line" ".*Server Report")
		if [[ $index -ne 0 ]]; then
			# set the flag, deal with the result in the next loop,
			flag=200
		fi
	done < ./iperfclient_result.log
}


# install iperf and run as iperf server
function run_server 
{
	debian_setup $1
	iperf -s -u
}

# check the parameters
if [[ $# -lt 2 ]]; then
	echo "two parameters were needed at least, but $# is given"
	exit 0
fi

# run as given model
if [[ $1 == "runserver" ]]; then
	run_server $2
elif [[ $1 == "runclient" ]]; then
	run_client $2 "${3}"
else
	echo "invalid parameter, first parameter should be  runclient/runserver"
fi