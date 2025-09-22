import { useBalances, useTransactions, useWalletConnection } from "@/hooks";
import { truncateAddress } from "@/lib";
import { ERC20Transfer } from "@/types";
import { Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { formatUnits } from "viem";
import { useDisconnect } from "wagmi";
import styles from "./wallet-connected.module.css";

const { Text } = Typography;

const EXAMPLE_TOKEN_ADDRESSES: { symbol: string; decimals: number; address: `0x${string}` }[] = [
  {
    symbol: "nALPHA",
    decimals: 6,
    address: "0x593cCcA4c4bf58b7526a4C164cEEf4003C6388db",
  },
  {
    symbol: "nTBILL",
    decimals: 6,
    address: "0xE72Fe64840F4EF80E3Ec73a1c749491b5c938CB9",
  },
];

const formatAmount = (value: string, decimals: number) => {
  return formatUnits(BigInt(value), decimals);
};

// Format timestamp to readable date
const formatTimestamp = (timestamp: string) => {
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

const columns: ColumnsType<ERC20Transfer> = [
  {
    title: "Transaction",
    dataIndex: "hash",
    key: "hash",
    render: (hash: string) => (
      <Text style={{ textDecoration: "underline", cursor: "pointer" }}>{truncateAddress(hash)}</Text>
    ),
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
    render: (from: string) => (
      <Text style={{ textDecoration: "underline", cursor: "pointer" }}>{truncateAddress(from)}</Text>
    ),
  },
  {
    title: "To",
    dataIndex: "to",
    key: "to",
    render: (to: string) => (
      <Text style={{ textDecoration: "underline", cursor: "pointer" }}>{truncateAddress(to)}</Text>
    ),
  },
  {
    title: "Token",
    dataIndex: "tokenSymbol",
    key: "tokenSymbol",
    render: (symbol: string) => <Text strong>{symbol}</Text>,
  },
  {
    title: "Amount",
    dataIndex: "value",
    key: "amount",
    render: (value: string, record: ERC20Transfer) => <Text>{formatAmount(value, record.tokenDecimal)}</Text>,
  },
  {
    title: "Date & Time",
    dataIndex: "timeStamp",
    key: "timeStamp",
    render: (timestamp: string) => <Text>{formatTimestamp(timestamp)}</Text>,
  },
];

export const WalletConnected = () => {
  const { address } = useWalletConnection();
  const { disconnect } = useDisconnect();
  const { data: balances, isLoading: balancesLoading } = useBalances(address!, EXAMPLE_TOKEN_ADDRESSES);

  const { data: transactions, isLoading: txLoading } = useTransactions(address!, EXAMPLE_TOKEN_ADDRESSES);

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
            PLUME {formatAmount(balances?.native.toString(), 18)}
            {balances?.erc20s.map((balance) => (
              <div key={balance.token.address}>
                {balance.token.symbol} {formatAmount(balance.balance, balance.token.decimals)}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card loading={txLoading} style={{ margin: "20px 0", minWidth: "800px" }}>
        <h3>Transaction history</h3>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="hash"
          pagination={false}
          className={styles.transactionTable}
          style={{ marginTop: "16px" }}
          locale={{
            emptyText: <Text type="secondary">No transactions found</Text>,
          }}
        />
      </Card>
    </>
  );
};
