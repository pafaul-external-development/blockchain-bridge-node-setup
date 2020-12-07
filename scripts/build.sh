#!/bin/bash

apt install -y wget

cd /opt/btcv/
./contrib/install_db4.sh $(pwd)

make clean
./autogen.sh
./configure --with-miniupnpc --with-zmq
make
res=$?
if [ $res -ne 0 ]
then
    echo "Build failed."
    exit 1
else
    echo "Build successfull. Proceeding to install"
fi

make install
if [ $res -ne 0 ]
then
    echo "Install failed."
    exit 1
else
    echo "Install successfull. Proceeding to tests"
fi