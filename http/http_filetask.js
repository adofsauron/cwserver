// file任务相关的类封装

var fs                  = require("fs");
var util                = require('util');
var url                 = require("url");
var path                = require('path');
var multiparty          = require('multiparty');
var querystring         = require('querystring');
var events              = require('events') ;
var zlib                = require('zlib');
var archiver            = require('archiver');
var async               = require('async');
var Q                   = require('q');

var db_process          = require('../db/db_process.js');
var logger              = require('../common/logger.js').logger;
var logger_error        = require('../common/logger.js').logger_error;
var Tools               = require('../base/tools.js');
var CONFIG              = require('../base/config.js');
var PACKET_CT_CONFIG    = require('../packet/packet_ct_config.js');
var fs_sync             = require('../common/fs_sync.js');

function HTTP_FileTask()
{   
    var m_db        = db_process;
    var m_2ct_jData = new PACKET_CT_CONFIG.SimulationRequestMsg;
    var m_emitter   = new events.EventEmitter();

    InitEmitter();

    // 事件注册
    function InitEmitter() {
        m_emitter.on('UploadFile'              , UploadFile);
        m_emitter.on('SendTaskToCT'            , SendTaskToCT);
        m_emitter.on('DownFIleByTaskId'        , DownFIleByTaskId);
        m_emitter.on('QueryTaskByTaskID'       , QueryTaskByTaskID);
        m_emitter.on('CondenseFolderWithZIP'   , CondenseFolderWithZIP);
    }

    // 根据task_id压缩相应的文件夹为zip
    // TODO 文件存在检测，避免重复的生成压缩文件
    function CondenseFolderWithZIP(taskId) {
        var pathPrefix = CONFIG.CT_PROCESS_PATH;
        var folderName = taskId;
        var destFile = CONFIG.CT_PROCESS_PATH + '/' + taskId + '.zip';
        Tools.CondenFolderWithZIP(pathPrefix, folderName, destFile);

        logger.info('CondenFolderWithZIP, destFile:' + destFile);
    }

    // 根据task_id创建相应的文件夹
    // TODO 文件夹已存在则给出提示和相应处理
    function CreateFoldeByTaskID(taskId) {
        var newFolder = CONFIG.STOR_PATH + '/' + taskId;
        Tools.CreateFolde(newFolder);
        logger.info('CreateFoldeByTaskID:' + taskId);
    }

    // 获取task_id
    //  TODO 存储task_id的文本如果有错，需要给出提示
    function CreateTaskID() {
        var new_id = Task_Id.m_GetTaskID();
        logger.info('new_id:'+new_id);

        return new_id;
    }

    // 向control发送相应的事件    
    // TODO 发送给的数据包的字段如果非法或不存在将导致报错，需要添加错误处理
    function SendTaskToCT(taskId, cmd) {
        m_2ct_jData.comm_msg = {
            seq_id      : taskId, 
            timestamp   : Date.parse( new Date() ) / 1000, 
            msg_id      : PACKET_CT_CONFIG.PACKETID_CT_SENDTASK_CMD
        }; 

        m_2ct_jData.task_id = Number(taskId);
        m_2ct_jData.cmd = cmd;

        var probuf2ct = Tools.Obj2ProtoBuf(m_2ct_jData);

        logger.info(m_2ct_jData);
        logger.info('SendTaskToCT send to ct, taskID:' + taskId);
    }

    // 根据task_id下载相应的zip压缩文件
    // TODO: 文件下载如果通过nginx进行，默认情况nginx的分片传输是开启的，务必确保在nginx.conf中关闭proxy_buf功能，否则分片传输将导致bad reuest错误
    function DownFIleByTaskId(req, res) {
        var task_id    = req.params [ CONFIG.TASK_ID ];
        var fileName   = task_id + '.zip';
        var options    = {
            root       : CONFIG.CT_PROCESS_PATH,
            dotfiles   : 'deny',
            headers    : {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment;filename=' + fileName,  
            }
        };

        res.sendFile(fileName, options, function (err) {
            if (err) {
                logger_error.error(err.message);
            } else {
                logger.info('m_DownFileByTaskID Sent:' + fileName);
            }
        });
    }

    // 上传文件到指定的taskId目录下
    function UploadFile(req, res, taskId) {
        var newTaskFolder   = CONFIG.STOR_PATH + '/' +taskId;
        var form            = new multiparty.Form();   
        form.encoding       = 'utf-8';                      // 设置编码
        form.uploadDir      = newTaskFolder;                // 设置文件存储路径
        form.maxFilesSize   = CONFIG.MaxFilesSize;          // 设置单文件大小限制
        
        form.parse(req, function(err, fields, files) {  
            if (err) {
                logger_error.error(err.message);
                res.writeHead(400, {'content-type': 'text/plain'});
                res.end("invalid request: " + err.message);
                return;
            }

            var inputName           = CONFIG.HTTP_UPLOAD_INPUTNAME;
            var originalFilename    = files[inputName][0].originalFilename;
            var pName               = files[inputName][0].path;
            var size                = files[inputName][0].size;    
     
            logger.info('fileSize: ' + size);
                                                
            var oldName = newTaskFolder + '/' + originalFilename;
            logger.info('fileName: ' + oldName);
            fs.rename(pName, oldName, function(err) {
                if (err) {
                    logger_error.error(er.message);
                }
            });
            
            res.end('upload success by task_id:' + taskId);
            logger.info('m_UploadFIle task_id: ' + taskId);
        });
    }

    // 根据task_id查询数据库信息
    function QueryTaskByTaskID(task_id, callback) {
        m_db.m_QueryTaskByTaskID(task_id, callback);
    }

    // 说明，以下函数为对外接口，目前保持独立的事件机制。
    // TODO 需求方的要求为强复杂逻辑交互，按照目前的设计将导致回调函数地狱，这一块暂时先遗留，优先级在修复无关bug后立即提升

    // 上传文件
    this.m_UploadFIle = function(req, res) {
        var query = querystring.parse(url.parse(req.url).query);
        var task_id = query.task_id;

        if (task_id == null) {
            logger_error.error('no task_id');
            res.status(404).end('no task_id');
            return;
        }

        var taskId = Number(task_id);
        m_emitter.emit('UploadFile', req, res, taskId);
    }

    // 下载文件
    this.m_DownFileByTaskID = function(req,res) {
         m_emitter.emit('DownFIleByTaskId', req, res);
    }
    
    // 前端开启新任务的处理流程
    function CreateTaskId_step(req, res) {
        // 1.生成task_id
        function CreateTaskId_Step_GetTaskId() {
            logger.debug('func get task_id');
            try {
                new_id = Task_Id.m_GetTaskID();
            } catch (e) {
                throw e;
            }

            var deferred = Q.defer();
            deferred.resolve(new_id);
            return deferred.promise;
        };

        // 2.创建相应文件夹
        function CreateTaskId_Step_CreateFolder(data) {
            var new_id = data;
            logger.debug('func create folder by task_id:' + new_id);
            var newFolder = CONFIG.STOR_PATH + '/' + new_id;
            try {
                fs_sync.CreateFolder(newFolder);
            } catch (e) {
                throw e;
            }

            var deferred = Q.defer();
            deferred.resolve(data);
            return deferred.promise;
        };

        // 3.查询数据库是否有重复task_id
        function CreateTaskId_Step_CheckDB(data) {
            var new_id = data;
            logger.debug('func query db to find task_id repeat: ' + new_id);
            var deferred = Q.defer();
            m_emitter.emit('QueryTaskByTaskID', new_id, function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (result.length == 0) {
                        deferred.resolve(new_id);
                    } else {
                        deferred.reject(new Error('task_id repeat in db'));
                    }
                }
            });

            return deferred.promise;
        };

        // 同步化处理入口
        CreateTaskId_Step_GetTaskId()
        .then(CreateTaskId_Step_CreateFolder)
        .then(CreateTaskId_Step_CheckDB)
        .done(function(data) {
            logger.debug('done data: ' + data);
            var toRes = {task_id:data};
            res.end(Tools.Json2Str(toRes));
        }, function(err) {
            logger_error.error(err.message);
            res.status(400).end(err.message);
        })
    }

    // 前端请求task_id
    this.m_GetTaskId2Front = function(req, res) {
        CreateTaskId_step(req, res)
    }

    // 根据task_id查询任务
    this.m_QueryTaskByTaskID = function(req, res) {
        var task_id = Number(req.params.task_id);

        m_emitter.emit('QueryTaskByTaskID', task_id, function(err, result) {
            if (err) {
                 logger_error.error(err.message);
                 res.status(400).end(err.message);
                 return;
            } else {
                if (result.length == 0) {
                    logger_error.warn('db has no task_id:' + task_id);
                    res.status(404).end('db has no task_id');
                    return;
                }

                var resql = {
                    task_id       : result[0].task_id, 
                    state         : result[0].state, 
                    state_desc    : result[0].state_desc
                };

                res.send(Tools.Json2Str(resql));

                logger.info(resql);
                logger.info('m_QueryTaskByTaskID task_id:' + task_id);

                var state = Number( result[0].state );

                if (state == 'null') {
                    logger_error.warn('state is null task_id: ' + task_id);
                    return;
                }

                if (state == 0) {
                    m_emitter.emit('CondenseFolderWithZIP', task_id);
                    logger.info('CondenseFolderWithZIP by task_id:' + task_id);
                }
            }
        });
    }

    // 告知control开始处理任务
    this.m_StartTask = function(req, res){
        if ( !req.body.cmd ) {
            res.status(404).end('req body no cmd');
            return;
        }

        var cmd = req.body.cmd; 
        var task_id = Number( req.params.task_id);

        logger.info('cmd:' + cmd);
        logger.info('task_id:' + task_id);

        m_emitter.emit('SendTaskToCT', task_id, cmd);

        res.end('task start:' + task_id);
    }
}

module.exports = new HTTP_FileTask; // give object
