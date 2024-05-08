// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

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

    uint256 private constant _UNISWAP_V2_ZERO_FOR_ONE_OFFSET = 247;
    uint256 private constant _UNISWAP_V2_ZERO_FOR_ONE_MASK = 0x01;
    uint256 private constant _UNISWAP_V3_ZERO_FOR_ONE_OFFSET = 247;
    uint256 private constant _UNISWAP_V3_ZERO_FOR_ONE_MASK = 0x01;

    uint256 private constant _CURVE_TO_COINS_SELECTOR_OFFSET = 208;
    uint256 private constant _CURVE_TO_COINS_SELECTOR_MASK = 0xff;
    uint256 private constant _CURVE_TO_COINS_ARG_OFFSET = 216;
    uint256 private constant _CURVE_TO_COINS_ARG_MASK = 0xff;
    // Curve Pool function selectors for different `coins` methods
    bytes32 private constant _CURVE_COINS_SELECTORS = 0x87cb4f5723746eb8c6610657b739953eb9947eb0000000000000000000000000;
    uint256 private constant _CURVE_SWAP_HAS_ARG_DESTINATION_OFFSET = 244;
    uint256 private constant _CURVE_OUTPUT_WETH_DEPOSIT_OFFSET = 245;
    uint256 private constant _CURVE_OUTPUT_WETH_WITHDRAW_OFFSET = 246;
    uint256 private constant _CURVE_SWAP_USE_ETH_OFFSET = 242;
    uint256 private constant _CURVE_SWAP_HAS_ARG_USE_ETH_OFFSET = 243;

    address internal constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address private constant _ETH_ = address(0);
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

            address destToken = getDestTokenFromDex(_dex);
            
            return (_srcToken.get(), destToken, _amount, _minReturnAmount, address(0));
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
        else if (selector == IAggregationRouterV6.clipperSwap.selector) {
            (
                ,
                Address _srcToken,
                address _dstToken,
                uint256 _inputAmount,
                uint256 _outputAmount,,,
            ) = abi.decode(inputData[4:], (address, Address, address, uint256,uint256,uint256,bytes32,bytes32));

            // Clipper-like dex accepts zero address as ETH
            address srcToken = _srcToken.get() == _ETH_ ? ETH : _srcToken.get();
            address dstToken = _dstToken == _ETH_ ? ETH : _dstToken;

            return (srcToken, dstToken, _inputAmount, _outputAmount, address(0));
        }
        else {
            revert("Cant decode");
        }
    }    

    function getDestTokenFromDex(Address dex) private view returns (address) {
        address destToken;

        if(isUniswap(dex)) {
            destToken = getDestTokenFromUniswapDex(dex);
        }
        else if(isCurve(dex)) {
            destToken = getDestTokenFromCurveDex(dex);
        }
        else {
            revert("Decoder: Cannot decode protocol");
        }

        return destToken;
    }
    
    function isUniswap(Address dex) private pure returns(bool) {
        return dex.protocol() == ProtocolLib.Protocol.UniswapV3 ||
           dex.protocol() == ProtocolLib.Protocol.UniswapV2;
    }

    function isCurve(Address dex) private pure returns(bool) {
        return dex.protocol() == ProtocolLib.Protocol.Curve;
    }

    function getDestTokenFromUniswapDex(
        Address dex
    ) private view returns(address destToken) {
        bool zeroForOne;
        if (dex.protocol() == ProtocolLib.Protocol.UniswapV2) {
            assembly {
                zeroForOne := and(shr(_UNISWAP_V2_ZERO_FOR_ONE_OFFSET, dex), _UNISWAP_V2_ZERO_FOR_ONE_MASK)
            }
        }
        else if (dex.protocol() == ProtocolLib.Protocol.UniswapV3) {
            assembly {
                zeroForOne := and(shr(_UNISWAP_V3_ZERO_FOR_ONE_OFFSET, dex), _UNISWAP_V3_ZERO_FOR_ONE_MASK)
            }
        }

        destToken = zeroForOne 
            ? IUniswapPool(dex.get()).token1()
            : IUniswapPool(dex.get()).token0();
            
        if (destToken == WETH && dex.shouldUnwrapWeth()) {
            destToken = ETH;
        }
        else if (destToken == ETH && dex.shouldWrapWeth()) {
            destToken = WETH;
        }
    }

    function getDestTokenFromCurveDex(
        Address dex
    ) private view returns(address destToken) {
        destToken = getCurveCoinFromDex(dex);

        if (destToken == ETH) {
            if (curveHasArgUseETH(dex) && !curveUseETH(dex)) {
                destToken = WETH;
            }
        }
        else if (destToken == WETH) {
            if (curveHasArgUseETH(dex) && curveUseETH(dex)) {
                destToken = ETH;
            }
        }

        if (!curveHasArgDestination(dex)) {
            if (destToken == ETH && routerWrapsEthAfterCurveSwap(dex)) {
                destToken == WETH;
            }
            else if (destToken == WETH && routerUnwrapsEthAfterCurveSwap(dex)) {
                destToken == ETH;
            }
        } 
    }

    function getCurveCoinFromDex(Address dex) private view returns(address coin) {
        address pool = dex.get();

        /* Call the "coins" method, encoded into dex */
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

    function routerWrapsEthAfterCurveSwap(Address dex) private pure returns(bool should) {
        assembly {
            should := and(shr(_CURVE_OUTPUT_WETH_DEPOSIT_OFFSET, dex), 0x01)
        }
    }

    function routerUnwrapsEthAfterCurveSwap(Address dex) private pure returns(bool should) {
        assembly {
            should := and(shr(_CURVE_OUTPUT_WETH_WITHDRAW_OFFSET, dex), 0x01)
        }
    }

    function curveHasArgUseETH(Address dex) private pure returns(bool hasArg) {
        assembly {
            hasArg := and(shr(_CURVE_SWAP_HAS_ARG_USE_ETH_OFFSET, dex), 0x01)
        }
    }

    function curveUseETH(Address dex) private pure returns(bool useEth) {
        assembly {
            useEth := and(shr(_CURVE_SWAP_USE_ETH_OFFSET, dex), 0x01)
        }
    }

    function curveHasArgDestination(Address dex) private pure returns(bool hasArg) {
        assembly {
            hasArg := and(shr(_CURVE_SWAP_HAS_ARG_DESTINATION_OFFSET, dex), 0x01)
        }
    }
}