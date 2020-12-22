const AxiosInstance = require('./request_instance');
const HighLevelRequests = require('./high_level_requests');
const getWalletId = require('../utils/utils');
const Database = require('../database/database');
const BlockchainConfig = require('../config/blockchain_config')

class EndPointRequests {
    /**
     * 
     * @param {AxiosInstance} btcvInstance 
     * @param {AxiosInstance} gleecsInstance 
     * @param {Database} databaseInstance
     */
    constructor(btcvInstance, gleecsInstance, databaseInstance) {
        this['BTCV'] = {
            instance: btcvInstance,
            requests: new HighLevelRequests(btcvInstance)
        };
        this['GLEECS'] = {
            instance: gleecsInstance,
            requests: new HighLevelRequests(gleecsInstance)
        };
        this.database = databaseInstance;
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
        let user = await this.database.safeAddUser(userId);
        let walletExists = await this.database.getKeyVault(userId, currency);
        if (!walletExists) {
            let walletToCreate = (currency == 'BTCV') ? 'btcv' : 'gleecs';
            let walletId = getWalletId(currency, userId);

            let walletData = await this[walletToCreate].createWallet(walletId);
            if (walletData) {
                let wallet = await this.database.safeAddKeyVault(userId, currency, walletData[0], walletId);
                if (wallet) {}
                    // TODO вызов url и запись в БД
            } else {
                throw Error('Cannot create wallet');
            }
        }
    }

    /**
     * 
     * @param {String} userId 
     */
    async getUserWallets(userId) {
        let existingWallets = await this.database.getAllKeyVaultsByUid(userId);
        let walletInfo = [];
        for (const walletData of existingWallets) {
            let wallet = await this[walletData.wallet_currency].getWallet(walletData.wallet_id);
            walletInfo.push([walletData.wallet_currency, wallet, walletData.pub_key]);
        }
        return walletInfo;
    }

    /**
     * 
     * @param {String} walletId 
     */
    async getHistory(walletId) {
        let wallet = await this.database.getKeyVaultByWalletId(walletId);
        if (currency) {
            let walletInfo = await this[wallet.wallet_currency].getWallet(wallet.walletId);
            return walletInfo;
        }
        return 
    }

    /**
     * 
     * @param {String} userId 
     */
    async getUserHistory(userId) {
        let wallets = await this.database.getAllKeyVaultsByUserId(userId);
        let history = [];
        for (const walletData of wallets) {
            let walletHistory = await this[walletData.wallet_currency].getHistory(walletData.wallet_id);
            history.push([walletData.wallet_currency, walletHistory]);
        }
        return history;
    }

    /**
     * 
     * @param {String} walletId 
     * @param {String} txId 
     */
    async getTxData(walletId, txId) {
        let wallet = await this.database.getKeyVaultByWalletId(walletId);
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
        let wallet = await this.database.getKeyVault(userId, currency);
        if (wallet) {
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
    }

    /**
     * 
     * @param {String} currency 
     * @param {String} userId 
     * @param {String} to 
     * @param {Number} amount 
     */
    async getTxComission(currency, userId, to, amount) {
        let wallet = this.database.getKeyVault(userId, currency);
        let confirmationBlocks = BlockchainConfig[currency].confirmationBlocks;
        let fee = await this[wallet.name].getTxComission(confirmationBlocks);
        return fee;
    }
}

module.exports = EndPointRequests;