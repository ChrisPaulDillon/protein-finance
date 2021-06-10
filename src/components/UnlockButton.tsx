import React from "react";
import { useWalletModal } from "@pancakeswap/uikit";
import { Button, Text } from "@chakra-ui/react";
import useAuth from "hooks/useAuth";
import { useTranslation } from "contexts/Localization";
import { useProfile } from "../state/hooks";
import { useWeb3React } from "@web3-react/core";
import { getAbbreviatedAddress } from "../utils/addressHelpers";

const UnlockButton = (props) => {
  const { t } = useTranslation();
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);
  const { account } = useWeb3React();

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {account ? (
        <Text>{getAbbreviatedAddress(account)}</Text>
      ) : (
        t("Unlock Wallet")
      )}
    </Button>
  );
};

export default UnlockButton;