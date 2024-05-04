// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IAspisDecoder.sol";
import "./1inchProtocolLib.sol";
import "./IAggregationRouterV6.sol";

interface IUniswapPool {
    function token0() external view returns (address);

    function token1() external view returns (address);
}

contract OneInchV6Decoder is IAspisDecoder {
    using AddressLib for Address;
    using ProtocolLib for Address;

    uint256 private constant _ONE_FOR_ZERO_MASK = 1 << 255;
    uint256 private constant _CURVE_TO_COINS_SELECTOR_OFFSET = 208;
    uint256 private constant _CURVE_TO_COINS_SELECTOR_MASK = 0xff;
    uint256 private constant _CURVE_TO_COINS_ARG_OFFSET = 216;
    uint256 private constant _CURVE_TO_COINS_ARG_MASK = 0xff;
    // Curve Pool function selectors for different `coins` methods
    bytes32 private constant _CURVE_COINS_SELECTORS = 0x87cb4f5723746eb8c6610657b739953eb9947eb0000000000000000000000000;

    address internal constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address private immutable WETH;

    constructor(address weth) {
        WETH = weth;
    }

    function decodeExchangeInput(
        uint256 value,
        bytes calldata inputData
    ) public view override returns (address, address, uint256, uint256, address) {
        bytes4 selector = bytes4(inputData[:4]);

        if (selector == IAggregationRouterV6.swap.selector) {
            (, IAggregationRouterV6.SwapDescription memory swap, ) = 
                abi.decode(inputData[4:], (
                    address, IAggregationRouterV6.SwapDescription, bytes
                ));
            return (swap.srcToken, swap.dstToken, swap.amount, swap.minReturnAmount, swap.dstReceiver);
        } else if (selector == IAggregationRouterV6.unoswap.selector) {
            (Address _srcToken, uint256 _amount, uint256 _minReturnAmount, Address _dex) = abi.decode(
                inputData[4:],
                (Address, uint256, uint256, Address)
            );

            address _srcTokenUnwrapped = _srcToken.get(); // input token cannot be native currency in unoswap
            address destToken = getDestTokenFromDex(_dex);
            
            return (_srcTokenUnwrapped, destToken, _amount, _minReturnAmount, address(0));
        } else if (selector == IAggregationRouterV6.unoswap2.selector) {
            (
                Address token, 
                uint256 amount, 
                uint256 minReturn, 
                , 
                Address dex2
            ) = abi.decode(
                inputData[4:],
                (Address, uint256, uint256, Address, Address)
            );

            address srcToken = token.get();
            address destToken = getDestTokenFromDex(dex2);

            return (srcToken, destToken, amount, minReturn, address(0));
        } else if (selector == IAggregationRouterV6.unoswap3.selector) {
            (
                Address token, 
                uint256 amount, 
                uint256 minReturn, 
                ,
                ,
                Address dex3
            ) = abi.decode(
                inputData[4:],
                (Address, uint256, uint256, Address, Address, Address)
            );

            address srcToken = token.get();
            address destToken = getDestTokenFromDex(dex3);

            return (srcToken, destToken, amount, minReturn, address(0));
        } else if (selector == IAggregationRouterV6.ethUnoswap.selector) {
            (uint256 minReturn, Address dex) = abi.decode(inputData[4:], (uint256, Address));

            address srcToken = ETH;
            address destToken = getDestTokenFromDex(dex);

            return (srcToken, destToken, value, minReturn, address(0));
        } else if (selector == IAggregationRouterV6.ethUnoswap2.selector) {
            (
                uint256 minReturn, 
                ,
                Address dex2
            ) = abi.decode(inputData[4:], (uint256, Address, Address));

            address srcToken = ETH;
            address destToken = getDestTokenFromDex(dex2);

            return (srcToken, destToken, value, minReturn, address(0));
        } else if (selector == IAggregationRouterV6.ethUnoswap3.selector) {
            (
                uint256 minReturn, , ,
                Address dex3
            ) = abi.decode(inputData[4:], (uint256, Address, Address, Address));

            address srcToken = ETH;
            address destToken = getDestTokenFromDex(dex3);

            return (srcToken, destToken, value, minReturn, address(0));
        }
         else {
            revert("Cant decode");
        }
    }    

    function getDestTokenFromDex(Address dex) private view returns (address) {
        address destToken;

        if(dex.protocol() == ProtocolLib.Protocol.UniswapV3 ||
           dex.protocol() == ProtocolLib.Protocol.UniswapV2
        ) {
            destToken = dex.getFlag(_ONE_FOR_ZERO_MASK)
                ? IUniswapPool(dex.get()).token1()
                : IUniswapPool(dex.get()).token0();
        }
        else if(dex.protocol() == ProtocolLib.Protocol.Curve) {
            destToken = getCurveOutputCoinFromDex(dex);
        }
        else {
            revert("Decoder: Cannot decode protocol");
        }

        if (destToken == WETH && dex.shouldUnwrapWeth()) {
            destToken = ETH;
        }

        return destToken;
    }

    function getCurveOutputCoinFromDex(Address dex) private view returns(address coin) {
        address pool = dex.get();

        assembly {
            function reRevert() {
                let ptr := mload(0x40)
                returndatacopy(ptr, 0, returndatasize())
                revert(ptr, returndatasize())
            }

            let toSelectorOffset := and(shr(_CURVE_TO_COINS_SELECTOR_OFFSET, dex), _CURVE_TO_COINS_SELECTOR_MASK)
            let toTokenIndex := and(shr(_CURVE_TO_COINS_ARG_OFFSET, dex), _CURVE_TO_COINS_ARG_MASK)

            mstore(0, _CURVE_COINS_SELECTORS)
            mstore(add(toSelectorOffset, 4), toTokenIndex)
            if iszero(staticcall(gas(), pool, toSelectorOffset, 0x24, 0, 0x20)) {
                reRevert()
            }
            coin := mload(0)
        }
    }
}