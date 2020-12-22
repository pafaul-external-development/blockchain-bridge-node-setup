const EndPointRequests = require('../requests/endpoint_requests');
const AxiosInstance = require('../requests/request_instance');
const config = require('./test_config');
/**
 * 
 * @param {JSON} config 
 */
function createAxiosInstance(config) {
    let instance = new AxiosInstance(config.url, config.user, config.pw);
    return instance;
}

/**
 * 
 * @param {AxiosInstance} btcvAxios
 * @param {AxiosInstance} gleecsAxios
 */
function createEndPoint(btcvAxios, gleecsAxios) {
    let endPoint = new EndPointRequests(btcvAxios, gleecsAxios);
    return endPoint;
}

function setup() {
    let btcv = createAxiosInstance(config.btcv);
    let gleecs = createAxiosInstance(config.gleecs);
    let endPoint = createEndPoint(btcv, gleecs);
    return endPoint;
}

/**
 * 
 * @param {EndPointRequests} endPoint 
 * @param {JSON} testConfig
 */
async function chainTest(endPoint, currency, testConfig) {
    let user1 = endPoint.createWallet(currency, testConfig.userIds[0], '');
    let user2 = endPoint.createWallet(currency, testConfig.userIds[1], '');
    return JSON.stringify(user1, null, '\t') + '\n' + JSON.stringify(user2, null, '\t');
}

async function main() {
    let endPoint = setup();
    // let btcvRes = await chainTest(endPoint, config.testBTCV);
    let gleecsRes = await chainTest(endPoint, config.gleecs);
    // console.log(JSON.stringify(btcvRes, null, '\t'))
    console.log(JSON.stringify(gleecsRes, null, '\t'))
}

main()