#SimpleCloud

##benchmark/benchmark.sh

本脚本用于自动化配置和执行UnixBench和Phoronix这两个benchmark程序

### 使用方法
将文件与UnixBench和Phoronix复制到某一目录下，使用以下命令执行benchmark.sh

```bash
    nohup ./benchmark.sh &
```

### 输出

Benchmark的原始输出在当前目录的 *./results/日期\_时间* 目录下

目前已格式化UnixBench与Phoronix中compress-7zip、pgbench的输出，结果放于当前目录的 *./results/日期\_时间/benchmark.log* 之中
