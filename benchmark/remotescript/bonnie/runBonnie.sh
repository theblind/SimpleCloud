#!/bin/bash

if [ $# -ne 1 ];
then
    echo 'Illegal number of parameters'
    exit
fi

hash_key=$1

BASEURL="http://203.195.187.64/benchmark/instance/"
export ROOT_DIRECTORY=`pwd`
export RESULT_DIRECTORY='results'
export timestamp=`date +%F_%T`
mkdir -p $ROOT_DIRECTORY/$RESULT_DIRECTORY/$timestamp

function log
{
    echo "$@" >> $ROOT_DIRECTORY/$RESULT_DIRECTORY/$timestamp/benchmark.log
}
export -f log

function run_bonnie
{
	log "Run Bonnie++ at "`date +%F\ %T`
    cd $ROOT_DIRECTORY/Bonnie    
    output_path=$ROOT_DIRECTORY/$RESULT_DIRECTORY/$timestamp/Bonnie
    mkdir -p $output_path
    ./Run > $output_path/Bonnie.log
    log "> Bonnie++ Finished at "`date +%F\ %T`

    result=$(tail -n 1 $output_path/UnixBench.log)
    post_Bonnie "$result"
    log "> Bonnie++ data posted at "`date +%F\ %T`
    cd $ROOT_DIRECTORY
}

function post_bonnie
{
	result=$1
    read_character_speed=$(echo $result | awk -F ',' '{print $8}')
    read_block_speed=$(echo $result | awk -F ',' '{print $10}')
    write_character_speed=$(echo $result | awk -F ',' '{print $14}')
    write_blcok_speed=$(echo $result | awk -F ',' '{print $16}')
    random_seek=$(echo $result | awk -F ',' '{print $18}')
    curl $BASEURL'bonnie' -d "hashKey=$hash_key&readCharacterSpeed=$read_character_speed&readBlockSpeed=$read_block_speed&writeCharacterSpeed=$write_character_speed&writeBlcokSpeed=$write_blcok_speed&randomSeek=$random_seek"
}

run_bonnie
