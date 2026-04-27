/**
 * Array utility functions
 */

/**
 * Remove duplicates from array
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Chunk array into smaller arrays
 */
export function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

/**
 * Get random element from array
 */
export function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Check if array is empty
 */
export function isEmpty(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}

/**
 * Get last element
 */
export function last(arr) {
  return arr?.[arr.length - 1];
}
