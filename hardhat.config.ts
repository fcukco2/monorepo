import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    hardhat: {
      forking: {
        url: "https://polygon-rpc.com",
        blockNumber: 43713000
      },
      accounts: [{
        privateKey: process.env.PRIVATE_KEY || "",
        balance: "10000000000000000000000000"
      }]
    }
  },
};

export default config;
