#!/bin/bash

if [ $# -ne 1 ]
then
    echo "Invlid argument count. Exiting."
    echo "Script takes only one argument: full configuration filename"
fi

gleecbtcd -conf=$1 -daemon