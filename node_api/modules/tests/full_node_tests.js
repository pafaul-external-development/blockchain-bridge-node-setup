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
 * @param {Array} res 
 * @param {String} yes 
 * @param {String} no 
 * @param {Boolean} exit
 */
function testSuccess(res, yes, no, exit=false) {
    if (res[0] && res[1]) {
        console.log(yes);
        return true;
    } else {
        console.log(no);
        return false;
    }
}

/**
 * 
 * @param {EndPointRequests} endPoint 
 * @param {JSON} testConfig
 */
async function chainTest(endPoint, currency, testConfig) {
}

async function main() {
    let endPoint = setup();
    let btcvRes = await chainTest(endPoint, config.testBTCV);
    let gleecsRes = await chainTest(endPoint, config.testGleecs);
    console.log(JSON.stringify(btcvRes, null, '\t'))
    console.log(JSON.stringify(gleecsRes, null, '\t'))
}

main()
