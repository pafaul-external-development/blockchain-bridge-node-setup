#!/bin/bash

required_packages="debootstrap systemd-container"

echo "Checking if required packages are installed"
for package in ${required_packages}
do
    echo "Checking package ${package}"
    dpkg -s ${package} &> /dev/null
    result=$?
    if [ $result -ne 0 ]
    then
        apt install -y ${package}
    else
        echo "Package ${package} already installed"
    fi
done