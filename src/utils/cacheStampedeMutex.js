/**
 * Cache Stampede (Thundering Herd) Mutex Gate
 */
class CacheMutex {
  constructor() {
    this.inFlight = new Map();
  }

  async getOrCompute(key, computeFn) {
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }
    const promise = Promise.resolve().then(computeFn).finally(() => {
      this.inFlight.delete(key);
    });
    this.inFlight.set(key, promise);
    return promise;
  }
}

module.exports = { CacheMutex };
