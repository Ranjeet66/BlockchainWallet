const routers =  require('express').Router();
const avaxController = require('../controller/avaxController')

/**
* @swagger
* /avax/generateMnemonic:
*   get:
*     tags:
*       - AVAX MANAGEMENT
*     description: Creating Docs for AVAX
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/generateMnemonic',avaxController.generateMnemonic);
/**
* @swagger
* /avax/getAvaxBalance:
*   get:
*     tags:
*       - AVAX MANAGEMENT
*     description: Creating Docs for AVAX
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
routers.get('/getAvaxBalance',avaxController.getAvaxBalance);
/**
* @swagger
* /avax/generateAvaxWallet:
*   post:
*     tags:
*       - AVAX MANAGEMENT
*     description: Creating Docs for AVAX
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
routers.post('/generateAvaxWallet',avaxController.generateAvaxWallet);
/**
* @swagger
* /avax/withdrawAVAX:
*   post:
*     tags:
*       - AVAX MANAGEMENT
*     description: Creating Docs for AVAX
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
routers.post('/withdrawAVAX',avaxController.withdrawAVAX);
/**
* @swagger
* /avax/transferAVAX:
*   post:
*     tags:
*       - AVAX MANAGEMENT
*     description: Creating Docs for AVAX
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
routers.post('/transferAVAX',avaxController.transferAVAX);
/**
* @swagger
* /avax/txListAVAX:
*   get:
*     tags:
*       - AVAX MANAGEMENT
*     description: Creating Docs for AVAX
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
routers.get('/txListAVAX',avaxController.txListAVAX);

module.exports=routers 