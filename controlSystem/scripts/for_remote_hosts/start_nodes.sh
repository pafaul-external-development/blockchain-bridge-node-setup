#!/bin/bash

. /opt/.config/config

${NODE} -conf=${CONFIG_FILE} -rescan -reindex &

sleep 30

bash /opt/.scripts/reload_wallets.sh