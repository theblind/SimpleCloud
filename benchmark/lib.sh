#!/bin/bash

# check the ssh public key and copy the ssh public key to destination machine
# $1 username
# $2 password
# $3 hostip
function copy_publickey
{
	if [[ $# -ne 3 ]]; then
		echo "copy_pubkey need 3 params, but $# given"
		return "wrong parameters"
	fi
	pubkey=`cat ~/.ssh/id_rsa.pub`
	if [[ ${#pubkey} -eq 0 ]]; then
		return "pubkey notexist"
	fi
	homepath=$HOME
	expect ./setpubkey.exp $1 $2 $3 $homepath
	echo "exiting..."
	return "ok"
}

# copy bash file to destination machine
# $1: username
# $2: destination machine ip
# $3: benchmark dir name
function copy_script
{
	username=$1
	host=$2
	benchmark_dir=$3
	scp -r ./remotescript/${benchmark_dir} ${username}@${host}:/home/${username}/jianyun-benchmark
}

