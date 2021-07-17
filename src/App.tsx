import React, { lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import BigNumber from "bignumber.js";
import useEagerConnect from "hooks/useEagerConnect";
import {
  usePollCoreFarmData,
  usePollBlockNumber,
  useFeatureFlag,
} from "state/hooks";
import SuspenseWithChunkError from "./components/SuspenseWithChunkError";
import PageLoader from "./components/PageLoader";
import Pools from "./views/Pools";
import history from "./routerHistory";
import NavBar from "newComponents/navBar";
import Footer from "newComponents/Footer";
import useFireToast from "./newHooks/useFireToast";
import { Box, Button, Container } from "@chakra-ui/react";
import Swap from "./views/Swap/index";
import Farms from "./views/Farms/Farms";
import { Heading, Skeleton, Text } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useGetStats } from "hooks/api";
import { useTranslation } from "contexts/Localization";

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Dashboard = lazy(() => import("./views/Dashboard"));
const NotFound = lazy(() => import("./views/NotFound"));

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

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

const App: React.FC = () => {
  const { t } = useTranslation();
  usePollBlockNumber();
  useEagerConnect();
  usePollCoreFarmData();
  useFeatureFlag();

  const { toastSuccess, toastError, toastWarning } = useFireToast();

  const data = useGetStats();
  const tvl = data
    ? data.tvl.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : null;

  return (
    <Box
      bgGradient="linear(to bottom, #212121, #261d28, #311526, #3d0a1b, #430000)"
      h="100%"
    >
      <Router history={history}>
        <Container maxW="container.xl">
          <NavBar />
          <Button
            onClick={() => {
              toastSuccess("Success", "Successfully deposited to vault");
              toastError("Error", "Successfully deposited to vault");
              toastWarning("Warning", "Successfully deposited to vault");
            }}
          ></Button>
          <Hero>
            <Heading as="h1" scale="xxl" mb="24px" color="secondary">
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
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact>
                <Dashboard />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/farm">
                <Farms />
              </Route>
              <Route path="/pools">
                <Pools />
              </Route>
              <Route path="/docs">
                <Pools />
              </Route>
              <Route path="/swap">
                <Swap />
              </Route>
              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </SuspenseWithChunkError>
        </Container>
        <Footer />
      </Router>
    </Box>
  );
};

export default React.memo(App);
