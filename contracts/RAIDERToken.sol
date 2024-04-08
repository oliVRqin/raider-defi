//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";


contract RaiderToken is ERC20 {
    // Mint the Raider token with a supply of 100,000,000
    constructor () ERC20("RaiderToken", "RAIDER") {
        _mint(msg.sender, 100000000 * (10 ** uint256(decimals())));
    }
}