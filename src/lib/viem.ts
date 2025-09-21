import { createPublicClient, http } from "viem";

export const client = createPublicClient({
  transport: http("https://rpc.plume.org"),
});
