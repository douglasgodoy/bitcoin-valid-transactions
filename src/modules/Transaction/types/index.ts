export type Transaction = {
  involvesWatchonly: boolean;
  account: string;
  address: string;
  category: string;
  amount: number;
  label: string;
  confirmations: number;
  blockhash: string;
  blockindex: number;
  blocktime: number;
  txid: string;
  vout: number;
  walletconflicts: any[];
  time: number;
  timereceived: number;
  bip125_replaceable: string;
};

export type TransactionFromDB = {
  Amount: number;
  PK: string;
  SK: string;
  Confirmations: number;
  Label: string;
  Category: string;
  Txid: string;
  Blockindex: number;
  ReceivedAt: number;
};
