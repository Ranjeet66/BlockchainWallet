const bodyParser = require('body-parser');
const express = require('express');
const app= express();
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const PORT = 8000;
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use('/eth',require('./Router/ethRouter'))
app.use('/avax',require('./Router/avaxRouter'))
app.use('/btc',require('./Router/btcRouter'))
app.use('/bnb',require('./Router/bnbRouter'))
app.use('/sol',require('./Router/solRouter'))
app.use('/matic',require('./Router/maticRouter'))
app.use('/dot',require('./Router/dotRouter'))
app.use('/xrp',require('./Router/xrpRouter'))
app.use('/usdt',require('./Router/usdtRouter'))

const swaggerDefinition = {
    info: {
      title: "compliance-node",
      version: "1.0.0",
      description: "Swagger API Docs",
    },
    host: `172.16.1.131:${8000}`,
    basePath: "/",
};
   const options = {
    swaggerDefinition: swaggerDefinition,
    apis: ["./Router/*.js"],
};
   const swaggerSpec = swaggerJSDoc(options);
   app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});
    
   /** Server Listen **/
   app.use("/api-docs-ranjeetSingh", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT,(err,res)=>{
    if (err) {
        console.log('Internal server error',err);
    } else {
        console.log('Server is running on',PORT);
    }
});