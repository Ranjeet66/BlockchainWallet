const routers =  require('express').Router();
const bnbController = require('../controller/bnbController')

/**
* @swagger
* /bnb/generateMnemonic:
*   get:
*     tags:
*       - BNB MANAGEMENT
*     description: Creating Docs for BNB
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/generateMnemonic',bnbController.generateMnemonic);
/**
* @swagger
* /bnb/generateWallet:
*   post:
*     tags:
*       - BNB MANAGEMENT
*     description: Creating Docs for BNB
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
routers.post('/generateWallet',bnbController.generateWallet);
/**
* @swagger
* /bnb/getBalance:
*   get:
*     tags:
*       - BNB MANAGEMENT
*     description: Creating Docs for BNB
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
routers.get('/getBalance',bnbController.getBalance);
/**
* @swagger
* /bnb/transfer:
*   post:
*     tags:
*       - BNB MANAGEMENT
*     description: Creating Docs for BNB
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
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.post('/transfer',bnbController.transfer);
/**
* @swagger
* /bnb/bnbWithdraw:
*   post:
*     tags:
*       - BNB MANAGEMENT
*     description: Creating Docs for BNB
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
routers.post('/bnbWithdraw',bnbController.bnbWithdraw);

module.exports=routers 