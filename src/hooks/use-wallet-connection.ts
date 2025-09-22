"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useWalletConnection = () => {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial render, always return false
  if (!mounted) {
    return {
      isConnected: false,
      address: undefined,
      mounted: false,
    };
  }

  return {
    isConnected,
    address,
    mounted: true,
  };
};
