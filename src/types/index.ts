export interface ERC20Transfer {
  timeStamp: string;
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
