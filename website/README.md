## Django环境配置步骤

1. 准备Python2.7版本环境，一般Linux系统上都自带有。
2. 


#### 2014/07/08 update
1. remove model Price, devide InstanceType into two models: InstanceType and InstancePriceAll
2. model Instance and InstancePrice reference InstanceTypeAll as foreign key  
3. add model InstancePriceLatest, this model is the same as InstancePriceAll, but InstancePriceLatest only save the latest pricing record.
