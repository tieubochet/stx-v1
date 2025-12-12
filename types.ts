export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  CHECK_IN = 'CHECK_IN', // Keep check-in for local points
  UNKNOWN = 'UNKNOWN'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: number;
  description: string;
  recipient?: string;
  sender?: string;
  status?: 'success' | 'pending' | 'failed';
  isRealChain: boolean; // Distinguish between real STX txs and local check-in txs
}

export interface WalletState {
  stxBalance: number; // Real STX Balance
  rewardPoints: number; // Local "Teeboo Points"
  lastCheckIn: number | null;
  transactions: Transaction[];
}
