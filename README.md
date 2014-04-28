#SimpleCloud

##benchmark/benchmark.sh

本脚本用于自动化配置和执行UnixBench和Phoronix这两个benchmark程序

### 使用方法
将文件与UnixBench和Phoronix复制到某一目录下，使用以下命令执行benchmark.sh

```bash
    nohup ./benchmark.sh UnixBench压缩文件路径 Phoronix压缩文件路径 &
```

注意：脚本使用x选项来解压压缩文件

### 输出

Benchmark的原始输出在当前目录的 *./results/日期\_时间* 目录下

目前已格式化UnixBench与Phoronix中compress-7zip、pgbench的输出，结果放于当前目录的 *./results/日期\_时间/benchmark.log* 之中


## South

### 说明

South用于应用model的改变到数据库。

[tutorial](http://south.readthedocs.org/en/latest/tutorial)

### 使用方法

* 对于新建的app或首次增加Model的app，执行下列代码以启用south

        ./manage.py schemamigration APP_NAME --initial

* 对于执行过initial的app，修改Model后，执行下列代码指示south发现更改

        ./manage.py schemamigration APP_NAME --auto

  如果未出错，则执行下列代码应用更改即可

        ./manage.py migrate APP_NAME

## pricing crawler

覆盖的IaaS provider有：
1. Amazon EC2
2. Windows Azure
3. Aliyun
4. Qcloud

爬虫程序存放数据使用的是MongoDB，和线上数据库是分开的。

爬虫程序运行方式：`node crawlprice.js`，需要安装NodeJS和NPM包管理器。初次运行的时候，需要在crawlclient目录下执行`npm install`命令，安装用到的NodeJS模块。

爬虫任务是定时任务。

### 爬虫同步模块

将MongoDB中的数据上传到线上使用的数据库中，由MongoDB转到MySQL。

### 价格API

价格API部分是包含在Django Web模块中一起的。不另外使用新的服务器和域名。