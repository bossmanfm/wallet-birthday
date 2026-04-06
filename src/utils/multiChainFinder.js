import { createPublicClient, http } from 'viem';

// Chain configurations
export const CHAINS = [
  { name: 'Ethereum', chainId: 1, rpc: 'https://eth.llamarpc.com', explorer: 'https://etherscan.io', useEtherscan: true },
  { name: 'BSC', chainId: 56, rpc: 'https://bsc-dataseed.binance.org', explorer: 'https://bscscan.com', useEtherscan: false },
  { name: 'Polygon', chainId: 137, rpc: 'https://polygon-rpc.com', explorer: 'https://polygonscan.com', useEtherscan: false },
  { name: 'Arbitrum', chainId: 42161, rpc: 'https://arb1.arbitrum.io/rpc', explorer: 'https://arbiscan.io', useEtherscan: false },
  { name: 'Optimism', chainId: 10, rpc: 'https://mainnet.optimism.io', explorer: 'https://optimistic.etherscan.io', useEtherscan: false },
  { name: 'Avalanche', chainId: 43114, rpc: 'https://api.avax.network/ext/bc/C/rpc', explorer: 'https://snowtrace.io', useEtherscan: false },
  { name: 'Base', chainId: 8453, rpc: 'https://mainnet.base.org', explorer: 'https://basescan.org', useEtherscan: false },
];

// Etherscan API key (optional but recommended for higher rate limits)
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || '';

// Create public client for a chain
function getClient(rpcUrl) {
  return createPublicClient({
    transport: http(rpcUrl),
  });
}

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Find the first transaction for an address on Ethereum using Etherscan API
 * Etherscan returns ALL transactions including plain ETH transfers
 */
async function findFirstTxEtherscan(address) {
  console.log('[WalletBirthday] Using Etherscan API for Ethereum');
  
  try {
    // Build URL with optional API key
    let url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc`;
    if (ETHERSCAN_API_KEY) {
      url += `&apikey=${ETHERSCAN_API_KEY}`;
      console.log('[WalletBirthday] Etherscan API key provided (5 calls/sec limit)');
    } else {
      console.log('[WalletBirthday] No Etherscan API key (1 call/sec limit)');
    }
    
    const response = await fetchWithTimeout(url, {}, 15000);
    const data = await response.json();
    
    if (data.status === '1' && data.result && data.result.length > 0) {
      console.log('[WalletBirthday] Etherscan returned result:', data.result[0].blockNumber);
      return {
        chainName: 'Ethereum',
        blockNumber: parseInt(data.result[0].blockNumber),
        timestamp: parseInt(data.result[0].timeStamp) * 1000,
        hash: data.result[0].hash,
      };
    }
    
    console.log('[WalletBirthday] Etherscan returned no transactions');
    return null;
  } catch (error) {
    console.error('[WalletBirthday] Etherscan API error:', error.message);
    return null;
  }
}

/**
 * Get current block number via RPC
 */
async function getCurrentBlockNumber(rpcUrl) {
  try {
    const response = await fetchWithTimeout(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    }, 10000);
    const data = await response.json();
    return parseInt(data.result || '0x0', 16);
  } catch (error) {
    console.error('[WalletBirthday] getCurrentBlockNumber error:', error.message);
    return 0;
  }
}

/**
 * Get transaction count at a specific block (nonce)
 */
async function getTxCountAtBlock(address, rpcUrl, blockNum) {
  try {
    const response = await fetchWithTimeout(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address, '0x' + blockNum.toString(16)],
        id: 1
      })
    }, 10000);
    const data = await response.json();
    return parseInt(data.result || '0x0', 16);
  } catch (error) {
    return 0;
  }
}

/**
 * Get block by number via RPC
 */
async function getBlockByNumber(rpcUrl, blockNum) {
  const response = await fetchWithTimeout(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['0x' + blockNum.toString(16), false],
      id: 1
    })
  }, 10000);
  return response.json();
}

/**
 * Find the first transaction for an address on a chain using RPC binary search
 * OPTIMIZED: Uses nonce check to quickly skip empty chains
 */
async function findFirstTxRpc(address, rpcUrl, chainName) {
  console.log(`[WalletBirthday] Starting RPC binary search for ${chainName}`);
  
  try {
    // Get current block number
    let high = await getCurrentBlockNumber(rpcUrl);
    
    if (high === 0) {
      console.log(`[WalletBirthday] ${chainName}: No blocks yet`);
      return null;
    }
    
    console.log(`[WalletBirthday] ${chainName}: Current block ${high}`);
    
    // First, check if wallet has ANY transactions at latest block
    const currentNonce = await getTxCountAtBlock(address, rpcUrl, high);
    
    if (currentNonce === 0) {
      console.log(`[WalletBirthday] ${chainName}: No transactions (nonce=0 at latest)`);
      return null; // No transactions on this chain
    }
    
    console.log(`[WalletBirthday] ${chainName}: Has ${currentNonce} txs at latest, finding first...`);
    
    let low = 0;
    
    // OPTIMIZATION: Check 1000 blocks ago first
    // If wallet has txs there too, we can skip recent blocks
    const checkBlock = Math.max(0, high - 1000);
    const oldNonce = await getTxCountAtBlock(address, rpcUrl, checkBlock);
    
    if (oldNonce > 0) {
      // Wallet is old, binary search in first half
      high = checkBlock;
      console.log(`[WalletBirthday] ${chainName}: Old wallet, searching blocks 0-${high}`);
    } else {
      // Wallet is newer (made first tx in last 1000 blocks)
      low = checkBlock;
      console.log(`[WalletBirthday] ${chainName}: Newer wallet, searching blocks ${low}-${high}`);
    }
    
    // Binary search to find first block where nonce > 0
    let iterations = 0;
    const maxIterations = 100; // Safety limit
    
    while (low < high && iterations < maxIterations) {
      iterations++;
      const mid = Math.floor((low + high) / 2);
      const count = await getTxCountAtBlock(address, rpcUrl, mid);
      
      if (count > 0) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    
    if (iterations >= maxIterations) {
      console.log(`[WalletBirthday] ${chainName}: Max iterations reached`);
    }
    
    // Double-check we found a block with transactions
    const finalCount = await getTxCountAtBlock(address, rpcUrl, low);
    if (finalCount === 0) {
      console.log(`[WalletBirthday] ${chainName}: No txs found after binary search`);
      return null;
    }
    
    // Get block timestamp
    const blockData = await getBlockByNumber(rpcUrl, low);
    
    if (!blockData.result) {
      console.log(`[WalletBirthday] ${chainName}: Could not get block data`);
      return null;
    }
    
    const timestamp = parseInt(blockData.result.timestamp, 16) * 1000;
    
    console.log(`[WalletBirthday] ${chainName}: Found first tx at block ${low}, ts=${timestamp}`);
    
    return {
      chainName,
      blockNumber: low,
      timestamp,
      hash: null,
    };
  } catch (error) {
    console.error(`[WalletBirthday] RPC binary search error on ${chainName}:`, error.message);
    return null;
  }
}

/**
 * Scan a single chain with timeout
 */
async function scanChainWithTimeout(chain, address, timeoutMs = 30000) {
  console.log(`[WalletBirthday] Starting scan for ${chain.name} (timeout: ${timeoutMs}ms)`);
  
  const startTime = Date.now();
  
  try {
    // Race between actual scan and timeout
    const result = await Promise.race([
      findFirstTxOnChain(address, chain),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Chain scan timeout')), timeoutMs)
      )
    ]);
    
    const elapsed = Date.now() - startTime;
    console.log(`[WalletBirthday] ${chain.name}: completed in ${elapsed}ms`);
    
    return { chain: chain.name, status: 'success', data: result };
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[WalletBirthday] ${chain.name}: failed after ${elapsed}ms -`, error.message);
    return { chain: chain.name, status: 'error', error: error.message };
  }
}

/**
 * Scan a chain with retry logic
 */
async function scanChainWithRetry(chain, address, maxRetries = 2, timeoutMs = 30000) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await scanChainWithTimeout(chain, address, timeoutMs);
    
    if (result.status === 'success' && result.data !== null) {
      return result;
    }
    
    if (i < maxRetries - 1) {
      console.log(`[WalletBirthday] Retry ${i + 1} for ${chain.name}...`);
      // Wait a bit before retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  return { chain: chain.name, status: 'error', error: 'Max retries exceeded' };
}

/**
 * Find the first transaction for an address on a specific chain
 * Uses Etherscan API for Ethereum (finds ALL tx types), RPC binary search for others
 */
export async function findFirstTxOnChain(address, chain) {
  // Use Etherscan API for Ethereum - it returns ALL transactions including ETH transfers
  if (chain.useEtherscan) {
    const result = await findFirstTxEtherscan(address);
    if (result) {
      return result;
    }
    // Fallback to RPC if Etherscan fails
    console.log(`[WalletBirthday] Etherscan failed for ${chain.name}, falling back to RPC binary search`);
  }
  
  // Use RPC binary search for other chains
  return findFirstTxRpc(address, chain.rpc, chain.name);
}

/**
 * Find the first transaction across all chains
 * @param {string} address - Ethereum address
 * @param {function} onProgress - Progress callback (chainName, status)
 * @returns {Promise<{chainName: string, blockNumber: number, timestamp: number, date: string}|null>}
 */
export async function findFirstTxMultiChain(address, onProgress = () => {}) {
  const results = [];
  
  console.log(`[WalletBirthday] Starting multi-chain scan for ${address}`);
  console.log(`[WalletBirthday] Scanning ${CHAINS.length} chains in parallel`);
  
  // Scan all chains in parallel with timeout
  const scanPromises = CHAINS.map(async (chain) => {
    try {
      onProgress(chain.name, 'scanning');
      const result = await scanChainWithRetry(chain, address, 2, 30000); // 2 retries, 30s timeout each
      
      if (result.status === 'success' && result.data !== null) {
        onProgress(chain.name, 'found');
        return result.data;
      } else {
        onProgress(chain.name, 'error');
        console.log(`[WalletBirthday] ${chain.name}: scan failed - ${result.error}`);
        return null;
      }
    } catch (error) {
      console.error(`[WalletBirthday] Failed to scan ${chain.name}:`, error.message);
      onProgress(chain.name, 'error');
      return null;
    }
  });
  
  // Wait for all chains to complete (max ~60s with timeouts)
  const allResults = await Promise.all(scanPromises);
  
  console.log(`[WalletBirthday] All chains scanned. Processing ${allResults.filter(r => r !== null).length} results...`);
  
  // Filter out null results and find the oldest
  const validResults = allResults.filter(r => r !== null);
  
  if (validResults.length === 0) {
    console.log('[WalletBirthday] No transactions found on any chain');
    return null;
  }
  
  // Find the oldest (earliest timestamp)
  const oldest = validResults.reduce((prev, curr) => 
    curr.timestamp < prev.timestamp ? curr : prev
  );
  
  console.log(`[WalletBirthday] Oldest tx found: ${oldest.chainName} at block ${oldest.blockNumber}`);
  
  return {
    chainName: oldest.chainName,
    blockNumber: oldest.blockNumber,
    timestamp: oldest.timestamp,
    date: new Date(oldest.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    allResults: validResults,
  };
}

export function getChainExplorerUrl(chainName) {
  const chain = CHAINS.find(c => c.name === chainName);
  return chain ? chain.explorer : 'https://etherscan.io';
}
