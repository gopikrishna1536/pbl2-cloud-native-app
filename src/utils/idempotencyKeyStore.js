/**
 * HTTP Idempotency-Key Response Cache Store
 */
class IdempotencyStore {
  constructor(ttlMs = 86400000) {
    this.store = new Map();
    this.ttlMs = ttlMs;
  }

  has(key) {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  get(key) {
    if (this.has(key)) return this.store.get(key).response;
    return null;
  }

  set(key, response) {
    this.store.set(key, {
      response,
      expiresAt: Date.now() + this.ttlMs
    });
  }
}

module.exports = { IdempotencyStore };
