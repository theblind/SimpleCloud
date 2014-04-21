# Amazon EC2爬虫模块

- 入口为getPrice方法

**注意事项**

- EC2 上的实例分为两种：预留实例reserve instance和按需实例on demand。在两种实例的收费不同。而且API返回的数据的格式也不同。
- EC2上的API经常会变动，除了从json编程jsonp外，还有数据格式的变动，API使用方式的变动。。
