import { useBalances, useTransactions, useWalletConnection } from "@/hooks";
import { truncateAddress } from "@/lib";
import { Card, List, Typography } from "antd";
import Image from "next/image";
import { useDisconnect } from "wagmi";
import styles from "./wallet-connected.module.css";

const { Text } = Typography;

const EXAMPLE_TOKEN_ADDRESSES: { symbol: string; decimals: number; address: `0x${string}` }[] = [
  {
    symbol: "nALPHA",
    decimals: 18,
    address: "0x593cCcA4c4bf58b7526a4C164cEEf4003C6388db",
  },
  {
    symbol: "nTBILL",
    decimals: 18,
    address: "0xE72Fe64840F4EF80E3Ec73a1c749491b5c938CB9",
  },
];

export const WalletConnected = () => {
  const { address } = useWalletConnection();
  const { disconnect } = useDisconnect();
  const { data: balances, isLoading: balancesLoading } = useBalances(address!, EXAMPLE_TOKEN_ADDRESSES);

  const { data: transactions, isLoading: txLoading, error } = useTransactions(address!, EXAMPLE_TOKEN_ADDRESSES);

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

      <Card style={{ minWidth: "400px" }} loading={balancesLoading}>
        <h3>Your Nest Balance</h3>
        {balances && (
          <div>
            PLUME {balances?.native}
            {balances?.erc20s.map((balance) => (
              <div key={balance.token.address}>
                {balance.token.symbol} {balance.balance}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card loading={txLoading} style={{ margin: "20px 0", minWidth: "400px" }}>
        <h3>Your Nest Transactions</h3>
        {error ? (
          <Text type="danger">Error loading transactions: {error.message}</Text>
        ) : transactions && transactions.length > 0 ? (
          <List
            dataSource={transactions}
            renderItem={(tx) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div>
                      <Text strong>{tx.tokenSymbol}</Text>
                      <Text type="secondary" style={{ marginLeft: "8px" }}>
                        {tx.from === address ? "Sent" : "Received"}
                      </Text>
                    </div>
                  }
                  description={
                    <div>
                      <Text>Amount: {tx.value}</Text>
                      <br />
                      <Text type="secondary">
                        {tx.from === address ? `To: ${truncateAddress(tx.to)}` : `From: ${truncateAddress(tx.from)}`}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Hash: {truncateAddress(tx.hash)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">
            No ERC20 transactions found. Add token addresses to the EXAMPLE_TOKEN_ADDRESSES array to see transactions.
          </Text>
        )}
      </Card>
    </>
  );
};
