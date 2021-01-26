#!/bin/bash

. /opt/.config/config

for f in $(ls ${WALLET_DIR})
do
    [ -d ${WALLET_DIR}/f ] && ${NODE} -conf=${CONF_FILE} loadwallet ${f}
done
