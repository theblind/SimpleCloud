# lib.sh

# check the ssh public key and copy the ssh public key to destination machine
# $1 username
# $2 password
# $3 hostip
function copy_pubkey
{
	if [[ $# -ne 3 ]]; then
		echo "copy_pubkey need 3 params, but $# given"
		return "wrong parameters"
	fi
	pubkey=`cat ~/.ssh/id_rsa.pub`
	if [[ ${#pubkey} -eq 0 ]]; then
		return "pubkey notexist"
	fi

	expect ./setpubkey.exp $1 $2 $3 $pubkey

	return "ok"
}