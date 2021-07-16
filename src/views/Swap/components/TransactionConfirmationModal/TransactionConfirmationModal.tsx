import { Modal } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import ConfirmationPendingContent from "./ConfirmationPendingContent";
import TransactionSubmittedContent from "./TransactionSubmittedContent";

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
}

const TransactionConfirmationModal = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
}: ConfirmationModalProps) => {
  const { chainId } = useWeb3React();

  if (!chainId) return null;

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onClose={onDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent
          onDismiss={onDismiss}
          pendingText={pendingText}
        />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
        />
      ) : (
        content()
      )}
    </Modal>
  );
};

export default TransactionConfirmationModal;
