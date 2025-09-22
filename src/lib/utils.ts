import { formatUnits } from "viem";

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const EXAMPLE_TOKEN_ADDRESSES: { symbol: string; decimals: number; address: `0x${string}`; icon: string }[] = [
  {
    symbol: "nALPHA",
    decimals: 6,
    address: "0x593cCcA4c4bf58b7526a4C164cEEf4003C6388db",
    icon: "https://app.nest.credit/images/vaults/nest-egg-vault.svg",
  },
  {
    symbol: "nTBILL",
    decimals: 6,
    address: "0xE72Fe64840F4EF80E3Ec73a1c749491b5c938CB9",
    icon: "https://app.nest.credit/images/vaults/nest-treasury-vault.svg",
  },
];

export const formatAmount = (value: string, decimals: number) => {
  return formatUnits(BigInt(value), decimals);
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// hardcoded token prices
// from coingecko (could be implemented pretty easily)
export const tokenPrices = {
  "0x0000000000000000000000000000000000000000": 0.1068,
  "0x593cCcA4c4bf58b7526a4C164cEEf4003C6388db": 1.02,
  "0xE72Fe64840F4EF80E3Ec73a1c749491b5c938CB9": 1.01,
};

export const calculateUsdValue = (value: string, decimals: number, price: number) => {
  return Number(formatUnits(BigInt(value), decimals)) * price;
};
