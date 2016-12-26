#! /bin/bash


DST=/home/szhang/work/lambda/project/cloudapp/webserver/

cp ../Main.js                            $DST    -rf
cp ../README.md                          $DST    -rf
cp ../3rd.sh                             $DST    -rf

cp ../http/http_filetask.js              $DST/http/    -rf
cp ../http/http_server.js                $DST/http/    -rf
cp ../http/http_web_router.js            $DST/http/    -rf
cp ../http/http_providefile.js           $DST/http/    -rf

cp ../base/config.js                     $DST/base/    -rf
cp ../base/task_id.js                    $DST/base/    -rf
cp ../base/tools.js                      $DST/base/    -rf

cp ../packet/packet_ct_config.js         $DST/packet/   -rf

cp ../proto/proto2js.sh                  $DST/proto/    -rf

cp ../common/logger.js                   $DST/common/    -rf
cp ../common/ct_zmq.js                   $DST/common/    -rf

cp ../db/db_process.js                   $DST/db/    -rf

echo 'cp success'

