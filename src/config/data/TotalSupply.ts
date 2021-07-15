import { BigNumber } from "@ethersproject/bignumber";
import { Token, TokenAmount } from "@pancakeswap-libs/sdk";
import { useTokenContract } from "../../hooks/swap/useContract";
import { useSingleCallResult } from "../../state/swap/multicall/hooks";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const totalSupply: BigNumber = useSingleCallResult(contract, "totalSupply")
    ?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
}

export default useTotalSupply;
