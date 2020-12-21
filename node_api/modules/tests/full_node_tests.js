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
    return instance;
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
    console.log('Wallet creation test');
    let res = [];
    for (let i = 0; i < 2; i++) {
        res.push(await endPoint.createWallet(currency, testConfig.userIds[i], ""));
    }

    let rc = testSuccess(res, 'Wallet creation test passed', 'Wallet creation test failed', true);
    if (!rc) return;

    console.log('Get info about wallets test');
    res = [];
    for (let i = 0; i < 2; i++) {
        let walletsForCurrency = await endPoint.getUserWallets(testConfig.userIds[i], "");
        let wallet = null;
        for (wallet in walletsForCurrency) {
            if (wallet[0] == currency)
            break;
        }
        res.push(wallet);
    }

    rc = testSuccess(res, 'Get info about wallet test passed', 'Get info about wallet test failed');
    if (!rc) return;

    console.log('Fee calcultaion test')
    let fee = await endPoint.getTxComission(currency, '', '', '');
    if (fee)
        console.log('calculated fee: ', fee);
    else
        console.log('Fee calculation test failed.');

    console.log('Transfer test');
    // TODO ДАНЯ ЗАЕБАЛ КОГДА БД
    for (let i = 0; i < 2; i++) {
        let walletsForCurrency = await endPoint.getUserWallets(testConfig.userIds[i], "");
        let wallet = null;
        for (wallet in walletsForCurrency) {
            if (wallet[0] == currency)
            break;
        }
        let resOfOperation = await endPoint.createTx(currency, testCOnfig.mainWallet, wallet[2], 0.001, '');
        res.push(resOfOperation);
    }

    testSuccess(res, 'Transfer test passed', 'Transfer test failed');

}

async function main() {
    let endPoint = setup();
    let btcvRes = await chainTest(endPoint, config.testBTCV);
    let gleecsRes = await chainTest(endPoint, config.testGleecs);
    console.log(JSON.stringify(btcvRes, null, '\t'))
    console.log(JSON.stringify(gleecsRes, null, '\t'))
}

main()
