#!/bin/bash

echo "nameserver 8.8.8.8" > /etc/resolv.conf
apt update

apt install -y software-properties-common
add-apt-repository -y universe
sudo add-apt-repository -y ppa:bitcoin/bitcoin
apt update
sudo apt-get install -y libdb4.8-dev libdb4.8++-dev