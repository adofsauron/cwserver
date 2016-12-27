// food

var uuid        = require('node-uuid');
var logger      = require('../common/logger.js').logger;
var Tools       = require('../base/tools.js');
var CONFIG      = require('../base/config.js');
var fs_sync     = require('../common/fs_sync.js');

function HTTP_Food() 
{

    this.m_RenderAddFood = function(req, res) {
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
        var uid = uuid.v4();

        var food_folder = CONFIG.UPLOAD_PATH + '/' + uid;
        fs_sync.CreateFolder(food_folder);
            
        var mejs = { 
            uid  : uid,
            csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };
        
        res.render('add-food', mejs);
    }

  
  this.m_ExecuteAddFood = function(req, res) {
      var body    = req.body;
      var uid = body.uid;
      
      var food_folder = CONFIG.UPLOAD_PATH + '/' + uid;

      res.status(200).end("uid: " + uid);
  }

}

module.exports = new HTTP_Food;

