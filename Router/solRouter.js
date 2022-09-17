const routers =  require('express').Router();
const solController = require('../controller/solController')

/**
* @swagger
* /sol/walletGenerate:
*   get:
*     tags:
*       - Solana MANAGEMENT
*     description: Creating Docs for Solana
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/walletGenerate',solController.walletGenerate);
/**
* @swagger
* /sol/getBalance:
*   get:
*     tags:
*       - Solana MANAGEMENT
*     description: Creating Docs for Solana
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
routers.get('/getBalance',solController.getBalance);
/**
* @swagger
* /sol/transfer:
*   post:
*     tags:
*       - Solana MANAGEMENT
*     description: Creating Docs for Solana
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
routers.post('/transfer',solController.transfer);
/**
* @swagger
* /sol/airdrop:
*   get:
*     tags:
*       - Solana MANAGEMENT
*     description: Creating Docs for Solana
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
routers.get('/airdrop',solController.airdrop);
/**
* @swagger
* /sol/withdrawSOL:
*   post:
*     tags:
*       - Solana MANAGEMENT
*     description: Creating Docs for Solana
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
routers.post('/withdrawSOL',solController.withdrawSOL);

module.exports=routers 