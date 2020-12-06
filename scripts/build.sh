#!/bin/bash

cd /opt/btcv/
bash autogen.sh
bash configure
make -j8