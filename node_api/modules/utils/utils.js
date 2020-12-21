const crypto = require('crypto-js');

/**
 * 
 * @param {String} currency 
 * @param {String} userId 
 */
function craeteWalletId(currency, userId) {
    return crypto.SHA256('userId'+userId+'currency'+currency+'date'+Date()).toString(crypto.enc.Hex);
}

module.exports = craeteWalletId;