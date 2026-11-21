/**
 * Distributed Lock State Manager with TTL and Fencing Tokens
 */
class DistributedLockManager {
  constructor() {
    this.locks = new Map();
    this.fencingTokenSeq = 1;
  }

  acquire(resource, ttlMs = 5000) {
    const now = Date.now();
    const existing = this.locks.get(resource);

    if (existing && existing.expiresAt > now) {
      return { acquired: false, error: 'Resource locked' };
    }

    const fencingToken = this.fencingTokenSeq++;
    this.locks.set(resource, { expiresAt: now + ttlMs, fencingToken });
    return { acquired: true, fencingToken, ttlMs };
  }

  release(resource, fencingToken) {
    const existing = this.locks.get(resource);
    if (!existing) return false;
    if (existing.fencingToken === fencingToken) {
      this.locks.delete(resource);
      return true;
    }
    return false;
  }
}

module.exports = { DistributedLockManager };
