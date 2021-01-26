#!/bin/bash

. /opt/.config/config

for f in $(ls ${WALLET_DIR})
do
    if [ -d ${WALLET_DIR}/${f} ]
    then
        count=21
        while [ ${count} -ge 15 ]
        do
            count=$(ps -aux | grep ${NODE_CLI} | wc -l)
            sleep 1
        done
        ${NODE_CLI} -conf=${CONF_FILE} loadwallet ${f} &
    fi
done
