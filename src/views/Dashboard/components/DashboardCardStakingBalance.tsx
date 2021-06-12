import React from "react";
import { Flex, Button, useModal, Skeleton } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { useTranslation } from "contexts/Localization";
import { Pool } from "state/types";
import HasSharesActions from "views/Pools/components/CakeVaultCard/VaultCardActions/HasSharesActions";
import VaultStakeModal from "views/Pools/components/CakeVaultCard/VaultStakeModal";
import NotEnoughTokensModal from "views/Pools/components/PoolCard/Modals/NotEnoughTokensModal";

interface DashboardCardStakingBalanceProps {
  pool: Pool;
  stakingTokenBalance: BigNumber;
  accountHasSharesStaked: boolean;
  isLoading?: boolean;
}

const DashboardCardStakingBalance: React.FC<DashboardCardStakingBalanceProps> =
  ({
    pool,
    stakingTokenBalance,
    accountHasSharesStaked,
    isLoading = false,
  }) => {
    const { stakingToken } = pool;
    const { t } = useTranslation();
    const [onPresentTokenRequired] = useModal(
      <NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />
    );

    return (
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="100%" height="52px" />
        ) : (
          <HasSharesActions
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
          />
        )}
      </Flex>
    );
  };

export default DashboardCardStakingBalance;
