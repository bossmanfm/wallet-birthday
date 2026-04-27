/**
 * Safe event listener management
 */

/**
 * Add event listener with cleanup function
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function addListener(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Debounce function calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function calls
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
