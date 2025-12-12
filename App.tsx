import React, { useState, useEffect, useCallback } from 'react';
import WalletCard from './components/WalletCard';
import ActionButtons from './components/ActionButtons';
import TransactionList from './components/TransactionList';
import TransferModal from './components/TransferModal';
import ConnectWallet from './components/ConnectWallet';
import { Transaction, TransactionType } from './types';
import { getAccountBalance, getRecentTransactions } from './services/Service';

// Stacks Connect Imports
import { showConnect, AppConfig, UserSession, openSTXTransfer } from '@stacks/connect';
import { STACKS_MAINNET } from '@stacks/network';

const CHECK_IN_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const DAILY_POINTS_REWARD = 50; // Points, not STX

// --- Stacks Configuration ---
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const App: React.FC = () => {
  // --- 1. State Management ---
  
  // Local State (for Check-in/Points only)
  const [localState, setLocalState] = useState<{points: number, lastCheckIn: number | null}>(() => {
    const saved = localStorage.getItem('teeboo_local_v2');
    return saved ? JSON.parse(saved) : { points: 0, lastCheckIn: null };
  });

  // Real Blockchain State
  const [stxBalance, setStxBalance] = useState<number>(0);
  const [chainTransactions, setChainTransactions] = useState<Transaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // UI State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize Connection
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.mainnet);
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserAddress(userData.profile.stxAddress.mainnet);
      });
    }
  }, []);

  // Persist Local State (Points/Check-in)
  useEffect(() => {
    localStorage.setItem('teeboo_local_v2', JSON.stringify(localState));
  }, [localState]);

  // Fetch Blockchain Data
  const fetchData = useCallback(async () => {
    if (!userAddress) return;
    setIsRefreshing(true);
    try {
      const [balance, txs] = await Promise.all([
        getAccountBalance(userAddress),
        getRecentTransactions(userAddress)
      ]);
      setStxBalance(balance);
      setChainTransactions(txs);
    } catch (e) {
      console.error("Failed to load blockchain data", e);
    } finally {
      setIsRefreshing(false);
    }
  }, [userAddress]);

  // Load data on connect
  useEffect(() => {
    if (userAddress) {
      fetchData();
    }
  }, [userAddress, fetchData]);

  // Handle Connect
  const handleConnect = () => {
    setIsConnecting(true);
    showConnect({
      appDetails: {
        name: 'Teeboo App',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserAddress(userData.profile.stxAddress.mainnet);
        setIsConnecting(false);
      },
      onCancel: () => setIsConnecting(false),
      userSession,
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut();
    setUserAddress(null);
    setStxBalance(0);
    setChainTransactions([]);
  };

  // --- 2. Logic ---

  /**
   * Function: daily-check-in (Local Gamification)
   * Awards "Teeboo Points" off-chain.
   */
  const checkIn = async () => {
    const now = Date.now();
    const last = localState.lastCheckIn;

    if (last && now - last < CHECK_IN_COOLDOWN_MS) {
      alert("Check-in cooldown active!");
      return;
    }

    setLocalState(prev => ({
      ...prev,
      points: prev.points + DAILY_POINTS_REWARD,
      lastCheckIn: now
    }));
  };

  /**
   * Function: transfer-token (Real Mainnet Transaction)
   */
  const transferToken = async (recipient: string, amount: number) => {
    if (!userAddress) return;

    // Convert STX to Micro-STX (integer)
    const amountMicroStx = Math.floor(amount * 1_000_000);

    try {
      await openSTXTransfer({
        recipient: recipient,
        amount: amountMicroStx.toString(),
        memo: 'Sent via Teeboo',
        network: STACKS_MAINNET, // Use the constant
        appDetails: {
          name: 'Teeboo App',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: (data) => {
          console.log('Transaction Broadcasted:', data.txId);
          setIsTransferModalOpen(false);
          
          // Add a temporary "Pending" transaction to UI
          const pendingTx: Transaction = {
            id: data.txId,
            type: TransactionType.WITHDRAWAL,
            amount: amount,
            timestamp: Date.now(),
            description: 'Transfer Pending...',
            status: 'pending',
            isRealChain: true
          };
          setChainTransactions(prev => [pendingTx, ...prev]);
          
          // Optionally create a link to explorer
          window.open(`https://explorer.hiro.so/txid/${data.txId}?chain=mainnet`, '_blank');
        },
        onCancel: () => {
          console.log('Transfer cancelled');
        }
      });
    } catch (e) {
      console.error("Transfer error:", e);
      alert("Failed to initiate transfer. Check console.");
    }
  };

  // --- 3. UI Derived State ---
  const canCheckIn = !localState.lastCheckIn || (Date.now() - localState.lastCheckIn > CHECK_IN_COOLDOWN_MS);
  
  // Combine Real Txs with Local Check-in History (Optional visualization)
  // For now, let's show Real Txs in the list, and just show Points in the UI.

  // --- 4. Render ---
  
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
        
        {/* Real Balance Card */}
        <WalletCard 
          balance={stxBalance} 
          address={userAddress} 
        />
        
        {/* Points Banner (Local Check-in) */}
        <div className="mt-6 flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
           <div className="flex items-center gap-2">
             <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
             </div>
             <span className="text-sm text-gray-300">Teeboo Points</span>
           </div>
           <span className="font-bold text-yellow-500">{localState.points} PTS</span>
        </div>

        {/* Actions */}
        <ActionButtons 
          onCheckIn={checkIn}
          onTransfer={() => setIsTransferModalOpen(true)}
          canCheckIn={canCheckIn}
          isProcessing={isRefreshing}
        />

        {/* Real Transactions */}
        <TransactionList transactions={chainTransactions} />

      </main>

      {/* Transfer Modal */}
      <TransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onConfirm={transferToken}
        maxAmount={stxBalance}
      />
      
      <footer className="text-center mt-12 mb-6 text-gray-600 text-xs">
        <p>Connected to Stacks Mainnet</p>
        <button onClick={fetchData} className="mt-2 text-clarity-500 hover:text-clarity-400 underline">
            Refresh Data
        </button>
        <p className="mt-4">© 2024 Teeboo App Inc.</p>
      </footer>
    </div>
  );
};

export default App;