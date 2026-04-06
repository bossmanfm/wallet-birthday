import { QRCodeSVG } from 'qrcode.react';
import { formatDate, formatAddress, calculateAge } from '../utils/helpers';
import { getChainExplorerUrl } from '../utils/multiChainFinder';

// Chain color mapping
const CHAIN_COLORS = {
  'Ethereum': '#627EEA',
  'BSC': '#F0B90B',
  'Polygon': '#8247E5',
  'Arbitrum': '#28A0F0',
  'Optimism': '#FF0420',
  'Avalanche': '#E84142',
  'Base': '#0052FF',
};

// Chain icons (emoji fallback)
const CHAIN_ICONS = {
  'Ethereum': '🔷',
  'BSC': '🟡',
  'Polygon': '🟣',
  'Arbitrum': '🔵',
  'Optimism': '🔴',
  'Avalanche': '🔺',
  'Base': '🔵',
};

const BirthdayCard = ({ walletData }) => {
  const { address, firstTx, age, allResults } = walletData;
  const chainColor = CHAIN_COLORS[firstTx.chainName] || '#627EEA';
  const chainIcon = CHAIN_ICONS[firstTx.chainName] || '⛓️';
  const explorerUrl = getChainExplorerUrl(firstTx.chainName);
  
  const shortAddress = formatAddress(address);
  const formattedDate = formatDate(firstTx.timestamp);
  const ageInDays = age.days;
  const ageInYears = age.years;
  const chainName = firstTx.chainName;
  
  // Format the "X days ago" text
  const getDaysAgoText = () => {
    if (age.days === 0) return 'today';
    if (age.days === 1) return 'yesterday';
    if (age.days < 7) return `${age.days} days ago`;
    if (age.days < 30) return `${age.weeks} weeks ago`;
    if (age.days < 365) return `${age.months} months ago`;
    return `${age.years} years ago`;
  };
  
  return (
    <div className="birthday-card" id="birthday-card">
      <div className="card-header">
        <span className="card-icon">🎂</span>
        <h2>Your Wallet Birthday</h2>
      </div>
      
      <div className="card-body">
        <div className="wallet-address">
          <span className="address-label">Wallet</span>
          <code>{shortAddress}</code>
        </div>
        
        <div className="birthday-info">
          <div className="info-item">
            <span className="info-label">First Transaction</span>
            <span className="info-value">{formattedDate}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Chain</span>
            <span className={`chain-badge chain-${chainName.toLowerCase()}`} style={{ borderColor: chainColor, color: chainColor }}>
              {chainIcon} {chainName}
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Age</span>
            <span className="info-value age-highlight">{ageInDays} days</span>
          </div>
        </div>
        
        <div className="card-footer">
          <p className="card-message">
            "Your wallet was born on {chainName} {ageInYears} years ago!"
          </p>
        </div>
        
        {firstTx.txHash && (
          <div className="tx-section">
            <span className="tx-label">First Tx</span>
            <a 
              href={`${explorerUrl}/tx/${firstTx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              {formatAddress(firstTx.txHash)}
            </a>
          </div>
        )}
        
        {allResults && allResults.length > 1 && (
          <div className="other-chains-section">
            <p className="other-chains-label">Also found on ({allResults.length - 1} other chains)</p>
            <div className="other-chains">
              {allResults
                .filter(r => r.chainName !== firstTx.chainName)
                .slice(0, 5)
                .map((r) => (
                  <span 
                    key={r.chainName} 
                    className="other-chain-badge"
                    style={{ borderColor: CHAIN_COLORS[r.chainName] || '#666' }}
                    title={`${r.chainName}: ${formatDate(r.timestamp)}`}
                  >
                    {CHAIN_ICONS[r.chainName]} {r.chainName}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCard;
