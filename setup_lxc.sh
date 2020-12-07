#!/bin/bash

REQUIRED_DEPS="lxc lxc-templates bridge-utils debootstrap"

apt update
apt install -y ${REQUIRED_DEPS}
