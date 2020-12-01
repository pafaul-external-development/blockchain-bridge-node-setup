#!/bin/bash
DIRROOT=$(cd $(dirname $0) && pwd)

ARG_COUNT=0

if [ $UID -ne 0 ]
then
    echo "Must be root to run this sctipt"
    exit 1
fi

if [ $# -lt $ARG_COUNT ]
then
    echo "Invalid argument count"
    help
    exit 1
fi

display_description() {
    echo "This script creates build chroot template for building BitcoinVault chain"
    echo 
    echo "Script must be runned as root"
}

display_help() {
    echo "Usage: $0 [option...] " >&2
    echo 
    echo "    -d, --target-dir                directory where template build system will be created"
    echo "    -a, --additional-packages       specifies what additional packs of packages will be installed"
}

parse_input_parameters() {
    while [ 1 -eq 1 ]
    do
        if [ $# -eq 0 ]
        then
            break
        fi

        case $1 in
            -h | --help)
                display_help
                exit 0
                ;;

            -d | --target-dir)
                TARGET_DIRECTORY=$2
                shift 2
                ;;
            -a | --additional-packages)
                ADDITIONAL_PACKS=$2
                shift 2
                ;;
            -r | --release)
                RELEASE=$2
                shift 2
                ;;
            *)
                echo "Unknown parameter"
                display_help
                exit 1
        esac
    done
}

parse_input_parameters $@

DEPS_DIR="${DIRROOT}/files/deb/"
PACKAGES_TO_INSTALL=$(cat ${DEPS_DIR}/deps)
[ -z $ADDITIONAL_PACKS ] && ADDITIONAL_PACKS="min"
case ${ADDITIONAL_PACKS} in
    qt)
        PACKAGES_TO_INSTALL="${PACKAGES_TO_INSTALL},$(cat ${DEPS_DIR}/qt_deps)"
        ;;
    zmq)
        PACKAGES_TO_INSTALL="${PACKAGES_TO_INSTALL},$(cat ${DEPS_DIR}/zmq_deps)"
        ;;
    upnp)
        PACKAGES_TO_INSTALL="${PACKAGES_TO_INSTALL},$(cat ${DEPS_DIR}/upnp_deps)"
        ;;
    full)
        PACKAGES_TO_INSTALL="${PACKAGES_TO_INSTALL},$(cat ${DEPS_DIR}/qt_deps),$(cat ${DEPS_DIR}/zmq_deps),$(cat ${DEPS_DIR}/upnp_deps)"
        ;;
    min) ;;
    *)
        echo "Unknown additional packages packs"
        display_help
        exit 1
        ;;
esac

DEBOOTSTRAP_PARAMS="--include=${PACKAGES_TO_INSTALL}"
DEBOOTSTRAP_PARAMS="${DEBOOTSTRAP_PARAMS} --components=main,contrib,non-free"
DEBOOTSTRAP_PARAMS="${DEBOOTSTRAP_PARAMS} buster ${TARGET_DIRECTORY}"
echo "${DEBOOTSTRAP_PARAMS}"
exit 0

debootstrap ${DEBOOTSTRAP_PARAMS}
result=$?
if [ $result -eq 0 ]
then
    echo "Chroot building dir created successfully"
    exit 0
else   
    echo "Problems creating chroot directory"
    exit 1
fi
