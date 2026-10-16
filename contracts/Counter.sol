//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error Unauthorized();

contract Counter {
    uint256 public count;
    address public owner;

    event CountIncremented(uint256 newCount);
    event CountDecremented(uint256 newCount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }
    
    function increment() public {
        count += 1;
        emit CountIncremented(count);
    }

    function decrement() public {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        count -= 1;
        emit CountDecremented(count);
    }
}