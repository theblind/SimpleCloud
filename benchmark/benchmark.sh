#!/bin/bash

set -e

if [ $# -ne 2 ];
then
    echo 'Illegal number of parameters'
    echo
    echo './benchmark.sh UnixBench_compressed_file_path Phoronix_compressed_file_path'
    echo
    echo 'NOTE: Compressed file will be extracted with option "x"'
    exit
fi

unixbench_compressed_file_path=$1
phoronix_compressed_file_path=$2

export ROOT_DIRECTORY=`pwd`
export RESULT_DIRECTORY='results'
CONFIGURATION_FILE="benchmark.conf"
CONFIG_KEY="key"
CONFIG_INSTANCE_ID="instance_id"
CONFIG_INSTALLED_BENCHMARK="installed_benchmark"

export timestamp=`date +%F_%T`
mkdir -p $ROOT_DIRECTORY/$RESULT_DIRECTORY/$timestamp
[ ! -f $CONFIGURATION_FILE ] && touch $CONFIGURATION_FILE

function log
{
    echo "$@" >> $ROOT_DIRECTORY/$RESULT_DIRECTORY/$timestamp/benchmark.log
}
export -f log

# format_result file_path indicator category
function format_result
{
    index=$(($(echo $2 | wc -w)+1))
    grep -i "$2" $1 | awk "{print \$$index}" | tr "\\n" " " | xargs -I {} bash -c "log \| $3: "{}
}

# setup benchmark_name dependencies compressed_file
function setup
{
    log "Setup $1"
    log "* Install dependencies: $2"
    sudo apt-get -y install $2

    log "* Extract compressed file: $3"
    cd $ROOT_DIRECTORY
    tar xf $3

    sed -i "/^$CONFIG_INSTALLED_BENCHMARK/s/$/$1|/" $CONFIGURATION_FILE
}

# get_config key
# return value
function get_config
{
    grep $1 $CONFIGURATION_FILE | awk -F '=' '{print $2}' | tr -d ' '
}

function setup_unixbench
{
    setup "unixbench" "libx11-dev libgl1-mesa-dev libxext-dev perl perl-modules make" $unixbench_compressed_file_path
}

function run_unixbench
{
    log "Run UnixBench at "`date +%F\ %T`
    cd $ROOT_DIRECTORY/UnixBench    
    output_path=$ROOT_DIRECTORY/$RESULT_DIRECTORY/$timestamp/UnixBench
    mkdir -p $output_path
    ./Run > $output_path/UnixBench.log
    format_result $output_path/UnixBench.log 'System Benchmarks Index Score' 'UnixBench'
    log "> UnixBench Finished at "`date +%F\ %T`
}

function setup_phoronix
{
    setup "Phoronix" "php5-cli php5-json php5-gd" $phoronix_compressed_file_path
    cd phoronix-test-suite
    sudo ./install-sh
    expect -c 'spawn phoronix-test-suite batch-setup; expect "*(Y/n): "; send "y\r"; expect "*(y/N): "; send "n\r"; expect "*(Y/n): "; send "n\r"; expect "*(Y/n): "; send "n\r"; expect "*(Y/n): "; send "n\r"; expect "*(Y/n): "; send "n\r"; expect "*(Y/n): "; send "Y\r"; interact '
}

function run_phoronix
{
    log "Run Phoronix at "`date +%F\ %T`
    output_path=$ROOT_DIRECTORY/$RESULT_DIRECTORY/$timestamp/Phoronix
    mkdir -p $output_path
    phoronix-test-suite batch-benchmark dbench > $output_path/dbench.log
    phoronix-test-suite batch-benchmark compress-7zip > $output_path/compress-7zip.log
    format_result $output_path/compress-7zip.log 'Average' 'compress-7zip'
    #phoronix-test-suite batch-benchmark x264 > $output_path/x264.log
    phoronix-test-suite batch-benchmark pgbench > $output_path/pgbench.log
    format_result $output_path/pgbench.log 'Average' 'pgbench'
    log "> Phoronix Finished at "`date +%F\ %T`
}

# need_config benchmark_name
function need_config
{
    return $(! grep -q -i $1 $ROOT_DIRECTORY/$CONFIGURATION_FILE)
}

need_config 'unixbench' && setup_unixbench
run_unixbench
need_config 'phoronix' && setup_phoronix
run_phoronix

