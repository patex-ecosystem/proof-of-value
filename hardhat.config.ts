import * as dotenv  from "dotenv"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-etherscan"
import '@openzeppelin/hardhat-upgrades'

dotenv.config({path: __dirname + '/.env'})

import { HardhatUserConfig } from "hardhat/config"

/** @type import('hardhat/config').HardhatUserConfig */

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 111,
            accounts: [
                {
                    privateKey: "", 
                    balance: "10000000000000000000000"
                }
            ]
        },
        localhost: {
            chainId: 111
        },

        sepolia: {
            chainId: 11155111,
            url: "https://eth-sepolia.g.alchemy.com/v2/qm8q3jYcvUkp2L1YOc1NVD18l_Ea__jn",
            accounts: [
                ""
            ]
        },

        patexTestnet: {
            url: "https://test-rpc.patex.io",
            chainId: 471100,
            accounts: [
                ""
            ]
        },
        mainnet: {
            url: "https://eth-mainnet.g.alchemy.com/v2/",
            chainId: 1,
            accounts: [
                ""
            ]
        },
    },
    solidity: {
        compilers: [
          {
            version: "0.5.16",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
            }
          },
          {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
            }
          },
        ]
    },
    etherscan: {
        apiKey: {
            sepolia: "",
            bscTestnet: "",
            ftmTestnet: "",
            polygonMumbai: "",
            harmonyTest: ""
        }
    }
}

export default config