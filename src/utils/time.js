/**
 * Get current timestamp in seconds
 * @returns {number} Current Unix timestamp
 */
export function nowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Get current timestamp in milliseconds
 * @returns {number} Current Unix timestamp
 */
export function nowInMs() {
  return Date.now();
}

/**
 * Convert seconds to milliseconds
 * @param {number} seconds - Time in seconds
 * @returns {number} Time in milliseconds
 */
export function secondsToMs(seconds) {
  return seconds * 1000;
}

/**
 * Convert milliseconds to seconds
 * @param {number} ms - Time in milliseconds
 * @returns {number} Time in seconds
 */
export function msToSeconds(ms) {
  return Math.floor(ms / 1000);
}

/**
 * Calculate time difference in days
 * @param {number} timestamp1 - First timestamp (ms)
 * @param {number} timestamp2 - Second timestamp (ms)
 * @returns {number} Difference in days
 */
export function daysBetween(timestamp1, timestamp2) {
  return Math.abs(Math.floor((timestamp2 - timestamp1) / (1000 * 60 * 60 * 24)));
}

/**
 * Get relative time string
 * @param {number} timestamp - Unix timestamp (ms)
 * @returns {string} Relative time description
 */
export function getRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Check if timestamp is in the future
 * @param {number} timestamp - Unix timestamp (ms)
 * @returns {boolean} True if future
 */
export function isFuture(timestamp) {
  return timestamp > Date.now();
}

/**
 * Check if timestamp is in the past
 * @param {number} timestamp - Unix timestamp (ms)
 * @returns {boolean} True if past
 */
export function isPast(timestamp) {
  return timestamp < Date.now();
}

/**
 * Format time as HH:MM:SS
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour12: false });
}

/**
 * Format date and time
 */
export function formatDateTime(timestamp) {
  return `${formatDateISO(timestamp)} ${formatTime(timestamp)}`;
}

/**
 * Check if year is leap year
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get number of days in month
 */
export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Get start of day timestamp
 */
export function startOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Get end of day timestamp
 */
export function endOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/**
 * Get start of week timestamp (Monday)
 */
export function startOfWeek(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
