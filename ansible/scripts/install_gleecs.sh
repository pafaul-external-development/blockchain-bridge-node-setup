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

GLEECS_DIR=$1
cd ${GLEECS_DIR}
echo_and_exit $? "Directory ${GLEECS_DIR} is not presented. Exiting."

TIMESTAMP=$(cat ${GLEECS_DIR}/.latest_download)
echo_and_exit $? "Timestamp not found. Exiting."
GLEECS_DIR_LATEST=${GLEECS_DIR}/gleecs-${TIMESTAMP}/

cd ${GLEECS_DIR_LATEST}
echo_and_exit $? "Directory with latest build not found. Exiting."

cp * /usr/bin/