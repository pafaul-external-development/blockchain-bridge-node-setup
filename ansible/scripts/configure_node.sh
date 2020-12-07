#!/bin/bash

echo "nameserver 8.8.8.8" > /etc/resolv.conf

apt install -y software-properties-common
add-apt-repository -y universe
apt update