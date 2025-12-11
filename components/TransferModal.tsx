import React, { useState } from 'react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipient: string, amount: number) => void;
  maxAmount: number;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, onConfirm, maxAmount }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (recipient && val > 0 && val <= maxAmount) {
      onConfirm(recipient, val);
      setRecipient('');
      setAmount('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 text-white">Transfer Tokens</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Recipient Address</label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="SP3..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-clarity-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Amount (Max: {maxAmount})</label>
            <input
              type="number"
              required
              min="1"
              max={maxAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-clarity-500 transition-colors"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-crypto-accent hover:bg-crypto-accent/80 text-white transition-colors shadow-lg shadow-purple-900/20"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;