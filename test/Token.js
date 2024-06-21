const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", () => {
   let MyToken, token, owner, addr1, addr2;

   beforeEach(async () => {
      [owner, addr1, addr2] = await ethers.getSigners();
      MyToken = await ethers.getContractFactory("MyToken");
      token = await MyToken.deploy();
   });

   describe("Deployment", () => {
      it("Should assign the total supply of tokens to the owner", async () => {
         const ownerBalance = await token.balanceOf(owner.address);
         expect(await token.totalSupply()).to.equal(ownerBalance);
      });
   });

   describe("Transactions", () => {
      it("Should transfer tokens between accounts", async () => {
         // Transfer 50 tokens from owner to addr1
         await token.transfer(addr1.address, 50);
         const addr1Balance = await token.balanceOf(addr1.address);
         expect(addr1Balance).to.equal(50);

         // Transfer 50 tokens from addr1 to addr2
         await token.connect(addr1).transfer(addr2.address, 50);
         const addr2Balance = await token.balanceOf(addr2.address);
         expect(addr2Balance).to.equal(50);
      });

      it("Should fail if sender doesn't have enough tokens", async () => {
         const initialOwnerBalance = await token.balanceOf(owner.address);

         // Try to send 1 token from addr1 (0 tokens) to owner (should fail)
         await expect(
            token.connect(addr1).transfer(owner.address, 1)
         ).to.be.revertedWithCustomError(MyToken, "ERC20InsufficientBalance");

         // Owner balance shouldn't have changed.
         expect(await token.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
         );
      });
   });

   describe("Minting", () => {
      it("Should allow owner to mint new tokens", async () => {
         await token.mint(owner.address, BigInt(100 * 10 ** 18).toString());
         const ownerBalance = await token.balanceOf(owner.address);
         expect(ownerBalance).to.equal(BigInt(1100 * 10 ** 18));
      });

      it("Should not allow non-owner to mint tokens", async () => {
         await expect(
            token.connect(addr1).mint(addr1.address, 100)
         ).to.be.revertedWithCustomError(MyToken, "OwnableUnauthorizedAccount");
      });
   });
});
