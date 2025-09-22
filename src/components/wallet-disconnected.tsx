import { Button, Card } from "antd";
import Image from "next/image";
import { useConnect } from "wagmi";
import styles from "./wallet-disconnected.module.css";

export const WalletDisconnected = () => {
  const { connect, connectors } = useConnect();

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  return (
    <Card className={styles.walletDisconnected}>
      <Image src="https://app.nest.credit/images/nest-logo.svg" alt="Wallet" width={80} height={80} />
      <span style={{ marginBottom: 20 }}>Connect your wallet to start using Nest.</span>
      <Button type="primary" onClick={handleConnect}>
        Connect Wallet
      </Button>
    </Card>
  );
};
