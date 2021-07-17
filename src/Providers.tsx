import React from "react";
import { ModalProvider } from "@pancakeswap/uikit";
import { Web3ReactProvider } from "@web3-react/core";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { getLibrary } from "utils/web3React";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { LanguageProvider } from "contexts/Localization";
import { RefreshContextProvider } from "contexts/RefreshContext";
import store from "state";
import { ChakraProvider } from "@chakra-ui/react";

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <HelmetProvider>
          <ThemeContextProvider>
            <LanguageProvider>
              <RefreshContextProvider>
                <ChakraProvider>
                  <ModalProvider>{children}</ModalProvider>
                </ChakraProvider>
              </RefreshContextProvider>
            </LanguageProvider>
          </ThemeContextProvider>
        </HelmetProvider>
      </Provider>
    </Web3ReactProvider>
  );
};

export default Providers;
