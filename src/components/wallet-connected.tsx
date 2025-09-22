import { useBalances, useTransactions, useWalletConnection } from "@/hooks";
import {
  calculateUsdValue,
  client,
  EXAMPLE_TOKEN_ADDRESSES,
  formatAmount,
  formatTimestamp,
  tokenPrices,
  truncateAddress,
} from "@/lib";
import { ERC20Transfer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Card, Input, Table, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isAddress } from "viem";
import { useDisconnect } from "wagmi";
import styles from "./wallet-connected.module.css";

const { Text } = Typography;

const columns = [
  {
    title: "Transaction",
    dataIndex: "hash",
    key: "hash",
    render: (hash: string) => <Text className={styles.clickableText}>{truncateAddress(hash)}</Text>,
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
    render: (from: string) => <Text className={styles.clickableText}>{truncateAddress(from)}</Text>,
  },
  {
    title: "To",
    dataIndex: "to",
    key: "to",
    render: (to: string) => <Text className={styles.clickableText}>{truncateAddress(to)}</Text>,
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
    dataIndex: "blockNumber",
    key: "blockNumber",
    render: (blockNumber: bigint) => <BlockNumberColumn blockNumber={blockNumber} />,
  },
];

export const WalletConnected = ({ address: addressProp }: { address?: `0x${string}` }) => {
  const { address } = useWalletConnection();
  const { disconnect } = useDisconnect();
  const [search, setSearch] = useState(addressProp || "");
  const router = useRouter();

  const validAddress = isAddress(addressProp || "") ? addressProp! : address!;

  const { data: balances, isLoading: balancesLoading } = useBalances(validAddress, EXAMPLE_TOKEN_ADDRESSES);
  const { data: transactions, isLoading: txLoading } = useTransactions(validAddress, EXAMPLE_TOKEN_ADDRESSES);

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSearch = () => {
    if (isAddress(search)) {
      router.push(`/address/${search as `0x${string}`}`);
    } else {
      alert("Invalid address format");
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Image src="https://app.nest.credit/images/nest-logo.svg" alt="Wallet" width={60} height={60} />
          <Input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Paste address"
            onPressEnter={handleSearch}
          />
          <div className={styles.walletAddress}>
            <span onClick={handleDisconnect}>{truncateAddress(address ?? "")}</span>
          </div>
        </div>
      </div>

      <Card className={styles.balanceCard} loading={balancesLoading}>
        <h3>Your Nest Balance</h3>
        {balances && (
          <div className={styles.balanceContainer}>
            <TokenBalanceItem
              logo="https://icons-ckg.pages.dev/stargate-light/networks/plumephoenix.svg"
              symbol="PLUME"
              decimals={18}
              balance={balances?.native.toString()}
              price={tokenPrices["0x0000000000000000000000000000000000000000"]}
            />
            {balances?.erc20s.map((balance) => (
              <TokenBalanceItem
                key={balance.token.address}
                logo={balance.token.icon}
                symbol={balance.token.symbol}
                decimals={balance.token.decimals}
                balance={balance.balance}
                price={tokenPrices[balance.token.address as keyof typeof tokenPrices]}
              />
            ))}
          </div>
        )}
      </Card>

      <Card loading={txLoading} className={styles.transactionCard}>
        <h3>Transaction history</h3>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{
            pageSize: 5,
            size: "default",
            showSizeChanger: false,
          }}
          className={`${styles.transactionTable} ${styles.tableContainer}`}
          locale={{
            emptyText: <Text type="secondary">No transactions found</Text>,
          }}
        />
      </Card>
    </>
  );
};

const TokenBalanceItem = ({
  logo,
  symbol,
  decimals,
  balance,
  price,
}: {
  logo: string;
  symbol: string;
  decimals: number;
  balance: string;
  price: number;
}) => {
  return (
    <div key={symbol} className={styles.tokenBalanceItemContainer}>
      <div className={styles.tokenBalanceItem}>
        <Image className={styles.tokenImage} src={logo} alt={symbol} width={30} height={30} />
        <Text strong className={styles.tokenAmount}>
          {formatAmount(balance, decimals)}
        </Text>
      </div>
      <Text type="secondary">${calculateUsdValue(balance, decimals, price)}</Text>
    </div>
  );
};

const BlockNumberColumn = ({ blockNumber }: { blockNumber: bigint }) => {
  const { data: block, isLoading: blockLoading } = useQuery({
    queryKey: ["block", blockNumber],
    queryFn: async () => {
      const block = await client.getBlock({ blockNumber: blockNumber });
      return block;
    },
  });

  if (blockLoading) return <Text>Loading...</Text>;

  return <Text>{formatTimestamp(block?.timestamp.toString() ?? "")}</Text>;
};
