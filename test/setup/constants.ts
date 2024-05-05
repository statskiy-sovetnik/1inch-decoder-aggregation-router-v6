export enum Network {
  // Mainnets
  Ethereum = 1,
  Bnb = 56,
  Arbitrum = 42161,
  // Testnets
  EthereumSepolia = 11155111,
  HardhatNetwork = 31337,
  BnbTestnet = 97,
  ArbitrumSepolia = 421614,
}

type TokenList = { [ticker: string]: string }

export type ChainIdToTokenList = { [chainId: number]: TokenList };

export const TOKENS: ChainIdToTokenList = {
  [Network.Arbitrum]: {
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    WBTC: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    LINK: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    crvUSD: "0x498bf2b1e120fed3ad3d42ea2165e9b73f99c1e5",
    FRAX: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
  },
  [Network.HardhatNetwork]: {
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    WBTC: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    LINK: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    crvUSD: "0x498bf2b1e120fed3ad3d42ea2165e9b73f99c1e5",
    FRAX: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
  }
}