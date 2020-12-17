const AxiosInstance = require('./request_instance');
const EndPointRequests = require('./endpoint_requests');
const config = require('../config');

function create_instance(config) {
    let address = 'http://' + config.address + ':' + config.port;
    let user = config.auth.user;
    let passwd = config.auth.passwd;
    let instance = new AxiosInstance(address, user, passwd);
    return instance;
}

let btcv_request_instance = create_instance(config.btcv);
let gleecs_request_instance = create_instance(config.gleecs);

let btcv_endpoint = new EndPointRequests(btcv_request_instance);
let gleecs_endpoint = new EndPointRequests(gleecs_request_instance);

async function test_wallet_creation(request_instance, wallet_name) {
    let data = await request_instance.createWallet(wallet_name);
    console.log(data);
    let balance = await request_instance.getBalance(wallet_name);
    console.log(balance);
}

async function main() {
    await test_wallet_creation(btcv_endpoint);
    await test_wallet_creation(gleecs_endpoint);
    process.exit(0)
}

main();

// instance.make_post_request('', 'getnewaddress', []).then(console.log).catch(console.log)
