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

/**
 * Flatten nested array
 */
export function flatten(arr) {
  return arr.reduce((flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item), []);
}

/**
 * Remove falsy values from array
 */
export function compact(arr) {
  return arr.filter(Boolean);
}

/**
 * Get difference between two arrays
 */
export function difference(arr1, arr2) {
  return arr1.filter(item => !arr2.includes(item));
}

/**
 * Get intersection of two arrays
 */
export function intersection(arr1, arr2) {
  return arr1.filter(item => arr2.includes(item));
}

/**
 * Get union of two arrays
 */
export function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}

/**
 * Remove specific values from array
 */
export function without(arr, ...values) {
  return arr.filter(item => !values.includes(item));
}

/**
 * Zip two arrays together
 */
export function zip(arr1, arr2) {
  return arr1.map((item, i) => [item, arr2[i]]);
}

/**
 * Unzip array of pairs
 */
export function unzip(pairs) {
  return [pairs.map(p => p[0]), pairs.map(p => p[1])];
}
