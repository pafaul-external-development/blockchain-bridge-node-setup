#!/bin/bash

DIRROOT=$(cd $(dirname $0) && pwd)

display_help() {
    echo "Bash script to backup database"
    echo
    echo "Possible arguments:"
    echo "  -gi, --gleec-ip       Gleec node ip address"
    echo "  -gp, --gleec-port     Gleec node ssh port"
    echo "  -bi, --btcv-ip        Btcv node ip address"
    echo "  -bp, --btcv-port      Btcv node ssh port"
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
            -gi | --gleec-ip)
                GLEECS_NODE_IP=${2}
                shift 2
            ;;

            -gp | --gleec-port)
                GLEECS_PORT=${2}
                shift 2
            ;;

            -bi | --btcv-ip)
                BTCV_NODE_IP=${2}
                shift 2
            ;;

            -bp | --btcv-port)
                BTCV_PORT=${2}
                shift 2
            ;;

            -h | --help)
                display_help
                exit 0
            ;;
            
            *)
                echo "Unknown parameter"
                display_help
                exit 1
                ;;
        esac
    done
}

loop() {
    ping -c 4 -p ${BTCV_PORT} ${BTCV_NODE_IP}
    btcv_status=$?
    ping -c 4 -p ${GLEECS_PORT} ${GLEECS_NODE_IP}
    gleecs_status=$?
}

parse_input_parameters $@

loop

status_string="[$(date '+%d-%m-%y-%H:%M:%S')]:"
[ $btcv_status ] && status_string="${status_string} btcv->ok" || status_string="${status_string} btcv->fail"
[ $gleecs_status ] && status_string="${status_string} gleecs->ok" || status_string="${status_string} gleecs->fail"
echo "${status_string}" >> ${DIRROOT}/.nodes_status
