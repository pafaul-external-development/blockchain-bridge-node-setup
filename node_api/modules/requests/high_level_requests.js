const AxiosInstance = require('./request_instance');
const Requests = require('./low_level_requests');

class HighLevelRequests {
    /**
     * 
     * @param {AxiosInstance} instance 
     */
    constructor(instance=null) {
        this.instance = instance;
        this.lowLevelRequests = new Requests(instance);
    }

    /**
     * Set instance of axios to handle requests
     * @param {AxiosInstance} instance 
     */
    setInstance(instance) {
        this.instance = instance;
        this.lowLevelRequests.setInstance(instance);
    }

    /**
     * Create wallet for user
     * @param {String} walletId 
     */
    async createWallet(walletId) {
        let wallet = await this.lowLevelRequests.createWallet(walletId);
        if (wallet) {
            let pubkey = await this.lowLevelRequests.getNewAddress(walletId);
            if (pubkey) 
                return [wallet, pubkey];
        }
        return null;
    }

    /**
     * Get walletInformation
     * @param {String} walletId 
     */
    async getWallet(walletId) {
        let walletInfo = await this.lowLevelRequests.getWalletInfo(walletId);
        if (walletInfo) {
            let info = {
                walletData: '',
                balance: walletInfo.balance,
                holdBalance: walletInfo.unconfirmed_balance
            }
            return info;
        }
        return null;
    }

    /**
     * Get user transaction history
     * @param {String} walletId 
     */
    async getHistory(walletId) {
        let history = await this.lowLevelRequests.listTransactions(walletId);
        let transactionsInfo = [];
        history.forEach((tx) => {
            transactionsInfo.push({
                txId: tx.txid,
                address: tx.address,
                amount: tx.amount,
                category: tx.category,
                time: tx.time,
                fee: tx.fee
            })
        })
        return transactionsInfo;
    }

    /**
     * Get transaction info
     * @param {String} walletId 
     * @param {String} txId 
     */
    async getTxData(walletId, txId) {
        let txData = await this.lowLevelRequests.getTransaction(walletId, txId);

        let txInfo = {
            amount: txData.amount,
            time: txData.time,
            fee: txData.fee,
            address: txData.details? txData.details.address: null,
            status: txData.details? txData.details.category : null,
            abandoned: txData.details? txData.details.abandoned : null,
        }
        return txInfo;
    }

    /**
     * Send funds to address
     * @param {String} walletId 
     * @param {String} to 
     * @param {String} amount 
     */
    async createTx(walletId, to, amount) {
        let txId = await this.lowLevelRequests.sendToAddress(walletId, to, amount);
        console.log(txId);
        if (txId) {
            let txData = await this.getTxData(walletId, txId);
            console.log(txData);
            if (txData) {
                txData.txId = txId;
                return txData;
            }
            return txId;
        }
        return null;
    }

    /**
     * Estimate possible fee
     * @param {String} walletId
     * @param {Number} confirmation_blocks 
     */
    async getTxComission(walletId, confirmation_blocks) {
        let fee = await this.lowLevelRequests.estimateSmartFee(walletId, confirmation_blocks);
        return fee;
    }
}

module.exports = HighLevelRequests;
