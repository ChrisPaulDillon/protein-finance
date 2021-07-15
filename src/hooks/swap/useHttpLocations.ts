import { useMemo } from "react";
import contenthashToUri from "../../utils/swap/contenthashToUri";
import { parseENSAddress } from "../../utils/swap/parseENSAddress";
import uriToHttp from "../../utils/swap/uriToHttp";
import useENSContentHash from "./useENSContentHash";

export default function useHttpLocations(uri: string | undefined): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri]);
  const resolvedContentHash = useENSContentHash(ens?.ensName);
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash
        ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash))
        : [];
    }
    return uri ? uriToHttp(uri) : [];
  }, [ens, resolvedContentHash.contenthash, uri]);
}
