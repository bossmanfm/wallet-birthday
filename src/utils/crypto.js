/**
 * Cryptocurrency utility functions
 */

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount, decimals = 18, displayDecimals = 4) {
  const value = Number(amount) / Math.pow(10, decimals);
  return value.toFixed(displayDecimals);
}

/**
 * Calculate gas cost in ETH
 */
export function calculateGasCost(gasUsed, gasPrice) {
  return (Number(gasUsed) * Number(gasPrice)) / 1e18;
}

/**
 * Format gas price in Gwei
 */
export function formatGasPrice(wei) {
  return (Number(wei) / 1e9).toFixed(2);
}

/**
 * Check if transaction hash is valid
 */
export function isValidTxHash(hash) {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Generate transaction explorer URL
 */
export function getExplorerTxUrl(hash, network = 'base') {
  const urls = {
    base: `https://basescan.org/tx/${hash}`,
    ethereum: `https://etherscan.io/tx/${hash}`,
  };
  return urls[network] || urls.base;
}
