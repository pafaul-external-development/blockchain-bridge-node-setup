#!/bin/bash

DEPS="locales locales-all build-essential libtool autotools-dev automake pkg-config bsdmainutils python3"
DEPS="${DEPS} libssl-dev libevent-dev libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-test-dev libboost-thread-dev"
DEPS="${DEPS} libminiupnpc-dev"
DEPS="${DEPS} libzmq3-dev"
DEPS="${DEPS} libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler"
DEPS="${DEPS} libqrencode-dev"

rm /etc/resolv.conf
echo "nameserver 8.8.8.8" > /etc/resolv.conf

apt install -y software-properties-common
add-apt-repository -y universe
add-apt-repository -y ppa:bitcoin/bitcoin
apt update

apt install -y ${DEPS}

cat << EOF > /etc/locale.conf 
LC_ALL=en_US.utf8
LC_CTYPE=en_US.utf8
LANG=en_US.utf8
EOF

dpkg-reconfigure locales