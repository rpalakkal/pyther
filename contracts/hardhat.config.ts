import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/fac65ffdcc624b34a88fdaf35f9a6b86",
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;
