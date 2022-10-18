/**
 * Module dependencies
 */
const LRU = require('lru-cache');
const { CACHE_MAX_AGE, CACHE_MAX_SIZE } = require('../../../env');

/**
 * Expose a LRU cache instance
 *
 * @param {number} max
 * @param {number} maxAge
 */
module.exports = (max, maxAge) =>
  new LRU({
    max: max || CACHE_MAX_SIZE,
    ttl: maxAge || CACHE_MAX_AGE,
    ttlAutopurge: true,
  });
