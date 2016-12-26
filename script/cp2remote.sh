#! /usr/bin/expect -f 

### root
spawn scp   ../3rd.sh                       lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../README.md                    lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../package.json                 lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../webserver_main.js            lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../start.sh                     lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

### http
spawn scp -r ../http/                       lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

### base
spawn scp -r ../base/config.js              lambda@10.0.100.43://home/lambda/app/webserver/base/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../base/task_id.js             lambda@10.0.100.43://home/lambda/app/webserver/base/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../base/tools.js               lambda@10.0.100.43://home/lambda/app/webserver/base/
expect "*password:" 
send "yskj2407\r"
expect eof 

### packet
spawn scp -r ../packet/                     lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

### proto
spawn scp -r ../proto/                      lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 
 
### db 
spawn scp -r ../db/                         lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

### common
spawn scp -r ../common/                     lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

### utest
spawn scp -r ../utest/                      lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

### script
spawn scp -r ../script/                     lambda@10.0.100.43://home/lambda/app/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 
