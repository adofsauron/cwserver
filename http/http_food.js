// food

var uuid            = require('node-uuid');
var multiparty      = require('multiparty');
var events          = require('events') ;

var logger          = require('../common/logger.js').logger;
var logger_error    = require('../common/logger.js').logger_error;
var Tools           = require('../base/tools.js');
var CONFIG          = require('../base/config.js');
var fs_sync         = require('../common/fs_sync.js');

function HTTP_Food() 
{
    var m_emitter   = new events.EventEmitter();

    InitEmitter();

    // 事件注册
    function InitEmitter() {
        
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


 function UploadFile(req, res, newTaskFolder, pic_names) {
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = newTaskFolder;
    form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
         if (err) {
            logger_error.error(err.message);
            res.writeHead(400, {'content-type': 'text/plain'});
            res.end("invalid request: " + err.message);
            return;
        }

        var text = {}

        logger.debug("fields: ");
        //logger.debug(fields);


        // fields 是文本域
        for (var i in fields) {
            logger.debug(i + ", " + fields[i][0])
            // TODO 填写表单
       
        }

        // files 是上传的文件
        logger.debug('-------------');
        logger.debug("files");
        logger.debug(files)
    
  })

}
  
  this.m_ExecuteAddFood = function(req, res) {
      var body    = req.body;


       var uid = req.params.uid;

       logger.debug(uid);


      var newTaskFolder = CONFIG.UPLOAD_PATH + '/' + uid;


      logger.debug(newTaskFolder)

      var pic_names = {"pic_main":1, "up_vedio":1, "pic_1":1,"pic_2":1, "pic_3":1}

      var text =  UploadFile(req, res, newTaskFolder, pic_names);

      res.status(200).end("uid: " + uid);
     


     
  }

}

module.exports = new HTTP_Food;

