/**
 * Date formatting utilities
 */

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateISO(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

/**
 * Format date as DD/MM/YYYY
 */
export function formatDateEU(timestamp) {
  const date = new Date(timestamp);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Format date as MM/DD/YYYY
 */
export function formatDateUS(timestamp) {
  const date = new Date(timestamp);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * Get day of week name
 */
export function getDayName(timestamp) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(timestamp).getDay()];
}

/**
 * Get month name
 */
export function getMonthName(timestamp) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[new Date(timestamp).getMonth()];
}

/**
 * Check if date is today
 */
export function isToday(timestamp) {
  const today = new Date();
  const date = new Date(timestamp);
  return date.toDateString() === today.toDateString();
}
