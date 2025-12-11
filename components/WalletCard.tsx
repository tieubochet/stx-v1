import React from 'react';

interface WalletCardProps {
  balance: number;
  address: string;
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, address }) => {
  return (
    <div className="relative w-full max-w-md mx-auto h-56 rounded-2xl overflow-hidden shadow-2xl transition-transform transform hover:scale-[1.02] duration-300">
      {/* Background with Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-clarity-500 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-crypto-accent opacity-20 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-300 font-medium tracking-wider">TOTAL BALANCE</p>
            <h2 className="text-4xl font-bold mt-1 tracking-tight">
              {balance.toLocaleString()} <span className="text-xl text-clarity-500">STX</span>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-clarity-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">WALLET ADDRESS</p>
          <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-1.5 w-fit backdrop-blur-sm">
            <span className="font-mono text-sm text-gray-200 truncate max-w-[200px]">{address}</span>
            <button className="text-gray-400 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(address)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;