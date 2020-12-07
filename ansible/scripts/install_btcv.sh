#!/bin/bash

echo_and_exit() {
    if [ $1 -ne 0 ]
    then
        echo $2
        exit 1
    fi
}

if [ $# -ne 1 ]
then
    echo_and_exit 1 "Invalid argument count. Exiting."
fi

BTCV_DIR=$1

cd ${BTCV_DIR}
echo_and_exit $? "Directory ${BTCV_DIR} is not presented. Exiting."

TIMESTAMP=$(cat ${BTCV_DIR}/.latest_download)
echo_and_exit $? "Timestamp not found. Exiting."

BTCV_DIR_LATEST=${BTCV_DIR}/btcv-${TIMESTAMP}/
BTCV_DIR_LATEST=${BTCV_DIR_LATEST}/$(ls ${BTCV_DIR_LATEST})
cd ${BTCV_DIR_LATEST}
echo_and_exit $? "Latest BTCV dir is not presented. Try to re-run ansible script. Exiting."