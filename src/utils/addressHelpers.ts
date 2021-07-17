import addresses from "config/constants/contracts";
import tokens from "config/constants/tokens";
import { Address } from "config/constants/types";

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[mainNetChainId];
};

export const getAbbreviatedAddress = (address: string) => {
  const len = address.length;
  const first3 = address.substring(0, 5);
  const last3 = address.substring(len - 5, len);
  return first3 + "..." + last3;
};

export const getCakeAddress = () => {
  return getAddress(tokens.cake.address);
};

export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef);
};
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address);
};
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile);
};
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits);
};
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory);
};
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund);
};
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial);
};
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition);
};
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault);
};
export const getChainlinkOracleAddress = () => {
  return getAddress(addresses.chainlinkOracle);
};
