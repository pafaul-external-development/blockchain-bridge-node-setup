const EndPointRequests = require('../requests/endpoint_requests');
const AxiosInstance = require('../requests/request_instance');
const Database = require('../database/database');
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
async function createEndPoint(btcvAxios, gleecsAxios) {
    let db = new Database();
    let endPoint = new EndPointRequests(btcvAxios, gleecsAxios, db);
    return endPoint;
}

async function setup() {
    let btcv = createAxiosInstance(config.btcv);
    let gleecs = createAxiosInstance(config.gleecs);
    let endPoint = await createEndPoint(btcv, gleecs);
    return endPoint;
}

/**
 * 
 * @param {EndPointRequests} endPoint 
 * @param {JSON} testConfig
 */
async function chainTest(endPoint, currency, testConfig) {
    let user1 = await endPoint.getUserHistory(currency, testConfig.userIds[0], 'GaYfn2tHb1RE6VYGd4dpjWko97gMFPTg1A', '0.005');
    //let user2 = await endPoint.getUserHistory(testConfig.userIds[1]);
    return JSON.stringify(user1, null, '\t'); //+ '\n' + JSON.stringify(user2, null, '\t');
}

async function main() {
    let endPoint = await setup();
    // let btcvRes = await chainTest(endPoint, config.testBTCV);
    let gleecsRes = await chainTest(endPoint, 'GLEECS', config.gleecs);
    // console.log(JSON.stringify(btcvRes, null, '\t'))
    console.log(JSON.stringify(gleecsRes, null, '\t'))
}

main()