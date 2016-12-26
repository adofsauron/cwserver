// 此文件中，是程序所有的配置属性，此后的配置也应在此文件添加

const WEB_SERVER_PATH           = '.';
           
exports.LOG_FILES               = WEB_SERVER_PATH + '/' + 'logs/WebServer.log';         // debug/info    
exports.LOG_FILES_ERROR         = WEB_SERVER_PATH + '/' + 'logs/WebServer_error.log';   // warn/error
exports.LOG_LEVEL               = process.env.LOG_LEVEL     || 'DEBUG';                 // 日志等级，debug/info/warn/error, 设置之后，只能显示同等级和更高等级的

exports.STOR_PATH               = WEB_SERVER_PATH + '/../' + 'store';                   // 存储文件的目录, 为避免引起误解，路径最后不再添加'/'， 由调用处来添加'/'
exports.CT_PROCESS_PATH         = WEB_SERVER_PATH + '/../' + 'store';                   // ct处理结果文件存放的位置, 为避免引起误解，路径最后不再添加'/'， 由调用处来添加'/'
exports.VIEW_PATH               = '/../view';                                           // 访问根目录时，从根目录下面的view目录寻找
exports.DEFAULT_PAGE            = 'index.html';                                        // 访问/目录时，默认访问的文件
exports.ACTION_FILE_UPLOAD      = '/file-upload';                                       // 上传文件时，与前端的接口actio
exports.MaxFilesSize            = 200 * 1024 * 1024 * 1024;                             // 上传单个文件的大小限制 2G
exports.HTTP_UPLOAD_INPUTNAME   = 'file';                                               // HTTP中，上传文件时候，指定的input_name

exports.FS_BUFFER_SIZE          = 256;                                                  // fs_sync模块中开辟的buffer的长度，1024字节, 目前并不需要太大的存储空间

exports.TASK_ID                 = 'task_id';                                            // 任务的唯一id， 这里约定的是与前端的url参数内的key
exports.FILE_TASK_ID            = WEB_SERVER_PATH + '/' + 'base/task_id';
exports.TASKID_STEP             = 1000;                                                 // 计算task_id时候的步长，以步长为单位进行运算

exports.HTTP_SERVER_PORT        = process.env.PORT          || 1524;                    // HTTP服务器监听的端口号

exports.CT_IP                   = process.env.CT_IP         || 'tcp://10.0.100.68';     // control模块的ip
exports.CT_PORT                 = process.env.CT_PORT       || '5077';                  // control模块的端口号                    

exports.DB_IP                   = process.env.DB_IP         || '10.0.100.68';           // 数据库的ip
exports.DB_PORT                 = process.env.DB_PORT       || 3306;                    // 数据库的端口
exports.DB_USER                 = process.env.DB_USER       || 'root';                  // 数据库的用户名
exports.DB_PASSWD               = process.env.DB_PASSWD     || 'yskj2407';              // 数据库的口令
exports.DB_DBNAME               = process.env.DB_DBNAME     || 'task';                  // 数据库的数据库名字
exports.DB_TABLE                = process.env.DB_TABLE      || 'task_info';             // 数据库的表名字


