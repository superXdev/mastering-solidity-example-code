// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank {
    mapping(address => uint) public balances;

    // Deposit function to add balance
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Withdraw function to reduce balance
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    // Get balance of the caller
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}