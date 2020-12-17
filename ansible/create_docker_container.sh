#!/bin/bash

DIRROOT=$(cd $(dirname $0) && pwd)

if [ $UID -ne 0 ]
then
    echo "This script must be runned as root"
    exit 1
fi

if [ $# -ne 1 ]
then
    echo "Expecting one argument: directory with Dockerfile"
    exit 1
fi

cd $1
docker build -t template:1.0 .

mkdir -p $DIRROOT/tmp

docker run -t -d -P --cpus=4 --name btcv_container template:1.0 > $DIRROOT/tmp/btcv_container_id
docker run -t -d -P --cpus=4 --name gleecs_container template:1.0 > $DIRROOT/tmp/gleecs_container_id