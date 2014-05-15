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