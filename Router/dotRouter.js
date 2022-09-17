const routers =  require('express').Router();
const dotController = require('../controller/dotController')

/**
* @swagger
* /dot/generateMnemonic:
*   get:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/generateMnemonic',dotController.generateMnemonic);
/**
* @swagger
* /dot/generatePolkaAddress:
*   post:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
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
routers.post('/generatePolkaAddress',dotController.generatePolkaAddress);
/**
* @swagger
* /dot/getBalance:
*   get:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
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
routers.get('/getBalance',dotController.getBalance);
/**
* @swagger
* /dot/connect:
*   post:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
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
routers.post('/connect',dotController.connect);
/**
* @swagger
* /dot/decryption:
*   get:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
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
routers.get('/decryption',dotController.decryption);
/**
* @swagger
* /dot/encryption:
*   get:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
*     produces:
*       - application/json
*     parameters:
*       - name: publicKey
*         description: publicKey is required.
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
routers.get('/encryption',dotController.encryption);
/**
* @swagger
* /dot/getKusamaAddress:
*   post:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
*     produces:
*       - application/json
*     parameters:
*       - name: mnemonic
*         description: mnemonic is required.
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
routers.get('/getKusamaAddress',dotController.getKusamaAddress);
/**
* @swagger
* /dot/getPolkaAddress:
*   get:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/  
routers.get('/getPolkaAddress',dotController.getPolkaAddress);
/**
* @swagger
* /dot/importPrivateKey:
*   get:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
*       - application/json
*     parameters:
*       - name: mnemonic
*         description: mnemonic is required.
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
routers.get('/importPrivateKey',dotController.importPrivateKey);
/**
* @swagger
* /dot/transfer:
*   post:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
*     produces:
*       - application/json
*     parameters:
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
routers.post('/transfer',dotController.transfer);
/**
* @swagger
* /dot/withdraw:
*   post:
*     tags:
*       - DOT MANAGEMENT
*     description: Creating Docs for DOT
*     produces:
*       - application/json
*     parameters:
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
routers.post('/withdraw',dotController.withdraw);

module.exports=routers 