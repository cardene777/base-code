import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_KEY = process.env.INFURA_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.6.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
