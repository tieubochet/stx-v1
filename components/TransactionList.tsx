import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No transactions yet.</p>
        <p className="text-sm mt-1">Check-in to start earning!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-200 mb-4 px-1">Transaction History</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="glass-panel rounded-xl p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === TransactionType.CHECK_IN ? 'bg-green-500/20 text-green-400' :
                tx.type === TransactionType.WITHDRAWAL ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {tx.type === TransactionType.CHECK_IN && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {tx.type === TransactionType.WITHDRAWAL && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-200">{tx.description}</p>
                <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            <div className={`font-mono font-semibold ${
              tx.type === TransactionType.WITHDRAWAL ? 'text-gray-400' : 'text-green-400'
            }`}>
              {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}{tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;