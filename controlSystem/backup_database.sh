#!/bin/bash

DATABASE_FILE=

display_help() {
    echo "Bash script to backup database"
    echo
    echo "Possible arguments:"
    echo "  -db, --database      Database filename"
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
}

main() {
    timestamp=$(date '+%d-%m-%y-%H:%m:%S')
    backup_file=${BACKUP_DIR}/bd_${timestamp}.sqlite
    cp ${DATABASE_FILE} ${backup_file}
}

parse_input_parameters
check_values
main
