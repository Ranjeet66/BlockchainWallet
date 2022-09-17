const axios = require("axios");
const bip39 = require("bip39");
const ethers = require("ethers");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common");
const Web3 = require("web3");

const RPCURL = "https://api.avax-test.network/ext/bc/C/rpc";

const web3 = new Web3(new Web3.providers.HttpProvider(RPCURL));


const getAvaxBalance = async (req, res) => {
  try {
    const bal = await web3.eth.getBalance(req.query.address);
    let balance = web3.utils.fromWei(bal);
    console.log('17 ==>', balance)
    return res.send({ responseCode: 200, responseMessage: "Balance fetched successfully.", responseResult: { balance: Number(balance) } });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
  }
}

const getAvaxBalance1 = async (address) => {
  try {
    const bal = await web3.eth.getBalance(address);
    let balance = web3.utils.fromWei(bal);
    return Number(balance);
  } catch (error) {
    console.log({
      Status: "Avax",
      Message: `Internal Server Error`,
      Error: `${error}`,
    });
    return "error";
  }
}

const preTransfer = async (senderAddress, amountToSend) => {
  const { fee } = await ethHelper();
  let balance = await getAvaxBalance1(senderAddress);

  if (balance - amountToSend - fee < 0) {
    console.log("insufficient funds", balance);
    return { status: false, message: "Low Balance" };
  } else {
    // console.log('Transfer Possible==>', balance);
    return { status: true, message: "Transfer Possible" };
  }
}

const ethHelper = async () => {
  let currentGasPrice = await getCurrentGasPrices();

  let gasPrice = currentGasPrice.high * 1000000000;

  let gasLimit = 21000;
  let fee = gasLimit * gasPrice;

  let txFee = Number(web3.utils.fromWei(fee.toString(), "ether"));

  return { fee: txFee, gasPrice: gasPrice };
}

const getCurrentGasPrices = async () => {
  let response = await axios.get(
    "https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0"
  );
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
  return prices;
}

const inComing = async (address) => {
  try {
    const response = await axios.get(
      `https://api-testnet.snowtrace.io/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=XRTMWRSS2HDNJ3KCXWZKSICX8PGXNEH8SZ`
    );
    let data = response.data.result;
    let matchedData = new Array();
    for (let i = 0; i < data.length; i++) {
      if (data[i].to.toLowerCase() == address.toLowerCase()) {
        data[i].type = "Incoming";
        data[i].value = Number(web3.utils.fromWei(data[i].value));
        matchedData.push(data[i]);
      } else if (data[i].from.toLowerCase() == address.toLowerCase()) {
        data[i].type = "Outgoing";
        data[i].value = Number(web3.utils.fromWei(data[i].value));
        matchedData.push(data[i]);
      }
    }
    return matchedData;
  } catch (error) {
    console.log(error.response);
    return [];
  }
}

const generateMnemonic = (req, res) => {
  try {
    let mnemonic = bip39.generateMnemonic();
    return res.send({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
  }
}

const generateAvaxWallet = (req, res) => {
  try {
    // m/1852'/1815'/0'
    const countValue = req.query.count ? req.query.count : 0;
    let path = `m/44'/60'/0'/0/${countValue}`;
    let secondMnemonicWallet = ethers.Wallet.fromMnemonic(req.query.mnemonic, path);
    let address = secondMnemonicWallet.address;
    let publicKey = secondMnemonicWallet.publicKey;
    let privateKey = secondMnemonicWallet.privateKey;
    // console.log(
    //   `address: ${address} \n privateKey: ${privateKey} \n publicKey: ${publicKey} \n `
    // );
    const obj = {
      address: address,
      publicKey: publicKey,
      privateKey: privateKey.substring(2),
    };
    console.log("Avax", obj);
    return res.send({ responseCode: 200, responseMessage: "Wallet generated successfully.", responseResult: obj });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
  }
}

const withdrawAVAX = async (req, res) => {
  try {
    var nonce = await web3.eth.getTransactionCount(req.body.senderAddress);
    const { gasPrice } = await ethHelper();

    const { status } = await preTransfer(req.body.senderAddress, req.body.amountToSend);
    if (status == false) {
      console.log({ status: status, message: "Low Balance" });
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
        name: "avax",
        networkId: "0xA869",
        chainId: "0xA869",
      },
      "petersburg"
    );
    const transaction = new EthereumTx(txObject, { common: common });
    let pvtKey = req.body.privateKey;
    if (pvtKey.startsWith('0x')) {
      pvtKey = pvtKey.slice(2);
    }
    let privKey = Buffer.from(pvtKey, "hex");
    transaction.sign(privKey);
    const serializedTransaction = transaction.serialize();
    const raw = "0x" + Buffer.from(serializedTransaction).toString("hex");
    console.log('171 ==>', raw)
    const signTransaction = await web3.eth.sendSignedTransaction(raw);
    console.log('177 ==>', signTransaction)
    // console.log({
    //   responseCode: 200,
    //   status: "Success",
    //   Hash: signTransaction.transactionHash,
    // });
    // return {
    //   status: true,
    //   Hash: signTransaction.transactionHash,
    //   message: "Success",
    // };
    return res.send({ responseCode: 200, responseMessage: "Withdraw Successful.", responseResult: signTransaction });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
  }
}

const transferAVAX = async (req, res) => {
  try {
    var nonce = await web3.eth.getTransactionCount(req.body.senderAddress);
    const { fee, gasPrice } = await ethHelper();
    let balance = await getAvaxBalance1(req.body.senderAddress) - fee;
    console.log('Transfer total balance =200=>', balance)
    const { status } = await preTransfer(req.body.senderAddress, balance);
    if (status == false) {
      console.log({ status: status, message: "Low Balance" });
    }

    let txObject = {
      to: req.body.recieverAddress,
      value: web3.utils.toHex(
        web3.utils.toWei(balance.toString(), "ether")
      ),
      gas: 21000,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const common = Common.default.forCustomChain(
      "mainnet",
      {
        name: "avax",
        networkId: "0xA869",
        chainId: "0xA869",
      },
      "petersburg"
    );
    const transaction = new EthereumTx(txObject, { common: common });
    let pvtKey = req.body.privateKey;
    if (pvtKey.startsWith('0x')) {
      pvtKey = pvtKey.slice(2);
    }
    let privKey = Buffer.from(pvtKey, "hex");
    transaction.sign(privKey);
    const serializedTransaction = transaction.serialize();
    const raw = "0x" + Buffer.from(serializedTransaction).toString("hex");
    console.log('171 ==>', raw)
    const signTransaction = await web3.eth.sendSignedTransaction(raw);
    console.log('177 ==>', signTransaction)
    // console.log({
    //   responseCode: 200,
    //   status: "Success",
    //   Hash: signTransaction.transactionHash,
    // });
    // return {
    //   status: true,
    //   Hash: signTransaction.transactionHash,
    //   message: "Success",
    // };
    return res.send({ responseCode: 200, responseMessage: "Transfer Successful.", responseResult: signTransaction });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
  }
}

const txListAVAX = async (req, res) => {
  try {
    let data = await inComing(req.body.address);
    const finalData = data.sort((a, b) =>
      a.timeStamp > b.timeStamp ? -1 : b.timeStamp > a.timeStamp ? 1 : 0
    );
    console.log("Final Data =", finalData)
    return res.send({ responseCode: 200, responseMessage: "Serialized transaction.", responseResult: finalData });
  } catch (error) {
    console.log()
    console.log()
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
  }
}

// generateMnemonic();
// getAvaxBalance('0xc46c23549cB32cD9708c15eF6986207c55F6C3ED')
// generateAvaxWallet("1","witness must beyond verb again guard cloud grunt squeeze drama win that");
// withdrawAVAX("0xc46c23549cB32cD9708c15eF6986207c55F6C3ED","5c5cc5dce23b99d4831eba4471007ea41ec1a35a87cdb72e0b5629abc1ffd660","0x03bC7e5f58FEfaB05a6D8178BeE33Ee3581443E8","1");
// txListAVAX("0xc46c23549cB32cD9708c15eF6986207c55F6C3ED");

module.exports = { generateMnemonic, getAvaxBalance, generateAvaxWallet, withdrawAVAX, transferAVAX, txListAVAX }
