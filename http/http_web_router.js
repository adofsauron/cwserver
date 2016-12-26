// router

var http_fileTask     = require('./http_filetask.js');
var http_provideFile  = require('./http_providefile.js');
var http_auth         = require('./http_auth.js');
var http_model        = require('./http_model.js');


var router            = require('express').Router();

// root
router.get  ('/',                          http_provideFile.m_ProvideFile);

// file task
router.get  ('/file-gettaskid/',           http_fileTask.m_GetTaskId2Front); 
router.post ('/file-upload/',              http_fileTask.m_UploadFIle); 
router.get  ('/file-querytask/:task_id',   http_fileTask.m_QueryTaskByTaskID);
router.get  ('/file-down/:task_id',        http_fileTask.m_DownFileByTaskID);
router.post ('/file-starttask/:task_id',   http_fileTask.m_StartTask);

// auth
router.get  ('/do/login',                      http_auth.m_auth, http_model.m_Login);       // check auth, if no then login
router.post ('/do/login',                      http_auth.m_Login);                          // post form login
router.get  ('/do/register',                   http_model.m_Register)                       // get register html
router.post ('/do/register',                   http_auth.m_Register);                       // post form register


module.exports = router;