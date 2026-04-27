const LOG_PREFIX = '[WalletBirthday]';
const isDev = import.meta.env?.DEV || process.env.NODE_ENV === 'development';

/**
 * Log info message (dev only)
 */
export function logInfo(...args) {
  if (isDev) {
    console.log(LOG_PREFIX, 'ℹ️', ...args);
  }
}

/**
 * Log warning message
 */
export function logWarning(...args) {
  console.warn(LOG_PREFIX, '⚠️', ...args);
}

/**
 * Log error message
 */
export function logError(...args) {
  console.error(LOG_PREFIX, '❌', ...args);
}

/**
 * Log success message (dev only)
 */
export function logSuccess(...args) {
  if (isDev) {
    console.log(LOG_PREFIX, '✅', ...args);
  }
}

/**
 * Log performance measurement
 */
export function logPerformance(label, startTime) {
  const duration = Date.now() - startTime;
  if (isDev) {
    console.log(LOG_PREFIX, '⏱️', `${label}: ${duration}ms`);
  }
}
