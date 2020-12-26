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
    echo "  -p, --passwd-file    File with password for vault."
    echo "                       Format: tag@filename"
    echo "  --no-encryption      Disables encryption options"
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
    [ -z $NO_ENCRYPTION ] && NO_ENCRYPTION=1
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

run_nodes() {
    CD=${DIRROOT}/conf
    ansible-playbook -i ${DIRROOT}/hosts ${DIRROOT}/ansible/run_nodes.yaml \
        --extra-vars \
        "btcv_conf_file_local=${CD}/btcv.conf btcv_conf_file_dest=/opt/btcv/btcv.conf gleecs_conf_file_local=${CD}/gleecs.conf gleecs_conf_file_dest=/opt/gleecs/gleecs.conf script_dir=${DIRROOT}/scripts" \
        ${ADDITIONAL_OPTIONS}
    echo_and_exit $? "Cannot start BTCV or Gleecs nodes"
}

parse_input_parameters $@
check_values
get_pass_options

run_nodes