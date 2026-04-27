/**
 * LoadingSpinner Component
 * Displays loading state during multi-chain scanning
 * 
 * Props:
 * - chains: Array of chain objects to scan
 * - progress: Object with scan progress per chain
 * - completed: Number of completed scans
 * - total: Total number of chains to scan
 * 
 * Returns: JSX loading spinner element
 */
export function LoadingSpinner({ chains, progress, completed, total }) {
  return (
    <div className="loading-spinner">
      <div className="spinner-icon">🔍</div>
      <p className="loading-text">Scanning chains for your first transaction...</p>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>
      <p className="progress-text">{completed} / {total} chains scanned</p>
      {chains.map(chain => (
        <div key={chain.id} className="chain-status">
          <span className="chain-name">{chain.name}</span>
          <span className={`status ${progress[chain.name] === 'done' ? 'done' : progress[chain.name] === 'scanning' ? 'scanning' : 'pending'}`}>
            {progress[chain.name] === 'done' ? '✓' : progress[chain.name] === 'scanning' ? '⟳' : '○'}
          </span>
        </div>
      ))}
    </div>
  );
}
