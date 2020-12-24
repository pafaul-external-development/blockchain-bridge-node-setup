const EndPointRequests = require('../requests/endpoint_requests');
const AxiosInstance = require('../requests/request_instance');
const Database = require('../database/database');
const fs = require('fs');

function createAxiosInstance(config) {
    let url = 'http://' + config.address + ':' + config.port;
    let instance = new AxiosInstance(url, config.auth.user, config.auth.passwd);
    return instance;
}

function getConfig(filename) {
    try {
        let data = JSON(fs.readFileSync(filename));
        return data;
    } catch (err) {
        throw new Error('Cannot read configuration file');
    }
}

/**
 * Initialize endpoint requests
 * @param {String} nodesConfig path to configuration file
 * @param {String} databaseConfig path to database config file
 */
function nodesInitialization(nodesConfig, databaseConfig) {
    let config = getConfig(nodesConfig);
    let database = new Database();
    let btcvAxiosInstance = createAxiosInstance(config.BTCV);
    let gleecsAxiosInstance = createAxiosInstance(config.GLEEC);
    let endPointInstance = new EndPointRequests(btcvAxiosInstance, gleecsAxiosInstance, database);
    return endPointInstance;
}

module.exports = nodesInitialization;