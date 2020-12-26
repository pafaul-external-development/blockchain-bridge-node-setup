#!/bin/bash

DATABASE_FILE=

display_help() {
    echo "Bash script to backup database"
    echo
    echo "Possible arguments:"
    echo "  -db, --database      Database filename"
    echo "  -bd, --backup-dir    Backup directory"
    echo "Time setup:"
    echo "  -h, --hours          Hours"
    echo "  -m, --minutes        Minutes"
    echo "  -s, --seconds        Seconds"
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
            -db | --database)
                DATABASE_FILE=$2
                BACKUP_DIR=${DATABASE_FILE%/*.sqlite}/bak/
                shift 2
            ;;

            -h | --hours)
                HOURS=$2
                shift 2
            ;;
            
            -m | --minutes)
                MINUTES=$2
                shift 2
            ;;
            
            -s | --seconds)
                SECONDS=$2
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
    [ ! -d ${BACKUP_DIR} ] && mkdir -p ${BACKUP_DIR}
    [ -z ${HOURS} ] && [ -z ${MINUTES} ] && [ -z ${SECONDS} ] && echo "No timer setup specified" && exit 1
    TIME_TO_SLEEP=$((HOURS*3600 + MINUTES*60 + SECONDS))
}

loop() {
    timestamp=$(date '+%d-%m-%y-%H:%m:%S')
    backup_file=${BACKUP_DIR}/bd_${timestamp}.sqlite
    cp ${DATABASE_FILE} ${backup_file}
}

while [ -f $(DIRROOT)/.backup_db ]
do
    loop
    sleep ${TIME_TO_SLEEP}
done
