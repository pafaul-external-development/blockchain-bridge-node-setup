#!/bin/bash
DIRROOT=$(cd $(dirname $0) && pwd)

VAULT_LINK="https://github.com/bitcoinvault/bitcoinvault/archive/v2.0.1.tar.gz"
GLEECS_LINK="https://github.com/Gleecs/GleecBTC-FullNode-Win-Mac-Linux/releases/download/v0.20.2/v20.0.2.tar.gz"

current_timestamp=$(date '+%d-%m-%y-%H:%M:%S')
echo "${current_timestamp}" >> ${DIRROOT}/timestamp

DIRS_TO_CREATE="sources builded build"
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

# if [ -d ${DIRROOT}/build ]
# then
#     echo "Do you want to owerwrite existing directories for build? [y/n]"
#     read consent
#     if [[ ${consent} =~ 'y' ]]
#     then
#         echo "Overriting existing build directories"
#         rm -rf ${DIRROOT}/build/*
#     else
#         echo "Overwrite declined."
#         echo "Exiting"
#         exit 0
#     fi
# else
#     mkdir ${DIRROOT}/build
# fi


mkdir ${SRC_DIR}/sources-${current_timestamp}
cd ${SRC_DIR}/sources-${current_timestamp}
exe_or_exit wget ${VAULT_LINK} -O btcv.tar.gz
exe_or_exit wget ${GLEECS_LINK} -O gleecs.tar.gz

mkdir ${BUILDED_DIR}/build-${current_timestamp}/{btcv,gleecs}
mkdir ${BUILD_DIR}/build-${current_timestamp}/{btcv,gleecs}