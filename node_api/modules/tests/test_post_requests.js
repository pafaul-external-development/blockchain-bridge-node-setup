const AxiosInstance = require('../requests/request_instance');
const HighLevelRequests = require('../requests/high_level_requests');
const config = require('../../config');

function createInstance(config) {
    let address = 'http://' + config.address + ':' + config.port;
    let user = config.auth.user;
    let passwd = config.auth.passwd;
    let instance = new AxiosInstance(address, user, passwd);
    return instance;
}

let btcvRequestInstance = createInstance(config.btcv);
let gleecsRequestInstance = createInstance(config.gleecs);

let btcvEndpoint = new HighLevelRequests(btcvRequestInstance);
let gleecsEndpoint = new HighLevelRequests(gleecsRequestInstance);

async function walletCreation(requestInstance, wallet_name) {
    let data = await requestInstance.createWallet(wallet_name);
    console.log(data);
    let balance = await requestInstance.getBalance(wallet_name);
    console.log(balance);
}

async function getHistory(requestInstance, wallet_name) {
    let data = await requestInstance.getHistory(wallet_name);
    console.log(data);
}

async function testWalletCreation() {
    await walletCreation(btcvEndpoint, 'test_wallet');
    await walletCreation(gleecsEndpoint, 'test_wallet');
}

async function testGetHistory() {
    await getHistory(btcvEndpoint, 'test_wallet');
    await getHistory(gleecsEndpoint, 'test_wallet');
}

async function main() {
    await testWalletCreation();
    await testGetHistory();
    process.exit(0);
}

main();

// instance.make_post_request('', 'getnewaddress', []).then(console.log).catch(console.log)
