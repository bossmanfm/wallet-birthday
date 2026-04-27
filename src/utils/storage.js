const PREFIX = 'wallet-birthday_';

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(`${PREFIX}${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch (error) {
    console.error('Failed to remove from storage:', error);
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllStorage() {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
