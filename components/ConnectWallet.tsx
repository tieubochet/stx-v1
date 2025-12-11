import React from 'react';

interface ConnectWalletProps {
  onConnect: () => void;
  isConnecting: boolean;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect, isConnecting }) => {
  return (
    <div className="min-h-screen bg-crypto-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-clarity-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-md w-full text-center space-y-8 p-8 glass-panel rounded-3xl border border-white/10 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-tr from-clarity-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-clarity-500/20 transform hover:rotate-3 transition-transform duration-300">
                <span className="text-4xl font-bold text-white">C</span>
            </div>
            
            <div className="space-y-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">ClarityWallet AI</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Experience the next generation of Stacks wallets. <br/>
                    Daily rewards, AI insights, and seamless transfers.
                </p>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                  onClick={onConnect}
                  disabled={isConnecting}
                  className="w-full py-4 px-6 bg-white text-crypto-dark font-bold rounded-xl hover:bg-gray-100 focus:ring-4 focus:ring-white/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
              >
                  {isConnecting ? (
                      <>
                          <div className="w-5 h-5 border-2 border-crypto-dark border-t-transparent rounded-full animate-spin"></div>
                          <span>Initializing...</span>
                      </>
                  ) : (
                      <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          <span>Connect Wallet</span>
                      </>
                  )}
              </button>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
                  <span>Leather</span>
                  <span>•</span>
                  <span>Xverse</span>
                  <span>•</span>
                  <span>Asgard</span>
              </div>
            </div>
        </div>
    </div>
  );
};

export default ConnectWallet;