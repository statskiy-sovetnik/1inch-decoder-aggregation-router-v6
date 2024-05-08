import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_ARB_API_KEY!,
        blockNumber: 207654042,
      },
    },
    arbitrum: {
      chainId: 42161,
      url: process.env.ALCHEMY_ARB_API_KEY!
    }
  },
  etherscan: {
    apiKey: {
        mainnet: process.env.ETHERSCAN_API_KEY!,
        arbitrumOne: process.env.ARBISCAN_API_KEY!,
    }
  }
}

export default config;
