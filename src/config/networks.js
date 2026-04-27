/**
 * Network configuration
 * Defines supported networks and their properties
 */

export const NETWORKS = {
  base: {
    id: 8453,
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  baseSepolia: {
    id: 84532,
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
};

/**
 * Get network by chain ID
 */
export function getNetworkById(chainId) {
  return Object.values(NETWORKS).find(n => n.chainId === chainId) || null;
}

/**
 * Get explorer URL for a chain
 */
export function getExplorerUrl(chainId) {
  const network = getNetworkById(chainId);
  return network?.explorer || 'https://basescan.org';
}

/**
 * Get transaction URL
 */
export function getTxUrl(chainId, txHash) {
  return `${getExplorerUrl(chainId)}/tx/${txHash}`;
}
