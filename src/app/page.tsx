"use client";

import { WalletConnected, WalletDisconnected } from "@/components";
import { useWalletConnection } from "@/hooks";
import styles from "./page.module.css";

export default function Home() {
  const { isConnected, mounted } = useWalletConnection();

  return (
    <div className={styles.page}>
      <div>{!mounted || !isConnected ? <WalletDisconnected /> : <WalletConnected />}</div>
    </div>
  );
}
