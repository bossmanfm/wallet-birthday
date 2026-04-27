/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to specified decimal places
 */
export function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Convert Wei to Ether (string)
 */
export function weiToEther(wei) {
  return (Number(wei) / 1e18).toFixed(4);
}

/**
 * Convert Ether to Wei
 */
export function etherToWei(ether) {
  return BigInt(Math.floor(Number(ether) * 1e18));
}

/**
 * Calculate percentage
 */
export function percentage(part, total) {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
}
