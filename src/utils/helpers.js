/**
 * Public client configuration for blockchain interactions
 * Uses public RPC endpoints for read-only operations
 */
import { createPublicClient, http, formatEther } from 'viem';
import { base, baseSepolia } from 'viem/chains';

const PUBLIC_NODES = {
  [base.id]: 'https://mainnet.base.org',
  [baseSepolia.id]: 'https://sepolia.base.org',
};

export function getPublicClient(chainId = base.id) {
  return createPublicClient({
    chain: chainId === base.id ? base : baseSepolia,
    transport: http(PUBLIC_NODES[chainId]),
  });
}

export async function findFirstTransaction(address, chainId = base.id) {
  const client = getPublicClient(chainId);
  const provider = client;
  
  try {
    // Get current block number
    const currentBlock = await provider.getBlockNumber();
    
    if (currentBlock === 0n) {
      return null;
    }
    
    let low = 0n;
    let high = currentBlock;
    let firstBlockWithTx = null;
    
    // Binary search to find first block with transaction
    while (low < high) {
      const mid = (low + high) / 2n;
      
      try {
        const logs = await provider.getLogs({
          address: address,
          fromBlock: low,
          toBlock: mid,
          limit: 1,
        });
        
        if (logs.length > 0) {
          high = mid;
        } else {
          low = mid + 1n;
        }
      } catch (e) {
        // If error, try a different range
        low = mid + 1n;
      }
    }
    
    // Verify this block has transactions
    try {
      const logs = await provider.getLogs({
        address: address,
        fromBlock: low,
        toBlock: low,
        limit: 10,
      });
      
      if (logs.length > 0) {
        // Get the first log's block to get timestamp
        const block = await provider.getBlock({ blockNumber: low });
        firstBlockWithTx = {
          blockNumber: low,
          timestamp: Number(block.timestamp) * 1000, // Convert to ms
          txHash: logs[0].transactionHash,
        };
      }
    } catch (e) {
      console.error('Error verifying first tx:', e);
    }
    
    return firstBlockWithTx;
  } catch (error) {
    console.error('Error finding first transaction:', error);
    throw error;
  }
}

export function calculateAge(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  return {
    days,
    weeks,
    months,
    years,
    formatted: {
      days: `${days} days`,
      weeks: `${weeks} weeks`,
      months: `${months} months`,
      years: `${years} years`,
    }
  };
}

export function getTitleByAge(days) {
  if (days < 7) {
    return { title: 'Time Traveler', emoji: '⏰', description: 'Did you just fall out of a DeLorean? Welcome to crypto!' };
  } else if (days < 30) {
    return { title: 'Baby Degen', emoji: '🍼', description: 'Still smells like fresh ETH. Don\'t touch the leverage yet!' };
  } else if (days < 90) {
    return { title: 'Toddler', emoji: '🧸', description: 'Learning to walk... and accidentally buying memecoins.' };
  } else if (days < 180) {
    return { title: 'Young Padawan', emoji: '🌱', description: 'You think you know crypto. You know nothing, Jon Snow.' };
  } else if (days < 365) {
    return { title: 'Teenager', emoji: '🎒', description: 'Rebellious phase. Thinks parents (BTC) don\'t understand.' };
  } else if (days < 730) {
    return { title: 'Adult', emoji: '👨', description: 'Finally understands compound interest. Has 3 tabs open.' };
  } else if (days < 1095) {
    return { title: 'OG', emoji: '🎖️', description: 'Was here before \'WAGMI\' was cool. Still has 2017 bags.' };
  } else if (days < 1825) {
    return { title: 'Legend', emoji: '🏆', description: 'Survived Mt. Gox, FTX, and 17 bear markets. Immortal.' };
  } else {
    return { title: 'Crypto God', emoji: '👑', description: 'Literally mined Bitcoin on a potato. Owns the blockchain.' };
  }
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Performance optimization: Cache public client instances
const clientCache = new Map();

/**
 * Get cached public client
 * @param {number} chainId - Chain ID
 * @returns {object} Public client instance
 */
export function getCachedClient(chainId = 8453) {
  if (!clientCache.has(chainId)) {
    clientCache.set(chainId, getPublicClient(chainId));
  }
  return clientCache.get(chainId);
}

/**
 * Format wallet address with custom length
 */
export function formatAddressWithLength(address, startLen = 6, endLen = 4) {
  if (!address) return '';
  return `${address.slice(0, startLen)}...${address.slice(-endLen)}`;
}

/**
 * Get ordinal suffix for numbers
 */
export function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Safely parse integer from string
 */
export function safeParseInt(value, defaultValue = 0) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
