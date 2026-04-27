/**
 * Event handler utilities for contract events
 */

/**
 * Parse BirthdayMinted event
 */
export function parseBirthdayMintedEvent(log) {
  return {
    minter: log.args?.minter || log.args?.[0],
    tokenId: log.args?.tokenId || log.args?.[1],
    timestamp: log.args?.timestamp || log.args?.[2],
    transactionHash: log.transactionHash,
    blockNumber: log.blockNumber,
  };
}

/**
 * Parse EmergencyTransfer event
 */
export function parseEmergencyTransferEvent(log) {
  return {
    from: log.args?.from || log.args?.[0],
    to: log.args?.to || log.args?.[1],
    tokenId: log.args?.tokenId || log.args?.[2],
    transactionHash: log.transactionHash,
    blockNumber: log.blockNumber,
  };
}

/**
 * Check if event matches expected signature
 */
export function matchesEventSignature(log, eventName) {
  return log.event === eventName || log.eventName === eventName;
}
