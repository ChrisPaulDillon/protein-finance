import React, { useMemo, useRef, useState } from "react";
import { Image } from "@chakra-ui/image";
import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useCakeVault, useFarms, usePools } from "state/hooks";
import partition from "lodash/partition";
import BigNumber from "bignumber.js";
import usePersistState from "hooks/usePersistState";
import { ViewMode } from "views/Farms/components/types";
import { useTranslation } from "contexts/Localization";
import DashboardStakedCard from "./DashboardStakedCard";

interface DashboardContainerProps {
  platform: string;
  imgSource: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  platform,
  imgSource,
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { pools: poolsWithoutAutoVault } = usePools(account);
  const [stakedOnly, setStakedOnly] = usePersistState(false, {
    localStorageKey: "pancake_pool_staked",
  });

  const { data: farmsLP } = useFarms();
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

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished),
    [pools]
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

  const poolsToShow = () => {
    return stakedOnlyOpenPools;
  };

  return (
    <Box
      //   maxW={"320px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"lg"}
      p={1}
      textAlign={"center"}
    >
      <Stack isInline alignContent="center" w="100%" justify="center">
        <Image src={imgSource} h={50} w={50} />
        <Heading textAlign="center">{platform}</Heading>
      </Stack>
      {poolsToShow()?.map((pool) => (
        <DashboardStakedCard pool={pool} account={account} />
      ))}
    </Box>
  );
};

export default DashboardContainer;
