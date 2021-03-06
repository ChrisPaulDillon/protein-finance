import { Modal } from "@chakra-ui/react";
import { Currency } from "@pancakeswap-libs/sdk";
import useLast from "hooks/swap/useLast";
import React, { useCallback, useEffect, useState } from "react";
import { useSelectedListUrl } from "state/swap/lists/hooks";
import { CurrencySearch } from "./CurrencySearch";
import { ListSelect } from "./ListSelect";

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  // eslint-disable-next-line react/no-unused-prop-types
  showCommonBases?: boolean;
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false);
  const lastOpen = useLast(isOpen);

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false);
    }
  }, [isOpen, lastOpen]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  const handleClickChangeList = useCallback(() => {
    setListView(true);
  }, []);
  const handleClickBack = useCallback(() => {
    setListView(false);
  }, []);

  const selectedListUrl = useSelectedListUrl();
  const noListSelected = !selectedListUrl;

  return (
    <Modal isOpen={isOpen} onClose={onDismiss}>
      {listView ? (
        <ListSelect onDismiss={onDismiss} onBack={handleClickBack} />
      ) : noListSelected ? (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          onChangeList={handleClickChangeList}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}
        />
      ) : (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          onChangeList={handleClickChangeList}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}
        />
      )}
    </Modal>
  );
}
