const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require('tiny-secp256k1')
const axios = require("axios");
const bitcore = require("bitcore-lib");

const baseURL = `https://sochain.com/api/v2/`;
const sochain_network = "BTC";
// const sochain_network = "BTCTEST";
const satoshisPerByte = 20;

//accountBalance


const preBTCTransfer = async (senderAddress, amountToSend) => {
  try {
    const { fee, totalAmountAvailable, satoshiToSend } = await btcTxHelper(
      senderAddress,
      amountToSend
    );
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      // throw new Error("Balance is too low for this transaction");
      console.log("false");
      return { status: false, message: "Low Balance" };
    }
    console.log("true");
    return { status: true, message: "Transfer Possible" };
  } catch (error) {
    alert("Wallet address is wrong.");
  }
}

const btcTxHelper = async (senderAddress, amountToSend) => {
  const satoshiToSend = amountToSend * 100000000;

  // Fetching UTXOs
  const utxos = await axios.get(
    `${baseURL}get_tx_unspent/${sochain_network}/${senderAddress}`
  );

  // console.log(utxos)

  let fee = 0;
  let inputCount = 0;
  let outputCount = 2;
  let totalAmountAvailable = 0;
  let inputs = [];

  utxos.data.data.txs.forEach(async (element) => {
    let utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = utxos.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
  });

  const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
  // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte

  fee = transactionSize * satoshisPerByte;

  return {
    fee: fee,
    totalAmountAvailable: totalAmountAvailable,
    satoshiToSend: satoshiToSend,
    inputs: inputs,
  };
}

const BTCSendApi = async (req, res) => {
  console.log("serializedTransaction=======>", req.body.serializedTransaction);
  // Send transaction
  try {
    const result = await axios({
      method: "POST",
      url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
      data: {
        tx_hex: req.body.serializedTransaction,
      },
    });
    console.log("TxHash => ", result.data.data);
    return res.send({ responseCode: 200, responseMessage: "Transfer successfully completed.", responseResult: result.data.data });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
  }
}

const importBTCWallet = (privatekey, accountName) => {
  try {
    const privateKey = privatekey.toString();
    var keyPair = bitcoin.ECPair.fromPrivateKey(
      Buffer.from(privateKey, "hex"),
      bitcoin.networks.bitcoin
    );

    let { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });
    console.log(address);
    alert("Private Key Imported successfully ");
    if (accountName === undefined || accountName === "") {
      accountName = `Account`;
    }
    let obj = {
      privateKey: privateKey,
      address: address,
      balance: 0,
      accountName: accountName,
    };
    return obj;
  } catch (error) {
    alert("Invalid Private Key");
  }
}

const getMarketBTCValue = (req,res) => {
  // generateMnemonic
  return axios(
    "https://min-api.cryptocompare.com/data/price?fsym=" + "BTC" + "&tsyms=USD"
  )
    .then((response) => response.data)
    .then((json) => {
      // setUSDBTCPrice(json.USD);
      return res.send({ responseCode: 200, responseMessage: "Prices listed successfully.", responseResult: json });
    })
    .catch((error) => {
      // generateMnemonic
      console.error('136 ==>',error);
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
    });
}
let marketpriceURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=27&page=1&sparkline=false&price_change_percentage=1h%2C%2024h";

const getGlobleMarketBTCPrice = (req, res) => {
  return axios(marketpriceURL)
    .then((response) => response.data)
    .then((json) => {
      console.log("getGlobleMarketBNBPrice", json);
      let newArray = json.filter(
        (item) =>
          item.id === "bitcoin" ||
          item.id === "ethereum" ||
          item.id === "binancecoin" ||
          item.id === "tron"
      );
      // console.log("New Data BNB=======>>>>", newArray);
      return res.send({ responseCode: 200, responseMessage: "Prices listed successfully.", responseResult: newArray });
      return newArray;
    })
    .catch((error) => {
      // console.error(error);
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
      return 0;
    });
}

const generateBTCMnemonic = (req, res) => {
  try {
    let mnemonic = bip39.generateMnemonic();
    res.send({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
  } catch (error) {
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
  }
}

const generateBTCWallet = (req, res) => {
  try {
    const seednew = bip39.mnemonicToSeedSync(req.body.mnemonic);
    // console.log("bip32",bip32.BIP32Factory(ecc).fromSeed(seednew));
    let root = bip32.BIP32Factory(ecc).fromSeed(seednew);

    // Derivation path
    const path = `m/84'/0'/0'/0/${req.body.count}`; //mainnet
    let child = root.derivePath(path);
    let address = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.bitcoin,
    }).address;

    const privateKey = child.privateKey.toString("hex");
    res.send({ responseCode: 200, responseMessage: "Account Created successfully.", responseResult: { Address: address, PrivateKey: privateKey } });
    // return { address, privateKey };
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
  }

}

const BTCBalance = async (req, res) => {
  try {
    const wallet = await axios.get(
      `${baseURL}get_address_balance/${sochain_network}/${req.query.address}`
    );
    // console.log("walletwallet", wallet);
    const accountBalance = wallet.data.data.confirmed_balance;
    console.log("accountBalance", accountBalance);
    return res.send({ responseCode: 200, responseMessage: "Balance fetched successfully.", responseResult: Number(accountBalance) });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
  }
}

const withdrawBTC = async (req, res) => {
  try {
    console.log(
      "senderAddress, privateKey, recieverAddress, amountToSend",
      req.body.senderAddress,
      req.body.privateKey,
      req.body.recieverAddress,
      req.body.amountToSend
    );

    const { fee, totalAmountAvailable, satoshiToSend, inputs } =
      await btcTxHelper(req.body.senderAddress, req.body.amountToSend);

    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      // throw new Error("Balance is too low for this transaction");
      return res.send({ responseCode: 400, responseMessage: "Low Balance.", responseResult: [] });
    }

    const transaction = new bitcore.Transaction();

    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    transaction.to(req.body.recieverAddress, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(req.body.senderAddress);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(fee * satoshisPerByte);

    // Sign transaction with your private key
    transaction.sign(req.body.privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();

    console.log("serializedTransaction", serializedTransaction);
    console.log("===> serializedTransaction:", serializedTransaction)
    return res.send({ responseCode: 200, responseMessage: "Serialized transaction.", responseResult: serializedTransaction });
  } catch (error) {
    console.log(error)
    res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: error.message });
  }
}

// generateMnemonic();
// generateBTCWallet("1","potato inflict wrap brush erase school hospital ice sauce field fury cannon");
// getBTCBalance("bc1qj8jcnne4z5pdvnqgf4l0eeghz5nswnzs0fjpu0");
// transferBTC("bc1qj8jcnne4z5pdvnqgf4l0eeghz5nswnzs0fjpu0","d181f668f0bc5bdd5c01b9c8e740b47fab8bc54770eaf754a3f2f136139e4074","tb1q0flgfrltccxwl35g9vednsgv7a2d7tz283e4xd","0.01");
// BTCSendApi();

module.exports = { generateBTCMnemonic, generateBTCWallet, BTCBalance, withdrawBTC, BTCSendApi, getGlobleMarketBTCPrice,getMarketBTCValue }