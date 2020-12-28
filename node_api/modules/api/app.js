const express = require('express');
const { check, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler')
const createError = require('http-errors')
const axios = require('axios');
const apiConfig = require("../config/api_config")

const endPointRequests = require("../initialization/instance_setup")();
const app = express()


async function erorHT(){
    throw new Error("test error");
}

const testConfig = {
    headers: {
        "api-key": "D8FE58CD2CD97A17E5227B11A95E7",
    }
};

async function main(){

    app.use(asyncHandler( async function (req, res, next) {
        if (!apiConfig.apiKeys.has(req.headers["api-key"])) {
            throw new Error('Unknown api key');
        }
        next();
      }));

    app.use(asyncHandler( async function (req, res, next) {
        if (!req.query.currency) {
            next();
        }
        else{
            if (req.query.currency == "GLEEC" || req.query.currency == "BTCV") {
                next();
            }
            else{
                throw new Error('Currency must be "GLEEC" or "BTCV"');
            }
        }
      }));


    app.post('/api/v1/test', asyncHandler(async function(req, res) {
        console.log(req);
        res.send("All right");
    }));

	app.post('/api/v1/createWallet', asyncHandler(async function(req, res) {
        let currency = req.query.currency;
        let userId = req.query.userId;
        let callbackUrl = req.query.callbackUrl;

        let resp = await endPointRequests.createWallet(currency, userId, callbackUrl).catch(e => {
            throw e;
        });

        axios.post(callbackUrl, resp, testConfig)
        .then(cbResp => {
            console.log(resp);
            res.send(resp)
        })
        .catch(e => {
            console.log(e);
            throw e;
        });

    }));

    app.post('/api/v1/createTx', asyncHandler(async function(req, res) {
        let currency = req.query.currency;
        let userId = req.query.userId;
        let to = req.query.to;
        let amount = req.query.amount;
        let callbackUrl = req.query.callbackUrl;

        let resp = await endPointRequests.createTx(currency, userId, to, amount, callbackUrl).catch(e => {
            throw e;
        });

        axios.post(callbackUrl, resp, testConfig)
        .then(cbResp => {
            console.log(resp);
            res.send(resp)
        })
        .catch(e => {
            console.log(e);
            throw e;
        });

    }));

    app.get('/api/v1/getTxCommission', asyncHandler(async function(req, res) {
        let currency = req.query.currency;
        let userId = req.query.userId;
        let to = req.query.to;
        let amount = req.query.amount;

        let resp = await endPointRequests.getTxCommission(currency, userId, to, amount).catch(e => {
            throw e;
        });

        res.send(resp)

    }));

    app.get('/api/v1/getTxData', asyncHandler(async function(req, res) {
        let walletId = req.query.walletId;
        let txId = req.query.txId;

        let resp = await endPointRequests.getTxData(walletId, txId).catch(e => {
            throw e;
        });

        res.send(resp)

    }));
    
    app.get('/api/v1/getUserHistory', asyncHandler(async function(req, res) {
        let userId = req.query.userId;

        let resp = await endPointRequests.getUserHistory(userId).catch(e => {
            throw e;
        });

        res.send(resp)

    }));
    
    app.get('/api/v1/getHistory', asyncHandler(async function(req, res) {
        let walletId = req.query.walletId;

        let resp = await endPointRequests.getHistory(walletId).catch(e => {
            throw e;
        });

        res.send(resp)


    }));
    
	app.get('/api/v1/getWallet', asyncHandler(async function(req, res) {
        let walletId = req.query.walletId;

        let resp = await endPointRequests.getWallet(walletId).catch(e => {
            throw e;
        });

        res.send(resp)

    }));

    app.get('/api/v1/getUserWallets', asyncHandler(async function(req, res) {
        let userId = req.query.userId;

        let resp = await endPointRequests.getUserWallets(userId).catch(e => {
            throw e;
        });

        res.send(resp)

    }));
    
    app.use((error, req, res, next) => {
        res.status(error.status || 500)
        res.json({
          status: error.status || 500,
          message: error.message,
        //   stack: error.stack // Turn on if need error stack in resp
        })

    })

}


main();


app.listen(apiConfig.port, apiConfig.host, () => console.log(`Server ready on ${apiConfig.port} port.`))