### WebServer

* 运行操作系统: linux-3.10.0-327.el7.x86_64
* 运行环境： node.js v4.4.5

## 系统需要安装的软件:
> node.js

## 附加文档：
> README.md： 说明文件
> 3rd.sh： 程序运行辅助脚本，创建程序运行相关的目录和文件，挂载相应文件
> package.json： node.js第三方依赖目录

## 程序文件及目录说明：
> Main.js：程序入口
> base：基础配置相关
> common： 一些通用的组件
> db: 数据库相关
> http: http协议相关
> packet: 与其他服务器通信相关
> proto：Protobuf协议通信相关

### webserver配置文件： ./base/config.js

## 运行方式：
> 1). 在WebServer目录下执行 $ nohub node Main.js & 
> 2). 在WebServer目录下执行 ./start.sh 脚本,根据启动脚本提示，传入相应参数

## 第一次运行，需要创建 logs目录

