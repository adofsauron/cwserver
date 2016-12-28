-- db desc

-- create database cate;
-- use cate;  

CREATE TABLE IF NOT EXISTS `user`
(
    id            INT(20)    NOT NULL   AUTO_INCREMENT,
    uid          CHAR(128)  NOT NULL,    -- uuid,作为对应文件夹的名字
    name          CHAR(20)   NOT NULL,   -- 用户名, 邮箱
    passwd        CHAR(20)   NOT NULL,   -- 密码

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- 食物
CREATE TABLE IF NOT EXISTS `food`
(
    id              INT(20)     NOT NULL   AUTO_INCREMENT,
    uid             CHAR(128)   NOT NULL,
    name            CHAR(20)    NOT NULL,  -- 食物名字
    pic_main        CHAR(240)   NOT NULL,  -- 食物图片位置
    material        CHAR(80)    NOT NULL,  -- 食材
    history         CHAR(250)   NOT NULL,  -- 历史
    site            CHAR(80)    NOT NULL,  -- 地域

    make_type       CHAR(10)      NOT NULL,  -- 制作工艺 类型 
    make_content    CHAR(250)   NOT NULL,  -- 制作步骤，json的string形式，视频则只有地址，图片介绍分步骤

    vedio_type      CHAR(10)      NOT NULL,  -- 视频类型

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- 商铺表
CREATE TABLE IF NOT EXISTS `shop`
(
    id            INT(20)       NOT NULL   AUTO_INCREMENT,
    uid           CHAR(128)     NOT NULL,
    name          CHAR(20)      NOT NULL,   -- 店铺名字
    picture       CHAR(40)      NOT NULL,   -- 店铺图片(文件夹)
    site          CHAR(20)      NOT NULL,   -- 地域
    classify      CHAR(20)      NOT NULL,   -- 类别

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
    classify      CHAR(20)  NOT NULL,   -- 类别
    shop_id       INT(20)   NOT NULL,   -- shop id

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- comment 点评
CREATE TABLE IF NOT EXISTS `comment`
(
    id            INT(20)       NOT NULL   AUTO_INCREMENT,
    content       CHAR(250)     NOT NULL,   -- 内容
    user_id       INT(20)       NOT NULL,   -- user id
    shop_id       INT(20)       NOT NULL,   -- shop id

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
