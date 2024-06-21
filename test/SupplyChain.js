const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
   let SupplyChain, supplyChain, owner, addr1, addr2;

   beforeEach(async function () {
      SupplyChain = await ethers.getContractFactory("SupplyChain");
      [owner, addr1, addr2, _] = await ethers.getSigners();

      supplyChain = await SupplyChain.deploy();
   });

   it("Should create an order", async function () {
      await supplyChain.createOrder(1, "Item1", 100);
      const order = await supplyChain.getOrder(0);
      expect(order[0]).to.equal(1);
      expect(order[1]).to.equal("Item1");
      expect(order[2]).to.equal(100);
      expect(order[3]).to.equal(0); // Status.Pending
   });

   it("Should update the order status", async function () {
      await supplyChain.createOrder(1, "Item1", 100);
      await supplyChain.updateOrderStatus(0, 1); // Status.Shipped
      const order = await supplyChain.getOrder(0);
      expect(order[3]).to.equal(1); // Status.Shipped
   });

   it("Should not update the status of a non-existent order", async function () {
      await expect(supplyChain.updateOrderStatus(1, 1)).to.be.revertedWith(
         "Invalid order ID"
      );
   });

   it("Should retrieve an existing order", async function () {
      await supplyChain.createOrder(1, "Item1", 100);
      const order = await supplyChain.getOrder(0);
      expect(order[0]).to.equal(1);
      expect(order[1]).to.equal("Item1");
      expect(order[2]).to.equal(100);
      expect(order[3]).to.equal(0); // Status.Pending
   });

   it("Should revert when trying to get a non-existent order", async function () {
      await expect(supplyChain.getOrder(1)).to.be.revertedWith(
         "Invalid order ID"
      );
   });
});
