const EndPointRequests = require('../requests/endpoint_requests');
const AxiosInstance = require('../requests/request_instance');
const Database = require('../database/database');
const nodesConfig = require('../config/blockchain_config');
const databaseConfig = require('../config/database_config');
const fs = require('fs');

function createAxiosInstance(config) {
    let url = 'http://' + config.address + ':' + config.port;
    let instance = new AxiosInstance(url, config.auth.user, config.auth.passwd);
    return instance;
}

// function getConfig(filename) {
//     try {
//         let data = JSON(fs.readFileSync(filename));
//         return data;
//     } catch (err) {
//         throw new Error('Cannot read configuration file');
//     }
// }

/**
 * Initialize endpoint requests
 */
function nodesInitialization() {
    let database = new Database();
    let btcvAxiosInstance = createAxiosInstance(nodesConfig.BTCV);
    let gleecsAxiosInstance = createAxiosInstance(nodesConfig.GLEEC);
    let endPointInstance = new EndPointRequests(btcvAxiosInstance, gleecsAxiosInstance, database);
    return endPointInstance;
}

module.exports = nodesInitialization;