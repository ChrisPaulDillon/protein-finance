import React from "react";
import { CardHeader, Heading, Text, Flex, Image } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";

// const Wrapper = styled(CardHeader)<{
//   isFinished?: boolean;
//   background?: string;
// }>`
//   background: ${({ isFinished, background, theme }) =>
//     isFinished ? theme.colors.backgroundDisabled : null};
// `;

const VaultCardHeader: React.FC<{
  earningTokenSymbol: string;
  stakingTokenSymbol: string;
  isAutoVault?: boolean;
  isFinished?: boolean;
  isStaking?: boolean;
}> = ({
  earningTokenSymbol,
  stakingTokenSymbol,
  isFinished = false,
  isAutoVault = false,
  isStaking = false,
}) => {
  const { t } = useTranslation();
  const poolImageSrc = isAutoVault
    ? `cake-cakevault.svg`
    : `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase();

  const isCakePool =
    earningTokenSymbol === "CAKE" && stakingTokenSymbol === "CAKE";

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return t("Auto");
    }
    if (isCakePool) {
      // manual cake
      return t("Manual");
    }
    // all other pools
    return t("Earn");
  };

  const getSubHeading = () => {
    if (isAutoVault) {
      return t("Automatic restaking");
    }
    if (isCakePool) {
      return t("Earn CAKE, stake CAKE");
    }
    return t("Stake %symbol%", { symbol: stakingTokenSymbol });
  };

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex flexDirection="column">
        <Heading color={isFinished ? "textDisabled" : "body"} scale="lg">
          {`${getHeadingPrefix()} ${earningTokenSymbol}`}
        </Heading>
        <Text color={isFinished ? "textDisabled" : "textSubtle"}>
          {getSubHeading()}
        </Text>
      </Flex>
      <Image
        src={`/images/pools/${poolImageSrc}`}
        alt={earningTokenSymbol}
        width={64}
        height={64}
      />
    </Flex>
  );
};

export default VaultCardHeader;
