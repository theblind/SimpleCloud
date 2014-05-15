## use iperf as the network benchmark

### 依赖
#### 自动交互脚本，需要使用`expect`
安装方式：`sudo apt-get install expect`
#### ssh public key nedded
```
ssh-keygen -t rsa
```


### run.sh  parameters
#### bwhen run as iperf server:
- $1: runserver
- $2: username
- $3: password
- $4: hostip

#### when run as client:
- $1: runclient/runserver
- $2: username
- $3: password
- $4: host ip
- $5: token created by master
- $6: iperf_server ip, not nedded when run as server, 

### benchmark running flow
1. **prepare the needed tools**
```
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