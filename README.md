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
