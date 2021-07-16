import React from "react";
import { Button, ButtonProps, useWalletModal } from "@pancakeswap-libs/uikit";
import useAuth from "hooks/useAuth";
import useI18n from "hooks/swap/useI18n";

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n();
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, "Unlock Wallet")}
    </Button>
  );
};

export default UnlockButton;
