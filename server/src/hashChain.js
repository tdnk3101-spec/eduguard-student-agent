const crypto = require('crypto');

/**
 * EduGuard Tamper-Evident Cryptographic Hash Chain
 * Every case action (intake, notice, student submission, hearing, decision, sanction, closure)
 * is appended as an immutable, hash-linked block in the institutional case ledger.
 */

function calculateEntryHash({ index, previousHash, timestamp, caseId, actor, action, payload }) {
  const serializedPayload = typeof payload === 'object' ? JSON.stringify(payload) : String(payload || '');
  const rawString = `${index}|${previousHash}|${timestamp}|${caseId}|${actor}|${action}|${serializedPayload}`;
  return crypto.createHash('sha256').update(rawString).digest('hex');
}

function createLedgerEntry({ previousHash, caseId, actor, action, payload, index }) {
  const timestamp = new Date().toISOString();
  const prev = previousHash || '0000000000000000000000000000000000000000000000000000000000000000';
  const entryIndex = typeof index === 'number' ? index : 0;
  
  const hash = calculateEntryHash({
    index: entryIndex,
    previousHash: prev,
    timestamp,
    caseId,
    actor,
    action,
    payload
  });

  return {
    id: `TX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    index: entryIndex,
    caseId,
    timestamp,
    actor,
    action,
    payload,
    previousHash: prev,
    hash
  };
}

function verifyChainIntegrity(chain) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return { isValid: true, count: 0, brokenIndex: null, message: 'Chain is empty' };
  }

  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i];
    
    // Verify link to previous hash
    if (i === 0) {
      if (entry.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          isValid: false,
          count: chain.length,
          brokenIndex: 0,
          reason: 'Genesis block previousHash mismatch'
        };
      }
    } else {
      const prev = chain[i - 1];
      if (entry.previousHash !== prev.hash) {
        return {
          isValid: false,
          count: chain.length,
          brokenIndex: i,
          reason: `Broken chain link at index ${i}. Expected prevHash ${prev.hash.substring(0, 10)}... got ${entry.previousHash.substring(0, 10)}...`
        };
      }
    }

    // Verify hash integrity of entry content
    const recalculatedHash = calculateEntryHash({
      index: entry.index,
      previousHash: entry.previousHash,
      timestamp: entry.timestamp,
      caseId: entry.caseId,
      actor: entry.actor,
      action: entry.action,
      payload: entry.payload
    });

    if (recalculatedHash !== entry.hash) {
      return {
        isValid: false,
        count: chain.length,
        brokenIndex: i,
        reason: `Tampering detected at block #${entry.index} (${entry.action}). Computed hash does not match recorded hash!`
      };
    }
  }

  return {
    isValid: true,
    count: chain.length,
    brokenIndex: null,
    message: `All ${chain.length} blocks verified cryptographically intact.`
  };
}

module.exports = {
  createLedgerEntry,
  verifyChainIntegrity,
  calculateEntryHash
};
