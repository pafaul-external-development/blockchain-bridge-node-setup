#!/bin/bash

REQUIRED_DEPS="lxc lxc-templates bridge-utils debootsrap"

apt update
apt install -y ${REQUIRED_DEPS}
