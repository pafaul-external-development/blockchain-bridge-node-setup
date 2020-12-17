const { default: Axios } = require('axios');

class AxiosInstance {
    /**
     * 
     * @param {String} server_url Base url for requests
     * @param {String} username Username for authorization
     * @param {String} userpassword Password for authorization
     */
    constructor(server_url, username, userpassword) {
        this.instance = this.create_default_instance(server_url, username, userpassword);
    }

    /**
     * 
     * @param {String} server_url Base url for requests
     * @param {String} username Username for authorization
     * @param {String} userpassword Password for authorization
     */
    create_default_instance(server_url, username, userpassword) {
        let instance = Axios.create({
            baseURL: server_url,
            auth: {
                username: username,
                password: userpassword
            },
            headers: {
                'content-type': 'text/plain'
            }
        });
        return instance; 
    }

    /**
     * Performs post request
     * @param {String} path Path relative to base url
     * @param {String} method Method to call
     * @param {Array} params Data for request
     * @param {AxiosInstance?} instance axios instance, if not provided - uses created instance
     * @returns {Promise}
     */
    async post_request(path, method, params, instance = null) {
        let request_data = this.get_post_data(method, params)
        return new Promise(async (resolve, reject) => {
            let instance_to_use = instance? instance: this.instance;
            try {
                let response = await instance_to_use.post(path, request_data);
                resolve(response);
            } catch(e) {
                reject(e);
            }
        });
    }

    /**
     * Get JSON data for post request
     * @param {String} method
     * @param {Array} params
     */
    get_post_data(method, params) {
        return {
            "jsonrpc": "1.0",
            "method": method, 
            "params": params
        }
    }
}

module.exports = AxiosInstance;
