#!/bin/bash

DIRROOT=$(cd $(dirname $0) && pwd)

. ${DIRROOT}/backup_config

check_values() {
    [ -z ${BTCV_WALLET_DIR} ] && echo "Btcv wallet dir not set" && exit 1
    [ -z ${GLEECS_WALLET_DIR} ] && echo "Gleecs wallet dir not set" && exit 1
}

run_backup() {
    ansible-playbook -i ${DIRROOT}/hosts ${DIRROOT}/ansible/backup_wallets.yaml \
        --extra-vars \
        "btcv_wallet_dir=${BTCV_WALLET_DIR} gleecs_wallet_dir=${GLEECS_WALLET_DIR} script_dir=${DIRROOT}/scripts"
    timestamp=$(date '+%d-%m-%y-%H:%m:%S')
    echo_and_exit $? "[${timestamp}]: cannot backup gleecs or btcv wallets" "[${timestamp}]: backup successful"
}

check_values
run_backup &> ${DIRROOT}/.backup_log
