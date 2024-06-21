// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyRegistry.sol";

contract ERC20Token is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract TokenFactory {
    MyRegistry public registry;

    constructor(address _registryAddress) {
        registry = MyRegistry(_registryAddress);
    }

    event TokenCreated(address tokenAddress);

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        string memory description
    ) public {
        ERC20Token newToken = new ERC20Token(name, symbol, initialSupply);
        newToken.transferOwnership(msg.sender);
        registry.registerContract(address(newToken), description);
        emit TokenCreated(address(newToken));
    }
}
