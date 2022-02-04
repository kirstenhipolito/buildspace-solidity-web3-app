// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;
    uint256 private seed;
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("This is my first contract! :)");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Please wait 15 minutes before waving again!"
        );

        lastWavedAt[msg.sender] = block.timestamp;

        console.log("%s has waved! Message: %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));
        seed = (block.timestamp + block.difficulty + seed) % 100;

        console.log("Random # generated: %d", seed);

        if (seed <= 30) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getTotalWaves() public view returns (uint256) {
        return waves.length;
    }

    function getWaves() public view returns (Wave[] memory) {
        return waves;
    }
}
