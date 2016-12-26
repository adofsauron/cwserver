#! /bin/bash

DEST_DIR=/home/szhang/work/lambda/project/cloudapp5/webserver/

 cp   ../3rd.sh                         $DEST_DIR

 cp   ../README.md                      $DEST_DIR

 cp   ../webserver_main.js              $DEST_DIR

 cp   ../start.sh                       $DEST_DIR

 cp -r ../http/                         $DEST_DIR

 cp -r ../base/                         $DEST_DIR

 cp -r ../packet/                       $DEST_DIR

 cp -r ../proto/proto2js.sh             $DEST_DIR/proto/
 
 cp -r ../db/                           $DEST_DIR

 cp -r ../common/                       $DEST_DIR

 cp -r ../utest/                        $DEST_DIR
 
 echo 'cp success'

