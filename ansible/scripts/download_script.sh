#!/bin/bash
TIMESTAMP=$(date '+%d-%m-%y')

echo_and_exit() {
    if [ $1 -ne 0 ]
    then
        echo $2
        exit 1
    fi
}

if [ $# -ne 3 ]
then
    echo_and_exit 1 "Invalid argumet count. Exiting."
fi

DOWNLOAD_LINK=${1}
DIR=${2}
ARCHIVE_NAME=${3}

cd ${DIR}
echo_and_exit $? "Directory ${DIR} is not presented. Exiting."

wget ${DOWNLOAD_LINK} -O ${ARCHIVE_NAME}.tar.gz
echo_and_exit $? "Cannot download ${ARCHIVE_NAME}. Exiting."

DOWNLOAD_DIR=${DIR}/${ARCHIVE_NAME}-${TIMESTAMP}
mkdir ${DOWNLOAD_DIR}

tar -xf ${ARCHIVE_NAME}.tar.gz -C ${DOWNLOAD_DIR}
echo_and_exit $? "Cannot unpack ${ARCHIVE_NAME}. Exiting."

echo "${TIMESTAMP}" > ${DIR}/.latest_download
echo "Download successfull."