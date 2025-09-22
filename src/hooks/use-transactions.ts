import { client } from "@/lib";
import { ERC20Transfer } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(
  address: `0x${string}`,
  tokens: { symbol: string; decimals: number; address: `0x${string}` }[] = [],
) {
  return useQuery({
    queryKey: ["erc20-transactions", address, tokens.map((token) => token.address)],
    queryFn: async () => {
      if (tokens.length === 0) {
        return [];
      }

      const transfers: ERC20Transfer[] = [];

      for (const token of tokens) {
        try {
          const fromEvents = await client.getLogs({
            address: token.address,
            event: {
              type: "event",
              name: "Transfer",
              inputs: [
                { name: "from", type: "address", indexed: true },
                { name: "to", type: "address", indexed: true },
                { name: "value", type: "uint256", indexed: false },
              ],
            },
            args: {
              from: address,
            },
            fromBlock: "earliest",
            toBlock: "latest",
          });

          const toEvents = await client.getLogs({
            address: token.address,
            event: {
              type: "event",
              name: "Transfer",
              inputs: [
                { name: "from", type: "address", indexed: true },
                { name: "to", type: "address", indexed: true },
                { name: "value", type: "uint256", indexed: false },
              ],
            },
            args: {
              to: address,
            },
            fromBlock: "earliest",
            toBlock: "latest",
          });

          for (const event of fromEvents) {
            if (!event.args.from || !event.args.to || event.args.value === undefined) {
              continue;
            }

            const block = await client.getBlock({ blockHash: event.blockHash });

            transfers.push({
              timeStamp: block.timestamp.toString(),
              hash: event.transactionHash,
              from: event.args.from,
              to: event.args.to,
              value: event.args.value.toString(),
              tokenSymbol: token.symbol,
              tokenDecimal: token.decimals,
            });
          }

          for (const event of toEvents) {
            if (!event.args.from || !event.args.to || event.args.value === undefined) {
              continue;
            }

            const block = await client.getBlock({ blockHash: event.blockHash });

            transfers.push({
              timeStamp: block.timestamp.toString(),
              hash: event.transactionHash,
              from: event.args.from,
              to: event.args.to,
              value: event.args.value.toString(),
              tokenSymbol: token.symbol,
              tokenDecimal: token.decimals,
            });
          }
        } catch (error) {
          console.error(`Error fetching transfers for token ${tokens}:`, error);
        }
      }

      return transfers.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp));
    },
    enabled: !!address && tokens.length > 0,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
