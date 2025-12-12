import { Transaction, TransactionType } from '../types';

const API_BASE_URL = 'https://api.mainnet.hiro.so';

// Helper: Convert Micro-STX to STX
const microToStx = (micro: number | string) => {
  return Number(micro) / 1000000;
};

/**
 * Fetch Real STX Balance from Stacks Blockchain
 */
export const getAccountBalance = async (address: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extended/v1/address/${address}/balances`);
    if (!response.ok) throw new Error('Failed to fetch balance');
    
    const data = await response.json();
    // data.stx.balance is the total balance including locked. 
    // Usually purely available balance is desired, but total is safer for general view.
    return microToStx(data.stx.balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
};

/**
 * Fetch Recent Transactions from Stacks Blockchain
 */
export const getRecentTransactions = async (address: string): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extended/v1/address/${address}/transactions?limit=10`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    
    const data = await response.json();
    
    // Map API results to our App's Transaction interface
    return data.results.map((tx: any) => {
      const isSender = tx.sender_address === address;
      let amount = 0;
      let type = TransactionType.UNKNOWN;
      let description = 'Blockchain Interaction';

      if (tx.tx_type === 'token_transfer') {
        amount = microToStx(tx.token_transfer.amount);
        type = isSender ? TransactionType.WITHDRAWAL : TransactionType.DEPOSIT;
        description = isSender 
          ? `Sent to ${tx.token_transfer.recipient_address.substring(0, 6)}...`
          : `Received from ${tx.sender_address.substring(0, 6)}...`;
      } else if (tx.tx_type === 'contract_call') {
         description = `Contract Call: ${tx.contract_call.function_name}`;
      } else if (tx.tx_type === 'coinbase') {
         type = TransactionType.DEPOSIT;
         description = 'Mining Reward';
      }

      return {
        id: tx.tx_id,
        type: type,
        amount: amount,
        timestamp: tx.burn_block_time ? tx.burn_block_time * 1000 : Date.now(), // Fallback if pending
        description: description,
        recipient: tx.token_transfer?.recipient_address,
        sender: tx.sender_address,
        status: tx.tx_status,
        isRealChain: true
      } as Transaction;
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};
