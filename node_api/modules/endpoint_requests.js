const AxiosInstance = require('./request_instance');
const Requests = require('./requests');

class EndPointRequests {
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
    set_instance(instance) {
        this.instance = instance;
        this.requests.set_instance(instance);
    }

    /**
     * Create wallet for user
     * @param {String} userId 
     */
    async createWallet(userId) {
        let wallet = await this.requests.create_wallet(userId);
        if (wallet) {
            let pubkey = await this.requests.get_new_address(userId);
            if (pubkey) 
                return [wallet, pubkey];
        }
        return null;
    }

    async getBalance(userId) {
        let balance = await this.requests.get_balance(userId);
        return balance;
    }

    /**
     * Get user transaction history
     * @param {String} userId 
     */
    async getHistory(userId) {
        let history = await this.requests.list_transactions(userId, 9999);
        return history;
    }

    /**
     * Get transaction info
     * @param {String} userId 
     * @param {String} txId 
     */
    async getTxData(userId, txId) {
        let txInfo = await this.requests.get_transaction(userId, txId);
        return txInfo;
    }

    /**
     * Send funds to address
     * @param {String} userId 
     * @param {String} to 
     * @param {String} amount 
     */
    async createTx(userId, to, amount) {
        let txId = await this.requests.send_to_address(userId, to, amount);
        return txId;
    }

    /**
     * Estimate possible fee
     * @param {Number} confirmation_blocks 
     */
    async getTxComission(confirmation_blocks) {
        let fee = await this.requests.estimate_smart_fee(confirmation_blocks);
        return fee;
    }
}

module.exports = EndPointRequests;