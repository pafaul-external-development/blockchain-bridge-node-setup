#!/bin/bash

apt update

apt install -y software-properties-common
add-apt-repository -y universe
add-apt-repository -y ppa:bitcoin/bitcoin
apt update
apt-get install -y libdb4.8-dev libdb4.8++-dev