#! /usr/bin/expect -f 


spawn scp   ../3rd.sh                                   szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../README.md                                szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../package.json                             szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../webserver_main.js                        szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp   ../start.sh                                 szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../http/                                   szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../base/                                   szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../packet/packet_ct_config.js              szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/packet/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../proto/proto2js.sh                       szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/proto/
expect "*password:" 
send "yskj2407\r"
expect eof 
 
spawn scp -r ../db/                                     szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../common/                                 szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

spawn scp -r ../utest/                                  szhang@10.0.100.22://home/szhang/work/lambda/project/cloudapp5/webserver/
expect "*password:" 
send "yskj2407\r"
expect eof 

