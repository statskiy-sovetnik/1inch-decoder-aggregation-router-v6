// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IAggregationRouterV6 {
    struct SwapDescription {
        address srcToken;
        address dstToken;
        address payable srcReceiver;
        address payable dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint256 flags;
    }

    function swap(
        address executor,
        SwapDescription calldata desc,
        bytes calldata data
    ) external payable returns (
        uint256 returnAmount,
        uint256 spentAmount
    );

    function unoswap(
        uint256 token, 
        uint256 amount, 
        uint256 minReturn, 
        uint256 dex
    ) external returns(uint256 returnAmount);

    function unoswap2(
        uint256 token, 
        uint256 amount, 
        uint256 minReturn, 
        uint256 dex, 
        uint256 dex2
    ) external returns(uint256 returnAmount);

    function unoswap3(
        uint256 token, 
        uint256 amount, 
        uint256 minReturn, 
        uint256 dex, 
        uint256 dex2,
        uint256 dex3
    ) external returns(uint256 returnAmount);

    function ethUnoswap(
        uint256 minReturn, 
        uint256 dex
    ) external payable returns(uint256 returnAmount);

    function ethUnoswap2(
        uint256 minReturn, 
        uint256 dex, 
        uint256 dex2
    ) external payable returns(uint256 returnAmount);

    function ethUnoswap3(
        uint256 minReturn, 
        uint256 dex, 
        uint256 dex2,
        uint256 dex3
    ) external payable returns(uint256 returnAmount);

    function clipperSwap(
        address clipperExchange,
        uint256 srcToken,
        address dstToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 goodUntil,
        bytes32 r,
        bytes32 vs
    ) external payable returns(uint256 returnAmount);
}