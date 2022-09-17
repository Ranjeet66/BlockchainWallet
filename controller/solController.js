const web3 = require('@solana/web3.js')
const connection = new web3.Connection("https://api.testnet.solana.com", "confirmed");
const LAMPORTS_PER_SOL = web3.LAMPORTS_PER_SOL;

const publicKeyFromString = (publicKeyString) => {
    return new web3.PublicKey(publicKeyString);
};
const createConnection = () => {
    return new web3.Connection(web3.clusterApiUrl("testnet"));
};

const airdrop = async (req, res) => {
    try {
        const myAddress = new web3.PublicKey(req.body.address);
        var airdropSignature = await connection.requestAirdrop(
            myAddress,
            web3.LAMPORTS_PER_SOL,
        );
        //wait for airdrop confirmation
        await connection.confirmTransaction(airdropSignature);
        let account = await connection.getAccountInfo(myAddress);
        // console.log("====>account=====>", (account));
        return res.send({ responseCode: 200, resposenMessage: 'Airdrop successful.', responseResult: { account: account } });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: `${error}` });
    }
}

const walletGenerate = async (req, res) => {
    try {
        // let privateKey = [];
        const wallet = web3.Keypair.generate();
        // console.log('34 ==>', Buffer.from(wallet.secretKey).toString('hex'))
        // privateKey.push(wallet.secretKey.toString());
        let privateKey = Buffer.from(wallet.secretKey).toString('hex');
        return res.send({
            responseCode: 200, resposenMessage: 'Wallet generated successfully.', responseResult: {
                address: (wallet.publicKey.toString()),
                privateKey: privateKey
            }
        });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: `${error}` });
    }
}

const getBalance = async (req, res) => {
    try {
        const myAddress = new web3.PublicKey(req.query.address);
        
        let account = await connection.getAccountInfo(myAddress);
        
        if (!account) {
            return res.send({ responseCode: 404, resposenMessage: 'Balance not fetched.', responseResult: [] });
        }
        return res.send({ responseCode: 200, resposenMessage: 'Balance fetched successfully.', responseResult: { balance: (account.lamports / web3.LAMPORTS_PER_SOL) } });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: `${error}` });
    }
}

const getBalanceForTransfer = async (address) => {
    try {
        const myAddress = new web3.PublicKey(address);
        let account = await connection.getAccountInfo(myAddress);
        if (!account) {
            return { status: false, error: 'Balance not fetched.' };
        }
        return { status: true, balance: (account.lamports / web3.LAMPORTS_PER_SOL) };
    } catch (error) {
        console.log(error)
        return { status: false, error: `${error}` };
    }
}

const transfer = async (req, res) => {
    try {
        req.body.privateKey = new Uint16Array(Buffer.from(req.body.privateKey,'hex'));
        let fromAddress = new web3.PublicKey(req.body.senderAddress);
        let toAddress = new web3.PublicKey(req.body.recieverAddress);
        const fromPrivateKey = Uint8Array.from(req.body.privateKey);
        const from = web3.Keypair.fromSecretKey(fromPrivateKey);
        let data = await getBalanceForTransfer(req.body.senderAddress);
        console.log('Data ===>', data);
        let fee= (Number(data.balance)* LAMPORTS_PER_SOL)*0.0004/100;
        console.log("LAMPORTS_PER_SOL ==>", Number(data.balance) * LAMPORTS_PER_SOL,(Number(data.balance) * LAMPORTS_PER_SOL)-fee, data.balance, LAMPORTS_PER_SOL);
        console.log('default ==>',web3.LAMPORTS_PER_SOL / 100)
        if (data.status == true) {
            let transaction = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                    fromPubkey: fromAddress,
                    toPubkey: toAddress,
                    lamports: (Number(data.balance)* LAMPORTS_PER_SOL)-web3.LAMPORTS_PER_SOL / 100,
                }),
            );
            let signature = await web3.sendAndConfirmTransaction(
                connection,
                transaction, [from]
            );
            // console.log('SIGNATURE', signature);
            return res.send({ responseCode: 200, resposenMessage: 'Transfer successfully.', responseResult: { Hash: signature } });
        }
        else {
            return res.send({ responseCode: 400, resposenMessage: 'Transfer not possible.', responseResult: [] });
        }
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: `${error}` });
    }
}

const withdrawSOL = async (req, res) => {
    try {
        console.log("Executing transaction...");
        console.log("amount", req.body.amountToSend);
        const fromKeyPair = new Uint16Array(Buffer.from(req.body.privateKey,'hex'));
        console.log("fromPrivateKey", Object.values(fromKeyPair));
        const prvKey = Uint8Array.from(Object.values(fromKeyPair));

        const fromData = web3.Keypair.fromSecretKey(prvKey);
        console.log("from", fromData);
        console.log("LAMPORTS_PER_SOL ==>", Number(req.body.amountToSend) * LAMPORTS_PER_SOL, req.body.amountToSend, LAMPORTS_PER_SOL);
  
        const connection = createConnection();
       

        return res.send({ responseCode: 200, resposenMessage: 'Withdraw successfully.', responseResult: { Hash: signature } });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: `${error}` });
    }
};



// walletGenerate();

// let airdropRequest = {
//     'body':{
//         address:'B1wMK6FBdjbYPPLYcZr8xJ7A6RcKq4WnJjcAp2dCuqdo'
//     }
// }
// airdrop(airdropRequest)
// let getBalanceRequest = {
//     'body':{
//         address:'B1wMK6FBdjbYPPLYcZr8xJ7A6RcKq4WnJjcAp2dCuqdo'
//     }
// }
// getBalance(getBalanceRequest);
// let transferRequest = {
//     body:{
//         fromaddress:'DbbNYoCPzawQc6RMqvUiMkMzSvzcMYZcnnZPmTbYgDxV',
//         toaddress:'7BBWQ7j9TdJ8xPv9UQoQSd6ZX8WS3aH6PvdRVRuSfeUh',
//         privateKey:'[225, 215, 57, 210, 19, 36, 3, 215, 40, 5, 222, 26, 170, 242, 136, 163, 228, 25, 184, 78, 52, 53, 75, 198, 136, 72, 130, 216, 53, 178, 211, 148, 187, 40, 218, 200, 220, 227, 32, 145, 100, 227, 34, 155, 58, 157, 174, 117, 20, 14, 240, 98, 211, 138, 181, 90, 177, 200, 208, 102, 104, 130, 237, 10]'
//     }
// }
// transfer(transferRequest);

// let withdrawRequest = {
//     body: {
//         from: 'DbbNYoCPzawQc6RMqvUiMkMzSvzcMYZcnnZPmTbYgDxV',
//         fromPrivateKey: '[225, 215, 57, 210, 19, 36, 3, 215, 40, 5, 222, 26, 170, 242, 136, 163, 228, 25, 184, 78, 52, 53, 75, 198, 136, 72, 130, 216, 53, 178, 211, 148, 187, 40, 218, 200, 220, 227, 32, 145, 100, 227, 34, 155, 58, 157, 174, 117, 20, 14, 240, 98, 211, 138, 181, 90, 177, 200, 208, 102, 104, 130, 237, 10]',
//         to: '7BBWQ7j9TdJ8xPv9UQoQSd6ZX8WS3aH6PvdRVRuSfeUh',
//         amount: '0.001'
//     }
// }
// withdrawSOL(withdrawRequest)

module.exports = { walletGenerate, getBalance, transfer, airdrop, withdrawSOL }
