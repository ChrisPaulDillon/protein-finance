import React from "react";
import { Image } from "@pancakeswap/uikit";
import {
  useFetchCakeVault,
  useFetchPublicPoolsData,
  usePollFarmsData,
} from "state/hooks";
import Page from "components/layout/Page";

import VaultContainer from "./newComponents/VaultContainer";

const Pools: React.FC = () => {
  usePollFarmsData();
  useFetchCakeVault();
  useFetchPublicPoolsData();

  return (
    <>
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
