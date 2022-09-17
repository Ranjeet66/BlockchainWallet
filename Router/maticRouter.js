const routers =  require('express').Router();
const maticController = require('../controller/maticController')


/**
* @swagger
* /matic/generateMnemonicM:
*   get:
*     tags:
*       - MATIC MANAGEMENT
*     description: Creating Docs for MATIC
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/generateMnemonicM',maticController.generateMnemonicM);
/**
* @swagger
* /matic/generateWalletM:
*   post:
*     tags:
*       - MATIC MANAGEMENT
*     description: Creating Docs for MATIC
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
routers.post('/generateWalletM',maticController.generateWalletM);
/**
* @swagger
* /matic/getBalanceM:
*   get:
*     tags:
*       - MATIC MANAGEMENT
*     description: Creating Docs for MATIC
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
routers.get('/getBalanceM',maticController.getBalanceM);
/**
* @swagger
* /matic/transferM:
*   post:
*     tags:
*       - MATIC MANAGEMENT
*     description: Creating Docs for MATIC
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
routers.post('/transferM',maticController.transferM);
/**
* @swagger
* /matic/withdrawM:
*   post:
*     tags:
*       - MATIC MANAGEMENT
*     description: Creating Docs for MATIC
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
routers.post('/withdrawM',maticController.withdrawM);

module.exports=routers 