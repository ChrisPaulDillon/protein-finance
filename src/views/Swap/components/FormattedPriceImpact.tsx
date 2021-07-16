import { Percent } from "@pancakeswap-libs/sdk";
import { ONE_BIPS } from "config/constants/swap";
import React from "react";
import { warningSeverity } from "utils/swap/prices";
import { ErrorText } from "./styleds";

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({
  priceImpact,
}: {
  priceImpact?: Percent;
}) {
  return (
    <ErrorText fontSize="14px" severity={warningSeverity(priceImpact)}>
      {priceImpact
        ? priceImpact.lessThan(ONE_BIPS)
          ? "<0.01%"
          : `${priceImpact.toFixed(2)}%`
        : "-"}
    </ErrorText>
  );
}
