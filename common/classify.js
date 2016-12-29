// classify
var xlsx = require("node-xlsx");

var CONFIG          = require('../base/config.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;

function Classify() {
    var excelName = CONFIG.XLSX_FILE;

    this.m_cfy = {}
    this.m_cfy_len = -1;
    this.m_Init = function() {
        var list = xlsx.parse(excelName);
        var data = list[0].data;

        var len = data.length;
        for (var i=1; i<len; ++i) {
            this.m_cfy[i] = data[i][0];
        }
        this.m_cfy_len = len-1;

        logger.debug(this.m_cfy);
        logger.debug(this.m_cfy_len);
    }

    this.m_GetCfy = function() {
        return this.m_cfy;
    }

    this.m_GetCfyLen = function() {
        return this.m_cfy_len;
    }

}

module.exports = new Classify;