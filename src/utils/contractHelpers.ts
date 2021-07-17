import Web3 from "web3";
import { AbiItem } from "web3-utils";
import web3NoAccount from "utils/web3";
import { poolsConfig } from "config/constants";
import { PoolCategory } from "config/constants/types";

// Addresses
import {
  getAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getCakeAddress,
  getMasterChefAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddress,
  getCakeVaultAddress,
  getChainlinkOracleAddress,
} from "utils/addressHelpers";

// ABI
import bunnyFactoryAbi from "config/abi/bunnyFactory.json";
import bunnySpecialAbi from "config/abi/bunnySpecial.json";
import bep20Abi from "config/abi/erc20.json";
import erc721Abi from "config/abi/erc721.json";
import lpTokenAbi from "config/abi/lpToken.json";
import cakeAbi from "config/abi/cake.json";
import masterChef from "config/abi/masterchef.json";
import sousChef from "config/abi/sousChef.json";
import sousChefV2 from "config/abi/sousChefV2.json";
import sousChefBnb from "config/abi/sousChefBnb.json";
import claimRefundAbi from "config/abi/claimRefund.json";
import tradingCompetitionAbi from "config/abi/tradingCompetition.json";
import cakeVaultAbi from "config/abi/cakeVault.json";
import chainlinkOracleAbi from "config/abi/chainlinkOracle.json";
import { DEFAULT_GAS_PRICE } from "config";
import { getSettings, getGasPriceInWei } from "./settings";

const getContract = (
  abi: any,
  address: string,
  web3?: Web3,
  account?: string
) => {
  const _web3 = web3 ?? web3NoAccount;
  const gasPrice = account ? getSettings(account).gasPrice : DEFAULT_GAS_PRICE;

  return new _web3.eth.Contract(abi as unknown as AbiItem, address, {
    gasPrice: getGasPriceInWei(gasPrice).toString(),
  });
};

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3);
};
export const getErc721Contract = (address: string, web3?: Web3) => {
  return getContract(erc721Abi, address, web3);
};
export const getLpContract = (address: string, web3?: Web3) => {
  return getContract(lpTokenAbi, address, web3);
};
export const getSouschefContract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id);
  const abi =
    config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef;
  return getContract(abi, getAddress(config.contractAddress), web3);
};
export const getSouschefV2Contract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id);
  return getContract(sousChefV2, getAddress(config.contractAddress), web3);
};
export const getCakeContract = (web3?: Web3) => {
  return getContract(cakeAbi, getCakeAddress(), web3);
};
export const getBunnyFactoryContract = (web3?: Web3) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), web3);
};
export const getBunnySpecialContract = (web3?: Web3) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), web3);
};
export const getMasterchefContract = (web3?: Web3) => {
  return getContract(masterChef, getMasterChefAddress(), web3);
};
export const getClaimRefundContract = (web3?: Web3) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), web3);
};
export const getTradingCompetitionContract = (web3?: Web3) => {
  return getContract(
    tradingCompetitionAbi,
    getTradingCompetitionAddress(),
    web3
  );
};
export const getCakeVaultContract = (web3?: Web3) => {
  return getContract(cakeVaultAbi, getCakeVaultAddress(), web3);
};
export const getChainlinkOracleContract = (web3?: Web3) => {
  return getContract(chainlinkOracleAbi, getChainlinkOracleAddress(), web3);
};
