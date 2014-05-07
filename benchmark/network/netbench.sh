# netbench.sh
# three parameters needed
# $1: username
# $2: password
# $3: host ip

. lib.sh

if [[ $# -ne 3 ]];then
	echo need three params, but $# is given!
	echo existing....
	exit 0
fi

# copy pub key to destination machine using scp and expect
copy_pubkey $1 $2 $3
if [[ $? != "ok" ]]; then
	echo "fail to copy pubkey to destination machine"
	echo "infomation: $?"
	exit 0
fi

# $1 is the username and $is the password, $3 is the destination ip address
ssh -tt $1@$3 <<SSHCMD
sudo apt-get update
exit
SSHCMD

# ssh $1@$2