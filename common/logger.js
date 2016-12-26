// log4js

var log4js = require('log4js');
var CONFIG = require('../base/config.js');

log4js.configure({
    appenders: [
        { type : 'console' },
        { type : 'file', filename: CONFIG.LOG_FILES,        category: 'WS' },
        { type : 'file', filename: CONFIG.LOG_FILES_ERROR,  category: 'ER' } 
    ]
});

var logger = log4js.getLogger('WS');
var logger_error = log4js.getLogger('ER');

logger.setLevel(CONFIG.LOG_LEVEL);

exports.logger          = logger;
exports.logger_error    = logger_error;

