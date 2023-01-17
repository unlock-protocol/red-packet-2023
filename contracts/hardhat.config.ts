import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@unlock-protocol/hardhat-plugin";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.unlock-protocol.com/137",
      },
    },
    polygon: {
      url: "https://rpc.unlock-protocol.com/137",
      accounts: process.env.PKEY ? [process.env.PKEY] : [],
    },
    goerli: {
      url: "https://rpc.unlock-protocol.com/5",
      accounts: process.env.PKEY ? [process.env.PKEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      polygon: "W9TVEYKW2CDTQ94T3A2V93IX6U3IHQN5Y3",
      goerli: "HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF",
    },
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
