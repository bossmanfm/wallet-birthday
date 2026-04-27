/**
 * Validate Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {boolean} True if valid
 */
export function isValidTimestamp(timestamp) {
  return Number.isFinite(timestamp) && timestamp > 0;
}

/**
 * Validate URI scheme
 * @param {string} uri - URI to validate
 * @param {string[]} allowedSchemes - Allowed schemes
 * @returns {boolean} True if valid
 */
export function isValidUri(uri, allowedSchemes = ['http', 'https', 'ipfs']) {
  if (!uri || typeof uri !== 'string') return false;
  const scheme = uri.split(':')[0]?.toLowerCase();
  return allowedSchemes.includes(scheme) || uri.startsWith('ipfs://');
}

/**
 * Validate number range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if in range
 */
export function isInRange(value, min, max) {
  return typeof value === 'number' && value >= min && value <= max;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is numeric
 */
export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Check if value is a positive integer
 */
export function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}
