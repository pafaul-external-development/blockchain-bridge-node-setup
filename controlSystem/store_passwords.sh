#!/bin/bash

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
    echo "Bash script to encrypt file with passwords and users"
    echo
    echo "Arguments:"
    echo "  -p, --pass-file      File with vault password"
    echo "                       If specified, requires tag before filename."
    echo "                       Example: tag_name@/opt/passwd/file"
    echo "  -f, --vars-file      File to encrypt"
}

if [ $# -lt 2 ]
then
    echo "Invalid argument count"
    display_help
    exit 1
fi

parse_input_parameters() {
    while [ 1 -eq 1 ]
    do
        if [ $# -eq 0 ]
        then
            break
        fi

        case $1 in
            -p | --pass-file )
                PASSWORD_FILE=$2
                shift 2
                ;;
            -f | --vars-file)
                HOST_VARS_FILE=$2
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
        esac
    done
}

check_values() {
    [ ! -f ${HOST_VARS_FILE} ] && echo_and_exit 1 "File to encrypt \"${HOST_VARS_FILE}\" not found. Exiting."
    if [ ! -z ${PASSWORD_FILE} ]
    then
        file_name=${PASSWORD_FILE#*@}
        [ ! -f ${file_name} ] && echo_and_exit 1 "Password file \"${file_name}\"not found. Exiting."
    fi
}

parse_input_parameters $@
check_values

echo "Make sure you configured file hosts_vars"
INPUT=1
while [ $INPUT -ne 0 ]
do
    read -r -p "Continue? [yes/no]" response

    case $response in 
        yes)
            echo "Proceeding to encrypt file"
            INPUT=0
            ;;
        no)
            echo "Exiting."
            exit 0
            ;;
        *)
            echo "Please input 'yes' or 'no'"
            ;;
    esac
done

if [ ! -z ${PASSWORD_FILE} ]
then
    ansible-vault encrypt --vault-id ${PASSWORD_FILE} ${HOST_VARS_FILE}
else
    ansible-vault encrypt ${HOST_VARS_FILE}
fi

echo_and_exit $? "Errors occured during file encryption. Exiting." "File encryption finished."