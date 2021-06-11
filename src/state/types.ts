import { ThunkAction } from "redux-thunk";
import { AnyAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { FarmConfig, Nft, PoolConfig, Team } from "config/constants/types";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  AnyAction
>;

export type TranslatableText =
  | string
  | {
      key: string;
      data?: {
        [key: string]: string | number;
      };
    };

export type SerializedBigNumber = string;

export interface Farm extends FarmConfig {
  tokenAmountMc?: SerializedBigNumber;
  quoteTokenAmountMc?: SerializedBigNumber;
  tokenAmountTotal?: SerializedBigNumber;
  quoteTokenAmountTotal?: SerializedBigNumber;
  lpTotalInQuoteToken?: SerializedBigNumber;
  lpTotalSupply?: SerializedBigNumber;
  tokenPriceVsQuote?: SerializedBigNumber;
  poolWeight?: SerializedBigNumber;
  userData?: {
    allowance: string;
    tokenBalance: string;
    stakedBalance: string;
    earnings: string;
  };
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber;
  stakingLimit?: BigNumber;
  startBlock?: number;
  endBlock?: number;
  apr?: number;
  stakingTokenPrice?: number;
  earningTokenPrice?: number;
  isAutoVault?: boolean;
  userData?: {
    allowance: BigNumber;
    stakingTokenBalance: BigNumber;
    stakedBalance: BigNumber;
    pendingReward: BigNumber;
  };
}

export interface Profile {
  userId: number;
  points: number;
  teamId: number;
  nftAddress: string;
  tokenId: number;
  isActive: boolean;
  username: string;
  nft?: Nft;
  team: Team;
  hasRegistered: boolean;
}

// Slices states

export interface FarmsState {
  data: Farm[];
  loadArchivedFarmsData: boolean;
  userDataLoaded: boolean;
}

export interface VaultFees {
  performanceFee: number;
  callFee: number;
  withdrawalFee: number;
  withdrawalFeePeriod: number;
}

export interface VaultUser {
  isLoading: boolean;
  userShares: string;
  cakeAtLastUserAction: string;
  lastDepositedTime: string;
  lastUserActionTime: string;
}
export interface CakeVault {
  totalShares?: string;
  pricePerFullShare?: string;
  totalCakeInVault?: string;
  estimatedCakeBountyReward?: string;
  totalPendingCakeHarvest?: string;
  fees?: VaultFees;
  userData?: VaultUser;
}

export interface PoolsState {
  data: Pool[];
  cakeVault: CakeVault;
  userDataLoaded: boolean;
}

// Block

export interface BlockState {
  currentBlock: number;
  initialBlock: number;
}

// Global state

export interface State {
  block: BlockState;
  farms: FarmsState;
  pools: PoolsState;
}
