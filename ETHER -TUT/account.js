const { ethers, providers } = require("ethers"); 

const RPC = 'https://ropsten.infura.io/v3/3d5572dc4b534711830b04cabe01f42a'
 
const Account = '0xd129A361792827462df6E50bABB226cBc088609c'

const privateKey = '7ce83a8d669d9961ea8969f428d842c69a27b22d6f30db6bbc168b33b7876103'

const provider = await ethers.providers.JsonRpcProvider(
    RPC
)
async function call(){
    const bal = await provider.getBalance(Account);
    console.log(ethers.utils.formatEther);
}
call();