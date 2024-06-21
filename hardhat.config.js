require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: "0.8.24",
   networks: {
      sepolia: {
         url: "https://sepolia.infura.io/v3/7699ff9dd25b4694bc711ca3abcdec3d",
         accounts: [process.env.PRIVATE_KEY],
      },
   },
};
