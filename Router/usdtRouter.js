const routers =  require('express').Router();
const usdtController = require('../controller/usdtController')

/**
* @swagger
* /usdt/generateMnemonic:
*   get:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/generateMnemonic',usdtController.generateMnemonic);
/**
* @swagger
* /usdt/generateWallet:
*   post:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*     produces:
*       - application/json
*     parameters:
*       - name: mnemonic
*         description: mnemonic is required.
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
routers.post('/generateWallet',usdtController.generateWallet);
/**
* @swagger
* /usdt/getBalance:
*   post:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*     produces:
*       - application/json
*     parameters:
*       - name: address
*         description: address is required.
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
routers.post('/getBalance',usdtController.getBalance);
/**
* @swagger
* /usdt/transfer:
*   post:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*     produces:
*       - application/json
*     parameters:
*       - name: amount
*         description: amount is required.
*         in: formData
*         required: true
*       - name: recieverAddress
*         description: recieverAddress is required.
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
routers.post('/transfer',usdtController.transfer);
/**
* @swagger
* /usdt/approved:
*   post:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*     produces:
*       - application/json
*     parameters:
*       - name: spenderAddress
*         description: spenderAddress is required.
*         in: formData
*         required: true
*       - name: amount
*         description: amount is required.
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
routers.post('/approved',usdtController.approved);
/**
* @swagger
* /usdt/allowances:
*   post:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*     produces:
*       - application/json
*     parameters:
*       - name: address
*         description: address is required.
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
routers.post('/allowances',usdtController.allowances);
/**
* @swagger
* /usdt/transferFrom:
*   post:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*     produces:
*       - application/json
*     parameters:
*       - name: receiverAddress
*         description: receiverAddress is required.
*         in: formData
*         required: true
*       - name: amount
*         description: amount is required.
*         in: formData
*         required: true
*       - name: spenderPrivateKey
*         description: spenderPrivateKey is required.
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
routers.post('/transferFrom',usdtController.transferFrom);
/**
* @swagger
* /usdt/tSupply:
*   post:
*     tags:
*       - USDT MANAGEMENT
*     description: Creating Docs for USDT
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.post('/tSupply',usdtController.tSupply);

module.exports=routers