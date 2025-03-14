require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    fuji: {
      url: "http://127.0.0.1:34890/ext/bc/C/rpc", // Fuji C-Chain RPC
      chainId: 43112, // Fuji testnet Chain ID
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      fuji: process.env.AVALANCHE_API_KEY, // Get from Snowtrace
    },
    customChains: [
      {
        network: "fuji",
        chainId: 43113,
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io",
        },
      },
    ],
  },
};