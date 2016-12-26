// database pool

var Pool	   = require('generic-pool').Pool;
var mysql      = require('mysql'); 

var CONFIG     = require('../base/config.js');

function DB_Pool() 
{
       this.m_pool = new Pool({
        name     : 'mysql',
        create   : function(callback) {
            var c = mysql.createConnection({
                host      :   CONFIG.DB_IP,
                user      :   CONFIG.DB_USER,
                password  :   CONFIG.DB_PASSWD,
                database  :   CONFIG.DB_DBNAME,
            });

            callback(null, c);
        },
        destroy  : function(client) { client.end(); },
        max      : CONFIG.DB_POOL_MAX,
        min      : CONFIG.DB_POOL_MIN,
        idleTimeoutMillis : CONFIG.DB_POOL_TIMEOUT,
        log      : false
    });

    this.DestoryPoll = function () {
        this.m_pool.drain(function() {
            this.m_pool.destroyAllNow();
        });
    }
}

module.exports = new DB_Pool;
