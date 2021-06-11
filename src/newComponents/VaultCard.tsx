import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { CardBody, Flex } from "@pancakeswap/uikit";
import UnlockButton from "components/UnlockButton";
import { useTranslation } from "contexts/Localization";
import { Pool } from "state/types";
import AprRow from "views/Pools/components/PoolCard/AprRow";
import CardActions from "views/Pools/components/PoolCard/CardActions";
import { BIG_ZERO } from "utils/bigNumber";
import BigNumber from "bignumber.js";
import StyledCardHeader from "views/Pools/components/PoolCard/StyledCardHeader";
import VaultCardHeader from "./VaultCardHeader";

const VaultCard: React.FC<{ pool: Pool; account: string }> = ({
  pool,
  account,
}) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool;
  const { t } = useTranslation();
  const stakedBalance = userData?.stakedBalance
    ? new BigNumber(userData.stakedBalance)
    : BIG_ZERO;
  const accountHasStakedBalance = stakedBalance.gt(0);

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
        <VaultCardHeader
          isStaking={accountHasStakedBalance}
          earningTokenSymbol={earningToken.symbol}
          stakingTokenSymbol={stakingToken.symbol}
          isFinished={isFinished && sousId !== 0}
        />
        <CardBody>
          <AprRow pool={pool} />
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <CardActions pool={pool} stakedBalance={stakedBalance} />
            ) : (
              <>
                <Text
                  mb="10px"
                  textTransform="uppercase"
                  fontSize="12px"
                  color="textSubtle"
                  bold
                >
                  {t("Start earning")}
                </Text>
                <UnlockButton />
              </>
            )}
          </Flex>
        </CardBody>
      </Box>
    </Center>
  );
};

export default VaultCard;
