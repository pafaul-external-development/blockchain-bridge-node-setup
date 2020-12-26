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

if [ ${UID} -ne 0 ]
then
    echo_and_exit 1 "You must be root to run this script"
fi

setup_backup() {
cat > ${CRON_FILE} <<EOF
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0 0 * * * ${BACKUP_USER} cd ${DIRROOT} && /bin/bash ${DIRROOT}/backup_database.sh -db ${DATABASE_FILE}
0 0 * * * ${BACKUP_USER} cd ${DIRROOT} && /bin/bash ${DIRROOT}/backup_wallets.sh
EOF
}

setup_backup