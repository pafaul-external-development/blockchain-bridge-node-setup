const crypto = require('crypto-js');

function craeteWalletId(currency, userId) {
    return crypto.SHA256('userId'+userId+'currency'+currency+'date'+Date());
}

module.exports = craeteWalletId;