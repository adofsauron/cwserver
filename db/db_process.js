// database process

var mysql               = require('mysql');

var CONFIG              = require('../base/config.js');
var logger              = require('../common/logger.js').logger;
var logger_error        = require('../common/logger.js').logger_error;

function DB_Process () 
{
    var m_con = null

    this.createConnection = function() {
        m_con = mysql.createConnection({
            host        : CONFIG.DB_IP,
            user        : CONFIG.DB_USER,
            password    : CONFIG.DB_PASSWD,
            database    : CONFIG.DB_DBNAME,
        });
    }

    this.m_QueryTaskByTaskID = function (task_id, callback) {
        var Seek_Sql = 'select * from task_info where task_id=?';
        var Seek_Args_Sql = [task_id];

        logger.debug(Seek_Sql);
        logger.debug(Seek_Args_Sql);
        
        m_con.query(Seek_Sql, Seek_Args_Sql,callback);
    }    

    this.m_CloseDB = function() {
        m_con.close();
    }   
};

module.exports = new DB_Process;
