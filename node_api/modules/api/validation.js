const { check, param, validationResult, oneOf} = require('express-validator');

const validate = {
    "currency": check("currency").not().isEmpty().withMessage('currency param is required').isIn(['GLEEC', 'BTCV']).withMessage('Currency must be "GLEEC" or "BTCV"'),
    "userId": check("userId").not().isEmpty().withMessage('userId param is required'),
    "callbackUrl": check("callbackUrl").not().isEmpty().withMessage('callbackUrl param is required'),
    "to": check("to").not().isEmpty().withMessage('to param is required'),
    "amount": check("amount").not().isEmpty().withMessage('amount param is required'),
    "walletId": check("walletId").not().isEmpty().withMessage('walletId param is required'),
    "txId": check("txId").not().isEmpty().withMessage('txId param is required')
}

module.exports = validate;