/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to Title Case
 */
export function toTitleCase(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

/**
 * Convert camelCase to kebab-case
 */
export function toKebabCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Generate a random string of given length
 */
export function randomString(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * Capitalize all words in a string
 */
export function capitalizeAll(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert string to URL-friendly slug
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Add ellipsis to truncated text
 */
export function ellipsis(text, maxLength = 50, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Repeat string n times
 */
export function repeat(str, times) {
  return str.repeat(times);
}

/**
 * Count occurrences of substring
 */
export function countOccurrences(str, substr) {
  return str.split(substr).length - 1;
}

/**
 * Pad string on the left
 */
export function padLeft(str, length, char = ' ') {
  return str.length >= length ? str : char.repeat(length - str.length) + str;
}

/**
 * Pad string on the right
 */
export function padRight(str, length, char = ' ') {
  return str.length >= length ? str : str + char.repeat(length - str.length);
}

/**
 * Reverse a string
 */
export function reverseString(str) {
  return str.split('').reverse().join('');
}

/**
 * Check if string is palindrome
 */
export function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverseString(cleaned);
}
