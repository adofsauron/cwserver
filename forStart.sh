#! /bin/bash

WEB_DIR=/home/work/webserver

$WEB_DIR/start.sh -p 1524 -d DEBUG -e 127.0.0.1 -t 3306 -u root -w ''
