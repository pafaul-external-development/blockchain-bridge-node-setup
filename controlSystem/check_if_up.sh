#!/bin/bash

DIRROOT=$(cd $(dirname $0) && pwd)

GLEECS_NODE_IP=
GLEECS_PORT=
BTCV_NODE_IP=
BTCV_PORT=

loop() {
    ping -p ${BTCV_PORT} ${BTCV_NODE_IP}
    btcv_status=$?
    ping -p ${GLEECS_PORT} ${GLEECS_NODE_IP}
    gleecs_status=$?
}

while [ -f $DIRROOT/.look_for_nodes ]
do
    loop
    status_string=$(date '+%d-%m-%y-%H:%m:%S')
    [ $btcv_status ] && status_string="${status_string} btcv->ok" || status_string="${status_string} btcv->fail"
    [ $gleecs_status ] && status_string="${status_string} gleecs->ok" || status_string="${status_string} gleecs->fail"
    echo "${status_string}" >> ${DIRROOT}/.nodes_status
done
