// router

var http_fileTask     = require('./http_filetask.js');
var http_provideFile  = require('./http_providefile.js');

var router            = require('express').Router();

// root
router.get  ('/',                          http_provideFile.m_ProvideFile);

// file task
router.get  ('/file-gettaskid/',           http_fileTask.m_GetTaskId2Front); 
router.post ('/file-upload/',              http_fileTask.m_UploadFIle); 
router.get  ('/file-querytask/:task_id',   http_fileTask.m_QueryTaskByTaskID);
router.get  ('/file-down/:task_id',        http_fileTask.m_DownFileByTaskID);
router.post ('/file-starttask/:task_id',   http_fileTask.m_StartTask);

module.exports = router;
