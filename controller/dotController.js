const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Polkadot wallet libraries
const { mnemonicGenerate, mnemonicValidate } = require('@polkadot/util-crypto');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');

//Test network  wss://westend-rpc.polkadot.io
//Main Network  wss://rpc.polkadot.io
const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
const api = new ApiPromise({ provider: wsProvider });

//to signAndsend transaction
const getAccountInfo = (mnemonic) => {

    const account = keyring.addFromMnemonic(mnemonic);
    return account
}

//we are using keyring sr25519 to ecrypt and decrypt the address and public key
const keyring = new Keyring({ type: 'sr25519' });


let generateMnemonic = async (req, res) => {
    try {
        let generatedMnemonic = await mnemonicGenerate();
        return res.send({ responseCode: 200, resposenMessage: 'Mnemonic generated successfully.', responseResult: generatedMnemonic });
    } catch (error) {
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error });
    }
}

let generatePolkaAddress = async (req, res) => {
    try {
        if(!req.query.mnemonic){
            req.query.mnemonic = await mnemonicGenerate();
        }
        let privateKey = Buffer.from(req.query.mnemonic).toString('hex');
        const account = keyring.addFromMnemonic(req.query.mnemonic);
        return res.send({ responseCode: 200, resposenMessage: 'Wallet generated successfully.', responseResult: { address: account.address, privateKey: privateKey } });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error });
    }
}


let getBalance = async (req, res) => {
    try {
        const account1balance = await api.derive.balances.all(req.query.address);
        console.log('54 ==:>',account1balance)
        const availableBalance = (account1balance.availableBalance.toNumber()) / (10 ** api.registry.chainDecimals);
        return res.send({ responseCode: 200, resposenMessage: 'Wallet Balance.', responseResult: { balance: availableBalance } });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error.message });
    }
}

//checking network connection status
let connect = async (req, res) => {
    try {
        return res.send({ responseCode: 200, resposenMessage: `Network is connected: ${api.isConnected}`, responseResult: [] });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error.message });
    }
};

// decrypting address
let decryption = async (req, res) => {
    try {
        let address = req.body.address
        //decrypt address using sr25519
        const decryption = keyring.decodeAddress(address)
        // console.log("decryption", decryption);
        return res.send({ responseCode: 200, resposenMessage: `Decrypted wallet address`, responseResult: decryption });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error.message });
    }
};

// encrypting public key provide conversion of any address to polkadot address (1)
let encryption = async (req, res) => {
    try {
        let publicKey = JSON.parse(req.body.publicKey)
        //encrypt address using sr25519
        const encryption = keyring.encodeAddress(Uint8Array.from(publicKey), 0);
        return res.send({ responseCode: 200, resposenMessage: `Encrypted public key.`, responseResult: encryption });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error.message });
    }
};


//Create account using mnemonic , address type: Polka addresses start with 1
let getPolkaAddress = async (req, res) => {

    // adjust the default ss58Format for Polkadot
    keyring.setSS58Format(0);

    const mnemonic = mnemonicGenerate();
    //Creating account using ss58Format keyring start with 1
    const account = keyring.addFromMnemonic(mnemonic);

    res.send({ account, mnemonic });
};


//Create account using mnemonic , address type: Kusama addresses start with Capital letter
let getKusamaAddress = async (req, res) => {
    try {
        // adjust the default ss58Format for Polkadot
        keyring.setSS58Format(2);

        //Creating account using ss58Format keyring start with 1
        const account = keyring.addFromMnemonic(req.body.mnemonic);

        res.send({ account, account });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error.message });
    }
};




//Import seed to get account details
let importPrivateKey = async (req, res) => {

    let mnemonic = req.body.mnemonic

    if (mnemonic && mnemonicValidate(mnemonic)) {

        const account = getAccountInfo(mnemonic);
        res.send({ account });
    }
    else {
        res.send({ error: "Invalid Mnemonic" });
    }
};



//Initia transaction function 
//Polkadot testnet explorer  https://westend.subscan.io/

let withdraw = async (req, res) => {
    try {
        //senders seed
        const seeds = Buffer.from(req.body.privateKey,'hex').toString();

        //receivers address
        const address2 = req.body.recieverAddress

        // amount to be transfer
        const sendingAmount = req.body.amountToSend

        const decimal = 10 ** api.registry.chainDecimals

        //Get sender account info by passing seeds
        const account1 = getAccountInfo(seeds);
        const account1balance = await api.derive.balances.all(account1.address);

        //converting binary balance to decimal
        const availableBalance = account1balance.availableBalance / decimal

        //converting decimal amount to binary
        const amount = sendingAmount * decimal;

        // //transfering coin (WND) 
        const transfer = api.tx.balances.transfer(address2, amount);

        //Transaction fee calculation
        const { partialFee } = await transfer.paymentInfo(account1.address);
        const fees = partialFee.muln(110).divn(100);

        //sending amount + network fees 
        const totalAmount = (amount + parseFloat(fees) + parseFloat(api.consts.balances.existentialDeposit)) / decimal
        console.log('189 ==>',totalAmount,availableBalance,amount/decimal,Number(fees)/decimal,Number(partialFee)/decimal)
        // query sender balance
        if (totalAmount > availableBalance) {
            return res.send({ responseCode: 400, resposenMessage: `Cannot withdraw ${totalAmount} with ${availableBalance} left`, responseResult: [] });
        }
        else {
            //sign the transaction with sender's secret key

            const tx = await transfer.signAndSend(account1);
            return res.send({ responseCode: 200, resposenMessage: 'Withdraw successfully completed.', responseResult: { Hash: tx } });
        }
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error.message });
    }
};


let transfer = async (req, res) => {
    try {
        //senders seed
        const seeds = Buffer.from(req.body.privateKey,'hex').toString();

        //receivers address
        const address2 = req.body.recieverAddress

        const decimal = 10 ** api.registry.chainDecimals

        //Get sender account info by passing seeds
        const account1 = getAccountInfo(seeds);
        const account1balance = await api.derive.balances.all(account1.address);

        //converting binary balance to decimal
        let availableBalance = account1balance.availableBalance / decimal;

        //converting decimal amount to binary
        let amount = availableBalance * decimal;

        // //transfering coin (WND) 
        let transfer = api.tx.balances.transfer(address2, amount);

        //Transaction fee calculation
        const { partialFee } = await transfer.paymentInfo(account1.address);
        const fees = partialFee.muln(110).divn(100);

        //sending amount + network fees 
        const totalAmount = (amount + parseFloat(fees) + parseFloat(api.consts.balances.existentialDeposit)) / decimal;
        amount = amount - parseFloat(fees) - parseFloat(api.consts.balances.existentialDeposit);
        availableBalance = amount;
        if (amount < 0) {
            return res.send({ responseCode: 400, resposenMessage: `You don't have enough balance to pay transaction fees.`, responseResult: [] });
        }
        transfer = api.tx.balances.transfer(address2, amount);

        // query sender balance
        if (totalAmount > availableBalance) {
            return res.send({ responseCode: 400, resposenMessage: `Cannot transfer ${totalAmount} with ${availableBalance} left.`, responseResult: [] });
        }
        else {
            //sign the transaction with sender's secret key
            const tx = await transfer.signAndSend(account1);
            return res.send({ responseCode: 200, resposenMessage: 'Transfer successfully completed.', responseResult: { Hash: tx } });
        }
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: error.message });
    }
};

module.exports = { generateMnemonic, generatePolkaAddress, getBalance, connect, decryption, encryption, getPolkaAddress, getKusamaAddress, importPrivateKey, withdraw, transfer }