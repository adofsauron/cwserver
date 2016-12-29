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
var db_food_process = require('../db/db_food_process.js');

function HTTP_Food() 
{
    var m_emitter   = new events.EventEmitter();

    InitEmitter();

    // 事件注册
    function InitEmitter() {
         m_emitter.on('UploadFile', UploadFile);
    }


    this.m_RenderAddFood = function(req, res) {
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
        var uid = uuid.v4();

        var food_folder = CONFIG.UPLOAD_PATH + '/' + uid;
        fs_sync.CreateFolder(food_folder);
            
        var mejs = { 
            uid  : uid,
            //csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };
        
        res.render('add-food', mejs);
    }


  function food_foom2tb(food_form) {
	var food_tb = {}
	
    food_tb.uid         = food_form.uid;
	food_tb.name 		= food_form.name;
	food_tb.history 	= food_form.history;
	food_tb.site 		= food_form.site;
	food_tb.material	= food_form.material;
    food_tb.make_type   = food_form.make_type;
    food_tb.vedio_type  = food_form.vedio_type;
    food_tb.step_num    = food_form.step_num;

    var pic_num = Number(food_form.pic_num);
    food_tb.pic_num = pic_num;

    var Jpic_main = {};
    for (var i=1; i<=pic_num; ++i)  {
        Jpic_main[i] = food_form["pic_main_" + i];
    }

    food_tb.pic_main = Tools.Json2Str(Jpic_main);
    
	
	var mk_type = food_form.make_type; // mt_1:vedio, 2:pic
	var vedio_type = food_form.vedio_type; // vedio_1:upload, 2:http://swf
	
	var content = "";
	
	if (mk_type == "mt_vedio") {
		content = food_form.make_content;
    } else if (mk_type == "mt_pic") {
        food_tb.vedio_type = "NULL";
        var step_num = Number( new String( food_form.step_num ));
		var js_con = {}
        // 注意，要指定从1开始
		for (var i=1; i < step_num; ++i) {
			var ms = food_form["ms_" + i];
			var pic = food_form["pic_" + i]
			var cot = ms + '|' + pic;
			js_con[i] = cot;
		}
		content = JSON.stringify(js_con);
		
	} else {
		content = "NULL";
	}
	
	food_tb.make_content = content;
	return food_tb;
	
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

            var food_form = {};

            // fields 是文本域
            for (var i in fields) {
                var field = fields[i][0];
                if (field == '') {
                    continue;
                }

                logger.debug(i + "\t" + field);
                food_form[i] = field;
            }

            // files 是上传的文件
            logger.debug('-------------');
            for (var i in files) {
                var file = files[i][0];
                logger.debug(file);

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

                food_form[i] =  file.fieldName + '.' + suffix;
            }

            //logger.debug(food_form);
            var food_tb = food_foom2tb(food_form);
            logger.debug(food_tb);
            db_food_process.m_AddFood(food_tb)
        
        })

    }
  
    this.m_ExecuteAddFood = function(req, res) {
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

             if (err) {
                logger_error.error(err.message);
                return;
            }

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

    this.m_GetFoodDetail = function(req, res){
        var body = req.body;
        var id = Number( req.params.id );

        db_food_process.m_FindOneById(id, function(err, result){
             if (err) {
                logger_error.error(err.message);
                return;
            }

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
            
            res.render('food-detail', mejs);

        });

    }

}

module.exports = new HTTP_Food;

