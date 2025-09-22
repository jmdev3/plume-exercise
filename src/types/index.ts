export interface ERC20Transfer {
  id: string;
  blockNumber: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  tokenDecimal: number;
}

export interface TransactionResponse {
  status: string;
  message: string;
  result: ERC20Transfer[];
}
