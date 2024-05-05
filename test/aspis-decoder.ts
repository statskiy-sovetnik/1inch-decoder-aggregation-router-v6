import {expect} from 'chai';
import {ethers, network} from 'hardhat';
import { OneInchV6Decoder } from '../typechain-types';
import { TOKENS } from './setup/constants';

  
describe('Aspis-decoders', async () => {

    describe('1Inch V6', () => {
        let oneInchV6decoder: OneInchV6Decoder;

        before(async () => {
            const chainId = network.config.chainId!;
            const OneInchV6Decoder = await ethers.getContractFactory('OneInchV6Decoder');
            oneInchV6decoder = await OneInchV6Decoder.deploy(TOKENS[chainId].WETH);
        });

        it('Uniswap V3 : 1 pool : ETH->WBTC', async () => {
            const chainId = network.config.chainId!;
            const transactionData = '0xa76dfc3b000000000000000000000000000000000000000000000000000000000000bcde2000000000000000000000002f5e87c9312fa29aed5c179e456625d79015299c01dbd640';
          
            const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
    
            expect(result[0].toString()).to.be.equal(TOKENS[chainId].ETH);
            expect(result[1].toString()).to.be.equal(TOKENS[chainId].WBTC);
        });

        it('Uniswap V3 : 1 pool : USDT->DAI', async () => {
          const chainId = network.config.chainId!;
          const transactionData = '0x83800a8e000000000000000000000000fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb900000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000d9968328094c5112800000000000000000000007f580f8a02b759c350e6b8340e7c2d4b8162b6a901dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].USDT);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].DAI);
        });

        it('Uniswap V3 : 1 pool : USDT->ETH', async () => {
          const chainId = network.config.chainId!;
          const transactionData = '0x83800a8e000000000000000000000000fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb90000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000070499db7203083380000000000000000000000641c00a822e8b671738d32a431a4fb6074e5c79d01dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].USDT);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].ETH);
        });

        it('Uniswap V3 : 1 pool with eth wrapping : WBTC->WETH', async () => {
          const chainId = network.config.chainId!;
          const transactionData = '0x83800a8e0000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f00000000000000000000000000000000000000000000000000000000009896800000000000000000000000000000000000000000000000001af89c765c2bff882880000000000000000000002f5e87c9312fa29aed5c179e456625d79015299c01dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].WBTC);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].WETH);
        });

        it('Uniswap V3 : 2 pools : USDT->WBTC', async () => {
          const chainId = network.config.chainId!; 
          // unoswap2 = 0x8770ba91
          const transactionData = '0x8770ba91000000000000000000000000fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb900000000000000000000000000000000000000000000000000000045d964b800000000000000000000000000000000000000000000000000000000001aeaacd9280000000000000000000000641c00a822e8b671738d32a431a4fb6074e5c79d2000000000000000000000002f5e87c9312fa29aed5c179e456625d79015299c01dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].USDT);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].WBTC);
        });

        it('Uniswap V3 : 2 pools : ETH->DAI', async () => {
          const chainId = network.config.chainId!; 
          // ethUnoswap2 = 0x89af926
          const transactionData = '0x89af926a000000000000000000000000000000000000000000007c01541daea3c04e4d9e208000000000000000000000641c00a822e8b671738d32a431a4fb6074e5c79d2000000000000000000000007f580f8a02b759c350e6b8340e7c2d4b8162b6a901dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].ETH);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].DAI);
        });

        it('Uniswap V3 : 2 pools : DAI->ETH', async () => {
          const chainId = network.config.chainId!; 
          // unoswap2 = 0x8770ba91
          const transactionData = '0x8770ba91000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000000000000000000000001a784379d99db4200000000000000000000000000000000000000000000000000000c99d3b773d205d0552880000000000000000000007f580f8a02b759c350e6b8340e7c2d4b8162b6a9300000000000000000000000641c00a822e8b671738d32a431a4fb6074e5c79d01dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].DAI);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].ETH);
        });

        it('Uniswap V3 : 3 pools : WBTC->USDT', async () => {
          const chainId = network.config.chainId!; 
          // unoswap3 = 0x19367472
          const transactionData = '0x193674720000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f00000000000000000000000000000000000000000000000000000000055d4a800000000000000000000000000000000000000000000000000000000ca1aee2e12880000000000000000000002f5e87c9312fa29aed5c179e456625d79015299c208000000000000000000000c6962004f452be9203591991d15f6b388e09e8d0208000000000000000000000be3ad6a5669dc0b8b12febc03608860c31e2eef601dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].WBTC);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].USDT);
        });

        it('Uniswap V3 : generic swap : WBTC->USDT', async () => {
          const chainId = network.config.chainId!; 
          // swap = 0x07ed2379
          const transactionData = '0x07ed2379000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd090000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f000000000000000000000000fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000e2d3f8c3c5597736ea34f1a24c6d3c9000e9796e0000000000000000000000000000000000000000000000000000000002faf080000000000000000000000000000000000000000000000000000000072a88f6610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002030000000000000000000000000000000000000001e50001b700018900013f00a007e5c0d200000000000000000000000000000000000000000000000000011b0000cc00a0c9e75c480000000000000000310100000000000000000000000000000000000000000000000000009e00004f02a00000000000000000000000000000000000000000000000000000000024aea863ee63c1e5016985cb98ce393fce8d6272127f39013f61e361662f2a2543b76a4166549f7aab2e75bef0aefc5b0f02a0000000000000000000000000000000000000000000000000000000070675a27fee63c1e5010e4831319a50228b9e450861297ab92dee15b44f2f2a2543b76a4166549f7aab2e75bef0aefc5b0f02a0000000000000000000000000000000000000000000000000000000072a88f661ee63c1e501be3ad6a5669dc0b8b12febc03608860c31e2eef6af88d065e77c8cc2239327c5edb3a432268e583100a0f2fa6b66fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9000000000000000000000000000000000000000000000000000000074ff978cc000000000000000000000000004c3fbb80a06c4eca27fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9111111125421ca6dc452d289314280a0f8842a650020d6bdbf78fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9111111125421ca6dc452d289314280a0f8842a65000000000000000000000000000000000000000000000000000000000001dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].WBTC);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].USDT);
        });

        it('Uniswap V3 : generic swap with split path : WBTC->ETH', async () => {
          const chainId = network.config.chainId!; 
          // swap = 0x07ed2379
          const transactionData = '0x07ed2379000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd090000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000e2d3f8c3c5597736ea34f1a24c6d3c9000e9796e0000000000000000000000000000000000000000000000000000000035a4e900000000000000000000000000000000000000000000000009c52c195390aca27000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000027300000000000000000000000000000000000000025500023b0002250001db00a0c9e75c48000000000000000004010000000000000000000000000000000000000000000000000001ad0000fe00a007e5c0d20000000000000000000000000000000000000000000000da00009e00004f02a00000000000000000000000000000000000000000000000000000001a1698ddffee63c1e5010e4831319a50228b9e450861297ab92dee15b44f2f2a2543b76a4166549f7aab2e75bef0aefc5b0f02a0000000000000000000000000000000000000000000000001f3a0d01477a34a98ee63c1e500c6962004f452be9203591991d15f6b388e09e8d0af88d065e77c8cc2239327c5edb3a432268e5831410182af49447d8a07e3bd95bd0d56f35241523fbab100042e1a7d4d000000000000000000000000000000000000000000000000000000000000000000a007e5c0d200000000000000000000000000000000000000000000000000008b00004f02a0000000000000000000000000000000000000000000000007d18b493f190957d8ee63c1e5012f5e87c9312fa29aed5c179e456625d79015299c2f2a2543b76a4166549f7aab2e75bef0aefc5b0f410182af49447d8a07e3bd95bd0d56f35241523fbab100042e1a7d4d000000000000000000000000000000000000000000000000000000000000000000a0f2fa6b66eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000009de6fc6d5b3c07ab500000000000000000005b6793560e961c061111111125421ca6dc452d289314280a0f8842a6500206b4be0b9111111125421ca6dc452d289314280a0f8842a650000000000000000000000000001dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].WBTC);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].ETH);
        });

        it('Curve + Curve V2: generic swap : FRAX->ETH', async () => {
          const chainId = network.config.chainId!; 
          // swap = 0x07ed2379
          const transactionData = '0x07ed2379000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd0900000000000000000000000017fc002b466eec40dae837fc4be5c67993ddbd6f000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000e2d3f8c3c5597736ea34f1a24c6d3c9000e9796e0000000000000000000000000000000000000000000000004563918244f40000000000000000000000000000000000000000000000000000000571a651c9e3ce0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002dc0000000000000000000000000000000000000000000002be0002a400028e00a007e5c0d200000000000000000000000000026a00026400019400017a0000ca0000b05120c9b8a3fdecb9d5b218d02555a8baf332e5b740d517fc002b466eec40dae837fc4be5c67993ddbd6f00443df0212400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004851f90020d6bdbf78ff970a61a04b1ca14834a43f5de4533ebddb5cc851207f90122bf0700f9e7e1f688fe926940e8839f353ff970a61a04b1ca14834a43f5de4533ebddb5cc800443df021240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000484e2f0020d6bdbf78fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb95120960ea3e3c7fb317332d990873d354e18d7645590fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb90044394747c5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000571a651c9e3ce000000000000000000000000000000000000000000000000000000000000000100206b4be0b9c061111111125421ca6dc452d289314280a0f8842a6500206b4be0b9111111125421ca6dc452d289314280a0f8842a650000000001dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].FRAX);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].ETH);
        });

        it('Curve V2: 1 pool : ETH->USDT', async () => {
          const chainId = network.config.chainId!; 
          // ethUnoswap = 0xa76dfc3b
          const transactionData = '0xa76dfc3b0000000000000000000000000000000000000000000000000000000058c8efe7400000020008020809000000960ea3e3c7fb317332d990873d354e18d764559001dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].ETH);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].USDT);
        });

        it('Curve V2: 1 pool : WBTC->ETH', async () => {
          const chainId = network.config.chainId!; 
          // unoswap = 0x83800a8e
          const transactionData = '0x83800a8e0000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f00000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000b0a8bd264e04480c0201020801080d000000960ea3e3c7fb317332d990873d354e18d764559001dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].WBTC);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].ETH);
        });

        it('Curve V2: 1 pool : WETH->USDT', async () => {
          const chainId = network.config.chainId!; 
          // unoswap = 0x83800a8e
          const transactionData = '0x83800a8e00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000001aa3bf9480000020008020809000000960ea3e3c7fb317332d990873d354e18d764559001dbd640';
        
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].WETH);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].USDT);
        });

        it('Curve + Uniswap V3: generic swap : ETH->FRAX', async () => {
          const chainId = network.config.chainId!; 
          // swap = 0x07ed2379
          const transactionData = '0x07ed2379000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000017fc002b466eec40dae837fc4be5c67993ddbd6f000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000e2d3f8c3c5597736ea34f1a24c6d3c9000e9796e00000000000000000000000000000000000000000000000000b1a2bc2ec500000000000000000000000000000000000000000000000000084b9c28b5c01e885800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000021b0000000000000000000000000000000000000001fd0001cf0001a100015700a007e5c0d200000000000000000000000000000000000000013300011900006900001a404182af49447d8a07e3bd95bd0d56f35241523fbab1d0e30db002a000000000000000000000000000000000000000000000000000000000091badd4ee63c1e501c31e54c7a869b9fcbecc14363cf510d1c41fa44382af49447d8a07e3bd95bd0d56f35241523fbab15120c9b8a3fdecb9d5b218d02555a8baf332e5b740d5ff970a61a04b1ca14834a43f5de4533ebddb5cc800443df021240000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000084b9c28b5c01e88580020d6bdbf7817fc002b466eec40dae837fc4be5c67993ddbd6f00a0f2fa6b6617fc002b466eec40dae837fc4be5c67993ddbd6f000000000000000000000000000000000000000000000008610f83a0504836fa000000000000000045d73f43721047db80a06c4eca2717fc002b466eec40dae837fc4be5c67993ddbd6f111111125421ca6dc452d289314280a0f8842a650020d6bdbf7817fc002b466eec40dae837fc4be5c67993ddbd6f111111125421ca6dc452d289314280a0f8842a65000000000001dbd640';
          
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].ETH);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].FRAX);
        });

        it('Curve + Curve V2: generic swap : FRAX->WBTC', async () => {
          const chainId = network.config.chainId!; 
          // swap = 0x07ed2379
          const transactionData = '0x07ed2379000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd0900000000000000000000000017fc002b466eec40dae837fc4be5c67993ddbd6f0000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000e2d3f8c3c5597736ea34f1a24c6d3c9000e9796e0000000000000000000000000000000000000000000000004563918244f400000000000000000000000000000000000000000000000000000000000000001d4600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000031c0000000000000000000000000000000000000000000002fe0002d00002a200a007e5c0d200000000000000000000000000027e00026400019400017a0000ca0000b05120c9b8a3fdecb9d5b218d02555a8baf332e5b740d517fc002b466eec40dae837fc4be5c67993ddbd6f00443df0212400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004851d30020d6bdbf78ff970a61a04b1ca14834a43f5de4533ebddb5cc851207f90122bf0700f9e7e1f688fe926940e8839f353ff970a61a04b1ca14834a43f5de4533ebddb5cc800443df021240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000484e1a0020d6bdbf78fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb95120960ea3e3c7fb317332d990873d354e18d7645590fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb90044394747c50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d4600000000000000000000000000000000000000000000000000000000000000000020d6bdbf782f2a2543b76a4166549f7aab2e75bef0aefc5b0f80a06c4eca272f2a2543b76a4166549f7aab2e75bef0aefc5b0f111111125421ca6dc452d289314280a0f8842a650020d6bdbf782f2a2543b76a4166549f7aab2e75bef0aefc5b0f111111125421ca6dc452d289314280a0f8842a650000000001dbd640';
          
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].FRAX);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].WBTC);
        });

        it('Curve + Uniswap V3: generic swap : LINK->FRAX', async () => {
          const chainId = network.config.chainId!; 
          // swap = 0x07ed2379
          const transactionData = '0x07ed2379000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000f97f4df75117a78c1a5a0dbb814af92458539fb400000000000000000000000017fc002b466eec40dae837fc4be5c67993ddbd6f000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000e2d3f8c3c5597736ea34f1a24c6d3c9000e9796e000000000000000000000000000000000000007e37be2022c0914b268000000000000000000000000000000000000000000000000000ddad889b6bc216722d9400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000039900000000000000000000000000000000000000037b00034d00031f0002d500a007e5c0d20000000000000000000000000000000000000002b10002970001e700011b00a0c9e75c48000000000000002b06010000000000000000000000000000000000000000000000ed00009e00004f02a00000000000000000000000000000000000000000000000000749515780aa6db8ee63c1e50022127577d772c4098c160b49a8e5cae3012c5824f97f4df75117a78c1a5a0dbb814af92458539fb402a000000000000000000000000000000000000000000000000019bcf5f0e69870edee63c1e50091308bc9ce8ca2db82aa30c65619856cc939d907f97f4df75117a78c1a5a0dbb814af92458539fb402a000000000000000000000000000000000000000000000001260b9dafdea9ab1b6ee63c1e500468b88941e7cc0b88c1869d68ab6b570bcef62fff97f4df75117a78c1a5a0dbb814af92458539fb400a0c9e75c480000000000000000310100000000000000000000000000000000000000000000000000009e00004f02a000000000000000000000000000000000000000000000000000000004df053ee1ee63c1e50117c14d2c404d167802b16c450d3c99f88f2c4f4d82af49447d8a07e3bd95bd0d56f35241523fbab102a0000000000000000000000000000000000000000000000000000000ef45993d6aee63c1e501c31e54c7a869b9fcbecc14363cf510d1c41fa44382af49447d8a07e3bd95bd0d56f35241523fbab15120c9b8a3fdecb9d5b218d02555a8baf332e5b740d5ff970a61a04b1ca14834a43f5de4533ebddb5cc800443df0212400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ddad889b6bc216722d940020d6bdbf7817fc002b466eec40dae837fc4be5c67993ddbd6f00a0f2fa6b6617fc002b466eec40dae837fc4be5c67993ddbd6f00000000000000000000000000000000000000000000e233aff768bb99842e83000000000000000045379fac95462d1180a06c4eca2717fc002b466eec40dae837fc4be5c67993ddbd6f111111125421ca6dc452d289314280a0f8842a650020d6bdbf7817fc002b466eec40dae837fc4be5c67993ddbd6f111111125421ca6dc452d289314280a0f8842a650000000000000001dbd640';
          
          const result = await oneInchV6decoder.decodeExchangeInput(0, transactionData)
  
          expect(result[0].toString()).to.be.equal(TOKENS[chainId].LINK);
          expect(result[1].toString()).to.be.equal(TOKENS[chainId].FRAX);
        });  
    });
});