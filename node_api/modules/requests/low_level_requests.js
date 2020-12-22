const AxiosInstance = require('./request_instance');

class LowLevelRequests {
    /**
     * 
     * @param {AxiosInstance} instance 
     */
    constructor(instance=null) {
        if (instance)
            this.instance = instance;
    }

    /**
     * Set used instance
     * @param {AxiosInstance} instance 
     */
    setInstance(instance) {
        this.instance = instance;
    }

    /** 
     * Get current instance
    */
    getInstance() {
        return this.instance;
    }

    /**
     * Create new wallet for user
     * @param {String} walletId 
     */
    async createWallet(walletId) {
        try {
            let response = await this.instance.post_request('', 'createwallet', [walletId]);
            if (!response.error)
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Generate new address
     * @param {String} walletId 
     */
    async getNewAddress(walletId) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'getnewaddress', []);
            if (!response.error) 
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Get private key of address
     * @param {String} walletId
     * @param {String} address 
     */
    async dupmPrivKey(walletId, address) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'dumpprivkey', [address]);
            if (!response.error)
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    
    /**
     * Import address to watch for
     * @param {String} walletId
     * @param {String} address 
     * @param {String} label 
     * @param {Boolean} rescan 
     */
    async importAddress(walletId, address, label, rescan) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'importaddress', [address, label, rescan]);
            if (!response.error)
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * List transactions of user
     * @param {String} walletId 
     * @param {Number} count 
     */
    async listTransactions(walletId, count) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'listtransactions', [String(count)]);
            if (!response.error)
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Get balance of user
     * @param {String} walletId 
     */
    async getBalance(walletId) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'getbalance', []);
            if (!response.error)
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Get wallet info of walletId
     * @param {String} walletId 
     */
    async getWalletInfo(walletId) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'getwalletinfo', []);
            if (!response.error)
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Get transaction info
     * @param {String} walletId 
     * @param {String} txId 
     */
    async getTransaction(walletId, txId) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'gettransaction', [txId]);
            if (!response.error)
                return response.data.result;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Send amount to specified address
     * @param {String} walletId 
     * @param {String} address 
     * @param {String} amount 
     */
    async sendToAddress(walletId, address, amount) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'sendtoaddress', [address, amount]);
            if (!response.error)
                return response.data.result.txId;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Estimate fee per Kb
     * @param {String} walletId
     * @param {Number} confirmation_target 
     */
    async estimateSmartFee(walletId, confirmation_target) {
        try {
            let path = '/wallet/' + walletId;
            let response = await this.instance.post_request(path, 'estimatesmartfee', [confirmation_target]);
            if (!response.error)
                return response.data.result.feerate;
            else
                return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

module.exports = LowLevelRequests;