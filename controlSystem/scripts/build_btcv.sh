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

export BDB_PREFIX=${BTCV_DIR_LATEST}/db4

./contrib/install_db4.sh $(pwd)
echo_and_exit $? "Cannot install db4.8 from BTCV sources"

./autogen.sh
./configure BDB_LIBS="-L${BDB_PREFIX}/lib -ldb_cxx-4.8" BDB_CFLAGS="-I${BDB_PREFIX}/include" --with-miniupnpc --with-zmq 
make
echo_and_exit $? "Build of BTCV failed"

