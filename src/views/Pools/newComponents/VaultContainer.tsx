import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchInput from "components/SearchInput";
import Select, { OptionProps } from "components/Select/Select";
import { Pool } from "state/types";
import PoolCard from "../components/PoolCard";
import CakeVaultCard from "../components/CakeVaultCard";
import PoolTabButtons from "../components/PoolTabButtons";
import BountyCard from "../components/BountyCard";
import HelpButton from "../components/HelpButton";
import PoolsTable from "../components/PoolsTable/PoolsTable";
import { ViewMode } from "../components/ToggleView/ToggleView";
import { getAprData, getCakeVaultEarnings } from "../helpers";
import VaultCard from "views/Pools/newComponents/VaultCard";
import { useCakeVault, usePools } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import usePersistState from "hooks/usePersistState";
import BigNumber from "bignumber.js";
import { orderBy, partition } from "lodash";
import styled from "styled-components";
import FlexLayout from "components/layout/Flex";
import { latinise } from "utils/latinise";
import { Heading, Flex, Image, Text, Skeleton, Box } from "@pancakeswap/uikit";
import { useTranslation } from "contexts/Localization";

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`;

const PoolControls = styled(Flex)`
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`;

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`;

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`;

const VaultContainer = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account);
  const [stakedOnly, setStakedOnly] = usePersistState(false, {
    localStorageKey: "pancake_pool_staked",
  });

  const [observerIsSet, setObserverIsSet] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, {
    localStorageKey: "pancake_farm_view",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("hot");
  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault();

  const NUMBER_OF_POOLS_VISIBLE = 12;
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(
    NUMBER_OF_POOLS_VISIBLE
  );
  const accountHasVaultShares = userShares && userShares.gt(0);
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;

  const pools = useMemo(() => {
    const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0);
    const cakeAutoVault = { ...cakePool, isAutoVault: true };
    return [cakeAutoVault, ...poolsWithoutAutoVault];
  }, [poolsWithoutAutoVault]);

  const handleChangeSearchQuery = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished),
    [pools]
  );
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares;
        }
        return (
          pool.userData &&
          new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
        );
      }),
    [finishedPools, accountHasVaultShares]
  );

  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares;
        }
        return (
          pool.userData &&
          new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
        );
      }),
    [openPools, accountHasVaultShares]
  );

  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0;

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case "apr":
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (pool: Pool) =>
            pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0,
          "desc"
        );
      case "earned":
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0;
            }
            return pool.isAutoVault
              ? getCakeVaultEarnings(
                  account,
                  cakeAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice
                ).autoUsdToDisplay
              : pool.userData.pendingReward
                  .times(pool.earningTokenPrice)
                  .toNumber();
          },
          "desc"
        );
      case "totalStaked":
        return orderBy(
          poolsToSort,
          (pool: Pool) =>
            pool.isAutoVault
              ? totalCakeInVault.toNumber()
              : pool.totalStaked.toNumber(),
          "desc"
        );
      default:
        return poolsToSort;
    }
  };

  const poolsToShow = () => {
    let chosenPools = [];

    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools;

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase());
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(
          lowercaseQuery
        )
      );
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible);
  };

  const cardLayout = (
    <CardLayout>
      {poolsToShow().map((pool) => (
        <VaultCard key={pool.sousId} pool={pool} account={account} />
      ))}
    </CardLayout>
  );

  const tableLayout = (
    <PoolsTable
      pools={poolsToShow()}
      account={account}
      userDataLoaded={userDataLoaded}
    />
  );

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible(
          (poolsCurrentlyVisible) =>
            poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        );
      }
    };

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: "0px",
        threshold: 1,
      });
      loadMoreObserver.observe(loadMoreRef.current);
      setObserverIsSet(true);
    }
  }, [observerIsSet]);

  return (
    <Box>
      {" "}
      <PoolControls justifyContent="space-between">
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <SearchSortContainer>
          <Flex flexDirection="column" width="50%">
            <Text
              fontSize="12px"
              bold
              color="textSubtle"
              textTransform="uppercase"
            >
              {t("Sort by")}
            </Text>
            <ControlStretch>
              <Select
                options={[
                  {
                    label: t("Hot"),
                    value: "hot",
                  },
                  {
                    label: t("APR"),
                    value: "apr",
                  },
                  {
                    label: t("Earned"),
                    value: "earned",
                  },
                  {
                    label: t("Total staked"),
                    value: "totalStaked",
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </ControlStretch>
          </Flex>
          <Flex flexDirection="column" width="50%">
            <Text
              fontSize="12px"
              bold
              color="textSubtle"
              textTransform="uppercase"
            >
              {t("Search")}
            </Text>
            <ControlStretch>
              <SearchInput
                onChange={handleChangeSearchQuery}
                placeholder="Search Pools"
              />
            </ControlStretch>
          </Flex>
        </SearchSortContainer>
      </PoolControls>
      {viewMode === ViewMode.CARD ? cardLayout : tableLayout})
      <div ref={loadMoreRef} />
    </Box>
  );
};

export default VaultContainer;
