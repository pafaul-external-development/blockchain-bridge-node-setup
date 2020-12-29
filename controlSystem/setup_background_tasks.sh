#!/bin/bash

DIRROOT=$(cd $(dirname $0) && pwd)
CRON_FILE=/etc/cron.d/backup_wallets_bd

echo_and_exit() {
    if [ $1 -ne 0 ]
    then
        echo $2
        exit 1
    else
        echo $3
    fi
}

display_help() {
    echo "Bash script to backup database and check if nodes are up"
    echo
    echo "Possible arguments:"
    echo "  -db, --database      Database filename"
    echo "  -u, --user           User which will do backups"
    echo "  -gi, --gleec-ip      Gleec node ip address"
    echo "  -gp, --gleec-port    Gleec node ssh port"
    echo "  -bi, --btcv-ip       Btcv node ip address"
    echo "  -bp, --btcv-port     Btcv node ssh port"
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
            -db | --database)
                DATABASE_FILE=${2}
                shift 2
            ;;

            -u | --user)
                BACKUP_USER=$2
                shift 2
            ;;

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

check_values() {
    [ -z ${DATABASE_FILE} ] && echo_and_exit 1 "Database file not set"
    [ -z ${BACKUP_USER} ] && echo_and_exit 1 "Backup user not set"
}

setup_backup() {
cat > ${CRON_FILE} <<EOF
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0   0 * * * ${BACKUP_USER} cd ${DIRROOT} && /bin/bash ${DIRROOT}/backup_database.sh -db ${DATABASE_FILE}
0   0 * * * ${BACKUP_USER} cd ${DIRROOT} && /bin/bash ${DIRROOT}/backup_wallets.sh
*/5 * * * * ${BACKUP_USER} cd ${DIRROOT} && /bin/bash ${DIRROOT}/check_if_up.sh -gi ${GLEECS_NODE_IP} -gp ${GLEECS_PORT} -bi ${BTCV_NODE_IP} -bp ${BTCV_PORT}

EOF
}

parse_input_parameters $@
if [ ${UID} -ne 0 ]
then
    echo_and_exit 1 "You must be root to run this script"
fi
check_values
setup_backup