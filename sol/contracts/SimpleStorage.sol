// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// Declares a simple smart contract named SimpleStorage
contract SimpleStorage {
    // States a variable to store a positive integer
    uint256 storedData;

    // Function to update the stored value
    function set(uint256 x) public {
        storedData = x;
    }

    // Function to retrieve the stored value
    function get() public view returns (uint256) {
        return storedData;
    }
}
