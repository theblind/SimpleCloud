#!/bin/bash
password=$1

if [[ -z password ]]; then
	echo "password for "`whoami`" is not given"
	exit 0
fi

lsb_release -i
uname -o
cat /proc/version
cat /etc/issue

sudo apt-get install make
sudo apt-get install gcc
