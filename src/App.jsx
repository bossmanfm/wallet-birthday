import { useState, useRef } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { toPng } from 'html-to-image';

import BirthdayCard from './components/BirthdayCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contracts/config';
import { calculateAge, formatAddress } from './utils/helpers';
import { findFirstTxMultiChain, CHAINS } from './utils/multiChainFinder';

import './App.css';
import './styles/theme.css';

function App() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [metadataUri, setMetadataUri] = useState(null);
  const [scanProgress, setScanProgress] = useState({});
  
  const cardRef = useRef(null);
  
  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isTxError } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  
  // Update UI when transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed && txHash) {
      console.log('[Mint] Transaction confirmed:', txHash);
      setMinting(false);
      setMintSuccess(true);
      setError(null);
    }
    if (isTxError) {
      console.error('[Mint] Transaction failed');
      setMinting(false);
      setError('Transaction failed. Please try again.');
    }
  }, [isConfirmed, isTxError, txHash]);
  
  // Check if wallet has already minted
  const { data: hasMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasMinted',
    args: [address],
    query: { enabled: isConnected && !!address }
  });
  
  const isCorrectChain = chain?.id === 8453 || chain?.id === 84532; // Base or Base Sepolia

  const connectWallet = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };
  
  const handleFindBirthday = async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    setWalletData(null);
    setMintSuccess(false);
    setScanProgress({});
    
    try {
      // Progress callback for multi-chain scanning
      const onProgress = (chainName, status) => {
        setScanProgress(prev => ({
          ...prev,
          [chainName]: status
        }));
      };
      
      const firstTx = await findFirstTxMultiChain(address, onProgress);
      
      if (!firstTx) {
        setError('This wallet has no on-chain activity yet. Make a transaction first (swap, transfer, or bridge) and try again.');
        setLoading(false);
        return;
      }
      
      const age = calculateAge(firstTx.timestamp);
      
      setWalletData({
        address,
        firstTx,
        age,
        allResults: firstTx.allResults,
      });
    } catch (err) {
      console.error('Error finding birthday:', err);
      setError('Failed to find first transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#1a1a2e',
      });
      
      const link = document.createElement('a');
      link.download = `wallet-birthday-${formatAddress(address)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading PNG:', err);
      setError('Failed to download image');
    }
  };
  
  const handleMintNFT = async () => {
    if (!walletData || !isCorrectChain) return;
    
    setMinting(true);
    setError(null);
    
    try {
      // Simplified metadata to avoid gas estimation issues
      const metadata = {
        name: `Wallet Birthday #${formatAddress(address)}`,
        description: `Wallet born on ${walletData.firstTx.chainName} - ${walletData.age.days} days old`,
        attributes: [
          { trait_type: 'Chain', value: walletData.firstTx.chainName },
          { trait_type: 'Age', value: `${walletData.age.days} days` },
          { trait_type: 'Birthday', value: new Date(walletData.firstTx.timestamp).toLocaleDateString() },
        ],
      };
      
      // Use IPFS-style URI (shorter, more compatible)
      const metadataUri = `ipfs://wallet-birthday-${address.slice(2, 10)}`;
      setMetadataUri(metadataUri);
      
      console.log('[Mint] Starting mint with:', {
        timestamp: BigInt(Math.floor(walletData.firstTx.timestamp / 1000)),
        age: BigInt(walletData.age.days),
        uri: metadataUri,
      });
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintBirthday',
        args: [
          BigInt(Math.floor(walletData.firstTx.timestamp / 1000)),
          BigInt(walletData.age.days),
          metadataUri,
        ],
      });
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(`Failed to mint NFT: ${err.message || 'Unknown error'}`);
      setMinting(false);
    }
  };
  
  const handleSwitchToBase = () => {
    switchChain({ chainId: 8453 }); // Base Mainnet
  };
  
  const shareTwitter = () => {
    const text = `My wallet was born on ${walletData.firstTx.chainName} ${walletData.age.years} years ago! 🎂 Check yours at:`;
    const url = `https://walletbirthday.xyz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(`https://walletbirthday.xyz?wallet=${address}`);
  };

  const completed = Object.keys(scanProgress).length;
  const total = CHAINS.length;
  
  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <div className="hero-icon">🎂</div>
          <h1>Wallet Birthday</h1>
          <p className="hero-subtitle">
            Discover when your crypto journey began. 
            Find your wallet's first transaction across all chains.
          </p>
          <div className="hero-cta">
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>
      
      <main className="main">
        {isConnected && (
          <div className="wallet-info">
            <span className="address">{formatAddress(address)}</span>
            <button className="btn-disconnect" onClick={() => disconnect()}>
              Disconnect
            </button>
          </div>
        )}
        
        {!isCorrectChain && isConnected && (
          <div className="chain-warning">
            <p>Please switch to Base network to mint NFT</p>
            <button className="btn-small" onClick={handleSwitchToBase}>
              Switch to Base
            </button>
          </div>
        )}
        
        {!walletData && isConnected && (
          <button 
            className="btn-primary btn-large" 
            onClick={handleFindBirthday}
            disabled={loading}
          >
            {loading ? 'Scanning...' : 'Find My Wallet Birthday'}
          </button>
        )}
        
        {loading && <LoadingSpinner chains={CHAINS} progress={scanProgress} completed={completed} total={total} />}
        
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        
        {walletData && (
          <>
            <div className="card-wrapper" style={{ display: 'none' }}>
              <div ref={cardRef}>
                <BirthdayCard walletData={walletData} />
              </div>
            </div>
            
            <div ref={cardRef} className="card-container">
              <BirthdayCard walletData={walletData} />
            </div>
            
            <div className="card-actions">
              <button className="btn-secondary" onClick={handleDownloadPNG}>
                📥 Download PNG
              </button>
              
              {mintSuccess ? (
                <button className="btn-muted" disabled>
                  ✓ Successfully Minted!
                </button>
              ) : hasMinted ? (
                <button className="btn-muted" disabled>
                  ✓ Already Minted
                </button>
              ) : (
                <button 
                  className="btn-nft" 
                  onClick={handleMintNFT}
                  disabled={minting || !isCorrectChain || isWritePending || isConfirming}
                >
                  {isWritePending || isConfirming 
                    ? 'Minting...' 
                    : minting 
                      ? 'Preparing...' 
                      : '🪙 Mint NFT Badge'}
                </button>
              )}
            </div>
            
            <div className="share-section">
              <p className="share-label">Share your wallet birthday!</p>
              <div className="share-buttons">
                <button onClick={shareTwitter} className="share-btn twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </button>
                <button onClick={copyLink} className="share-btn copy">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy Link
                </button>
              </div>
            </div>
            
            {isConfirmed && (
              <div className="success">
                <p>🎉 NFT Minted Successfully!</p>
                <a 
                  href={`https://basescan.org/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  View on Basescan
                </a>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
