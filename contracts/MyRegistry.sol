// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyRegistry {
    struct ContractDetails {
        address contractAddress;
        string description;
    }

    mapping(address => ContractDetails) public registry;
    address[] public contractList;

    event ContractRegistered(
        address indexed contractAddress,
        string description
    );
    event ContractRemoved(address indexed contractAddress);

    function registerContract(
        address _contractAddress,
        string memory _description
    ) public {
        require(_contractAddress != address(0), "Invalid contract address");
        ContractDetails memory details = ContractDetails(
            _contractAddress,
            _description
        );
        registry[_contractAddress] = details;
        contractList.push(_contractAddress);
        emit ContractRegistered(_contractAddress, _description);
    }

    function removeContract(address _contractAddress) public {
        require(
            registry[_contractAddress].contractAddress != address(0),
            "Contract not registered"
        );
        delete registry[_contractAddress];

        // Remove from contractList
        for (uint256 i = 0; i < contractList.length; i++) {
            if (contractList[i] == _contractAddress) {
                contractList[i] = contractList[contractList.length - 1];
                contractList.pop();
                break;
            }
        }

        emit ContractRemoved(_contractAddress);
    }

    function getContractDetails(
        address _contractAddress
    ) public view returns (ContractDetails memory) {
        return registry[_contractAddress];
    }

    function getAllContracts() public view returns (address[] memory) {
        return contractList;
    }

    function getTotalContracts() public view returns (uint128) {
        return uint128(contractList.length);
    }
}
