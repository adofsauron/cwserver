#! /bin/bash

### server assistant script

### file and folder path
WEBSERVER_DIR=/home/lambda/app/webserver
STORE_DIR=$WEBSERVER_DIR/../store
LOGS=$WEBSERVER_DIR/logs
TASK_ID=$WEBSERVER_DIR/base/task_id

### check command execution state
function CheckExecuteState() {
    if [ $1 -eq 0 ]; then
        echo "execute success"
    else
        echo "execute error, pleasure run this script again"
        # the exit code is the input
        exit $1
    fi
}

### mount store folder
## check whether the folder exists
if [ ! -d "$STORE_DIR" ]; then
    mkdir $STORE_DIR

    CheckExecuteState $?
fi

## whether if mount or not, sill run this cmd to ensure the folder is mounted successly.
sudo mount -t cifs //nas.intern.lambdacal.com/homes/szhang/store $STORE_DIR -o uid=1001,gid=1001,dir_mode=0755,username=szhang,password=Yskj2407

CheckExecuteState $?

### mkdir logs folder
if [ ! -d "$LOGS" ]; then
    mkdir $LOGS
    
    CheckExecuteState $?
fi

### touch task_id and set value
if [ ! -f "$TASK_ID" ]; then
    # touch task_id file
    touch $TASK_ID
   
    CheckExecuteState $?

    # set value
    echo '0' >$TASK_ID

    CheckExecuteState $?
fi

### if you just copy the whole webserver files, you still can't run it.
## the reason is that the so file of libzmq not in /usr, but other node_modules is in local folder, run the following cmd to install it
cd $WEBSERVER_DIR
sudo npm install zmq

CheckExecuteState $?

### if you have not proto js files, this cmd whil create that files.
##  but at first, you have to install ProtobufJs, I can't help you to install pbjs, it is illegal. So do it by yourself
cd $WEBSERVER_DIR/proto
./proto2js.sh

CheckExecuteState $?
