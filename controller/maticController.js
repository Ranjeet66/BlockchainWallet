const { hdkey } = require("ethereumjs-wallet");
const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ethers = require('ethers');
 
 
const { privateToAddress, toBuffer } = require("ethereumjs-util");
 
const axios = require("axios");
// const INFURA_URL =
//   "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const INFURA_URL ="https://matic-mumbai.chainstacklabs.com";
// const TRX_URL = "https://mainnet.etherscan.io/tx";
 
//ETH Required
const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
 
const getCurrentGasPrices = async () => {
   let response = await axios.get(
       "https://ethgasstation.info/api/ethgasAPI.json?api-key=_Wv43tH8lpmmj5BZ6wnZlObFLCAdMxc4"
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
   const result = await axios.get(`https://ethgasstation.info/api/ethgasAPI.json?api-key=_Wv43tH8lpmmj5BZ6wnZlObFLCAdMxc4`); // Put this api-key in the service file
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
       const response = await axios.get(`https://mumbai.polygonscan.com/api?module=account&action=balance&address=${senderAddress}&tag=latest&apikey=F2M2JW7VTGWX7TX7MQ9K8YEIFC4EJSWZM3`
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
 
const generateMnemonicM = (req, res) => {
   try {
       let mnemonic = bip39.generateMnemonic();
       res.status(200).json({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
   } catch (error) {
       res.send({ responseMessage: "Something went wrong!!!", responseResult: `${error}` });
   }
}
 
const generateWalletM = (req, res) => {
   try {
       const seednew = bip39.mnemonicToSeedSync(req.query.mnemonic);
       let countvalue = req.query.count ? req.query.count : 0;
 
       let hdwallet = hdkey.fromMasterSeed(seednew);
       let path = `m/44'/60'/0'/0/${countvalue}`;
 
       let wallet = hdwallet.derivePath(path).getWallet();
       let address = "0x" + wallet.getAddress().toString("hex");
       let privateKey = wallet.getPrivateKey().toString("hex");
       console.log(address, privateKey);
 
       let totalwallet = [];
       let importWallet = [];
 
       // if (card && card.length > 0) {
       //   totalwallet = card;
       // }
 
       if (req.query.accountName === undefined || req.query.accountName === "") {
           req.query.accountName = `Account ${countvalue}`;
       }
       if (countvalue === 0) {
           req.query.accountName = `MaticMainAccount`;
       }
 
       totalwallet.push({
           address: address,
           privateKey: privateKey,
           balance: 0,
           accountName: req.query.accountName,
       });
       let Body = {};
       if (countvalue > 0) {
           Body = {
               count: parseInt(totalwallet.length) + parseInt(countvalue),
               name: "MATIC",
               totalwallet: totalwallet,
               importWallet: importWallet,
           };
       } else {
           Body = {
               count: 1,
               name: "MATIC",
               totalwallet: totalwallet,
               importWallet: importWallet,
           };
       }
       console.log("Body", Body);
       return res.status(200).json({ responseCode: 200, responseMessage: "Wallet generated successfully.", responseResult: Body });
   } catch (error) {
       res.send({ responseMessage: "Something went wrong!!!", responseResult: `${error}` });
   }
}
 
const getBalanceM = async (req, res) => {
   try {
       provider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com/');
       let userBalance = await provider.getBalance(req.query.address);
       userBalance = ethers.utils.formatEther(userBalance)
 
       return res.status(200).json({ responseCode: 200, responseMessage: "Balance fetched successfully.", responseResult: userBalance });
   } catch (error) {
       console.log('error ==>',error);
       return res.send({ responseMessage: "Something went wrong!!!", responseResult: `${error}` });
   }
 
}
 
const withdrawM = async (req, res) => {
   try {
       var nonce = await web3.eth.getTransactionCount(req.body.senderAddress);
 
       const { gasPrice } = await ethHelper(req.body.senderAddress, req.body.amountToSend);
       console.log("gass Price", gasPrice);
       const { status } = await preETHTransfer(req.body.senderAddress, req.body.amountToSend);
       if (status == false) {
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
       return res.status(200).json({ responseCode: 200, responseMessage: "Withdraw Successful.", responseResult: data });
   } catch (error) {
       console.log(error)
       return res.status(501).json({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult:error.message});
   }
}
 
const transferM = async (req,res) => {
   try {
       // if (!req.body.fromAddress || !req.body.fromPrivateKey || !req.body.toAddress) {
       //     return res.status(404).json({ Message: `Invalid payment details.` })
       // }
       // const node = await staticModel.findOne({ type: "node", status: "ACTIVE" })
       provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
       // console.log("Hello", req.body);
       let transferValidatorResponse = await transferValidator(req.body.senderAddress, req.body.recieverAddress, provider)   // returns the value subtracting tx fess(taking a buffer of 2%)
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
       return res.status(200).json({ responseCode: 200, responseMessage: "Transfer Successful", responseResult: transferEtherResponse });
   } catch (error) {
       console.log(error)
       return res.status(501).json({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
   }
}
 
// generateMnemonic();
// generateETHWallet();
// getBalance("0xc46c23549cB32cD9708c15eF6986207c55F6C3ED");
// withdraw("0xc46c23549cB32cD9708c15eF6986207c55F6C3ED", "5c5cc5dce23b99d4831eba4471007ea41ec1a35a87cdb72e0b5629abc1ffd660", "0x03bC7e5f58FEfaB05a6D8178BeE33Ee3581443E8", "0.1");
// SendETH("0xf86c1685089d5f32008252089403bc7e5f58fefab05a6d8178bee33ee3581443e888016345785d8a0000802aa0339566391f8d56a70f2018adf050a73f6314c3a41f0eae34f337c4cadb352158a0034553f6742f695e7c7934e1b3e47083170a4304b3a6f27502b64d50ce6b7f13");
// transfer("0xc46c23549cB32cD9708c15eF6986207c55F6C3ED", "5c5cc5dce23b99d4831eba4471007ea41ec1a35a87cdb72e0b5629abc1ffd660", "0x03bC7e5f58FEfaB05a6D8178BeE33Ee3581443E8");
 
// let getBalanceRequest = {
//     'query': {
//         address: '0x70aD2db5469244Ae66729cAf2445D88DB5591837'
//     }
// };
// getBalance(getBalanceRequest);
 
module.exports = { generateMnemonicM, generateWalletM, getBalanceM, withdrawM, transferM }
 

