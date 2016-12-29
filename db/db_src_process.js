// shop relate classify

// db shop process

var db_pool         = require('./db_pool.js');
var CONFIG          = require('../base/config.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;

function DB_Src_Process () 
{
    var m_pool = db_pool.m_pool;

    // 之所以要传入回掉函数callback, 是因为node把阻塞执行的连贯逻辑，强行拆成了事件回调
    function PoolExecute(sql, sql_params, callback) {
        m_pool.acquire(function(err, client) {
            if (err) {
                logger_error.error(err.message);
                return; // 这里并未成功从池中获得连接，所以无需释放
            } else {
                logger.info(sql);
                logger.info(sql_params);
                client.query(sql, sql_params, callback);
                m_pool.release(client);
            }
        });
    }

     // add src
    this.m_AddSrc = function(shop_id, classify, callback) {
        var sql = 'INSERT INTO src(shop_id,classify) VALUES(?,?)';
        var sql_params = [shop_id, classify]

        PoolExecute(sql, sql_params, callback);
    }

    // find set by classify
    this.m_FindByClassify = function(classify, callback) {
        var sql =  'SELECT shop_id,classify FROM src where classify= ?';
        var sql_params = [classify]

        PoolExecute(sql, sql_params, callback);
    } 

    // 获取classify的数目
    this.m_GetClyNum = function(callback) {
        var sql = '  select count(*) as num from ( \
	                select classify , count(*) as cnt from src group by 1 ) as total;';
        var sql_params = ['']
        PoolExecute(sql, sql_params, callback);
    }

    this.m_GetAllCly = function(callback) {
        var sql = ' select classify , count(*) as cnt from src group by 1 ';
        var sql_params = ['']
        PoolExecute(sql, sql_params, callback);
    }
};

module.exports = new DB_Src_Process;
