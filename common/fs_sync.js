// 封装对于io的同步操作，出错后抛出异常然后由上层处理。不将这些函数封装成类的原因是，这些操作集合不能算是功能集合，最多只能算是些api集合，构不成一个功能单元。
// 重新将对io的同步封装的原因，是因为有些特殊的操作需要同步执行，而且，出错之后在回调函数中抛出的异常不能被很好的扑捉，如果使用domain来处理回调函数中的异常，将打破上层需要的逻辑，所以强制以阻塞行为发生
// 注意:使用本文件的封装函数必须非常小心, 由于node.js以单线程运行，一旦某个函数被阻塞，将引起性能损失。

var fs              = require('fs');

var CONFIG          = require('../base/config.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;

// 缓冲区buf,用以存放读取文件的内容,存放在全局数据区，每次读文件都要清空此缓存，避免与上一次干扰。内部使用，对外隐藏，所以不做exports暴露接口处理。
var m_fs_buffer = new Buffer(CONFIG.FS_BUFFER_SIZE);

// 打开文件,返回打开文件的文件描述符，因为打开文件中的的错误都交由异常扑捉，所以不再对fd进行检查
exports.OpenFile = function(fileName) {
    var fd = -1;
    try {
        fd = fs.openSync(fileName, 'rs+');
    } catch (e) {
        logger_error.error(e.message);
        throw e;
    }

    logger.info('open file: ' + fileName);
    return fd;
}

// 同步写，该函数确保将数据真正的写入磁盘，因为涉及到强制写入磁盘，开销比较大，谨慎调用
exports.WriteFile = function(fd, data) {
    var write_size = -1;
    try {
        var write_size = fs.writeSync(fd, data, 0, 'utf-8');
        fs.fsyncSync(fd); // 强制同步进磁盘
    } catch (e) {
        logger_error.error(e.message);
        throw e;
    }

    logger.debug('write to file by fd: ' + fd + ', write_size: ' + write_size + ', write_data: ' + data);
    return write_size;
}

// 同步读，成功则返回文本内容，出错则抛出异常
exports.ReadFile = function(fd) {
    var read_size = -1 ;
    m_fs_buffer.fill('\0');
    try {
        read_size = fs.readSync(fd, m_fs_buffer, 0, CONFIG.FS_BUFFER_SIZE, 0);
    } catch (e) {
        logger_error.error(e.message);
        throw e;
    }

    logger.debug('read file by fd: ' + fd + ', read_size: ' + read_size);
    return m_fs_buffer.toString('utf-8', 0, read_size);
}

// 根据文件描述符关闭文件
exports.CloseFile = function(fd) {
    try {
        fs.closeSync(fd);
    } catch (e) {
        logger_error.error(e.message);
        throw e;
    }

    logger.info('close file by fd: ' + fd);
}

// 同步创建文件夹，强制同步磁盘针对的是fd，对于创建文件夹不适用。目前检测磁盘中是否已创建成功，如果没有继续抛出异常
exports.CreateFolder = function(newFolder) {
    var isExists = false;
    try {
        fs.mkdirSync(newFolder);
        isExists = fs.existsSync(newFolder); // 检测磁盘中是否已创建成功
    } catch (e) {
        logger_error.error(e.message);
        throw e;
    }

    if (!isExists) {
        logger_error.error('after create folder, but desk no folder: ' + newFolder);
        throw new Error('after create folder, but desk no folder: ' + newFolder);
    }

    logger.info('create folder:' + newFolder);
}

