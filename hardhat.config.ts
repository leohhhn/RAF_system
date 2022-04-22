import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers'
import * as dotenv from "dotenv";

dotenv.config({path: __dirname + '/.env'});

module.exports = {
  solidity: {
    version: "0.8.4",
  },
  gasReporter: {
    enabled: true,
  },
  // DEPLOYMENT
  // networks: {
  //     ropsten: {
  //         url: process.env.INFURA_ROPSTEN,
  //         accounts: [`0x${process.env.PRIVATE_KEY}`],
  //     },
  //     rinkeby: {
  //         url: process.env.INFURA_RINKEBY,
  //         accounts: [`0x${process.env.PRIVATE_KEY}`],
  //     },
  // },
  // etherscan: {
  //     apiKey: process.env.ETHERSCAN_API_KEY
  // }
}