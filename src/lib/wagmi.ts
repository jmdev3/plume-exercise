import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [
    {
      id: 98866,
      name: "Plume Mainnet",
      network: "plume",
      rpcUrls: { default: { http: ["https://rpc.plume.org"] } },
      nativeCurrency: { name: "PLUME", symbol: "PLUME", decimals: 18 },
      blockExplorers: { default: { name: "Plume Explorer", url: "https://explorer.plume.org" } },
    },
  ],
  connectors: [injected()],
  transports: {
    [98866]: http(),
  },
});
