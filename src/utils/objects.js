/**
 * Object utility functions
 */

/**
 * Check if object is empty
 */
export function isEmptyObject(obj) {
  return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Get nested property safely
 */
export function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Merge objects deeply
 */
export function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Pick specific keys from object
 */
export function pick(obj, keys) {
  return Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));
}

/**
 * Omit specific keys from object
 */
export function omit(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
}

/**
 * Map values of object
 */
export function mapValues(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

/**
 * Map keys of object
 */
export function mapKeys(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k), v]));
}

/**
 * Invert object keys and values
 */
export function invert(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
}

/**
 * Check if object has property
 */
export function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Get object keys (alias for Object.keys)
 */
export function keys(obj) {
  return Object.keys(obj);
}

/**
 * Get object values
 */
export function values(obj) {
  return Object.values(obj);
}

/**
 * Get object entries
 */
export function entries(obj) {
  return Object.entries(obj);
}

/**
 * Assign properties from source to target
 */
export function assign(target, ...sources) {
  return Object.assign({}, target, ...sources);
}
