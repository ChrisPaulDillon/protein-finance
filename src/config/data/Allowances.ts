import { Token, TokenAmount } from "@pancakeswap-libs/sdk";
import { useMemo } from "react";

import { useTokenContract } from "../../hooks/swap/useContract";
import { useSingleCallResult } from "../../state/swap/multicall/hooks";

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const allowance = useSingleCallResult(contract, "allowance", inputs).result;

  return useMemo(
    () =>
      token && allowance
        ? new TokenAmount(token, allowance.toString())
        : undefined,
    [token, allowance]
  );
}

export default useTokenAllowance;
