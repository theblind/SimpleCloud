#!/bin/bash

# at least four parameters needed
# $1: runclient/runserver
# $2: username
# $3: password
# $4: host ip

. lib.sh

if [[ $# -lt 4 ]];then
	echo need at least for params, but $# is given!
	echo existing....
	exit 0
fi

run_model=$1
username=$2
password=$3
host=$4
token=$5
iperf_server=$6

# copy pub key to destination machine using scp and expect
copy_publickey ${username} ${password} ${host}

copy_result=$?
echo ${copy_result}
if [[ ${copy_result} != "ok" ]]; then
	echo "copy_publickey result infomation: ${copy_result}"
fi

# copy the benchmark autorun script to destination machine
copy_script $username $host

# $1 is the username and $2 is the password, $3 is the destination ip address
ssh -tt ${username}@${host} <<SSHCMD
echo $(date "+%Y-%m-%d %H:%M %p") >> record.txt
cd netbenchmark
bash ./netbench.sh ${run_model} ${password} ${token} ${iperf_server}
exit
SSHCMD
