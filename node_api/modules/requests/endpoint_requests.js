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
        this['GLEEC'] = {
            instance: gleecsInstance,
            requests: new HighLevelRequests(gleecsInstance)
        };
        this.database = databaseInstance;
        this.that = this;
    }

    /**
     * Set request instance for BTCV
     * @param {AxiosInstance} instance 
     */
    setBtcvInstance(instance) {
        this.BTCV.instance = instance;
        this.BTCV.requests.setInstance(instance);
    }

    /**
     * Set request instance for Gleec
     * @param {AxiosInstance} instance 
     */
    setGleecsInstance(instance) {
        this.GLEECS.instance = instance;
        this.GLEECS.requests.setInstance(instance);
    }

    /**
     * Create user wallet
     * @param {String} currency 
     * @param {String} userId 
     * @param {String} callbackUrl 
     */
    async createWallet(currency, userId, callbackUrl) {
        let user = await this.database.safeAddUser(userId);
        let walletExists = await this.database.getKeyVaultByUid(userId, currency);
        if (!walletExists) {
            let walletId = getWalletId(currency, userId);

            let walletData = await this[currency].requests.createWallet(walletId);
            let wallet = await this.database.safeAddKeyVaultByUid(userId, currency, walletData[1], walletId);
            if (wallet) {
                return await this.getWallet(walletId);
            } else {
                throw new Error('Cannot create wallet for user!')
            }
        } else {
            throw new Error('Wallet for user already exists!');
        }
    }

    /**
     * Get user wallet by walletId
     * @param {String} walletId 
     */
    async getWallet(walletId) {
        let wallet = await this.database.getKeyVaultByWalletId(walletId);
        if (wallet) {
            let walletData = await this[wallet.wallet_currency].requests.getWallet(walletId);
            return {
                currency: wallet.wallet_currency, 
                balances: walletData, 
                address: wallet.pub_key,
                walletId: walletId
            };
        } else {
            throw new Error('Wallet not found!');
        }
    }

    /**
     * Get all existing user wallets
     * @param {String} userId 
     */
    async getUserWallets(userId) {
        let existingWallets = await this.database.getAllKeyVaultsByUid(userId);
        if (existingWallets.length > 0) {
            let walletInfo = [];
            for (const walletData of existingWallets) {
                let wallet = await this.getWallet(walletData.wallet_id);
                walletInfo.push(wallet);
            }
            return walletInfo;
        }
        return [];
    }

    /**
     * Get history of wallet by walletId
     * @param {String} walletId 
     */
    async getHistory(walletId) {
        let wallet = await this.database.getKeyVaultByWalletId(walletId);
        if (wallet.wallet_currency) {
            let walletHistory = await this[wallet.wallet_currency].requests.getHistory(wallet.wallet_id);
            return {
                currency: wallet.wallet_currency, 
                data: walletHistory
            };
        } else {
            throw new Error ('Cannot get wallet history');
        }
    }

    /**
     * Get history of all user's wallets
     * @param {String} userId 
     */
    async getUserHistory(userId) {
        let wallets = await this.database.getAllKeyVaultsByUid(userId);
        let history = [];
        if (wallets.length > 0) {
            for (const walletData of wallets) {
                let walletHistory = await this.getHistory(walletData.wallet_id);
                history.push(walletHistory);
            }
            return history;
        }
        return [];
    }

    /**
     * Get information about transaction
     * @param {String} walletId 
     * @param {String} txId 
     */
    async getTxData(walletId, txId) {
        let wallet = await this.database.getKeyVaultByWalletId(walletId);
        if (wallet) {
            let txData = await this[wallet.wallet_currency].requests.getTxData(wallet.wallet_id, txId);
            return txData;
        } else {
            throw new Error('Cannot get tx data');
        }
    }

    /**
     * Create transaction
     * @param {String} currency 
     * @param {String} userId 
     * @param {String} to 
     * @param {Number} amount 
     * @param {function} callback 
     */
    async createTx(currency, userId, to, amount, callback) {
        let wallet = await this.database.getKeyVaultByUid(userId, currency);
        if (wallet) {
            let txData = await this[wallet.wallet_currency].requests.createTx(wallet.wallet_id, to, String(amount));
            if (txData) {
                if (txData.txId) {
                    return txData;
                }
                return txId;
            }
            return null;
        } else {
            throw new Error('Cannot create tx');
        }
    }

    /**
     * Calculate approximate comission
     * @param {String} currency 
     * @param {String} userId 
     * @param {String} to 
     * @param {Number} amount 
     */
    async getTxCommission(currency, userId, to, amount) {
        let wallet = await this.database.getKeyVaultByUid(userId, currency);
        if (wallet) {
            let confirmationBlocks = BlockchainConfig[currency].confirmation_blocks;
            let fee = await this[wallet.wallet_currency].requests.getTxCommission(wallet.wallet_id, confirmationBlocks);
            return {
                fee: fee
            };
        } else {
            throw new Error('Cannot calculate tx Commission');
        }
    }
}

module.exports = EndPointRequests;