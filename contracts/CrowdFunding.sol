// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Campaign {
        address payable creator;
        uint goal;
        uint pledged;
        uint deadline;
        bool claimed;
    }

    mapping(uint => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(
        uint indexed id,
        address indexed creator,
        uint goal,
        uint deadline
    );
    event Pledged(uint indexed campaignId, address indexed backer, uint amount);
    event Claimed(
        uint indexed campaignId,
        address indexed creator,
        uint amount
    );

    error GoalNotMet(uint goal, uint pledged);
    error NotCreator(address caller);
    error CampaignEnded(uint deadline);

    // Create a new campaign with a goal and duration
    function createCampaign(
        uint _goal,
        uint _duration
    ) public returns (uint256) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        campaignCount++;
        Campaign storage newCampaign = campaigns[campaignCount] = Campaign({
            creator: payable(msg.sender),
            goal: _goal,
            pledged: 0,
            deadline: block.timestamp + _duration,
            claimed: false
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _goal,
            newCampaign.deadline
        );

        return campaignCount;
    }

    // Pledge funds to a campaign
    function pledge(uint _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");

        campaign.pledged += msg.value;
        emit Pledged(_campaignId, msg.sender, msg.value);
    }

    // Claim funds after campaign ends if goal is met
    function claimFunds(uint _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        if (msg.sender != campaign.creator) {
            revert NotCreator(msg.sender);
        }

        if (campaign.pledged < campaign.goal) {
            revert GoalNotMet(campaign.goal, campaign.pledged);
        }

        require(!campaign.claimed, "Funds already claimed");

        campaign.claimed = true;
        campaign.creator.transfer(campaign.pledged);

        emit Claimed(_campaignId, msg.sender, campaign.pledged);
    }
}
