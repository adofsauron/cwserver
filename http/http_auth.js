// auth 验证模块

var uuid            = require('node-uuid');  
var querystring     = require('querystring');
var url             = require("url");
var events          = require('events') ;
var multiparty      = require('multiparty');
var fs              = require("fs");

var CONFIG          = require('../base/config.js');
var Tools           = require('../base/tools.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;
var db_user_process = require('../db/db_user_process.js');
var http_model      = require('./http_model.js');
var fs_sync         = require('../common/fs_sync.js');

function HTTP_auth() 
{
    var m_emitter   = new events.EventEmitter();

    InitEmitter();

    // 事件注册
    function InitEmitter() {
        m_emitter.on('SetSession', SetSession);
    }

    // 记录session
    function SetSession (_user, req) {
        var user = req.session.user;
        if (!user) {
            user = req.session.user = {};
        }

        user.id      = _user.id;
        user.uid     = _user.uid;
        user.name    = _user.name;
        user.passwd  = _user.passwd;

        logger.info('set session success: ' + user.name);
    }

    //登录 TODO; 添加表单验证
    this.m_Login = function(req, res) {
        var body = req.body;
        var name = body.name;
        var passwd = body.passwd;

        if ( (!name) || (!passwd) ) {
            logger_error.warn('!name || !passwd');
            res.status(401).end('no name or passwd');
        }

        if (!Tools.IsEmail(name)) {
            res.status(401).end('name is not email');
        }
 
        var user = {name:name, passwd:passwd};

        db_user_process.m_FindOneUser(user, function(err, data) {
            if (err) {
                logger_error.error(err.message);
                res.status(400).end(err.message);
            } else {
                var uid = data[0].uid;
                var num = data.length;
                logger.debug('data.length: ' + num);
                // num为0, 表示数据库中没有该用户
                if (num == 0) {
                    logger_error.warn('db has no this user: ' + user.name + ':' + user.passwd);
                    res.status(400).end('db has no this user: ' + user.name + ':' + user.passwd);
                } else {
                    
                    //res.status(200).end('set session success: ' + user.name);
                    db_user_process.m_FindOneByUid(uid, function(err, data){
                        if (err) {
                            logger_error.error(err.message);
                            res.status(401).end(err.message);
                            return;
                        }

                        logger.debug(data);
                        var id = data[0].id;

                        user.uid = uid;
                        user.id = id;
                        m_emitter.emit('SetSession', user, req);

                        res.redirect('/user-intro/' + id + '.action');
                    });
                    
                }
            }         
        });  
    }

    function UploadFile(req, res, newTaskFolder, uid) {
        var form = new multiparty.Form();
        form.encoding = 'utf-8';
        form.uploadDir = newTaskFolder;
        form.keepExtensions = true; // 保留后缀
        form.maxFilesSize = 2 * 1024 * 1024;
        form.maxFields = 5000;  //设置所有文件的大小总和

        form.parse(req, function(err, fields, files) {
            if (err) {
                logger_error.error(err.message);
                res.writeHead(400, {'content-type': 'text/plain'});
                res.end("invalid request: " + err.message);
                return;
            }

            var user_form = {};

            // fields 是文本域
            for (var i in fields) {
                var field = fields[i][0];
                if (field == '') {
                    continue;
                }

                logger.debug(i + "\t" + field);
                user_form[i] = field;
            }

            // files 是上传的文件
            logger.debug('-------------');
            for (var i in files) {
                var file = files[i][0];
                logger.debug(file);

                if (file.originalFilename == '') {
                    continue;
                }
                var pName = file.path;
                var fixName = newTaskFolder + '/' + file.fieldName

                var suffix = Tools.GetSuffix(pName);
                if (suffix != '') {
                    fixName = fixName + '.' + suffix
                }

                fs.rename(pName, fixName, function(err) {
                    if (err) {
                        logger_error.error(err.message);
                    }
                });

                user_form[i] =  file.fieldName + '.' + suffix;
            }

            user_form.uid = uid;
            logger.debug(user_form);

            var name = user_form.name;
            var passwd = user_form.passwd;
            var repasswd = user_form.repasswd;

             if ( (!name) || (!passwd) ) {
                res.status(401).end('no name or passwd');
                return;
            }

            if (!Tools.IsEmail(name)) {
                res.status(401).end('name is not email');
                return;
            }

            var user = user_form;
            db_user_process.m_FindOneUser(user, function(err, data) {
            if (err) {
                logger_error.error(err.message);
                res.status(400).end(err.message);
                return;
            } else {
                var num = data.length;
                logger.debug('data.length: ' + num);
                // num为0, 表示数据库中没有该用户
                if (num == 0) {
                    
                    
                    db_user_process.m_AddUser(user, function(err, data){
                            if (err) {
                            logger_error.error(err.message);
                            res.status(400).end(err.message);
                            return;
                        };
                    
                        db_user_process.m_FindOneByUid(user.uid, function(err, data){
                            if (err) {
                                logger_error.error(err.message);
                                res.status(200).end(err.message);
                                return;
                            }

                            logger.debug(data);
                            var user = data[0];
                            m_emitter.emit('SetSession', user, req);
                            var id = data[0].id;
                            res.redirect('/user-intro/' + id + '.action');
                        });
                    });
                } else {
                    logger_error.warn('db has this user when register: ' + user.name + ':' + user.passwd);
                    res.status(400).end('db has this user when register: ' + user.name + ':' + user.passwd);
                    return;
                }
            }         
            });
        })

    }

    // 注册 TODO; 添加表单验证
    this.m_Register = function(req, res, next) {
        var uid    = uuid.v4();
        var user_folder = CONFIG.UPLOAD_PATH + '/' + uid;
        fs_sync.CreateFolder(user_folder);

        UploadFile(req, res, user_folder, uid);

    }

    // 验证session 验证成功，继续执行，否则强制去登录
    this.m_auth = function(req, res, next) {
        var user = req.session.user;

        if (user) {
            logger.info('auth: ' + Tools.Json2Str(user));
            //res.status(200).end('auth pass: ' + Tools.Json2Str(user));
            next();
        } else {
            var query = querystring.parse(url.parse(req.url).query); // for get
            var body = req.body; // for post
            var auth_message = 'auth_message'; // for log message

            if (query) {
                auth_message += ', query: ' + Tools.Json2Str(query);
            }
                
            if (body) {
                auth_message += ', body: ' + Tools.Json2Str(body);
            }
            
            logger_error.warn('no auth: ' + auth_message);
            http_model.m_Login(req, res);

        }
    }

    // 验证session 验证成功，继续执行，否则强制去登录
    this.m_authLoc = function(req, res, next) {
        var user = req.session.user;
        
        if (user) {
            logger.info('auth: ' + Tools.Json2Str(user));
            //res.status(200).end('auth pass: ' + Tools.Json2Str(user));
            var id = user.id;
            res.redirect('/user-intro/' + id + '.action');    
        } else {
            var query = querystring.parse(url.parse(req.url).query); // for get
            var body = req.body; // for post
            var auth_message = 'auth_message'; // for log message

            if (query) {
                auth_message += ', query: ' + Tools.Json2Str(query);
            }
                
            if (body) {
                auth_message += ', body: ' + Tools.Json2Str(body);
            }
            
            logger_error.warn('no auth: ' + auth_message);
            http_model.m_Login(req, res);

        }
    }
}

module.exports = new HTTP_auth;

