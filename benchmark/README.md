### 依赖
#### 自动交互脚本，需要使用`expect`
安装方式：`sudo apt-get install expect`

#### ssh public key needed
```
ssh-keygen -t rsa
```

### parameters specification

#### public parameters
* -u: username
* -p: password
* -h: ip address
* -t: instance token/hask key
* -b: indicate the benchmark script to run, run all benchmark in default. split by ',' while including multiple benchmark script

#### private parameters
* -c: run as client, used by iperf benchmark
* -s: run as server, used by iperf benchmark
* -d: destination ip address, server's ip address should be indicated when iperf run as client

### benchmark running flow
1. **prepare the needed tools**
```bash
ssh-keygen -t rsa		#generate the public key 	
sudo apt-get install except			#we need expect to run the interactive script automatically
```
2. **run.sh:this can be called by other script or in commandline**

> this script will execute following operations 	
> + copy localhost's ssh public key using `ssh-copy-id`	
> + login to destination machine using `ssh` and delete the old files(foldername:simplecloudbenchmark)
> + copy ./remotescript to destination machine using `scp`
> + login to destination machine and `cd ./simplecloudbenchmark/bandwidth` to run the benchmark automatically
> + extract the result from output and POST the result to server using `curl`