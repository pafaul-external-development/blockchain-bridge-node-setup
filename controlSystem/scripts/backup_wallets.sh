#!/bin/bash

if [ $# -ne 1 ]
then
    echo "Invalid argument count"
    exit 1
fi

timestamp=$(date '+%d-%m-%y-%H:%M:%S')

DIRECTORY_TO_BACKUP=$1
BACKUP_DIRECTORY=${DIRECTORY_TO_BACKUP%/.*}/bak
DIRECTORY_TO_BACKUP_TO=${BACKUP_DIRECTORY}/bak_${timestamp}

[ ! -d ${BACKUP_DIRECTORY} ] && mkdir ${BACKUP_DIRECTORY}
[ ! -d ${DIRECTORY_TO_BACKUP_TO} ] && mkdir ${DIRECTORY_TO_BACKUP_TO}

backup_count=$(ls ${BACKUP_DIRECTORY} | wc -l)

if [ $backup_count -ge 5 ]
then
    oldest_backup=$(ls -At ${BACKUP_DIRECTORY} | tail -n1)
    oldest_backup=${BACKUP_DIRECTORY}/${oldest_backup}
    rm -rf ${oldest_backup}
fi

cp -r ${DIRECTORY_TO_BACKUP}/* ${DIRECTORY_TO_BACKUP_TO}
exit $?