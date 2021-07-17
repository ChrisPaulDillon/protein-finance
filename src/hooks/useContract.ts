import { useMemo } from "react";
import useWeb3 from "hooks/useWeb3";
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getMasterchefContract,
  getSouschefContract,
  getClaimRefundContract,
  getTradingCompetitionContract,
  getErc721Contract,
  getCakeVaultContract,
  getChainlinkOracleContract,
  getSouschefV2Contract,
} from "utils/contractHelpers";

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getIfoV1Contract(address, web3), [address, web3]);
};

export const useIfoV2Contract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getIfoV2Contract(address, web3), [address, web3]);
};

export const useERC20 = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getBep20Contract(address, web3), [address, web3]);
};

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getErc721Contract(address, web3), [address, web3]);
};

export const useCake = () => {
  const web3 = useWeb3();
  return useMemo(() => getCakeContract(web3), [web3]);
};

export const useBunnyFactory = () => {
  const web3 = useWeb3();
  return useMemo(() => getBunnyFactoryContract(web3), [web3]);
};

export const useMasterchef = () => {
  const web3 = useWeb3();
  return useMemo(() => getMasterchefContract(web3), [web3]);
};

export const useSousChef = (id) => {
  const web3 = useWeb3();
  return useMemo(() => getSouschefContract(id, web3), [id, web3]);
};

export const useSousChefV2 = (id) => {
  const web3 = useWeb3();
  return useMemo(() => getSouschefV2Contract(id, web3), [id, web3]);
};

export const useBunnySpecialContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getBunnySpecialContract(web3), [web3]);
};

export const useClaimRefundContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getClaimRefundContract(web3), [web3]);
};

export const useTradingCompetitionContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getTradingCompetitionContract(web3), [web3]);
};

export const useCakeVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getCakeVaultContract(web3), [web3]);
};

export const useChainlinkOracleContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getChainlinkOracleContract(web3), [web3]);
};
