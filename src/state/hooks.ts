import { useEffect, useMemo } from "react";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import { farmsConfig } from "config/constants";
import { getWeb3NoAccount } from "utils/web3";
import { getBalanceAmount } from "utils/formatBalance";
import { BIG_ZERO } from "utils/bigNumber";
import useRefresh from "hooks/useRefresh";
import { filterFarmsByQuoteToken } from "utils/farmsPriceHelpers";
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchCakeVaultFees,
  setBlock,
} from "./actions";
import { State, Farm, Pool, FarmsState } from "./types";
import { transformPool } from "./pools/helpers";
import { fetchPoolsStakingLimitsAsync } from "./pools";
import { fetchFarmUserDataAsync, nonArchivedFarms } from "./farms";
import { setFeaturesEnabled } from "./generic";
import { Feature } from "../components/FeatureFlag";

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  const web3 = getWeb3NoAccount();
  const { account } = useWeb3React();

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms;
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid);

    dispatch(fetchFarmsPublicDataAsync(pids));

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }));
    }
  }, [includeArchive, dispatch, slowRefresh, web3, account]);
};

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch();
  const { fastRefresh } = useRefresh();
  const web3 = getWeb3NoAccount();

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([251, 252]));
  }, [dispatch, fastRefresh, web3]);
};

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch();
  const web3 = getWeb3NoAccount();

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      dispatch(setBlock(blockNumber));
    }, 6000);

    return () => clearInterval(interval);
  }, [dispatch, web3]);
};

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : BIG_ZERO,
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : BIG_ZERO,
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  };
};

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (
  tokenSymbol: string,
  preferredQuoteTokens?: string[]
): Farm => {
  const farms = useSelector((state: State) =>
    state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol)
  );
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens);
  return filteredFarm;
};

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid);
  return farm && new BigNumber(farm.token.busdPrice);
};

export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol);
  const tokenPrice = useBusdPriceFromPid(tokenFarm?.pid);
  return tokenPrice;
};

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol);
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid);
  let lpTokenPrice = BIG_ZERO;

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(
      farm.tokenAmountTotal
    );
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply));
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);
  }

  return lpTokenPrice;
};

// Pools

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  const web3 = getWeb3NoAccount();

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      dispatch(fetchPoolsPublicDataAsync(blockNumber));
    };

    fetchPoolsPublicData();
    dispatch(fetchPoolsStakingLimitsAsync());
  }, [dispatch, slowRefresh, web3]);
};

export const usePools = (
  account
): { pools: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }));
  return { pools: pools.map(transformPool), userDataLoaded };
};

export const usePoolFromPid = (sousId: number): Pool => {
  const pool = useSelector((state: State) =>
    state.pools.data.find((p) => p.sousId === sousId)
  );
  return transformPool(pool);
};

export const useFetchCakeVault = () => {
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCakeVaultPublicData());
  }, [dispatch, fastRefresh]);

  useEffect(() => {
    dispatch(fetchCakeVaultUserData({ account }));
  }, [dispatch, fastRefresh, account]);

  useEffect(() => {
    dispatch(fetchCakeVaultFees());
  }, [dispatch]);
};

export const useCakeVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalCakeInVault: totalCakeInVaultAsString,
    estimatedCakeBountyReward: estimatedCakeBountyRewardAsString,
    totalPendingCakeHarvest: totalPendingCakeHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      cakeAtLastUserAction: cakeAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => state.pools.cakeVault);

  const estimatedCakeBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyRewardAsString);
  }, [estimatedCakeBountyRewardAsString]);

  const totalPendingCakeHarvest = useMemo(() => {
    return new BigNumber(totalPendingCakeHarvestAsString);
  }, [totalPendingCakeHarvestAsString]);

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString);
  }, [totalSharesAsString]);

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString);
  }, [pricePerFullShareAsString]);

  const totalCakeInVault = useMemo(() => {
    return new BigNumber(totalCakeInVaultAsString);
  }, [totalCakeInVaultAsString]);

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString);
  }, [userSharesAsString]);

  const cakeAtLastUserAction = useMemo(() => {
    return new BigNumber(cakeAtLastUserActionAsString);
  }, [cakeAtLastUserActionAsString]);

  return {
    totalShares,
    pricePerFullShare,
    totalCakeInVault,
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      cakeAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  };
};

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(252);
  return new BigNumber(bnbBusdFarm.quoteToken.busdPrice);
};

export const usePriceCakeBusd = (): BigNumber => {
  const cakeBnbFarm = useFarmFromPid(251);
  return new BigNumber(cakeBnbFarm.token.busdPrice);
};

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block);
};

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock);
};

export const useFeatureFlag = () => {
  const dispatch = useAppDispatch();
  const features = process.env.REACT_APP_FEATURES;
  const featureArr = features.split(",") as Feature[];
  dispatch(setFeaturesEnabled(featureArr));
};
