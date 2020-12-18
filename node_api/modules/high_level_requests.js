const AxiosInstance = require('./request_instance');
const Requests = require('./low_level_requests');

class HighLevelRequests {
    /**
     * 
     * @param {AxiosInstance} instance 
     */
    constructor(instance=null) {
        this.instance = instance;
        this.requests = new Requests(instance);
    }

    /**
     * Set instance of axios to handle requests
     * @param {AxiosInstance} instance 
     */
    setInstance(instance) {
        this.instance = instance;
        this.requests.setInstance(instance);
    }

    /**
     * Create wallet for user
     * @param {String} walletId 
     */
    async createWallet(walletId) {
        let wallet = await this.requests.createWallet(walletId);
        if (wallet) {
            let pubkey = await this.requests.getNewAddress(walletId);
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
        let walletInfo = await this.requests.getWalletInfo(walletId);
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
        let history = await this.requests.listTransactions(walletId, 9999);
        let transactionsInfo = [];
        history.forEach((tx) => {
            transactionsInfo.push({
                address: tx.address,
                status: tx.details? tx.details.category : null,
                fee: tx.fee,
                abandoned: tx.details? tx.details.abandoned : null
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
        let txData = await this.requests.getTransaction(walletId, txId);

        let txInfo = {
            address: txData.address,
            status: txData.details? txData.details.category : null,
            fee: tx.fee,
            abandoned: txData.details? tx.details.abandoned : null
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
        let txId = await this.requests.sendToAddress(walletId, to, amount);
        if (txId) {
            let txData = await this.getTxData(walletId, txId);
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
     * @param {Number} confirmation_blocks 
     */
    async getTxComission(confirmation_blocks) {
        let fee = await this.requests.estimateSmartFee(confirmation_blocks);
        return fee;
    }
}

module.exports = HighLevelRequests;
