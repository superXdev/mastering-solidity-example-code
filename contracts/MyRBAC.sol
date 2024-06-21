// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyRBAC is AccessControl, ERC20 {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not Admin");
        _;
    }

    function addMinter(address account) public onlyAdmin {
        _grantRole(MINTER_ROLE, account);
    }

    function removeMinter(address account) public onlyAdmin {
        _revokeRole(MINTER_ROLE, account);
    }

    function mint(address to, uint256 amount) public {
        require(
            hasRole(MINTER_ROLE, msg.sender),
            "You are not allowed to mint"
        );
        _mint(to, amount);
    }
}
