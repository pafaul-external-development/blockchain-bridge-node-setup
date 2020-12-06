#!/bin/bash

rm /etc/resolv.conf
echo "nameserver 8.8.8.8" > /etc/resolv.conf

apt install -y software-properties-common
add-apt-repository -y universe
add-apt-repository -y ppa:bitcoin/bitcoin
apt update

deps=$(cat /opt/scripts/deps)
apt install -y ${deps}