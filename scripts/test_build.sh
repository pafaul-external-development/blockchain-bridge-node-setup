#!/bin/bash

apt install -y python3-zmq

cd /opt/btcv

make check
res=$?
if [ $res -ne 0 ]
then
    echo "Unit tests failed"
else
    echo "Unit tests passed"
fi

/opt/btcv/test/functional/test_runner.py --extended
res=$?
if [ $res -ne 0 ]
then
    echo "Integration tests failed"
else
    echo "Integration tests passed"
fi