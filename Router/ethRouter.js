const routers =  require('express').Router();
const ethController =require('../controller/ethController')

/**
* @swagger
* /eth/generateEthMnemonic:
*   get:
*     tags:
*       - ETH MANAGEMENT
*     description: Creating Docs for ETH
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/generateEthMnemonic',ethController.generateEthMnemonic);
/**
* @swagger
* /eth/generateETHWallet:
*   post:
*     tags:
*       - ETH MANAGEMENT
*     description: Creating Docs for ETH
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
routers.post('/generateETHWallet',ethController.generateETHWallet);
/**
* @swagger
* /eth/getEthBalance:
*   get:
*     tags:
*       - ETH MANAGEMENT
*     description: Creating Docs for ETH
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
routers.get('/getEthBalance',ethController.getEthBalance);
/**
* @swagger
* /eth/transferEth:
*   post:
*     tags:
*       - ETH MANAGEMENT
*     description: Creating Docs for ETH
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
routers.post('/transferEth',ethController.transferEth);
/**
* @swagger
* /eth/ethWithdraw:
*   post:
*     tags:
*       - ETH MANAGEMENT
*     description: Creating Docs for ETH
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
routers.post('/ethWithdraw',ethController.ethWithdraw);
/**
* @swagger
* /eth/allTransaction:
*   post:
*     tags:
*       - ETH MANAGEMENT
*     description: Creating Docs for ETH
*     produces:
*       - application/json
*     parameters:
*       - name: addressFetch
*         description: senderAddress is required.
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
routers.post('/allTransaction',ethController.allTransaction);

module.exports=routers 