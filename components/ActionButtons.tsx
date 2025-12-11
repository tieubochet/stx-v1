import React from 'react';

interface ActionButtonsProps {
  onCheckIn: () => void;
  onTransfer: () => void;
  canCheckIn: boolean;
  isProcessing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCheckIn, onTransfer, canCheckIn, isProcessing }) => {
  return (
    <div className="flex justify-center gap-4 w-full max-w-md mx-auto my-8">
      <button
        onClick={onCheckIn}
        disabled={!canCheckIn || isProcessing}
        className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
          canCheckIn 
            ? 'bg-clarity-600/20 border-clarity-500/50 hover:bg-clarity-600/30 hover:border-clarity-400 text-blue-100 cursor-pointer' 
            : 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <div className={`p-3 rounded-full mb-2 ${canCheckIn ? 'bg-clarity-500' : 'bg-gray-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-medium text-sm">Daily Check-in</span>
        {!canCheckIn && <span className="text-[10px] mt-1 text-gray-500">Come back tomorrow</span>}
      </button>

      <button
        onClick={onTransfer}
        disabled={isProcessing}
        className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-crypto-accent/10 border border-crypto-accent/30 hover:bg-crypto-accent/20 hover:border-crypto-accent/50 text-purple-100 transition-all duration-200"
      >
        <div className="p-3 rounded-full bg-crypto-accent mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <span className="font-medium text-sm">Transfer</span>
      </button>
    </div>
  );
};

export default ActionButtons;