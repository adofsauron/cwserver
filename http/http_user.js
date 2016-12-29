// food

var fs              = require("fs");
var uuid            = require('node-uuid');
var multiparty      = require('multiparty');
var events          = require('events') ;

var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;
var Tools           = require('../base/tools.js');
var CONFIG          = require('../base/config.js');
var fs_sync         = require('../common/fs_sync.js');
var db_user_process = require('../db/db_user_process.js');

function HTTP_User() 
{
    this.m_GetUserIntroById = function(req, res) {
        var body = req.body;
        var id = Number( req.params.id );

        db_user_process.m_FindOneById(id, function(err, data){
            if (err) {
                logger_error.error(err.message);
                res.status(200).end(err.message);
                return;
            }

            logger.debug(data);

             var info = data[0];

            var ret = Tools.Json2Str(info);
            var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
            var mejs = { 
                ret  : ret,
                //csrfToken  : req.csrfToken(),
                WrapRoute  : function(x) { 
                    return function(y) { 
                        return Tools.WrapRoute(x, y);
                    }
                } (proxyRoute),
            };

            logger.debug(ret);
            
            res.render('user-intro', mejs);

        });
   }


    this.m_GetUserDetailById = function(req, res) {
        var body = req.body;
        var id = req.params.id;

        db_user_process.m_FindOneById(id, function(err, data){
            if (err) {
                logger_error.error(err.message);
                res.status(200).end(err.message);
                return;
            }

            logger.debug(data);

             var info = data[0];

            var ret = Tools.Json2Str(info);
            var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
            var mejs = { 
                ret  : ret,
                //csrfToken  : req.csrfToken(),
                WrapRoute  : function(x) { 
                    return function(y) { 
                        return Tools.WrapRoute(x, y);
                    }
                } (proxyRoute),
            };

            logger.debug(ret);
            
            res.render('user-detail', mejs);

        });
    }

    // 渲染修改密码页面
    this.m_RenderPwdChange = function(req, res) {
        var body = req.body;
        var id = req.params.id;
        

        var info = {'id': id};

        var ret = Tools.Json2Str(info);
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
        var mejs = { 
            ret  : ret,
            //csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };

        logger.debug(ret);
        
        res.render('pwd-change', mejs);
    }

    // 处理密码修改
    this.m_DoPwdChange = function(req, res) {
        var body = req.body;
        var id = req.params.id;
        var newPwd = body.pwd_change;

        db_user_process.m_UpdatePwdById(newPwd, id, function(err, data){
            if (err) {
                logger_error.error(err.message);
                res.status(401).end(err.message);
                return;
            }

            var ret = 'change passwd success, new passwd: ' + newPwd;
            res.status(200).end(ret)
        })
    }

    // 上传头像
    function UploadPic(req, res, newTaskFolder, id) {
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
                        res.status(401).end(err.message);
                        return;
                    }

                    res.redirect('/user-detail/' + id + '.action');
                });
            }
        })

    }

    // 修改头像

    this.m_RenderPicChange = function(req, res) {
        var body = req.body;
        var id = req.params.id;
        
        var info = {'id': id};

        var ret = Tools.Json2Str(info);
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
        var mejs = {
            ret  : ret,
            //csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };

        logger.debug(ret);
        
        res.render('pic-change', mejs);
    }

    this.m_DoPicChange = function(req, res) {
        var body = req.body;
        var id = req.params.id;

        db_user_process.m_FindOneById(id, function(err, data){
            if (err) {
                logger_error.error(err.message);
                res.status(200).end(err.message);
                return;
            }

            logger.debug(data);

            var info = data[0];
            var folder = CONFIG.UPLOAD_PATH + '/' + info.uid;

            UploadPic(req, res, folder, info.id)
    
        });
    }


    // 修改昵称
     this.m_RenderNickChange = function(req, res) {
        var body = req.body;
        var id = req.params.id;
        
        var info = {'id': id};

        var ret = Tools.Json2Str(info);
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
        var mejs = {
            ret  : ret,
            //csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };

        logger.debug(ret);
        
        res.render('nick-change', mejs);
    }

    this.m_DoNickChange = function(req, res) {
        var body = req.body;
        var id = req.params.id;
        var newNick = body.newNick;

        db_user_process.m_UpdatePwdById(newNick, id, function(err, data){
            if (err) {
                logger_error.error(err.message);
                res.status(401).end(err.message);
                return;
            }

            res.redirect('/user-detail/' + id + '.action');
        })
    }
    
}

module.exports = new HTTP_User;

