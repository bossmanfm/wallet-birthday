/**
 * Browser utility functions
 */

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

/**
 * Download file
 */
export function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Open URL in new tab
 */
export function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Get viewport dimensions
 */
export function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
