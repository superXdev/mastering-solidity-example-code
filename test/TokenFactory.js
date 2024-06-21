const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFactory", function () {
   let tokenFactory, myRegistry;
   let owner, addr1;

   beforeEach(async function () {
      [owner, addr1] = await ethers.getSigners();

      // Deploy MyRegistry
      const MyRegistry = await ethers.getContractFactory("MyRegistry");
      myRegistry = await MyRegistry.deploy();

      // Deploy TokenFactory with the address of MyRegistry
      const TokenFactory = await ethers.getContractFactory("TokenFactory");
      tokenFactory = await TokenFactory.deploy(myRegistry.target);
   });

   it("should create a token and register it", async function () {
      const name = "TestToken";
      const symbol = "TTK";
      const initialSupply = ethers.parseEther("1000");
      const description = "A test token";

      // Create a token
      await tokenFactory.createToken(name, symbol, initialSupply, description);

      // Get the address of the created token from the emitted event
      const filter = tokenFactory.filters.TokenCreated();
      const events = await tokenFactory.queryFilter(filter);
      const tokenAddress = events[0].args.tokenAddress;

      // Verify the token is registered in MyRegistry
      const contractDetails = await myRegistry.getContractDetails(tokenAddress);
      expect(contractDetails.contractAddress).to.equal(tokenAddress);
      expect(contractDetails.description).to.equal(description);
   });
});
