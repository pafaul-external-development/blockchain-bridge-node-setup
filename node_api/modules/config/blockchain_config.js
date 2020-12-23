let config = {};

config.BTCV = {};
config.BTCV.confirmation_blocks = 6;
config.BTCV.address = '0.0.0.0';
config.BTCV.port = 32807;
config.BTCV.auth = {};
config.BTCV.auth.user = 'user';
config.BTCV.auth.passwd = 'pw';
config.BTCV.watchWallet = 'watchWallet';

config.GLEECS = {};
config.GLEECS.confirmation_blocks = 6;
config.GLEECS.address = '0.0.0.0';
config.GLEECS.port = 32812;
config.GLEECS.auth = {};
config.GLEECS.auth.user = 'user';
config.GLEECS.auth.passwd = 'pw';
config.GLEECS.watchWallet = 'watchWallet';

module.exports = config;