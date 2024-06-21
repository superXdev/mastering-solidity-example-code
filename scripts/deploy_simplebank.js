const { ethers } = require("hardhat");

async function main() {
   const SimpleBank = await ethers.getContractFactory("SimpleBank");
   const bank = await SimpleBank.deploy();
   console.log("SimpleBank deployed to:", bank.target);

   // Deposit 1 Ether
   await bank.deposit({ value: ethers.parseEther("1.0") });

   // Get balance
   let balance = await bank.getBalance();
   console.log(balance.toString()); // Should print '1000000000000000000' (1 Ether in Wei)

   // Withdraw 0.5 Ether
   await bank.withdraw(ethers.parseEther("0.5"));
   balance = await bank.getBalance();
   console.log(balance.toString()); // Should print '500000000000000000' (0.5 Ether in Wei)
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
