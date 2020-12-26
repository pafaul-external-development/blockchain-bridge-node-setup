#!/bin/bash

if [ $# -ne 1 ]
then
    echo "Invalid argument count"
    exit 1
fi

timestamp=$(date '+%d-%m-%y-%H:%m:%S')

DIRECTORY_TO_BACKUP=$1
DIRECTORY_TO_BACKUP_TO=${DIRECTORY_TO_BACKUP%/*}/bak/bak_${timestamp}

[ ! -d ${DIRECTORY_TO_BACKUP_TO} ] && mkdir ${DIRECTORY_TO_BACKUP_TO}

cp -r ${DIRECTORY_TO_BACKUP}/* ${DIRECTORY_TO_BACKUP_TO}
exit $?