const AxiosInstance = require('./request_instance');
const config = require('../config');
let address = 'http://' + config.btcv.address + ':' + config.btcv.port;
let user = config.btcv.auth.user;
let passwd = config.btcv.auth.passwd;
let instance = new AxiosInstance(address, user, passwd);

instance.make_post_request('', 'getnewaddress', []).then(console.log).catch(console.log)