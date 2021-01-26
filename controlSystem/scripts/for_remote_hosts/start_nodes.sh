#!/bin/bash

. /opt/.config/config

${NODE} -conf=${CONF_FILE}

sleep 30

bash /opt/.scripts/reload_wallets.sh