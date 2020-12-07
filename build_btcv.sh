#!/bin/bash

DIRROOT=$(cd $(dirname $0) && pwd)

CHROOT_ORIG=${DIRROOT}/chroots/build_chroot_template
BUILD_DIR=${DIRROOT}/chroots/build

if [ $UID -ne 0 ]
then
    echo "Must be root to run this script"
    echo "Exiting"
    exit 1
fi

if [ ! -d ${CHROOT_ORIG} ]
then
    echo "Chroot template not found."
    echo "Exiting."
    exit 1
fi

timestamp=$(cat ${DIRROOT}/tmp/timestamp)
BTCV_DIR=$(cat ${DIRROOT}/tmp/btcv_dir)

echo "Restoring build container default state"

cp -r ${CHROOT_ORIG} ${BUILD_DIR}
systemd-nspawn -D ${BUILD_DIR} \
    --bind="${BTCV_DIR}":/opt/btcv \
    /bin/bash /opt/scripts/build.sh

res=$?

if [ $res -eq 0 ]
then
    echo "build successful"
else
    echo "Errors during build of btcv"
    exit 1
fi

systemd-nspawn -D ${BUILD_DIR} \
    --bind="${BTCV_DIR}":/opt/btcv \
    --bind="${DIRROOT}/scripts":/opt/scripts \
    /bin/bash /opt/scripts/test_build.sh

if [ $res -eq 0 ]
then
    echo "Tests passed"
else
    echo "Tests failed"
    exit 1
fi

systemd-nspawn -D ${BUILD_DIR} \
    --bind="/home/pavel/build/build/build-01-12-20/btcv//bitcoinvault-2.0.1":/opt/btcv \
    /bin/bash /opt/scripts/build.sh