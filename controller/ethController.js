const { hdkey } = require("ethereumjs-wallet");
const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ethers = require('ethers');


const { privateToAddress, toBuffer } = require("ethereumjs-util");

const axios = require("axios");
// const INFURA_URL =
//   "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const INFURA_URL =
    "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
// const TRX_URL = "https://mainnet.etherscan.io/tx";

//ETH Required
const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

const getCurrentGasPrices = async () => {
    let response = await axios.get(
        "https://ethgasstation.info/api/ethgasAPI.json?api-key=U2QZ11Z29MQZFNAME5CSNYAB4ZP2TJVSF7"
        // "https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0"
    );
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10,
    };
    console.log("prices", prices);
    return prices;
}

const transferValidator = async (fromAddress, toAddress, provider) => {
    const userBalance = await provider.getBalance(fromAddress);
    var gasPrice = await fetchGasStationPrice();
    const { txFee, gasAmount } = await transactionFees(fromAddress, toAddress, '0x00', gasPrice, provider) // Calculates tx Fees for sending ether to User
    console.log('status', userBalance.gte(txFee));

    return { status: userBalance.gte(txFee), value: userBalance.add(txFee), gasPrice: gasPrice, gasAmount: gasAmount, requiredAmount: userBalance.sub(txFee) }
}

const fetchGasStationPrice = async () => {
    const result = await axios.get(`https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0`); // Put this api-key in the service file
    let fast = (result.data.fast) / 10 // Using `fast` as default, dividing by 10 to get in Gwei
    fast = Math.round(fast) // Error for Decimals, round it 
    console.log(`Current Gas Price ${fast} Gwei`);
    return ethers.utils.parseUnits(fast.toString(), "gwei") // Calculate and send in gwei amount
}

const transactionFees = async (fromAddress, toAddress, data, gasPrice, provider) => {
    try {
        const gasAmount = await provider.estimateGas({
            to: toAddress,
            from: fromAddress,
            data: data,
        });

        var txFee = gasPrice.mul(gasAmount);

        return { txFee, gasAmount }

    } catch (error) {
        console.log('transactionFees Error', error);
        return
    }
}

const transferEther = async (fromPrivKey, toAddress, valueToSend, gasPrice, gasAmount, provider) => {
    try {
        const wallet = new ethers.Wallet(fromPrivKey)
        const providerWallet = wallet.connect(provider)
        const txObject = {
            to: toAddress,
            gasLimit: gasAmount, // Safe Limit is 21000 
            gasPrice: gasPrice,
            value: valueToSend,
        }
        console.log(txObject);
        providerWallet.signTransaction(txObject)
        const txHash = await providerWallet.sendTransaction(txObject)
        await txHash.wait()
        console.log("success");
        return { message: 'Transfer Success', hash: txHash.hash, status: true }
    } catch (error) {
        console.log(`Transfer Ether to ${toAddress} Failed`, error);
        return { message: `Transfer Ether to ${toAddress} Failed`, code: error.code, status: false }
    }
}

const accountETHBalance = async (senderAddress) => {
    try {
        const response = await axios.get(
            `https://api-ropsten.etherscan.io/api?module=account&action=balance&address=${senderAddress}&tag=latest&apikey=4XQJNGAFASQ8V9TSISGP9B6TD7VYKG9IW8`
            //   `https://api.etherscan.io/api?module=account&action=balance&address=${senderAddress}&tag=latest&apikey=U2QZ11Z29MQZFNAME5CSNYAB4ZP2TJVSF7`
        );
        let balance = web3.utils.fromWei(response.data.result, "ether");
        return Number(balance);
    } catch (error) {
        console.log("accountETHBalance error", error);
        return Number(0);
    }
}

const preETHTransfer = async (senderAddress, amountToSend) => {
    const { fee } = await ethHelper();
    let balance = await accountETHBalance(senderAddress);

    if (balance - amountToSend - fee < 0) {
        console.log("insufficient funds", balance);
        return { status: false, message: "Low Balance" };
    } else {
        console.log("Transfer Possible==>", balance);
        return { status: true, message: "Transfer Possible" };
    }
}

const ethHelper = async () => {
    let currentGasPrice = await getCurrentGasPrices();

    let gasPrice = currentGasPrice.high * 1000000000;
    console.log(currentGasPrice)
    let gasLimit = 21000;
    let fee = gasLimit * gasPrice;

    let txFee = Number(web3.utils.fromWei(fee.toString(), "ether"));

    return { fee: txFee, gasPrice: gasPrice };
}

const generateEthMnemonic =async (req, res) => {
    try {
        let mnemonic = await bip39.generateMnemonic();
        return res.send({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
    } catch (error) {
        // console.log(error)
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
    }
}

const generateETHWallet = (req, res) => {
    try {
      const seednew = bip39.mnemonicToSeedSync(req.query.mnemonic);
      let count
      let countvalue = count ? count : 0;
  
      let hdwallet = hdkey.fromMasterSeed(seednew);
      let path = `m/44'/60'/0'/0/${countvalue}`;
  
      let wallet = hdwallet.derivePath(path).getWallet();
      let address = "0x" + wallet.getAddress().toString("hex");
      let privateKey = wallet.getPrivateKey().toString("hex");
  
      return res.send({ responseCode: 200, responseMessage: "Address generated successfully.", address: address, privateKey: privateKey.substring(2) });
  
    //   const obj = {
    //     'address': address,
    //     'privateKey': privateKey.substring(2)
    //   }
  
    }
    catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!", error: error.message })
    }
  }
  
const getEthBalance = async (req, res) => {
    try {
        provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
        let userBalance = await provider.getBalance(req.query.address);
        userBalance = ethers.utils.formatEther(userBalance)

        return res.send({ responseCode: 200, responseMessage: "Balance fetched successfully.", responseResult: userBalance });
    } catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
    }

}

const transferEth = async (req, res) => {
    try {
        // var nonce = await web3.eth.getTransactionCount(req.body.senderAddress);
        // if (!req.body.fromAddress || !req.body.fromPrivateKey || !req.body.toAddress) {
        //     return res.status(404).json({ Message: `Invalid payment details.` })
        // }
        // const node = await staticModel.findOne({ type: "node", status: "ACTIVE" })
        provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
        
        let transferValidatorResponse = await transferValidator(req.body.senderAddress, req.body.recieverAddress,provider)   // returns the value subtracting tx fess(taking a buffer of 2%)
        // Should return TRUE, calculates user tx fees for the whole process
        if (transferValidatorResponse.status == false) {
            return res.status(404).json({
                responseCode:404,
                responseMessage: `Insufficient funds.`,
                responseResult:{TxCost: Number(ethers.utils.formatEther(transferValidatorResponse.value))}
            })
        }
        const transferEtherResponse = await transferEther(req.body.privateKey, req.body.recieverAddress, transferValidatorResponse.requiredAmount, transferValidatorResponse.gasPrice, transferValidatorResponse.gasAmount, provider)
        if (transferEtherResponse.status == false) {
            return res.status(404).json({
                responseCode:404,
                responseMessage: transferEtherResponse.message,
                responseResult: transferEtherResponse,
            })
        }
        return res.send({ responseCode: 200, responseMessage: "Transfer Successful", responseResult: transferEtherResponse });
    } catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
    }
}

const ethWithdraw = async (req, res) => {
    try {
        var nonce = await web3.eth.getTransactionCount(req.body.senderAddress);

        const { gasPrice } = await ethHelper();
        console.log("gass Price", gasPrice);
        const { status } = await preETHTransfer(req.body.senderAddress, req.body.amountToSend);
        if (status == false) {
            console.log({ status: status, message: "Low Balance" });
            return res.status(404).json({ responseCode: 404, responseMessage: "Low Balance.", responseResult: [] });
        }

        let txObject = {
            to: req.body.recieverAddress,
            value: web3.utils.toHex(
                web3.utils.toWei(req.body.amountToSend.toString(), "ether")
            ),
            gasLimit: 21000,
            gasPrice: gasPrice,
            nonce: nonce,
            // "chainId": 3 // EIP 155 chainId - mainnet: 1, rinkeby: 4
        };

        const transaction = new EthereumTx(txObject, { chain: "ropsten" });

        let privKey = Buffer.from(req.body.privateKey, "hex");
        transaction.sign(privKey);

        let serializedTransaction = transaction.serialize();
        serializedTransaction = `0x${serializedTransaction.toString("hex")}`;
        let data = await web3.eth.sendSignedTransaction(serializedTransaction);
        return res.send({ responseCode: 200, responseMessage: "Withdraw Successful.", responseResult: data });
    } catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
    }
}
const allTransaction=async(req,res)=>{
    try {
        // let data = await web3.infura.getTransactionCount({
        //     fromBlock: "0x0",
        //     fromAddress: req.body.addressFetch,
        //   })
        // let data2 = await web3.eth.filter({
        // address: req.body.addressFetch,
        // from: 1,
        // to: 'latest'
        // }).get()
        // return res.send({ responseCode: 200, responseMessage: "transaction fetch Successful.", responseResult: data2 });

        let data = await web3.eth.getTransactionCount(req.body.addressFetch).then(console.log);
          if(data){
                return res.send({ responseCode: 200, responseMessage: "transaction fetch Successful.", responseResult: data });
          }
          web3.eth.getBlock(2).then(console.log);
    } catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
        
    }
}   
 
// generateMnemonic();
// generateETHWallet();
// getBalance('0xbB4e5e40AA9031947B579D6942c6A13e3FD03776');
// withdraw('0x2EdaF3E43642FD28966Cc3D615c4664cd61373E9','3672a434300cb646074b4e91152fd946cd57173e16e85f2db62dee653ffc0b0e','0x20e7d69D7dC4E05da51cD9eaa510C80Eb7CD3E7b','2');
// transfer('0x2EdaF3E43642FD28966Cc3D615c4664cd61373E9','3672a434300cb646074b4e91152fd946cd57173e16e85f2db62dee653ffc0b0e','0xbB4e5e40AA9031947B579D6942c6A13e3FD03776');
 
module.exports = { generateEthMnemonic, generateETHWallet, getEthBalance, transferEth, ethWithdraw ,allTransaction}
