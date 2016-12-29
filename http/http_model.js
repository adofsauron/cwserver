// 模板渲染

var logger      = require('../common/logger.js').logger;
var Tools       = require('../base/tools.js');
var CONFIG      = require('../base/config.js');

function HTTP_Model() 
{
    this.m_Login = function(req, res) {
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
            
        var mejs = { 
            //csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };
        
        logger.debug('proxyRoute: ' + proxyRoute);
        res.status(401).render('login', mejs);
    }

    this.m_Register = function(req, res) {
        var proxyRoute = req.header("x-proxy-route") ? req.header("x-proxy-route") : CONFIG.PROXY_ROUTE;
              
        var mejs = { 
           // csrfToken  : req.csrfToken(),
            WrapRoute  : function(x) { 
                return function(y) { 
                    return Tools.WrapRoute(x, y);
                }
            } (proxyRoute),
        };

        logger.debug('proxyRoute: ' + proxyRoute);
        res.render('register', mejs);
    }
}

module.exports = new HTTP_Model;

