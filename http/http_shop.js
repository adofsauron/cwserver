// food

var fs              = require("fs");
var uuid            = require('node-uuid');
var multiparty      = require('multiparty');
var events          = require('events') ;

var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;
var Tools           = require('../base/tools.js');
var CONFIG          = require('../base/config.js');
var fs_sync         = require('../common/fs_sync.js');
var db_shop_process = require('../db/db_shop_process.js');
var classify        = require('../common/classify.js');

function HTTP_Shop() 
{
    var m_emitter   = new events.EventEmitter();

    InitEmitter();

    // 事件注册
    function InitEmitter() {
         m_emitter.on('UploadFile', UploadFile);
    }


    this.m_RenderAddShop = function(req, res) {
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
        var uid = uuid.v4();

        var food_folder = CONFIG.UPLOAD_PATH + '/' + uid;
        fs_sync.CreateFolder(food_folder);

        var jrt = {};
        jrt.uid = uid;
        jrt.cfy = classify.m_GetCfy();
        jrt.cfy_len = classify.m_GetCfyLen();

        var ret = Tools.Json2Str(jrt);
            
        var mejs = { 
            ret  : ret,
            //csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };
        
        res.render('add-shop', mejs);
    }


  function shop_foom2tb(shop_form) {
	var shop_tb = {}
	
    shop_tb.uid         = shop_form.uid;
	shop_tb.name 		= shop_form.name;
	shop_tb.brief 	    = shop_form.brief;
	shop_tb.site 		= shop_form.site;
	shop_tb.material	= shop_form.material;
    shop_tb.classify 	= shop_form.classify;
    shop_tb.locate      = shop_form.locate;
    shop_tb.cost        = shop_form.cost;
    shop_tb.phone       = shop_form.phone;


    var pic_num = Number(shop_form.pic_num);
    shop_tb.pic_num = pic_num;

    var Jpic_main = {};
    for (var i=1; i<=pic_num; ++i)  {
        Jpic_main[i] = shop_form["pic_main_" + i];
    }

    shop_tb.pic_main = Tools.Json2Str(Jpic_main);
    

	return shop_tb;
	
}
  


    function UploadFile(req, res, newTaskFolder, uid) {
        var form = new multiparty.Form();
        form.encoding = 'utf-8';
        form.uploadDir = newTaskFolder;
        form.keepExtensions = true; // 保留后缀
        form.maxFilesSize = 2 * 1024 * 1024;
        form.maxFields = 5000;  //设置所有文件的大小总和

        form.parse(req, function(err, fields, files) {
            if (err) {
                logger_error.error(err.message);
                res.writeHead(400, {'content-type': 'text/plain'});
                res.end("invalid request: " + err.message);
                return;
            }

            var shop_form = {};

            logger.debug(fields);

            // fields 是文本域
            for (var i in fields) {
                var field = fields[i];
                if (field.length == 0) {
                    continue;
                } else if (field.length==1) {
                    shop_form[i] = field[0];
                } else {
                    var jfield = {};
                    for (var s in field) {
                        jfield[s] = field[s];
                    }
                    shop_form[i] = Tools.Json2Str(jfield);
                }
            }

            // files 是上传的文件
            logger.debug('-------------');
            for (var i in files) {
                var file = files[i][0];
                //logger.debug(file);

                if (file.originalFilename == '') {
                    continue;
                }
                var pName = file.path;
                var fixName = newTaskFolder + '/' + file.fieldName

                var suffix = Tools.GetSuffix(pName);
                if (suffix != '') {
                    fixName = fixName + '.' + suffix
                }

                //logger.debug(pName + "\t" + fixName);

                fs.rename(pName, fixName, function(err) {
                    if (err) {
                        logger_error.error(err.message);
                    }
                });

                shop_form[i] =  file.fieldName + '.' + suffix;
            }

            logger.debug(shop_form);
            var shop_tb = shop_foom2tb(shop_form);
            logger.debug(shop_tb);
            db_shop_process.m_AddShop(shop_tb)
        
        })

    }
  
    this.m_ExecuteAddShop = function(req, res) {
        var body = req.body;
        var uid = req.params.uid;
        logger.debug(uid);
        var newTaskFolder = CONFIG.UPLOAD_PATH + '/' + uid;
        logger.debug(newTaskFolder);
        m_emitter.emit('UploadFile', req, res, newTaskFolder, uid);
        res.status(200).end("uid: " + uid);
    }


    this.m_GetIntroBySite = function(req, res) {
        var body = req.body;
        var site = req.params.site;

        db_food_process.m_GetIntroBySite(site, function(err, result){
            logger.debug(result);

            var num = result.length;
            logger.debug(num);

            for (var i=0; i<num; ++i) {
                logger.debug(result[i]);
            }

            var ret = Tools.Json2Str(result);
            logger.debug(ret);

            var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
            var mejs = { 
                ret  : ret,
                //csrfToken  : req.csrfToken(),
                WrapRoute  : function(x) { 
                    return function(y) { 
                        return Tools.WrapRoute(x, y);
                    }
                } (proxyRoute),
            };
            
            res.render('food-intro', mejs);


        });
    }

    this.m_GetFoodDetail = function(req, res) {
        var body = req.body;
        var id = Number( req.params.id );

        db_food_process.m_FindOneById(id, function(err, result){
            var jrt = result[0];

            jrt.cfy = classify.m_GetCfy();
            jrt.cfy_len = classify.m_GetCfyLen();

            var ret = Tools.Json2Str(jrt);
            var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
            var mejs = { 
                ret  : ret,
                //csrfToken  : req.csrfToken(),
                WrapRoute  : function(x) { 
                    return function(y) { 
                        return Tools.WrapRoute(x, y);
                    }
                } (proxyRoute),
            };

            logger.debug(ret);
            
            res.render('food-detail', mejs);

        });

    }

    this.m_GetShopDetail = function(req, res) {
        var body = req.body;
        var id = Number( req.params.id );
        logger.debug("id: " +id);

        db_shop_process.m_FindOneById(id, function(err, result){

            logger.debug(result);


            var ret = Tools.Json2Str(result[0]);
            var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
            var mejs = { 
                ret  : ret,
                //csrfToken  : req.csrfToken(),
                WrapRoute  : function(x) { 
                    return function(y) { 
                        return Tools.WrapRoute(x, y);
                    }
                } (proxyRoute),
            };

            logger.debug(ret);
            
            res.render('shop-detail', mejs);
        });

    }

}

module.exports = new HTTP_Shop;

