// http服务的入口

var express             = require('express');
var compression         = require('compression');
var cookieSession       = require('cookie-session');
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');

var CONFIG              = require('../base/config.js');
var logger              = require('../common/logger').logger;
var logger_error        = require('../common/logger').logger_error;
var routers             = require('./http_web_router');
var db_process          = require('../db/db_process.js');

function HTTP_Server()
{
    var m_app   = express();
    var m_port  = CONFIG.HTTP_SERVER_PORT;
        
    function AppInit() {
        m_app.use(compression());          
        m_app.use(bodyParser.json());
        m_app.use(bodyParser.urlencoded({ extended: false }));
        m_app.use(cookieParser());

        m_app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        })
    }

    function StaticInit() {
        db_process.createConnection();
    }

    this.m_Init = function() {
        try {
            AppInit();
            StaticInit();
        } catch (e) {
            logger_error.error(e.message);
            process.exit(1);
        }

        logger.info('server http init');
    }    
   
    this.m_Run = function() {
        m_app.listen(m_port);       // 开始监听
        m_app.use('/', routers);    // web_router
    
        logger.info('server http run');
    }
}

module.exports.HTTP_Server = HTTP_Server;
