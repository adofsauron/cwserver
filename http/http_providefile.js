// 提供http请求的文件,常规的http服务器访问请求

var fs      = require('fs');  
var path    = require('path');
var url     = require("url");

var CONFIG  = require('../base/config.js');
var logger  = require('../common/logger.js').logger;
var logger_error = require('../common/logger.js').logger_error;

function HTTP_ProvideFile()
{
    function GetHeadType(pathname) {
        var tpye;
        switch ( path.extname(pathname) ) {
            case ".html":
                type = "text/html";
                break;
            case ".js":
                type = "text/javascript";
                break;
            case ".css":
                type = "text/css";
                break;
            case ".gif":
                type = "image/gif";
                break;
            case ".jpg":
                type = "image/jpeg";
                break;
            case ".png":
                type = "image/jpng";
                break;
            default:
                type = "application/octet-stream";
                break;
        }

        return type;
    };
    
    this.m_ProvideFile = function (req, res) {
        var pathname = __dirname+CONFIG.VIEW_PATH+url.parse(req.url).pathname;

         var options = {
            root      : pathname,
            dotfiles  : 'deny',
            headers   : {
                'x-timestamp' : Date.now(),
                'x-sent'      : true
            }
        };

        var fileName = '';

         if (path.extname(pathname)=="") {
            fileName += "/";
        }

        if (pathname.charAt(pathname.length-1)=="/"){
            fileName += CONFIG.DEFAULT_PAGE;
        }

        res.sendFile(fileName, options, function (err) {
            if (err) {
                logger_error.error(err);
                res.status(err.status).end();
            } else {
                logger.info('Sent:' + fileName);
            }
        });

    }; 
}

module.exports = new HTTP_ProvideFile;
