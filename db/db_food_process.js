// db food process

var db_pool         = require('./db_pool.js');
var CONFIG          = require('../base/config.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;

function DB_Process () 
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

    // add user
    this.m_AddFood = function(food, callback) {
        var sql = 'INSERT INTO food(uid, name, material, history, site, make_type, make_content, vedio_type, pic_main) \
             VALUES(?,?,?,?,?,?,?,?,?)';
        var sql_params = [food.uid, food.name, food.material, 
            food.history, food.site, food.make_type, food.make_content, food.vedio_type, food.pic_main];

        PoolExecute(sql, sql_params, callback);
    }

    // delete user by user.name and passwd
    this.m_DelUser = function(food, callback) {
        var sql = 'DELETE FROM food WHERE id = ?';
        var sql_params = [food.id];

        PoolExecute(sql, sql_params, callback);
    } 

    // find one food by food.id and passwd
    this.m_FindOneById = function(food, callback) {
        var sql = 'SELECT * from food where id= ?';
        var sql_params = [food.id];
         
        PoolExecute(sql, sql_params, callback);
    }

    // find by site
    this.m_FindBySite = function(site, callback) {
        var sql = 'SELECT * from food where site = ?';
        var sql_params = [site];

        PoolExecute(sql, sql_params, callback);
    }

    // find by name
    this.m_FindBySite = function(name, callback) {
        var sql = 'SELECT * from food where name like \'%' + site + '&\'';
        var sql_params = [name];

        PoolExecute(sql, sql_params, callback);
    }  
};

module.exports = new DB_Process;
