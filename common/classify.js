// classify
var xlsx = require("node-xlsx");

var CONFIG          = require('../base/config.js');
var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;

function Classify() {
    // 所有类别
    var cly_name = CONFIG.CLASSIFY_FILE;
    // 精选类别，sift是cly的子集
    var sift_name = CONFIG.classify_SIFT_FILE;

    this.m_cfy = {}
    this.m_cfy_len = -1;

    this.m_sift = {};
    this.m_sift_len = -1

    this.m_ClyInit = function() {
        var list = xlsx.parse(cly_name);
        var data = list[0].data;

        var len = data.length;
        for (var i=1; i<len; ++i) {
            this.m_cfy[i] = data[i][0];
        }
        this.m_cfy_len = len-1;

        logger.debug(this.m_cfy);
        logger.debug(this.m_cfy_len);
    }

    this.m_SiftInit = function() {
        var list = xlsx.parse(sift_name);
        var data = list[0].data;

        var len = data.length;
        for (var i=1; i<len; ++i) {
            this.m_sift[i] = data[i][0];
        }
        this.m_sift_len = len-1;

        logger.debug(this.m_sift);
        logger.debug(this.m_sift_len);
    }

    this.m_Init = function() {
        this.m_ClyInit();
        this.m_SiftInit();
    }

    this.m_GetCfy = function() {
        return this.m_cfy;
    }

    this.m_GetSift = function() {
        return this.m_sift;
    }

    this.m_GetCfyLen = function() {
        return this.m_cfy_len;
    }

    this.m_GetSiftLen = function() {
        return this.m_sift_len;
    }

}

module.exports = new Classify;