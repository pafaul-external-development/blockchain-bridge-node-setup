let config = {};

config.BTCV = {};
config.BTCV.confirmation_blocks = 6;
config.BTCV.address = '0.0.0.0';
config.BTCV.port = 32807;
config.BTCV.auth = {};
config.BTCV.auth.user = 'user';
config.BTCV.auth.passwd = 'pw';
config.BTCV.watchWallet = 'watchWallet';

config.GLEEC = {};
config.GLEEC.confirmation_blocks = 6;
config.GLEEC.address = '0.0.0.0';
config.GLEEC.port = 32812;
config.GLEEC.auth = {};
config.GLEEC.auth.user = 'user';
config.GLEEC.auth.passwd = 'pw';
config.GLEEC.watchWallet = 'watchWallet';

module.exports = config;