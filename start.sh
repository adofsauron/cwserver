#! /bin/bash

###
 # Copyright @ 2016 LambdaCal,Inc
 #  
 # Author:szhang
##

### for  webserver run

# main file
MAIN_FILE=./webserver_main.js

#### args 

# server port
PORT=${PORT} 
# log_level: DEBUG/INFO/WARN/ERRO
LOG_LEVEL=${LOG_LEVEL}
# control server ip
CT_IP=${CT_IP}
# control server port
CT_PORT=${CT_PORT}
# database ip
DB_IP=${DB_OP}
# database port: defalult 3306
DB_PORT=${DB_PORT}
# databae username
DB_USER=${DB_USER}
# database passwd
DB_PASSWD=${DB_PASSWD}

### whay 'p,d,c,s,e,t,u,w'? the reason is that I can't find a well name by one char that can descrbe so much args'
function helper() {
    echo "args meaning: "
    echo "    -p            [WebServer port]"
    echo "    -d            [log level， DEBUG/INFO/WARN/ERROR]"
    echo "    -e            [db ip]"
    echo "    -t            [db port]"
    echo "    -u            [db user]"
    echo "    -w            [db passwd]"
    echo "    -?            [help message]"
    echo "[for example: you should put all the cmd as follow:]"
    echo "[./start.sh -p 1524 -d DEBUG -e 127.0.0.1 -t 3306 -u root -w '' ]"
}

function SetEnv() {
    export PORT=$PORT
    export LOG_LEVEL=$LOG_LEVEL
    export DB_IP=$DB_IP
    export DB_PORT=$DB_PORT
    export DB_USER=$DB_USER
    export DB_PASSWD=$DB_PASSWD
    echo 'set Env over'
}

### print Env, for check what you input at cmd
function ShowEnv() {
    echo 'PORT        :'    $PORT
    echo 'LOG_LEVEL   :'    $LOG_LEVEL
    echo 'DB_IP       :'    $DB_IP
    echo 'DB_PORT     :'    $DB_PORT
    echo 'DB_USER     :'    $DB_USER
    echo 'DB_PASSWD   :'    $DB_PASSWD
}

### server run
function ServerRun() {
    NODE_BIN=`exec which node`

    if [ ! $NODE_BIN ]; then
        echo "node is not installed"
    else
        echo 'web server ready runing'
        nohup $NODE_BIN $MAIN_FILE &
    fi
}

### inpout args
while getopts p:d:e:t:u:w:?:i val
do
    case $val in 
         'p')
            echo "PORT: " ${OPTARG}
            PORT=${OPTARG}
         ;;

         'd')
            echo "LOG_LEVEL: " ${OPTARG}
            LOG_LEVEL=${OPTARG}
         ;;

         'e')
            echo "DB_IP: " ${OPTARG}
            DB_IP=${OPTARG}
         ;;

         't')
            echo "DB_PORT: " ${OPTARG}
            DB_PORT=${OPTARG}
         ;;

         'u')
            echo "DB_USER: " ${OPTARG}
            DB_USER=${OPTARG}
         ;;

         'w')
            echo "DB_PASSWD: " ${OPTARG}
            DB_PASSWD=${OPTARG}
         ;;

         '?')
            echo "args error， input -?, see help message" 
        ;;
    esac
done

### check args, db passwd could be null, so don't check DB_PASSWD args'
if ! [[ \
            $PORT \
        && $LOG_LEVEL \
        && $DB_IP \
        && $DB_PORT \
        && $DB_USER \
     ]] 
then 
    echo "input args by help"
    helper; 
    exit 
fi

### print ENV args
ShowEnv

### set Env
SetEnv

### server run
ServerRun

