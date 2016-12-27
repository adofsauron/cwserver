-- db desc

create database cate;
use cate;  

CREATE TABLE IF NOT EXISTS `user`
(
    id            INT(20)    NOT NULL   AUTO_INCREMENT,
    uuid          char(128)  NOT NULL,  -- uuid,作为对应文件夹的名字
    name          char(20)   NOT NULL,   -- 用户名, 邮箱
    passwd        char(20)   NOT NULL,   -- 密码

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;


-- 食物
CREATE TABLE IF NOT EXISTS `food`
(
    id              INT(20)     NOT NULL   AUTO_INCREMENT,
    uuid            char(128)   NOT NULL,
    name            char(20)    NOT NULL,  -- 食物名字
    picture         char(80)    NOT NULL,  -- 食物图片位置(文件夹)/main.*
    material        char(80)    NOT NULL,  -- 食材
    history         char(500)   NOT NULL,  -- 历史
    site            char(80)    NOT NULL,  -- 地域

    make_type       INT(1)      NOT NULL;  -- 制作工艺 类型 1:视频，2:图片
    make_step       char(500)   NOT NULL;  -- 制作步骤，json的string形式，视频则只有地址，图片介绍分步骤

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- 商铺表
CREATE TABLE IF NOT EXISTS `shop`
(
    id            INT(20)       NOT NULL   AUTO_INCREMENT,
    uuid          char(128)     NOT NULL,
    name          char(20)      NOT NULL,   -- 店铺名字
    picture       char(40)      NOT NULL,   -- 店铺图片(文件夹)
    site          char(20)      NOT NULL,   -- 地域
    class         char(20)      NOT NULL,   -- 类别

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;


-- 食物和商铺的关系表，n:n的关系 foo relate shop
CREATE TABLE IF NOT EXISTS `frs`
(
    id            INT(20)   NOT NULL   AUTO_INCREMENT,
    food_id       INT(20)   NOT NULL,   -- 食物id
    shop_id       INT(20)   NOT NULL,   -- 商铺id

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- 用户收藏
CREATE TABLE IF NOT EXISTS `collect`
(
    id            INT(20)   NOT NULL   AUTO_INCREMENT,
    user_id       INT(20)   NOT NULL,   -- 用户id
    coll_id       INT(20)   NOT NULL,   -- 收藏id(食物/商铺)
    coll_type     INT(1)    NOT NULL,   -- 收藏种类(食物:1， 商铺:2)

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- class relate shop
CREATE TABLE IF NOT EXISTS `crs`
(
    id            INT(20)   NOT NULL   AUTO_INCREMENT,
    class         char(20)  NOT NULL,   -- 类别
    shop_id       INT(20)   NOT NULL,   -- shop id

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;


-- comment 点评
CREATE TABLE IF NOT EXISTS `comment`
(
    id            INT(20)       NOT NULL   AUTO_INCREMENT,
    content       char(500)     NOT NULL,   -- 内容
    user_id       INT(20)       NOT NULL,   -- user id
    shop_id       INT(20)       NOT NULL,   -- shop id

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
