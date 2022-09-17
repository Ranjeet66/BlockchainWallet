const routers =  require('express').Router();
const xrpController = require('../controller/xrpController')

/**
* @swagger
* /xrp/walletGenerate:
*   get:
*     tags:
*       - XRP MANAGEMENT
*     description: Creating Docs for XRP
*       - application/json
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.get('/walletGenerate',xrpController.walletGenerate);

module.exports= routers