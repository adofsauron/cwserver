// 此文件中，是程序所有的配置属性，此后的配置也应在此文件添加

const WEB_SERVER_PATH           = '/home/work/webserver';
           
exports.LOG_FILES               = WEB_SERVER_PATH + '/' + 'logs/webserver.log';         // debug/info    
exports.LOG_FILES_ERROR         = WEB_SERVER_PATH + '/' + 'logs/webserver_error.log';   // warn/error
exports.LOG_LEVEL               = process.env.LOG_LEVEL     || 'DEBUG';                 // 日志等级，debug/info/warn/error, 设置之后，只能显示同等级和更高等级的

exports.STOR_PATH               = WEB_SERVER_PATH + '/../' + 'store';                   // 存储文件的目录, 为避免引起误解，路径最后不再添加'/'， 由调用处来添加'/'
exports.CT_PROCESS_PATH         = WEB_SERVER_PATH + '/../' + 'store';                   // ct处理结果文件存放的位置, 为避免引起误解，路径最后不再添加'/'， 由调用处来添加'/'
exports.UPLOAD_PATH             = '/home/work/nginx/html/views/upload';
exports.VIEWS_PATH              = '/../views';                                          // ejs views
exports.DEFAULT_PAGE            = 'index.html';                                         // 访问/目录时，默认访问的文件
exports.ACTION_FILE_UPLOAD      = '/file-upload';                                       // 上传文件时，与前端的接口actio
exports.MaxFilesSize            = 200 * 1024 * 1024 * 1024;                             // 上传单个文件的大小限制 2G
exports.HTTP_UPLOAD_INPUTNAME   = 'file';                                               // HTTP中，上传文件时候，指定的input_name

exports.FS_BUFFER_SIZE          = 256;                                                  // fs_sync模块中开辟的buffer的长度，1024字节, 目前并不需要太大的存储空间

exports.HTTP_SERVER_PORT        = process.env.PORT          || 1524;                    // HTTP服务器监听的端口号

exports.DB_IP                   = process.env.DB_IP         || '127.0.0.1';             // 数据库的ip
exports.DB_PORT                 = process.env.DB_PORT       || 3306;                    // 数据库的端口
exports.DB_USER                 = process.env.DB_USER       || 'root';                  // 数据库的用户名
exports.DB_PASSWD               = process.env.DB_PASSWD     || '';                      // 数据库的口令
exports.DB_DBNAME               = process.env.DB_DBNAME     || 'cate';                  // 数据库的数据库名字
exports.DB_TABLE_USER           = process.env.DB_TABLE      || 'user';                  // 用户表

exports.DB_POOL_MAX             = 10;                                                    // 数据库连接池最大数目
exports.DB_POOL_MIN             = 3;                                                     // 数据库连接池最小数目 
exports.DB_POOL_TIMEOUT         = 3000;                                                  // 单个数据库连接最大处理时间

exports.PROXY_ROUTE             = process.env.PROXY_ROUTE   || '';                       // 模板渲染中的路径前缀
exports.session_secret          = 'auth_server_session_secret';                          // session secret


