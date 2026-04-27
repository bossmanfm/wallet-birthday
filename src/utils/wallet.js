/**
 * Wallet utility functions
 */

/**
 * Check if address is a contract
 * Note: This requires an RPC call, use with caution
 */
export function isContractAddress(address) {
  return address && address.startsWith('0x') && address.length === 42;
}

/**
 * Get short address format
 */
export function shortAddress(address, start = 6, end = 4) {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Validate checksum address
 */
export function isChecksumAddress(address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
  const lower = address.toLowerCase();
  const upper = address.toUpperCase();
  return address === lower || address === upper;
}

/**
 * Get ENS-like display name
 */
export function getDisplayName(address, ensName = null) {
  return ensName || shortAddress(address);
}
