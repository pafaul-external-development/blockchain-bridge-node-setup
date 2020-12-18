const AxiosInstance = require('./requestInstance');
const EndPointRequests = require('./endpoint_requests');
const config = require('../config');

function createInstance(config) {
    let address = 'http://' + config.address + ':' + config.port;
    let user = config.auth.user;
    let passwd = config.auth.passwd;
    let instance = new AxiosInstance(address, user, passwd);
    return instance;
}

let btcvRequestInstance = createInstance(config.btcv);
let gleecsRequestInstance = createInstance(config.gleecs);

let btcvEndpoint = new EndPointRequests(btcvRequestInstance);
let gleecsEndpoint = new EndPointRequests(gleecsRequestInstance);

async function walletCreation(requestInstance, wallet_name) {
    let data = await requestInstance.createWallet(wallet_name);
    console.log(data);
    let balance = await requestInstance.getBalance(wallet_name);
    console.log(balance);
}

async function get_history(requestInstance, wallet_name) {
    let data = await requestInstance.getHistory(wallet_name);
    console.log(data);
}

async function test_walletCreation() {
    await walletCreation(btcvEndpoint, 'test_wallet');
    await walletCreation(gleecsEndpoint, 'test_wallet');
}

async function test_get_history() {
    await get_history(btcvEndpoint, 'test_wallet');
    await get_history(gleecsEndpoint, 'test_wallet');
}

async function main() {
    await test_walletCreation();
    await test_get_history();
    process.exit(0);
}

main();

// instance.make_post_request('', 'getnewaddress', []).then(console.log).catch(console.log)
