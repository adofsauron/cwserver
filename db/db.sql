-- db desc

create database cate;
use cate;  

CREATE TABLE IF NOT EXISTS `user`
(
    id            INT(20)  NOT NULL   AUTO_INCREMENT,
    name          char(20) NOT NULL,
    passwd        char(20) NOT NULL,

    primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
