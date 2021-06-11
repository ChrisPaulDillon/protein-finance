import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { Heading, Flex, Image, Text, Skeleton } from "@pancakeswap/uikit";
import orderBy from "lodash/orderBy";
import partition from "lodash/partition";
import { useTranslation } from "contexts/Localization";
import usePersistState from "hooks/usePersistState";
import {
  usePools,
  useFetchCakeVault,
  useFetchPublicPoolsData,
  usePollFarmsData,
  useCakeVault,
} from "state/hooks";
import { latinise } from "utils/latinise";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";

import { useGetStats } from "hooks/api";
import VaultContainer from "./newComponents/VaultContainer";

const Hero = styled.div`
  align-items: center;
  background-image: url("/images/pan-bg-mobile.svg");
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url("/images/pan-bg2.svg"), url("/images/pan-bg.svg");
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
`;

const Pools: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  usePollFarmsData();
  useFetchCakeVault();
  useFetchPublicPoolsData();

  const data = useGetStats();
  const tvl = data
    ? data.tvl.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : null;

  return (
    <>
      <Hero>
        <Heading as="h1" scale="xl" mb="24px" color="primary">
          {t("Protein Finance")}
        </Heading>
        {data ? (
          <>
            <Heading scale="xl">{`$${tvl}`}</Heading>
            <Text color="textSubtle">{t("Total Value Locked")}</Text>
          </>
        ) : (
          <Skeleton height={66} />
        )}
      </Hero>

      <Page>
        <VaultContainer />
        <Image
          mx="auto"
          mt="12px"
          src="/images/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        />
      </Page>
    </>
  );
};

export default Pools;
