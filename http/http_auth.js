// auth 验证模块

var uuid            = require('node-uuid');  
var querystring     = require('querystring');
var url             = require("url");
var events          = require('events') ;

var CONFIG          = require('../base/config.js');
var Tools           = require('../base/tools.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;
var db_user_process = require('../db/db_user_process.js');
var http_model      = require('./http_model.js');

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

        user.uid     = uuid.v4();
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
                var num = data.length;
                logger.debug('data.length: ' + num);
                // num为0, 表示数据库中没有该用户
                if (num == 0) {
                    logger_error.warn('db has no this user: ' + user.name + ':' + user.passwd);
                    res.status(400).end('db has no this user: ' + user.name + ':' + user.passwd);
                } else {
                    m_emitter.emit('SetSession', user, req);
                    res.status(200).end('set session success: ' + user.name);
                }
            }         
        });  
    }

    // 注册 TODO; 添加表单验证
    this.m_Register = function(req, res, next) {
        var body    = req.body;
        var name    = body.name;
        var passwd  = body.passwd;

        if ( (!name) || (!passwd) ) {
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
                var num = data.length;
                logger.debug('data.length: ' + num);
                // num为0, 表示数据库中没有该用户
                if (num == 0) {
                    m_emitter.emit('SetSession', user, req);
                    db_user_process.m_AddUser(user, function(err, data) {
                        if (err) {
                            logger_error.error(err.message);
                            res.status(400).end(err.message);
                        }
                        
                        logger.info('add user: ' + user.name);
                        res.status(200).end('add user: ' + user.name);
                    });
                } else {
                    logger_error.warn('db has this user when register: ' + user.name + ':' + user.passwd);
                    res.status(400).end('db has this user when register: ' + user.name + ':' + user.passwd);
                }
            }         
        }); 
    }

    // 验证session
    this.m_auth = function(req, res, next) {
        var user = req.session.user;

        if (user) {
            logger.info('auth: ' + Tools.Json2Str(user));
            res.status(200).end('auth pass: ' + Tools.Json2Str(user));
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

            next(); // pass to next
        }
    }
}

module.exports = new HTTP_auth;

