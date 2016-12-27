// db shop process

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
    this.m_AddUser = function(user, callback) {
        var sql = 'INSERT INTO user(uid, name, passwd) VALUES(?, ?, ?)';
        var sql_params = [user.uid, user.name, user.passwd];

        PoolExecute(sql, sql_params, callback);
    }

    // delete user by user.name and passwd
    this.m_DelUser = function(user, callback) {
        var sql = 'DELETE FROM user WHERE name = ? AND passwd = ?';
        var sql_params = [user.name, user.passwd];

        PoolExecute(sql, sql_params, callback);
    } 

    // update user by user.name and passwd
    this.m_UpdateUser = function(oldUser , newUser, callback) {
        var sql = 'UPDATE user SET name = ?, passwd = ? WHERE name = ? AND passwd = ?';
        var sql_params = [newUser.name, newUser.passwd, oldUser.name, oldUser.passwd];
         
        PoolExecute(sql, sql_params, callback);
    }

    // find one user by user.name and passwd
    this.m_FindOneUser = function(user, callback) {
        var sql = 'SELECT * from user where name= ? AND passwd= ?';
        var sql_params = [user.name, user.passwd];
         
        PoolExecute(sql, sql_params, callback);
    }

    // find all users
    this.m_FindAllUser = function(callback) {
        var sql = 'SELECT * from user';

        PoolExecute(sql, [], callback);
    }  
};

module.exports = new DB_Process;
