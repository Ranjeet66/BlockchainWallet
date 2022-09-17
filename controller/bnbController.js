const axios = require('axios')
const bip39 = require('bip39')
const BNB_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');
const { hdkey } = require('ethereumjs-wallet');

var web3 = new Web3(new Web3.providers.HttpProvider(BNB_URL));

const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0');
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    };
    return prices;

    // const gas = await web3.eth.getGasPrice().then(console.log);
}

const EthHelper = async () => {
    let currentGasPrice = await getCurrentGasPrices();

    let gasPrice = currentGasPrice.high * 1000000000

    let gasLimit = 21000;
    let fee = gasLimit * gasPrice;

    let txFee = Number(web3.utils.fromWei(fee.toString(), "ether"));


    return { fee: txFee, gasPrice: gasPrice }
}

const accountBalance = async (senderAddress) => {

    const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=balance&address=${senderAddress}&apikey=GQWQPRVJXUI35NTS2VK4J8KEMZCRXJAI4S`)
    console.log(response.data.result);
    let balance = web3.utils.fromWei(response.data.result, "ether");
    return Number(balance)



}

const preTransfer = async (senderAddress, amountToSend) => {

    const { fee } = await EthHelper()
    let balance = await accountBalance(senderAddress)

    if (balance - amountToSend - fee < 0) {
        console.log('insufficient funds', balance);
        return { status: false, message: 'Low Balance',balance:balance }
    } else {
        return { status: true, message: 'Transfer Possible' }

    }

}

const generateMnemonic =async (req, res) => {
    try {
        let mnemonic = bip39.generateMnemonic();
        return res.send({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
    } catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
    }
}

const generateWallet =async (req, res) => {
    try {
        const seed = bip39.mnemonicToSeedSync(req.query.mnemonic)

        let hdwallet = hdkey.fromMasterSeed(seed);
        let countvalue = req.query.count ? req.query.count : 0;
        let path = `m/44'/60'/0'/0/${countvalue}`;

        let wallet = hdwallet.derivePath(path).getWallet();
        let address = "0x" + wallet.getAddress().toString("hex");
        let privateKey = wallet.getPrivateKey().toString("hex");
        return res.send({ responseCode: 200, responseMessage: "Account Created successfully.", responseResult: { address: address, privateKey: privateKey } });
        // return { address, privateKey };
    } catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
    }

}

const getBalance = async (req, res) => {
    try {
        const response = await web3.eth.getBalance(req.query.address);
        let balance = web3.utils.fromWei(response, "ether")
        return res.send({ responseCode: 200, responseMessage: "Balance fetched successfully.", responseResult: { balance: Number(balance) } });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
    }

}

const transfer = async (req, res) => {
    try {
        var nonce = await web3.eth.getTransactionCount(req.body.senderAddress);
        const { fee, gasPrice } = await EthHelper()
        let balance = await accountBalance(req.body.senderAddress)
        let amountToSend = balance - fee;
        if (amountToSend > 0) {
            let txObject = {
                "to": req.body.recieverAddress,
                "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                "gas": 21000,
                "gasPrice": gasPrice,
                "nonce": nonce,
            };
            const common = Common.default.forCustomChain(
                'mainnet', {
                name: 'bnb',
                networkId: '0x61',
                chainId: '0x61',
            },
                "petersburg",
            );
            const transaction = new EthereumTx(txObject, { common: common });
            let privKey = Buffer.from(req.body.privateKey, 'hex');
            transaction.sign(privKey);
            const serializedTransaction = transaction.serialize();
            const signTransaction = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
            // console.log(signTransaction.transactionHash);
            return res.send({ responseCode: 200, Status: "Success", Hash: signTransaction.transactionHash,responseResult: signTransaction });
            // return res.send({ responseCode: 200, Status: "Transfer Successful", responseResult: signTransaction });
        } else {
            // console.log({ status: true, message: 'Transfer Possible' });
            return res.send({ status: true, message: 'Transfer Possible' });
        }
    } catch (error) {
        // console.log({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error })
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}

const bnbWithdraw = async (req, res) => {
    try {
        var nonce = await web3.eth.getTransactionCount(req.body.senderAddress);
        const { gasPrice } = await EthHelper();

        const { status } = await preTransfer(req.body.senderAddress, req.body.amountToSend);
        if (status == false) {
            // console.log({ status: status, message: "Low Balance" });
            return res.send({ responseCode: 404, responseMessage: "Low balance.", responseResult: [] });
        }

        let txObject = {
            to: req.body.recieverAddress,
            value: web3.utils.toHex(
                web3.utils.toWei(req.body.amountToSend.toString(), "ether")
            ),
            gas: 21000,
            gasPrice: gasPrice,
            nonce: nonce,
        };
        
        const common = Common.default.forCustomChain(
            "mainnet",
            {
                name: "bnb",
                networkId: "0x61",
                chainId: "0x61",
            },
            "petersburg"
        );
        const transaction = new EthereumTx(txObject, { common: common });
        let privKey = Buffer.from(req.body.privateKey, "hex");
        transaction.sign(privKey);
        const serializedTransaction = transaction.serialize();
        const raw = "0x" + Buffer.from(serializedTransaction).toString("hex");
        const signTransaction = await web3.eth.sendSignedTransaction(raw);
        return res.send({responseCode: 200,Status: "Success",Hash: signTransaction.transactionHash,signTransaction});
        // return res.send({ responseCode: 200, responseMessage: "Withdraw successful.", responseResult: signTransaction });
        // return {
        //     Status: true,
        //     Hash: signTransaction.transactionHash,
        //     message: "Success",
        // };
    } catch (error) {
        // console.log(error)
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
    }
}



// generateMnemonic();
// let walletRequest = {
//     body:{
//         count:1,
//         mnemonic:'hospital pigeon weekend identify napkin digital shadow immense bulk behind venue kind'
//     }
// }
// // generateWallet(walletRequest);
// let balanceRequest = {
//     body:{
//         address:'0x06384e75098db76bc8b4504b3fd07c9babba6196'
//     }
// }
// getBalance(balanceRequest);
// transfer("0x03bC7e5f58FEfaB05a6D8178BeE33Ee3581443E8", "e1e172e159a124a9530a944b0992c39d87807c176445e0772aa5e11d4bff1d72", "0xc46c23549cB32cD9708c15eF6986207c55F6C3ED");
// bnbWithdraw("0xc46c23549cB32cD9708c15eF6986207c55F6C3ED", "5c5cc5dce23b99d4831eba4471007ea41ec1a35a87cdb72e0b5629abc1ffd660", "0x03bC7e5f58FEfaB05a6D8178BeE33Ee3581443E8", "0.5");


module.exports = { generateMnemonic, generateWallet, getBalance, transfer, bnbWithdraw }