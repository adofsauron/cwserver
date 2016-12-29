// router

var http_fileTask     = require('./http_filetask.js');
var http_provideFile  = require('./http_providefile.js');
var http_auth         = require('./http_auth.js');
var http_model        = require('./http_model.js');
var http_food         = require('./http_food.js');
var http_shop         = require('./http_shop.js');
var http_user         = require('./http_user.js');

var router            = require('express').Router();

// root
router.get  ('/',                               http_provideFile.m_ProvideFile);

// file task
router.get  ('/file-gettaskid/',                http_fileTask.m_GetTaskId2Front); 
router.post ('/file-upload/',                   http_fileTask.m_UploadFIle); 
router.get  ('/file-querytask/:task_id',        http_fileTask.m_QueryTaskByTaskID);
router.get  ('/file-down/:task_id',             http_fileTask.m_DownFileByTaskID);
router.post ('/file-starttask/:task_id',        http_fileTask.m_StartTask);

router.get  ('/login.action',                   http_auth.m_authLoc);       // check auth, if no then login
router.post ('/login.action',                   http_auth.m_Login);                          // post form login
router.get  ('/register.action',                http_model.m_Register)                       // get register html
router.post ('/register.action',                http_auth.m_Register);                       // post form register

//router.get  ('/admin.action',                   http_auth.m_auth);       // check auth, if no then login
//router.post ('/login.action',                   http_auth.m_Login);                          // post form login

router.get  ('/add-food.action',                http_food.m_RenderAddFood);
router.post ('/add-food/:uid.action',           http_food.m_ExecuteAddFood);
router.get  ('/food-intro/:site.action',        http_food.m_GetIntroBySite);
router.get  ('/food-detail/:id.action',         http_food.m_GetFoodDetail);

router.get  ('/add-shop.action',                http_shop.m_RenderAddShop);
router.post ('/add-shop/:uid.action',           http_shop.m_ExecuteAddShop);
router.get  ('/shop-detail/:id.action',         http_shop.m_GetShopDetail);
router.get  ('/select-shop.action',             http_shop.m_SelectShop);
router.get  ('/select-detail/:classify.action', http_shop.m_GetSelectDetail);


router.get  ('/user.action',                    http_auth.m_auth, http_auth.m_auth, http_model.m_Login);
router.get  ('/user-intro/:id.action',          http_auth.m_auth, http_user.m_GetUserIntroById);
router.get  ('/user-detail/:id.action',         http_auth.m_auth, http_user.m_GetUserDetailById);
// 修改密码
router.get  ('/pwd-change/:id.action',          http_auth.m_auth, http_user.m_RenderPwdChange); 
router.post ('/pwd-change/:id.action',          http_auth.m_auth, http_user.m_DoPwdChange);
// 修改头像
router.get  ('/pic-change/:id.action',          http_auth.m_auth, http_user.m_RenderPicChange); 
router.post ('/pic-change/:id.action',          http_auth.m_auth, http_user.m_DoPicChange);
// 修改昵称
router.get  ('/nick-change/:id.action',         http_auth.m_auth, http_user.m_RenderNickChange); 
router.post ('/nick-change/:id.action',         http_auth.m_auth, http_user.m_DoNickChange);


module.exports = router;
