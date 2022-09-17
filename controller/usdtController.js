const Web3 = require('web3');
const { hdkey } = require("ethereumjs-wallet");
const bip39 = require('bip39')
var web3js = new Web3(new Web3.providers.HttpProvider('https://eth-rinkeby.alchemyapi.io/v2/uaOYfVWqoHB8pbOM1t0Mn6ycv9SddZP8'));
// const web3 = new Web3(new Web3.providers.HttpProvider("https://eth-ropsten.alchemyapi.io/v2/N2XCjoURDrc_zvFotTcERGOjExUwGRuu"));
const erc20tokenABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'
const addressFrom     = '0xC7916de797256bD89Cd1825166c4cDd9f84454a9'
const privKey         = '6acf2aa756af39334183c80101db64280bf5e5b0107017ae3d3b7a758df065ca'
const contractData = new web3js.eth.Contract(erc20tokenABI,contractAddress,{form:addressFrom});
let amount = web3js.utils.toHex(web3js.utils.toWei("0.1"));

const generateMnemonic =async (req,res) => {
    try {
        let mnemonic = await bip39.generateMnemonic();
		console.log(mnemonic);
        return res.send({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!!!", responseResult: `${error}` });
    }
}
const generateWallet =async (req,res) => {
    try {
      const seednew = bip39.mnemonicToSeedSync(req.query.mnemonic);
      let count
      let countvalue = count ? count : 0;
  
      let hdwallet = hdkey.fromMasterSeed(seednew);
      let path = `m/44'/60'/0'/0/${countvalue}`;
  
      let wallet = hdwallet.derivePath(path).getWallet();
      let address = "0x" + wallet.getAddress().toString("hex");
      let privateKey = wallet.getPrivateKey().toString("hex");
		console.log(`address : ${address} \n privateKey$ : ${privateKey}`);
      return res.send({ responseCode: 200, responseMessage: "Address generated successfully.", address: address, privateKey: privateKey.substring(2) });

    }
    catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!", error: error.message })
    }
  }
const getBalance=async (req,res)=>{
		try {
			
			let balance = await contractData.methods.balanceOf(req.body.address).call()
			console.log("	Balance :- ",balance);
			const etherValue =await  Web3.utils.fromWei(balance, "ether");
			console.log({ responseCode: 200, responseMessage: "your balance fetch successfully",responseResult:etherValue });
			return res.send({ responseCode: 200, responseMessage: "your balance fetch successfully", responseResult: etherValue })
		} catch (error) {
			console.log('error=====>',error.message);
			return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message })
		}
}
const transfer =async(req,res)=>{
	try {
		let data = await contractData.methods.transfer(req.body.recieverAddress,req.body.amount).encodeABI()
		console.log('414====>',data);
		let txObj = {
			gas: web3js.utils.toHex(100000),
			"to": contractAddress,
			"value":"",
			"data": data,
			"from": addressFrom
		}
		console.log('412====>',txObj);
		let signedTx = await web3js.eth.accounts.signTransaction(txObj, privKey) 
		if (signedTx) {
			let tData= await web3js.eth.sendSignedTransaction(signedTx.rawTransaction)
			if (tData) {
				return res.send({ responseCode: 200, responseMessage: "transfer successfully", responseResult: tData })
			}
		}	
	} catch (error) {
		console.log('error=====>',error);
		return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message })
	}
}
const approved =async(req,res)=>{
	try {
  
        var txParams = {
            gas: web3js.utils.toHex(210000),
            gasPrice: web3js.utils.toHex(17000000000),
            to: contractAddress
        };

        txParams.data = await contractData.methods.approve(req.body.spenderAddress,req.body.amount).encodeABI();

        var signedTx = await web3js.eth.accounts.signTransaction(txParams,privKey);
        let data =await web3js.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("\n Token spending approved. \n");
        txAlreadyApprove = true;
		if (data) {
		return res.send({ responseCode: 200, responseMessage: "approve successfully", responseResult: [] })
		}
		return true
	} catch (error) {
		console.log('error=====>',error);
		return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message })
	}
}
const allowances = async(req,res)=>{
	try {
		let approvalData =await contractData.methods.allowance(addressFrom,req.body.address).call()
		console.log(approvalData);
		if (approvalData) {
			return res.send({ responseCode: 200, responseMessage: "allowance fetch successfully", responseResult: approvalData })
		}
	} catch (error) {
		console.log('error=====>',error);
		return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message })
	}
}
const transferFrom=async(req,res)=>{
	try {
		
		const dataTransferFrom= await contractData.methods.transferFrom(addressFrom,req.body.receiverAddress,req.body.amount).encodeABI()
        
        let txObj = {
			to: contractAddress,
			gas: web3js.utils.toHex(210000),
            gasPrice: web3js.utils.toHex(17000000000),
			data: dataTransferFrom,
			// from: spender
		}
		let signedTx= await web3js.eth.accounts.signTransaction(txObj, req.body.spenderPrivateKey)
		if (signedTx) {
			let tData= await web3js.eth.sendSignedTransaction(signedTx.rawTransaction)
			if (tData) {
				return res.send({ responseCode: 200, responseMessage: "transferFrom successfully", responseResult: tData })
			}
		}	
	} catch (error) {
		console.log('error=====>',error)
		return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message })
	}
}
const tSupply= async (req,res)=>{
	try {
		const data = await contractData.method.totalSupply().call();
		console.log("Total Supply :- ",data);
		return res.send({ responseCode: 200, responseMessage: "total supply fetch successfully", responseResult: data })
	} catch (error) {
		console.log('error=====>',error)
		return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message })
	}
}

// getBalance()
// transferFrom()
// transfer()
// allowances()
// approved()
// tSupply()
// generateMnemonic()
// generateWallet()
module.exports = {generateMnemonic,generateWallet,getBalance,transfer,approved,allowances,transferFrom,tSupply}