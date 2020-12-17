const AxiosInstance = require('./request_instance');
const EndPointRequests = require('./endpoint_requests');
const config = require('../config');

let address = 'http://' + config.btcv.address + ':' + config.btcv.port;
let user = config.btcv.auth.user;
let passwd = config.btcv.auth.passwd;
let instance = new AxiosInstance(address, user, passwd);

let requests = new EndPointRequests(instance);

async function main() {
    let data = await requests.createWallet('1234');
    console.log(data);
    let balance = await requests.getBalance('1234');
    console.log(balance);
}

main();

// instance.make_post_request('', 'getnewaddress', []).then(console.log).catch(console.log)


