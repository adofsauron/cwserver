// 工具集合，一些常用的工具封装函数

var os          = require('os');
var fs          = require('fs');
var zlib        = require('zlib');
var archiver    = require('archiver');
var unzip       = require("unzip");

var logger       = require('../common/logger').logger;
var logger_error = require('../common/logger').logger_error;
var CONFIG       = require('../base/config.js');

// 对象转为ProtoBuf
exports.Obj2ProtoBuf = function(obj) {
    return obj.encode().toBuffer();
}

// 按照指定的类，解析protobuf， 返回该类的实例化对象
// Class: 从protobuf对应的js文件中提取的类
// protobuf: 接受到的protobuf流
exports.ProtoBuf2ObjClass = function (Class, protobuf) {
    obj = Class.decode(protobuf);
    return obj; // 分开两行写，是为了更直观看出返回的是一个对象
}

// json对象转为buf字符串
exports.Json2Str = function(oJson) {
    return JSON.stringify(oJson);
}

// json字符串转换成json对象
exports.Str2Json = function(sJson) {
    return JSON.parse(sJson);   
}

// 获取本机IP地址， 目前默认是IPV4
// 说明：正常返回本机ipv4地址，获取不到则返回空
exports.GetLocalIP = function () {
    var IPv4;
    for (var i=0; i < os.networkInterfaces().eth0.length; i++) {
        if (os.networkInterfaces().eth0[i].family == 'IPv4') {
            IPv4=os.networkInterfaces().eth0[i].address;
        }
    }

    return IPv4;    
}

// 压缩文件夹为zip文件 
// TODO 检测文件冲突
exports.CondenFolderWithZIP = function (pathPrefix, folderName, destFile) {
    var output = fs.createWriteStream(destFile);
    var archive = archiver('zip');

    archive.on('error', function(err) {
        logger_error.error(err);
        return;
    });

    archive.pipe(output);
    archive.bulk([
        { expand: true, cwd: pathPrefix + '/', src: folderName + '/' + '**' }
    ]);
    archive.finalize(); 

    logger.info('tool CondenFolderWithZIP:' + destFile);
}

