require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,  // Add your Infura/Alchemy URL in .env
      accounts: [process.env.PRIVATE_KEY]  // Add your wallet private key in .env
    },
    localhost: {
      url: "http://127.0.0.1:8545/"
    }
  }
};
