let config = {};

config.btcv = {};
config.btcv.confirmation_blocks = 6;
config.btcv.address = '0.0.0.0';
config.btcv.port = 32807;
config.btcv.auth = {};
config.btcv.auth.user = 'user';
config.btcv.auth.passwd = 'pw';

config.gleecs = {};
config.gleecs.confirmation_blocks = 6;
config.gleecs.address = '0.0.0.0';
config.gleecs.port = 32812;
config.gleecs.auth = {};
config.gleecs.auth.user = 'user';
config.gleecs.auth.passwd = 'pw';

module.exports = config;