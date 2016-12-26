-- db desc

create database cate;
use cate;  

CREATE TABLE IF NOT EXISTS `user`
(
    id            INT(20)  NOT NULL   AUTO_INCREMENT,
    name          char(20) NOT NULL,   -- 用户名, 邮箱
    passwd        char(20) NOT NULL,   -- 密码

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;


-- 食物制作步骤
CREATE TABLE IF NOT EXISTS `make`
(
    id              INT(20)     NOT NULL   AUTO_INCREMENT,
    food_id         INT(20)     NOT NULL,   -- 食物id
    step            INT(20)     NOT NULL,   -- 第几步
    step_pic        char(80)    NOT NULL,   -- 该步骤图片
    step_des        char(80)    NOT NULL,   -- 该步骤描述

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- 食物表
CREATE TABLE IF NOT EXISTS `food`
(
    id              INT(20)     NOT NULL   AUTO_INCREMENT,
    name            char(20)    NOT NULL,  -- 食物名字
    picture         char(80)    NOT NULL,  -- 食物图片位置(文件夹)/main.*
    material        char(80)    NOT NULL,  -- 食材
    history         char(500)   NOT NULL,  -- 历史
    site            char(80)    NOT NULL,  -- 地域

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- 商铺表
CREATE TABLE IF NOT EXISTS `shop`
(
    id            INT(20)       NOT NULL   AUTO_INCREMENT,
    name          char(20)      NOT NULL,   -- 店铺名字
    picture       char(20)      NOT NULL,   -- 店铺图片(文件夹)
    site          char(80)      NOT NULL,   -- 地域
    class         char(80)      NOT NULL,   -- 类别

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