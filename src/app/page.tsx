"use client";

import { WalletConnected, WalletDisconnected } from "@/components";
import { useAccount } from "wagmi";
import styles from "./page.module.css";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className={styles.page}>
      <div>
        {!isConnected && <WalletDisconnected />}
        {isConnected && <WalletConnected />}
      </div>
    </div>
  );
}
