"use client";

import { truncateAddress } from "@/lib";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import styles from "./wallet-connected.module.css";

export const WalletConnected = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Image src="https://app.nest.credit/images/nest-logo.svg" alt="Wallet" width={60} height={60} />
          <div className={styles.walletAddress}>
            <span onClick={() => disconnect()}>{truncateAddress(address ?? "")}</span>
          </div>
        </div>
      </div>
    </>
  );
};
