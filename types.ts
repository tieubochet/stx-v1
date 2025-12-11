export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  CHECK_IN = 'CHECK_IN'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: number;
  description: string;
  recipient?: string;
}

export interface WalletState {
  balance: number;
  lastCheckIn: number | null; // Timestamp
  transactions: Transaction[];
}

export interface AIAdvice {
  message: string;
  sentiment: 'positive' | 'neutral' | 'caution';
}