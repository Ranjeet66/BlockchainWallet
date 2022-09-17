const routers =  require('express').Router();
const btcCntroller = require('../controller/btcController')

/**
* @swagger
* /btc/generateBTCMnemonic:
*   get:
*     tags:
*       - BTC MANAGEMENT
*     description: Creating Docs for BTC
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/generateBTCMnemonic',btcCntroller.generateBTCMnemonic);
/**
* @swagger
* /btc/generateBTCWallet:
*   post:
*     tags:
*       - BTC MANAGEMENT
*     description: Creating Docs for BTC
*     produces:
*       - application/json
*     parameters:
*       - name: mnemonic
*         description: mnemonic is required.
*         in: formData
*         required: true
*       - name: count
*         description: count is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.post('/generateBTCWallet',btcCntroller.generateBTCWallet);
/**
* @swagger
* /btc/BTCBalance:
*   get:
*     tags:
*       - BTC MANAGEMENT
*     description: Creating Docs for BTC
*     produces:
*       - application/json
*     parameters:
*       - name: address
*         description: address is required.
*         in: query
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/BTCBalance',btcCntroller.BTCBalance);
/**
* @swagger
* /btc/withdrawBTC:
*   post:
*     tags:
*       - BTC MANAGEMENT
*     description: Creating Docs for BTC
*     produces:
*       - application/json
*     parameters:
*       - name: senderAddress
*         description: senderAddress is required.
*         in: formData
*         required: true
*       - name: privateKey
*         description: privateKey is required.
*         in: formData
*         required: true
*       - name: recieverAddress
*         description: recieverAddress is required.
*         in: formData
*         required: true
*       - name: amountToSend
*         description: amountToSend is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.post('/withdrawBTC',btcCntroller.withdrawBTC);
/**
* @swagger
* /btc/withdrawBTC:
*   post:
*     tags:
*       - BTC MANAGEMENT
*     description: Creating Docs for BTC
*     produces:
*       - application/json
*     parameters:
*       - name: serializedTransaction
*         description: serializedTransaction is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/BTCSendApi',btcCntroller.BTCSendApi);
/**
* @swagger
* /btc/getGlobleMarketBTCPrice:
*   get:
*     tags:
*       - BTC MANAGEMENT
*     description: Creating Docs for BTC
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/  
routers.get('/getGlobleMarketBTCPrice',btcCntroller.getGlobleMarketBTCPrice);
/**
* @swagger
* /btc/getMarketBTCValue:
*   get:
*     tags:
*       - BTC MANAGEMENT
*     description: Creating Docs for BTC
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/getMarketBTCValue',btcCntroller.getMarketBTCValue);

module.exports=routers 