import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "hardhat-deploy";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    matic: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/` + process.env.MATIC_API_KEY,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    hardhat: {
      forking: {
        url: "https://polygon-rpc.com",
      },
      accounts: [
        {
          privateKey: process.env.PRIVATE_KEY || "",
          balance: "10000000000000000000000000",
        },
      ],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: 0
  }
};

export default config;
