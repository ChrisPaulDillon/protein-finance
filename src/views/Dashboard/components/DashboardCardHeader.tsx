import React from "react";
import { CardHeader, Heading, Text, Flex, Image } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";
import { Stack } from "@chakra-ui/react";
import { Pool } from "../../../state/types";
import Balance from "components/Balance";
import { getAprData } from "views/Pools/helpers";

// const Wrapper = styled(CardHeader)<{
//   isFinished?: boolean;
//   background?: string;
// }>`
//   background: ${({ isFinished, background, theme }) =>
//     isFinished ? theme.colors.backgroundDisabled : null};
// `;

const DashboardCardHeader: React.FC<{
  earningTokenSymbol: string;
  stakingTokenSymbol: string;
  isAutoVault?: boolean;
  isFinished?: boolean;
  isStaking?: boolean;
  pool: Pool;
  performanceFee;
}> = ({
  earningTokenSymbol,
  stakingTokenSymbol,
  isFinished = false,
  isAutoVault = false,
  isStaking = false,
  pool,
  performanceFee = 0,
}) => {
  const { t } = useTranslation();
  const poolImageSrc = isAutoVault
    ? `cake-cakevault.svg`
    : `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase();

  const isCakePool =
    earningTokenSymbol === "CAKE" && stakingTokenSymbol === "CAKE";

  //   const getHeadingPrefix = () => {
  //     if (isAutoVault) {
  //       // vault
  //       return t("Auto");
  //     }
  //     if (isCakePool) {
  //       // manual cake
  //       return t("Manual");
  //     }
  //     // all other pools
  //     return t("Earn");
  //   };

  //   const getSubHeading = () => {
  //     if (isAutoVault) {
  //       return t("Automatic restaking");
  //     }
  //     if (isCakePool) {
  //       return t("Earn CAKE, stake CAKE");
  //     }
  //     return t("Stake %symbol%", { symbol: stakingTokenSymbol });
  //   };

  const {
    apr: earningsPercentageToDisplay,
    roundingDecimals,
    compoundFrequency,
  } = getAprData(pool, performanceFee);

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex flexDirection="column" width="100%">
        <Heading
          color={isFinished ? "textDisabled" : "body"}
          scale="lg"
          textAlign="left"
        >
          {earningTokenSymbol}
        </Heading>
        <Stack isInline mt={2}>
          {" "}
          <Text size="sm">APY: </Text>
          <Balance
            fontSize="16px"
            isDisabled={isFinished}
            value={earningsPercentageToDisplay}
            decimals={2}
            unit="%"
            bold
          />
        </Stack>
        {/* <Text color={isFinished ? "textDisabled" : "textSubtle"}>
          {getSubHeading()}
        </Text> */}
      </Flex>
      <Image
        src={`/images/pools/${poolImageSrc}`}
        alt={earningTokenSymbol}
        width={50}
        height={50}
      />
    </Flex>
  );
};

export default DashboardCardHeader;
