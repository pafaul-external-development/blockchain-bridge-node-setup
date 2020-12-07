#!/bin/bash
DIRROOT=$(cd $(dirname $0) && pwd)

VAULT_LINK="https://github.com/bitcoinvault/bitcoinvault/archive/v2.1.0.tar.gz"
GLEECS_LINK="https://github.com/Gleecs/GleecBTC-FullNode-Win-Mac-Linux/releases/download/v0.20.3/v0.20.3.tar.gz"

[ ! -d ${DIRROOT}/tmp ] && mkdir ${DIRROOT}/tmp

current_timestamp=$(date '+%d-%m-%y')
echo "${current_timestamp}" > ${DIRROOT}/tmp/timestamp

DIRS_TO_CREATE="sources build sources/sources-${current_timestamp}"
SRC_DIR=${DIRROOT}/sources

make_dir_tree() {
    for directory in $DIRS_TO_CREATE
    do
        [ ! -d ${DIRROOT}/${directory} ] && mkdir ${DIRROOT}/${directory}
    done
}

exe_or_exit() {
    bash -c "$@"
    res=$?
    if [ $res -ne 0 ]
    then
        echo "command failed: $@"
        echo "Exiting"
        exit 1
    fi
}

make_dir_tree

cd ${SRC_DIR}/sources-${current_timestamp}
wget ${VAULT_LINK} -O btcv.tar.gz
wget ${GLEECS_LINK} -O gleecs.tar.gz

BUILD_DIR=${DIRROOT}/build/build-${current_timestamp}
mkdir ${BUILD_DIR}/{,btcv,gleecs}
tar -xf btcv.tar.gz -C ${BUILD_DIR}/btcv
tar -xf gleecs.tar.gz -C ${BUILD_DIR}/gleecs

BTCV_DIR=${BUILD_DIR}/btcv/
BTCV_DIR=${BTCV_DIR}/$(ls ${BTCV_DIR})
echo "${BTCV_DIR}" > ${DIRROOT}/tmp/btcv_dir
