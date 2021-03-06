// db shop process

var db_pool         = require('./db_pool.js');
var CONFIG          = require('../base/config.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;

function DB_Shop_Process () 
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

     // add shop
    this.m_AddShop = function(shop, callback) {
        var sql = 'INSERT INTO shop(uid, name, locate, brief, site, cost, phone, pic_main, pic_num, classify) \
             VALUES(?,?,?,?,?,?,?,?,?,?)';
        var sql_params = [shop.uid, shop.name, shop.locate, shop.brief, 
                shop.site, shop.cost, shop.phone, shop.pic_main, shop.pic_num, shop.classify];

        PoolExecute(sql, sql_params, callback);
    }

     // find one food by food.id and passwd
    this.m_FindOneById = function(id, callback) {
        var sql = 'SELECT * FROM shop where id= ?';
        var sql_params = [id];
         
        PoolExecute(sql, sql_params, callback);
    }

    // get id by uid
    this.m_GetIdByUid = function(uid, callback) {
        var sql = 'SELECT id FROM shop where uid= ?';
        var sql_params = [uid];

        PoolExecute(sql, sql_params, callback);
    }

    // get by str
    this.m_GetByStr = function(str, callback) {
        var sql = 'SELECT * FROM shop where ' + str;
        var sql_params = [];

        PoolExecute(sql, sql_params, callback);
    }
};

module.exports = new DB_Shop_Process;
