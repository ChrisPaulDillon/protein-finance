import React from "react";
import styled from "styled-components";
import {
  Skeleton,
  Text,
  useTooltip,
  HelpIcon,
  Flex,
  Box,
  useModal,
  useMatchBreakpoints,
} from "@pancakeswap/uikit";
import { Pool } from "state/types";
import BigNumber from "bignumber.js";
import { PoolCategory } from "config/constants/types";
import { BIG_ZERO } from "utils/bigNumber";
import {
  formatNumber,
  getBalanceNumber,
  getFullDisplayBalance,
} from "utils/formatBalance";
import Balance from "components/Balance";
import { useCakeVault } from "state/hooks";
import { useTranslation } from "contexts/Localization";
import { getCakeVaultEarnings } from "views/Pools/helpers";
import CollectModal from "views/Pools/components/PoolCard/Modals/CollectModal";
import DashboardCardYield from "./DashboardCardYield";
import BaseCell, {
  CellContent,
} from "views/Pools/components/PoolsTable/Cells/BaseCell";
import { Stack } from "@chakra-ui/react";

interface EarningsCellProps {
  pool: Pool;
  account: string;
  userDataLoaded?: boolean;
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`;

const HelpIconWrapper = styled.div`
  align-self: center;
`;

const DashboardStakedCardStats: React.FC<EarningsCellProps> = ({
  pool,
  account,
}) => {
  const { t } = useTranslation();
  const { isXs, isSm } = useMatchBreakpoints();
  const {
    sousId,
    earningToken,
    poolCategory,
    userData,
    earningTokenPrice,
    isAutoVault,
  } = pool;
  const isManualCakePool = sousId === 0;

  const earnings = userData?.pendingReward
    ? new BigNumber(userData.pendingReward)
    : BIG_ZERO;
  // These will be reassigned later if its Auto CAKE vault
  let earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals);
  let earningTokenDollarBalance = getBalanceNumber(
    earnings.multipliedBy(earningTokenPrice),
    earningToken.decimals
  );
  let hasEarnings = account && earnings.gt(0);
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals);
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3);
  const earningsDollarValue = formatNumber(earningTokenDollarBalance);
  const isBnbPool = poolCategory === PoolCategory.BINANCE;

  // Auto CAKE vault calculations
  const {
    userData: { cakeAtLastUserAction, userShares, lastUserActionTime },
    pricePerFullShare,
  } = useCakeVault();
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } =
    getCakeVaultEarnings(
      account,
      cakeAtLastUserAction,
      userShares,
      pricePerFullShare,
      earningTokenPrice
    );

  const lastActionInMs =
    lastUserActionTime && parseInt(lastUserActionTime) * 1000;
  const dateTimeLastAction = new Date(lastActionInMs);
  const dateStringToDisplay = dateTimeLastAction.toLocaleString();

  //   const labelText = isAutoVault
  //     ? t("Recent CAKE profit")
  //     : t("%asset% Earned", { asset: earningToken.symbol });
  earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance;
  hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings;
  earningTokenDollarBalance = isAutoVault
    ? autoUsdToDisplay
    : earningTokenDollarBalance;

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance
        fontSize="16px"
        value={autoCakeToDisplay}
        decimals={3}
        bold
        unit=" CAKE"
      />
      <Balance
        fontSize="16px"
        value={autoUsdToDisplay}
        decimals={2}
        bold
        prefix="~$"
      />
      {t("Earned since your last action")}
      <Text>{dateStringToDisplay}</Text>
    </>,
    { placement: "bottom" }
  );

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isManualCakePool}
    />
  );

  const handleEarningsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onPresentCollect();
  };

  return (
    <StyledCell role="cell">
      <CellContent>
        {/* <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text> */}
        {tooltipVisible && tooltip}
        <Flex>
          <Box
            mr="8px"
            height="32px"
            onClick={
              !isAutoVault && hasEarnings ? handleEarningsClick : undefined
            }
          >
            <Stack isInline>
              <DashboardCardYield
                mt="4px"
                bold={!isXs && !isSm}
                fontSize={isXs || isSm ? "14px" : "16px"}
                color={hasEarnings ? "primary" : "textDisabled"}
                decimals={hasEarnings ? 5 : 1}
                value={hasEarnings ? earningTokenBalance : 0}
              />
              {hasEarnings && (
                <Box pt={1}>
                  <DashboardCardYield
                    display="inline"
                    fontSize={isXs || isSm ? "14px" : "16px"}
                    color={hasEarnings ? "textSubtle" : "textDisabled"}
                    decimals={2}
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                </Box>
              )}
            </Stack>
          </Box>
          <Box pt={2}>
            {isAutoVault && hasEarnings && !isXs && !isSm && (
              <HelpIconWrapper ref={targetRef}>
                <HelpIcon color="textSubtle" />
              </HelpIconWrapper>
            )}
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  );
};

export default DashboardStakedCardStats;