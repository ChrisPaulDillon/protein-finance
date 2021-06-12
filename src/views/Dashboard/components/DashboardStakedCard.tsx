import { Box, Center, Text, useColorModeValue } from "@chakra-ui/react";
import { CardBody, Flex } from "@pancakeswap/uikit";
import UnlockButton from "components/UnlockButton";
import { useTranslation } from "contexts/Localization";
import { Pool } from "state/types";
import AprRow from "views/Pools/components/PoolCard/AprRow";
import CardActions from "views/Pools/components/PoolCard/CardActions";
import { BIG_ZERO } from "utils/bigNumber";
import BigNumber from "bignumber.js";
import VaultCardHeader from "../../../newComponents/VaultCardHeader";
import DashboardStakedCardStats from "./DashboardStakedCardStats";
import { useCakeVault } from "state/hooks";
import DashboardCardHeader from "./DashboardCardHeader";
import VaultStakeActions from "views/Pools/components/CakeVaultCard/VaultCardActions/VaultStakeActions";
import DashboardCardStakingBalance from "./DashboardCardStakingBalance";

const DashboardStakedCard: React.FC<{ pool: Pool; account: string }> = ({
  pool,
  account,
}) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool;
  const { t } = useTranslation();
  const stakedBalance = userData?.stakedBalance
    ? new BigNumber(userData.stakedBalance)
    : BIG_ZERO;
  const accountHasStakedBalance = stakedBalance.gt(0);

  console.log(pool);
  const {
    fees: { performanceFee },
  } = useCakeVault();
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;
  const isLoading = !pool.userData;
  const stakingTokenBalance = userData?.stakingTokenBalance
    ? new BigNumber(userData.stakingTokenBalance)
    : BIG_ZERO;

  return (
    <Center py={6}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
      >
        <DashboardCardHeader
          isStaking={accountHasStakedBalance}
          earningTokenSymbol={earningToken.symbol}
          stakingTokenSymbol={stakingToken.symbol}
          isFinished={isFinished && sousId !== 0}
          pool={pool}
          performanceFee={0}
        />
        <CardBody>
          {/* <AprRow pool={pool} /> */}
          <DashboardStakedCardStats pool={pool} account={account} />
          <DashboardCardStakingBalance
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            accountHasSharesStaked={true}
          />
        </CardBody>
      </Box>
    </Center>
  );
};

export default DashboardStakedCard;
