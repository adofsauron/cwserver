// Main类: 程序入口，启动http服务器

var HTTP_Server = require('./http/http_server.js').HTTP_Server;

function Main() 
{
    var m_HttpServer = new HTTP_Server();
    
    function m_Init() {
        m_HttpServer.m_Init();
    }
    
    function m_Run() {
        m_HttpServer.m_Run();   
    }
    
    this.m_Start = function () {
        m_Init();
        m_Run();    
    }
}

new Main().m_Start();
