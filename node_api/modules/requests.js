const AxiosInstance = require('./request_instance');

class Requests {
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
    set_instance(instance) {
        this.instance = instance;
    }

    /** 
     * Get current instance
    */
    get_instance() {
        return this.instance;
    }

    /**
     * Create new wallet for user
     * @param {String} userId 
     */
    async create_wallet(userId) {
        let response = await this.instance.post_request('', 'createwallet', [String(userId)]);
        if (!response.error)
            return response.data.result;
        else
            return null;
    }

    /**
     * Generate new address
     * @param {String} userId 
     */
    async get_new_address(userId) {
        let path = '/wallet/' + userId;
        let response = await this.instance.post_request(path, 'getnewadress', []);
        if (!response.error) 
            return response.data.result;
        else
            return null;
    }

    /**
     * Get private key of address
     * @param {String} userId
     * @param {String} address 
     */
    async dump_priv_key(userId, address) {
        let path = '/wallet/' + userId;
        let response = await this.instance.post_request(path, 'dumpprivkey', [address]);
        if (!response.error)
            return response.data.result;
        else
            return null;
    }
    
    /**
     * Import address to watch for
     * @param {String} userId
     * @param {String} address 
     * @param {String} label 
     * @param {Boolean} rescan 
     */
    async import_address(userId, address, label, rescan) {
        let path = '/wallet/' + userId;
        let response = await this.instance.post_request(path, 'importaddress', [address, label, rescan]);
        if (!response.error)
            return response.data.result;
        else
            return null;
    }

    /**
     * List transactions of user
     * @param {String} userId 
     * @param {Number} count 
     */
    async list_transactions(userId, count) {
        let path = '/wallet/' + userId;
        let response = await this.instance.post_request(path, 'listtransactions', [count]);
        if (!response.error)
            return response.data.result;
        else
            return null;
    }

    /**
     * Get balance of user
     * @param {String} userId 
     */
    async get_balance(userId) {
        let path = '/wallet/' + userId;
        let response = await this.instance.post_request(path, 'getbalance', []);
        if (!response.error)
            return response.data.result;
        else
            return null;
    }

    /**
     * Get transaction info
     * @param {String} userId 
     * @param {String} txId 
     */
    async get_transaction(userId, txId) {
        let path = '/wallet/' + userId;
        let response = await this.instance.post_request(path, 'gettransaction', [txId]);
        if (!response.error)
            return response.data.result;
        else
            return null;
    }

    /**
     * Send amount to specified address
     * @param {String} userId 
     * @param {String} address 
     * @param {String} amount 
     */
    async send_to_address(userId, address, amount) {
        let path = '/wallet/' + userId;
        let response = await this.instance.post_request(path, 'sendtoaddress', [address, amount]);
        if (!response.error)
            return response.data.result.txId;
        else
            return null;
    }

    /**
     * Estimate fee per Kb
     * @param {Number} confirmation_target 
     */
    async estimate_smart_fee(confirmation_target) {
        let response = await this.instance.post_request('', 'estimatesmartfee', [confirmation_target]);
        if (!response.error)
            return response.data.result.feerate;
        else
            return null;
    }
}