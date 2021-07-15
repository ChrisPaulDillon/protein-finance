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
import EasterEgg from "./components/EasterEgg";
import Pools from "./views/Pools";
import history from "./routerHistory";
import NavBar from "newComponents/navBar";
import Footer from "newComponents/Footer";
import useFireToast from "./newHooks/useFireToast";
import { Box, Button, Container } from "@chakra-ui/react";

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
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
  useFeatureFlag();

  const { toastSuccess, toastError, toastWarning } = useFireToast();

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
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact>
                <Dashboard />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/farm">
                <Pools />
              </Route>
              <Route path="/docs">
                <Pools />
              </Route>
              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </SuspenseWithChunkError>
          <EasterEgg iterations={2} />
        </Container>
        <Footer />
      </Router>
    </Box>
  );
};

export default React.memo(App);
