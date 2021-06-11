import { Image } from "@chakra-ui/image";
import { Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { usePriceCakeBusd } from "state/hooks";

const PriceImageToken = () => {
  const cakePriceUsd = usePriceCakeBusd();

  return (
    <Box>
      {cakePriceUsd.s && (
        <Stack isInline>
          {" "}
          <Image
            src="/images/cake.svg"
            alt="cake logo"
            width={25}
            height={25}
          />
          <Text fontSize="lg">{`$${cakePriceUsd.toNumber().toFixed(2)}`}</Text>
        </Stack>
      )}{" "}
    </Box>
  );
};

export default PriceImageToken;
