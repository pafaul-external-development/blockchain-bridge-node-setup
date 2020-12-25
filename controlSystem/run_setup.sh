#!/bin/bash

DIRROOT=$(cd $(dirname $0) && pwd)

echo_and_exit() {
    if [ $1 -ne 0 ]
    then
        echo $2
        exit 1
    fi
}

. ${DIRROOT}/download_links
echo_and_exit $? "Cannot find file with download links. Exiting"

if [ $# -gt 5 ]
then
    echo_and_exit 1 "Invalid argument count"
fi

display_help() {
    echo "Bash script to configure host and install gleecs and BTCV on nodes"
    echo
    echo "Possible arguments:"
    echo "  -b, --btcv           Run btcv installation"
    echo "  -g, --gleecs         Run gleecs installation"
    echo "  -p, --passwd-file    File with password for vault."
    echo "                       Format: tag@filename"
    echo "  --no-encryption      Disables encryption options"
    echo "  --host               Run host setup"
    echo "  -h, --help           Show this message and exit"
    echo "If no arguments specified, silently exits."
}

parse_input_parameters() {
    while [ 1 -eq 1 ]
    do
        if [ $# -eq 0 ]
        then
            break
        fi

        case $1 in
            --host)
                HOST=0
                shift
                ;;
            -b | --btcv)
                BTCV=0
                shift
                ;;

            -g | --gleecs)
                GLEECS=0
                shift
                ;;
            
            -p | --passwd-file)
                PASSWORD_FILE=$2
                shift 2
                ;;

            -h | --help)
                display_help
                exit 0
                ;;

            --no-encryption)
                NO_ENCRYPTION=0
                shift
                ;;
            
            *)
                echo "Unknown parameter"
                display_help
                exit 1
                ;;
        esac
    done
}

check_values() {
    [ -z $HOST ] && HOST=1
    [ -z $BTCV ] && BTCV=1
    [ -z $GLEECS ] && GLEECS=1
    [ -z $NO_ENCRYPTION ] && NO_ENCRYPTION=1
    [ -z ${BTCV_DIR} ] && BTCV_DIR=/opt/btcv
    [ -z ${GLEECS_DIR} ] && GLEECS_DIR=/opt/gleecs
    [ -z ${BTCV_LINK} ] && [ $BTCV -eq 0 ] && echo_and_exit 1 "Link for BTCV download is absent. Exiting."
    [ -z ${GLEECS_LINK} ] && [ $GLEECS -eq 0 ] && echo_and_exit 1 "Link for GLEECS download is absent. Exiting."
    if [ ! -z ${PASSWORD_FILE} ]
    then
        file_name=${PASSWORD_FILE#*@}
        [ ! -f ${file_name} ] && echo_and_exit 1 "Password file \"${file_name}\"not found. Exiting."
    fi
}

get_pass_options() {
    [ $NO_ENCRYPTION -eq 0 ] && ADDITIONAL_OPTIONS="" && return
    if [ -z ${PASSWORD_FILE} ]
    then
        ADDITIONAL_OPTIONS="--ask-vault-pass"
    else
        ADDITIONAL_OPTIONS="--vault-id=${PASSWORD_FILE}"
    fi
}

run_btcv() {
    ansible-playbook -i ${DIRROOT}/hosts2 ${DIRROOT}/setup_btcv_node.yaml \
        --extra-vars \
        "script_dir=${DIRROOT}/scripts btcv_link=${BTCV_LINK} btcv_dir=${BTCV_DIR}" \
        ${ADDITIONAL_OPTIONS}
    echo_and_exit $? "Cannot setup btcv node"
    echo "BTCV node setup successfull"
}

run_gleecs() {
    ansible-playbook -i ${DIRROOT}/hosts2 ${DIRROOT}/setup_gleecs_node.yaml \
        --extra-vars \
        "script_dir=${DIRROOT}/scripts gleecs_link=${GLEECS_LINK} gleecs_dir=${GLEECS_DIR}" \
        ${ADDITIONAL_OPTIONS}
    echo_and_exit $? "Cannot setup gleecs node"
    echo "GLEECS node setup successfull"
}

run_host() {
    ansible-playbook -i ${DIRROOT}/hosts2 ${DIRROOT}/setup_host.yaml \
        ${ADDITIONAL_OPTIONS}
    echo_and_exit $? "Host configuration failed"
    echo "Host configuration successfull"
}

parse_input_parameters $@
check_values
get_pass_options

if [ $HOST -eq 0 ]
then
    run_host
fi

if [ $BTCV -eq 0 ]
then
    run_btcv
fi

if [ $GLEECS -eq 0 ]
then
    run_gleecs
fi