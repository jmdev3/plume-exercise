"use client";

import { WalletConnected, WalletDisconnected } from "@/components";
import { useWalletConnection } from "@/hooks";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const { isConnected, mounted } = useWalletConnection();
  const { id } = useParams();

  return (
    <div className={styles.page}>
      <div>{!mounted || !isConnected ? <WalletDisconnected /> : <WalletConnected address={id as `0x${string}`} />}</div>
    </div>
  );
}
