const AxiosInstance = require('./request_instance');
const HighLevelRequests = require('./high_level_requests');
const getWalletId = require('../utils/utils');

class EndPointRequests {
    /**
     * 
     * @param {AxiosInstance} btcvInstance 
     * @param {AxiosInstance} gleecsInstance 
     */
    constructor(btcvInstance, gleecsInstance) {
        this.btcv = {
            instance: btcvInstance,
            requests: new HighLevelRequests(btcvInstance)
        };
        this.gleecs = {
            instance: gleecsInstance,
            requests: new HighLevelRequests(gleecsInstance)
        };
    }

    /**
     * 
     * @param {AxiosInstance} instance 
     */
    setBtcvInstance(instance) {
        this.btcv.instance = instance;
        this.btcv.requests.setInstance(instance);
    }

    /**
     * 
     * @param {AxiosInstance} instance 
     */
    setGleecsInstance(instance) {
        this.gleecs.instance = instance;
        this.gleecs.requests.setInstance(instance);
    }

    /**
     * 
     * @param {String} currency 
     * @param {String} userId 
     * @param {String} callbackUrl 
     */
    async createWallet(currency, userId, callbackUrl) {
        // TODO проверка есть ли у пользователя кошелёк для currency 
        let walletExists = false;
        if (!walletExists) {
            let walletToCreate = (currency == 'BTCV') ? 'btcv' : 'gleecs';
            let walletId = null;
            let walletData = await this[walletToCreate].createWallet(walletId);
            if (walletData) {
                // TODO вызов url и запись в БД
            } else {
                // TODO обработка
            }
        }
    }

    /**
     * 
     * @param {String} userId 
     */
    async getUserWallets(userId) {
        // TODO запрос в бд и получение кошельков
        let existingWallets = [];
        let walletInfo = [];
        existingWallets.forEach((walletData) => {
            let wallet = await this[walletData.currency].getWalletInfo(walletData.id);
            walletInfo.push([walletData.currency, wallet]);
        });
        return walletInfo;
    }

    /**
     * 
     * @param {String} walletId 
     */
    async getHistory(walletId) {
        // TODO придумать ID кошелька и получение валюты кошелька
        let currency = 'btcv';
        if (currency) {
            let walletInfo = await this[currency].getWalletInfo(walletId);
            return walletInfo;
        }
        return 
    }

    /**
     * 
     * @param {String} userId 
     */
    async getUserHistory(userId) {
        // TODO получение кошельков пользователя
        let wallets = [];
        let history = [];
        wallets.forEach((walletData) => {
            let walletHistory = await this[walletData.name].getHistory(walletData.id);
            history.push([walletData.name, walletHistory]);
        })
        return history;
    }

    /**
     * 
     * @param {String} userId 
     * @param {String} currency 
     * @param {String} txId 
     */
    async getTxData(userId, currency, txId) {
        // TODO получение кошелька с которого была произведена транзакция
        let wallet = null;
        let txData = await this[wallet.name].getTxData(wallet.id, txId);
        return txData;
    }

    /**
     * 
     * @param {String} currency 
     * @param {String} userId 
     * @param {String} to 
     * @param {Number} amount 
     * @param {function} callback 
     */
    async createTx(currency, userId, to, amount, callback) {
        // TODO получение кошелька пользователя с валютой
        let wallet = null;
        let txData = await this[wallet.name].createTx(wallet.id, to, String(amount));
        if (txData) {
            if (txData.txId) {
                // был получен txId и данные по транзакции на текущий момент
                // TODO вызов callback
                return txData;
            }
            return txId;
        }
        return null;
    }

    /**
     * 
     * @param {String} currency 
     * @param {String} userId 
     * @param {String} to 
     * @param {Number} amount 
     */
    async getTxComission(currency, userId, to, amount) {
        // TODO получение кошелька пользователя
        let wallet = null;
        let confirmation_blocks = null;
        let fee = await this[wallet.name].getTxComission(confirmation_blocks);
        return fee;
    }
}

module.exports = EndPointRequests;