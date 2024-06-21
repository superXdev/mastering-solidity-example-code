const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StorageModule", (m) => {
   const ss = m.contract("SimpleStorage");

   return { ss };
});
