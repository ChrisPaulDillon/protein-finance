import React, { lazy } from "react";
import { Router, Redirect, Route, Switch } from "react-router-dom";
import { ResetCSS } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import useEagerConnect from "hooks/useEagerConnect";
import { usePollCoreFarmData, usePollBlockNumber } from "state/hooks";
import GlobalStyle from "./style/Global";
import Menu from "./components/Menu";
import SuspenseWithChunkError from "./components/SuspenseWithChunkError";
import ToastListener from "./components/ToastListener";
import PageLoader from "./components/PageLoader";
import EasterEgg from "./components/EasterEgg";
import Pools from "./views/Pools";
import history from "./routerHistory";
import NavBar from "newComponents/navBar";
import { Box, Container } from "@chakra-ui/react";

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import("./views/Home"));
const Farms = lazy(() => import("./views/Farms"));
const Dashboard = lazy(() => import("./views/Dashboard"));
const NotFound = lazy(() => import("./views/NotFound"));

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  usePollBlockNumber();
  useEagerConnect();
  usePollCoreFarmData();

  return (
    <Box
      bgGradient="linear(to bottom, #212121, #261d28, #311526, #3d0a1b, #430000)"
      h="100%"
    >
      <Router history={history}>
        <Container maxW="container.xl">
          <NavBar />
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact>
                <Pools />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>

              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </SuspenseWithChunkError>
          <EasterEgg iterations={2} />
          <ToastListener />
        </Container>
      </Router>
    </Box>
  );
};

export default React.memo(App);
