const RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI();
// console.log('address', address.address);
// console.log('privateKey', address.secret);

const walletGenerate = async (req,res) => {
    try {
        const addresses = api.generateAddress();
        let privateKey = Buffer.from(addresses.secret).toString('hex');
        return res.send({
            responseCode: 200, resposenMessage: 'Wallet generated successfully.', responseResult: {
                address: (addresses.address.toString()),
                privateKey: privateKey
            }
        });
    } catch (error) {
        console.log(error)
        return res.send({ responseCode: 501, resposenMessage: 'Something went wrong!!!', responseResult: `${error}` });
    }
}

module.exports= {walletGenerate}