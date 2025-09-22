import { client } from "@/lib";
import { ERC20Transfer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

// not the best elegant solution, but it works
// subgraph or a more elegant indexer service would be better
// for wallets with a lot of transactions, this implementation is not efficient and crash
async function fetchLogsInChunks({
  token,
  address,
  filter,
  chunkSize = BigInt(5000000),
}: {
  token: { symbol: string; decimals: number; address: `0x${string}` };
  address: `0x${string}`;
  filter: "from" | "to";
  chunkSize?: bigint;
}) {
  const latest = await client.getBlockNumber();
  let from = BigInt(0);
  const transfers: ERC20Transfer[] = [];

  while (from <= latest) {
    const to = from + chunkSize > latest ? latest : from + chunkSize;

    const logs = await client.getLogs({
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
      args: { [filter]: address },
      fromBlock: from,
      toBlock: to,
    });

    for (const event of logs) {
      if (!event.args.from || !event.args.to || event.args.value === undefined) continue;

      transfers.push({
        id: `${event.transactionHash}-${uuidv4()}`,
        blockNumber: event.blockNumber.toString(),
        hash: event.transactionHash,
        from: event.args.from,
        to: event.args.to,
        value: event.args.value.toString(),
        tokenSymbol: token.symbol,
        tokenDecimal: token.decimals,
      });
    }

    from = to + BigInt(1);
  }

  return transfers;
}

export function useTransactions(
  address: `0x${string}`,
  tokens: { symbol: string; decimals: number; address: `0x${string}` }[] = [],
) {
  return useQuery({
    queryKey: ["erc20-transactions", address, tokens.map((t) => t.address)],
    queryFn: async () => {
      if (tokens.length === 0) return [];

      const allTransfers: ERC20Transfer[] = [];

      for (const token of tokens) {
        try {
          const fromTransfers = await fetchLogsInChunks({ token, address, filter: "from" });
          const toTransfers = await fetchLogsInChunks({ token, address, filter: "to" });
          allTransfers.push(...fromTransfers, ...toTransfers);
        } catch (err) {
          console.error(`Error fetching transfers for ${token.symbol}:`, err);
        }
      }

      return allTransfers.sort((a, b) => parseInt(b.blockNumber) - parseInt(a.blockNumber));
    },
    enabled: !!address && tokens.length > 0,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
