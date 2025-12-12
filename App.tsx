import React, { useState, useEffect, useCallback } from 'react';
import WalletCard from './components/WalletCard';
import ActionButtons from './components/ActionButtons';
import TransactionList from './components/TransactionList';
import TransferModal from './components/TransferModal';
import ConnectWallet from './components/ConnectWallet';
import { WalletState, Transaction, TransactionType } from './types';

// Stacks Connect Imports
import { showConnect, AppConfig, UserSession } from '@stacks/connect';

// --- Clarity-style Function Simulation Constants ---
const DAILY_REWARD_AMOUNT = 10;
const CHECK_IN_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

// --- Stacks Configuration ---
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const App: React.FC = () => {
  // --- 1. State Management (Simulating Blockchain State) ---
  const [wallet, setWallet] = useState<WalletState>(() => {
    // Load from local storage for persistence or default
    const saved = localStorage.getItem('teeboo_app_v1');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      balance: 0,
      lastCheckIn: null,
      transactions: []
    };
  });

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Connection State
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize Connection
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      // Prefer Mainnet address
      setUserAddress(userData.profile.stxAddress.mainnet);
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserAddress(userData.profile.stxAddress.mainnet);
      });
    }
  }, []);

  // Persist Wallet Data
  useEffect(() => {
    localStorage.setItem('teeboo_app_v1', JSON.stringify(wallet));
  }, [wallet]);

  // Handle Connect with Real Wallet (Leather/Xverse)
  const handleConnect = () => {
    setIsConnecting(true);
    showConnect({
      appDetails: {
        name: 'Teeboo App',
        icon: window.location.origin + '/favicon.ico', // Fallback icon
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserAddress(userData.profile.stxAddress.mainnet);
        setIsConnecting(false);
      },
      onCancel: () => {
        setIsConnecting(false);
      },
      userSession,
    });
  };

  // Handle Disconnect
  const handleDisconnect = () => {
    userSession.signUserOut();
    setUserAddress(null);
  };

  // --- 2. The "4 Functions" of Clarity Logic ---

  /**
   * Function 1: get-balance (read-only)
   * Already available via wallet.balance state, but defined conceptually here.
   */
  const getBalance = useCallback(() => wallet.balance, [wallet.balance]);

  /**
   * Function 2: get-history (read-only)
   * Already available via wallet.transactions.
   */
  const getHistory = useCallback(() => wallet.transactions, [wallet.transactions]);

  /**
   * Function 3: daily-check-in (public function)
   * Awards tokens if cooldown passed.
   */
  const checkIn = async () => {
    const now = Date.now();
    const last = wallet.lastCheckIn;

    if (last && now - last < CHECK_IN_COOLDOWN_MS) {
      alert("Check-in still in cooldown!");
      return;
    }

    // 1. Generate new transaction
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      type: TransactionType.CHECK_IN,
      amount: DAILY_REWARD_AMOUNT,
      timestamp: now,
      description: 'Daily Reward Mined'
    };

    // 2. Update State
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + DAILY_REWARD_AMOUNT,
      lastCheckIn: now,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  /**
   * Function 4: transfer-token (public function)
   * Sends tokens to another user.
   */
  const transferToken = async (recipient: string, amount: number) => {
    if (amount > wallet.balance) return;

    const newTx: Transaction = {
      id: crypto.randomUUID(),
      type: TransactionType.WITHDRAWAL,
      amount: amount,
      timestamp: Date.now(),
      description: `Sent to ${recipient.substring(0, 6)}...`,
      recipient: recipient
    };

    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  // --- 3. Derived UI State ---
  const canCheckIn = !wallet.lastCheckIn || (Date.now() - wallet.lastCheckIn > CHECK_IN_COOLDOWN_MS);

  // --- 4. Render ---
  
  // If not connected, show Connect Wallet Screen
  if (!userAddress) {
    return <ConnectWallet onConnect={handleConnect} isConnecting={isConnecting} />;
  }

  return (
    <div className="min-h-screen bg-crypto-dark text-white font-sans selection:bg-clarity-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-crypto-dark/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-clarity-600 to-purple-600 flex items-center justify-center">
               <span className="font-bold text-lg">T</span>
             </div>
             <h1 className="font-bold text-lg tracking-tight">Teeboo App</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] text-green-400 font-mono font-medium tracking-wide">MAINNET</span>
             </div>
             <button 
                onClick={handleDisconnect}
                className="text-gray-400 hover:text-white transition-colors"
                title="Disconnect Wallet"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        
        {/* Function 1: Get Balance (Visualized) */}
        <WalletCard 
          balance={getBalance()} 
          address={userAddress} 
        />

        {/* Actions (Function 3 & 4 Triggers) */}
        <ActionButtons 
          onCheckIn={checkIn}
          onTransfer={() => setIsTransferModalOpen(true)}
          canCheckIn={canCheckIn}
          isProcessing={false}
        />

        {/* Function 2: Get History (Visualized) */}
        <TransactionList transactions={getHistory()} />

      </main>

      {/* Function 4 UI: Transfer Modal */}
      <TransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onConfirm={transferToken}
        maxAmount={getBalance()}
      />
      
      {/* Footer Info */}
      <footer className="text-center mt-12 mb-6 text-gray-600 text-xs">
        <p>Secured by Stacks Blockchain</p>
        <p className="mt-1">© 2024 Teeboo App Inc.</p>
      </footer>
    </div>
  );
};

export default App;