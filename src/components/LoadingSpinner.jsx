import { getChainExplorerUrl } from '../utils/multiChainFinder';

const CHAIN_ICONS = {
  'Ethereum': '🔷',
  'BSC': '🟡',
  'Polygon': '🟣',
  'Arbitrum': '🔵',
  'Optimism': '🔴',
  'Avalanche': '🔺',
  'Base': '🔵',
};

export function LoadingSpinner({ chains, progress, completed, total }) {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      
      <p className="loading-text">
        Scanning {chains.length} chains...
      </p>
      
      <div className="progress-grid">
        {chains.map(chain => (
          <div 
            key={chain.name} 
            className={`chain-progress ${progress[chain.name] || 'pending'}`}
          >
            <span className="chain-icon">{CHAIN_ICONS[chain.name] || '⛓️'}</span>
            <span className="chain-name">{chain.name}</span>
            <span className="chain-status">
              {progress[chain.name] === 'scanning' && '⏳'}
              {progress[chain.name] === 'found' && '✅'}
              {progress[chain.name] === 'error' && '❌'}
              {progress[chain.name] === 'pending' && '⭕'}
            </span>
          </div>
        ))}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${total > 0 ? (completed/total)*100 : 0}%` }}
        ></div>
      </div>
      
      <p className="loading-hint">
        {completed < total 
          ? `Scanning in progress... (max ~3-4 min total)`
          : 'All chains scanned!'
        }
      </p>
    </div>
  );
}
