const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyRBAC", function () {
   let MyRBAC, myRBAC, owner, addr1, addr2;

   beforeEach(async function () {
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
      MyRBAC = await ethers.getContractFactory("MyRBAC");
      myRBAC = await MyRBAC.deploy();
   });

   describe("Initial State", function () {
      it("should have the correct initial supply", async function () {
         const ownerBalance = await myRBAC.balanceOf(owner.address);
         expect(ownerBalance).to.equal(BigInt(1000 * 10 ** 18).toString());
      });
   });

   describe("Role Management", function () {
      it("should grant MINTER_ROLE to an account", async function () {
         await myRBAC.addMinter(addr1.address);
         const hasMinterRole = await myRBAC.hasRole(
            myRBAC.MINTER_ROLE(),
            addr1.address
         );
         expect(hasMinterRole).to.be.true;
      });

      it("should allow the admin to revoke MINTER_ROLE", async function () {
         await myRBAC.addMinter(addr1.address);
         await myRBAC.removeMinter(addr1.address);
         const hasMinterRole = await myRBAC.hasRole(
            myRBAC.MINTER_ROLE(),
            addr1.address
         );
         expect(hasMinterRole).to.be.false;
      });

      it("should not allow non-admins to grant or revoke roles", async function () {
         await expect(
            myRBAC.connect(addr1).addMinter(addr2.address)
         ).to.be.revertedWith("You are not Admin");
         await myRBAC.addMinter(addr1.address);
         await expect(
            myRBAC.connect(addr1).removeMinter(addr1.address)
         ).to.be.revertedWith("You are not Admin");
      });
   });

   describe("Minting Tokens", function () {
      it("should allow minters to mint tokens", async function () {
         await myRBAC.addMinter(addr1.address);
         await myRBAC
            .connect(addr1)
            .mint(addr2.address, BigInt(200 * 10 ** 18).toString());
         const addr2Balance = await myRBAC.balanceOf(addr2.address);
         expect(addr2Balance).to.equal(BigInt(200 * 10 ** 18).toString());
      });

      it("should not allow non-minters to mint tokens", async function () {
         await expect(
            myRBAC
               .connect(addr1)
               .mint(addr2.address, BigInt(100 * 10 ** 18).toString())
         ).to.be.revertedWith("You are not allowed to mint");
      });
   });
});
