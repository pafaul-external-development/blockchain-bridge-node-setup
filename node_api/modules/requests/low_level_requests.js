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
     * @param {String} userId 
     */
    async createWallet(userId) {
        try {
            let response = await this.instance.post_request('', 'createwallet', [userId]);
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
     * @param {String} userId 
     */
    async getNewAddress(userId) {
        try {
            let path = '/wallet/' + userId;
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
     * @param {String} userId
     * @param {String} address 
     */
    async dupmPrivKey(userId, address) {
        try {
            let path = '/wallet/' + userId;
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
     * @param {String} userId
     * @param {String} address 
     * @param {String} label 
     * @param {Boolean} rescan 
     */
    async importAddress(userId, address, label, rescan) {
        try {
            let path = '/wallet/' + userId;
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
     * @param {String} userId 
     * @param {Number} count 
     */
    async listTransactions(userId, count) {
        try {
            let path = '/wallet/' + userId;
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
     * @param {String} userId 
     */
    async getBalance(userId) {
        try {
            let path = '/wallet/' + userId;
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
     * Get wallet info of userId
     * @param {String} userId 
     */
    async getWalletInfo(userId) {
        try {
            let path = '/wallet/' + userId;
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
     * @param {String} userId 
     * @param {String} txId 
     */
    async getTransaction(userId, txId) {
        try {
            let path = '/wallet/' + userId;
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
     * @param {String} userId 
     * @param {String} address 
     * @param {String} amount 
     */
    async sendToAddress(userId, address, amount) {
        try {
            let path = '/wallet/' + userId;
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
     * @param {Number} confirmation_target 
     */
    async estimateSmartFee(confirmation_target) {
        try {
            let response = await this.instance.post_request('', 'estimatesmartfee', [confirmation_target]);
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
