const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnhancedBank", function () {
   let EnhancedBank, bank, owner, addr1, addr2;

   beforeEach(async function () {
      EnhancedBank = await ethers.getContractFactory("EnhancedBank");
      [owner, addr1, addr2, _] = await ethers.getSigners();

      bank = await EnhancedBank.deploy();
   });

   it("Should allow deposits", async function () {
      await bank.deposit({ value: ethers.parseEther("1.0") });
      expect(await bank.getBalance()).to.equal(ethers.parseEther("1.0"));
   });

   it("Should allow withdrawals", async function () {
      await bank.deposit({ value: ethers.parseEther("1.0") });
      await bank.withdraw(ethers.parseEther("0.5"));
      expect(await bank.getBalance()).to.equal(ethers.parseEther("0.5"));
   });

   it("Should not allow over-withdrawal", async function () {
      await bank.deposit({ value: ethers.parseEther("1.0") });
      await expect(bank.withdraw(ethers.parseEther("1.5"))).to.be.revertedWith(
         "Insufficient balance"
      );
   });

   it("Should update balances correctly after multiple deposits and withdrawals", async function () {
      await bank.deposit({ value: ethers.parseEther("2.0") });
      await bank.withdraw(ethers.parseEther("1.0"));
      await bank.deposit({ value: ethers.parseEther("3.0") });
      expect(await bank.getBalance()).to.equal(ethers.parseEther("4.0"));
   });

   it("Should not allow emergency withdrawal for another account", async function () {
      await bank.connect(addr1).deposit({ value: ethers.parseEther("1.0") });
      await bank.connect(addr2).deposit({ value: ethers.parseEther("1.0") });
      await expect(bank.connect(addr1).emergencyWithdraw()).to.be.revertedWith(
         "Not the contract owner"
      );
   });

   it("Should allow emergency withdrawal for owner", async function () {
      await bank.connect(addr1).deposit({ value: ethers.parseEther("1.0") });
      await bank.emergencyWithdraw();
      expect(await ethers.provider.getBalance(bank.target)).to.equal("0");
   });
});
