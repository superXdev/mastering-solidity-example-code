const { expect } = require("chai");

describe("Crowdfunding Contract", function () {
   let Crowdfunding, crowdfunding, owner, addr1, addr2;

   beforeEach(async function () {
      Crowdfunding = await ethers.getContractFactory("Crowdfunding");
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
      crowdfunding = await Crowdfunding.deploy();
   });

   describe("Deployment", function () {
      it("Should start with zero campaigns", async function () {
         expect(await crowdfunding.campaignCount()).to.equal(0);
      });
   });

   describe("Create Campaign", function () {
      it("Should create a campaign and emit an event", async function () {
         const goal = ethers.parseEther("10");
         const duration = 3600; // 1 hour

         await expect(crowdfunding.createCampaign(goal, duration))
            .to.emit(crowdfunding, "CampaignCreated")
            .withArgs(
               1,
               owner.address,
               goal,
               (await ethers.provider.getBlock()).timestamp + duration + 1
            );

         const campaign = await crowdfunding.campaigns(1);
         expect(campaign.creator).to.equal(owner.address);
         expect(campaign.pledged).to.equal(0);
         expect(campaign.claimed).to.equal(false);
      });

      it("Should revert if goal is zero", async function () {
         await expect(crowdfunding.createCampaign(0, 3600)).to.be.revertedWith(
            "Goal must be greater than 0"
         );
      });

      it("Should revert if duration is zero", async function () {
         const goal = ethers.parseEther("10");
         await expect(crowdfunding.createCampaign(goal, 0)).to.be.revertedWith(
            "Duration must be greater than 0"
         );
      });
   });

   describe("Pledge", function () {
      it("Should accept pledges and emit an event", async function () {
         const goal = ethers.parseEther("10");
         const duration = 3600; // 1 hour

         await crowdfunding.createCampaign(goal, duration);

         const pledgeAmount = ethers.parseEther("1");

         await expect(
            crowdfunding.connect(addr1).pledge(1, { value: pledgeAmount })
         )
            .to.emit(crowdfunding, "Pledged")
            .withArgs(1, addr1.address, pledgeAmount);

         const campaign = await crowdfunding.campaigns(1);
         expect(campaign.pledged).to.equal(pledgeAmount);
      });

      it("Should revert if campaign has ended", async function () {
         const goal = ethers.parseEther("10");
         const duration = 1; // 1 second

         await crowdfunding.createCampaign(goal, duration);

         // Wait for the campaign to end
         await ethers.provider.send("evm_increaseTime", [2]);
         await ethers.provider.send("evm_mine", []);

         await expect(
            crowdfunding
               .connect(addr1)
               .pledge(1, { value: ethers.parseEther("1") })
         ).to.be.revertedWith("Campaign has ended");
      });
   });

   describe("Claim Funds", function () {
      it("Should allow creator to claim funds if goal is met", async function () {
         const goal = ethers.parseEther("10");
         const duration = 3600; // 1 hour

         await crowdfunding.createCampaign(goal, duration);

         const pledgeAmount = ethers.parseEther("10");
         await crowdfunding.connect(addr1).pledge(1, { value: pledgeAmount });

         // Wait for the campaign to end
         await ethers.provider.send("evm_increaseTime", [3601]);
         await ethers.provider.send("evm_mine", []);

         await expect(crowdfunding.claimFunds(1))
            .to.emit(crowdfunding, "Claimed")
            .withArgs(1, owner.address, pledgeAmount);

         const campaign = await crowdfunding.campaigns(1);
         expect(campaign.claimed).to.equal(true);
      });

      it("Should revert if caller is not the creator", async function () {
         const goal = ethers.parseEther("10");
         const duration = 3600; // 1 hour

         await crowdfunding.createCampaign(goal, duration);

         const pledgeAmount = ethers.parseEther("10");
         await crowdfunding.connect(addr1).pledge(1, { value: pledgeAmount });

         // Wait for the campaign to end
         await ethers.provider.send("evm_increaseTime", [3601]);
         await ethers.provider.send("evm_mine", []);

         await expect(
            crowdfunding.connect(addr1).claimFunds(1)
         ).to.be.revertedWithCustomError(Crowdfunding, "NotCreator");
      });

      it("Should revert if goal is not met", async function () {
         const goal = ethers.parseEther("10");
         const duration = 3600; // 1 hour

         await crowdfunding.createCampaign(goal, duration);

         const pledgeAmount = ethers.parseEther("5");
         await crowdfunding.connect(addr1).pledge(1, { value: pledgeAmount });

         // Wait for the campaign to end
         await ethers.provider.send("evm_increaseTime", [3601]);
         await ethers.provider.send("evm_mine", []);

         await expect(crowdfunding.claimFunds(1)).to.be.revertedWithCustomError(
            Crowdfunding,
            "GoalNotMet"
         );
      });

      it("Should revert if funds are already claimed", async function () {
         const goal = ethers.parseEther("10");
         const duration = 3600; // 1 hour

         await crowdfunding.createCampaign(goal, duration);

         const pledgeAmount = ethers.parseEther("10");
         await crowdfunding.connect(addr1).pledge(1, { value: pledgeAmount });

         // Wait for the campaign to end
         await ethers.provider.send("evm_increaseTime", [3601]);
         await ethers.provider.send("evm_mine", []);

         await crowdfunding.claimFunds(1);

         await expect(crowdfunding.claimFunds(1)).to.be.revertedWith(
            "Funds already claimed"
         );
      });
   });
});
