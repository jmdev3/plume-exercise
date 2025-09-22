import { client } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { erc20Abi } from "viem";

export function useBalances(
  address: `0x${string}`,
  tokens: { symbol: string; decimals: number; address: `0x${string}` }[],
) {
  return useQuery({
    queryKey: ["balances", address],
    queryFn: async () => {
      const native = await client.getBalance({ address });
      const erc20s = await Promise.all(
        tokens.map(async (token) => {
          const balance = await client.readContract({
            address: token.address,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          });

          return {
            token: token,
            balance: balance.toString(),
          };
        }),
      );
      return { native, erc20s };
    },
    enabled: !!address,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
