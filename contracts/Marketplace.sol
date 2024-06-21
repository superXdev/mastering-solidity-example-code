// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Marketplace is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address seller;
    }

    mapping(uint256 => Product) public products;
    uint256 public nextProductId;

    constructor() {
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function addSeller(address account) public onlyRole(ADMIN_ROLE) {
        _grantRole(SELLER_ROLE, account);
    }

    function addProduct(
        string memory name,
        uint256 price
    ) public onlyRole(SELLER_ROLE) {
        products[nextProductId] = Product(
            nextProductId,
            name,
            price,
            msg.sender
        );
        nextProductId++;
    }
}
