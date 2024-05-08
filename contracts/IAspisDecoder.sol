// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IAspisDecoder {

    function decodeExchangeInput(
        uint256 value,
        bytes calldata inputData
    ) external view returns (address, address, uint256, uint256, address);
}