/**
 * Module dependencies
 */
const lru = require('./helpers/lru-cache');
const localLock = require('./helpers/lock');
const logger = require('../../logger');
const ExtrinsicModel = require('./extrinsic.model');
const { NETWORK_MAX_ITEMS } = require('../../env');

/**
 * Init cache on memory
 */
const lruCache = lru();

/**
 * Init local lock
 */
const lock = localLock();

class CacheService {
  /**
   * gets initiated during server startup and updates data in lru-cache returned from
   * api.rpc.author.pendingExtrinsics
   *
   *
   * @param {*} data
   * @returns
   */
  static async updateCachedExtrinsics(data = {}) {
    const { hash, from, nonce, networkId } = data;

    // Lock network and prevent update at the same time
    let extrinsicKeys = await lock.acquire(networkId);

    try {
      if (!extrinsicKeys) {
        extrinsicKeys = await CacheService.getCachedNetworkExtrinsicKeys(
          networkId
        );
        extrinsicKeys.reverse();
      }

      const extrinsicKey = CacheService.generateExtrinsicKey(
        networkId,
        hash,
        from,
        nonce
      );

      const extrinsic = new ExtrinsicModel();
      const cacheExtrinsic = await CacheService.getCachedExtrinsic(
        hash,
        from,
        nonce,
        networkId
      );

      // Check if extrinsic is already on cache and update the local instance of ExtrinsicModel
      extrinsic.buildFrom(cacheExtrinsic || {});

      if (!extrinsicKeys.includes(extrinsicKey)) {
        if (extrinsicKeys.length + 1 > NETWORK_MAX_ITEMS) {
          // Remove last element from cache
          // pop() method removes the last element from an array and returns that element.

          lruCache.del(extrinsicKeys.pop());
        }

        extrinsicKeys.push(extrinsicKey);
      }

      // Update cache with data
      extrinsic.buildFrom(data);
      // Update extrinsic
      await CacheService.cacheExtrinsic(
        hash,
        from,
        nonce,
        networkId,
        extrinsic.toJSON()
      );
      // Update network
      await CacheService.cacheNetworkExtrinsicKeys(networkId, extrinsicKeys);

      return extrinsic;
    } catch (err) {
      logger.error({ err }, 'Error trying to upsert extrinsic');

      return null;
    } finally {
      lock.release(networkId, extrinsicKeys);
    }
  }

  static async getCachedExtrinsics(networkId) {
    const cachedExtrinsicKeys = await CacheService.getCachedNetworkExtrinsicKeys(
      networkId
    );

    if (cachedExtrinsicKeys.length > 0) {
      const expiredExtrinsicKeys = [];
      const extrinsics = [];

      cachedExtrinsicKeys.forEach((extrinsicKey) => {
        const extrinsic = JSON.parse(lruCache.get(extrinsicKey) || null);

        if (extrinsic) {
          extrinsics.push(extrinsic);
        } else {
          expiredExtrinsicKeys.push(extrinsicKey);
        }
      });

      //TODO: investigate
      // Remove the least-recently-used extrinsic from network
      // In some cases the extrinsic can expire and still be present on the network cache.
      if (expiredExtrinsicKeys.length > 0) {
        expiredExtrinsicKeys.forEach((expireExtrinsicKey) => {
          const index = cachedExtrinsicKeys.indexOf(expireExtrinsicKey);

          if (index !== -1) {
            cachedExtrinsicKeys.splice(index, 1);
          }
        });

        logger.info('############ expiredExtrinsicKeys ###############');
        // Update extrinsicCachedKeys
        await CacheService.cacheNetworkExtrinsicKeys(
          networkId,
          cachedExtrinsicKeys
        );
      }

      return extrinsics.sort((a, b) => {
        if (a.createAt > b.createAt) return -1;
        if (a.createAt < b.createAt) return 1;
        return 0;
      });
    }

    return [];
  }

  static async getCachedExtrinsic(hash, from, nonce, networkId) {
    const extrinsicKey = CacheService.generateExtrinsicKey(
      networkId,
      hash,
      from,
      nonce
    );

    return JSON.parse(lruCache.get(extrinsicKey) || null);
  }

  static async getCachedNetworkExtrinsicKeys(networkId) {
    const networkKey = CacheService.generateNetworkKey(networkId);

    return JSON.parse(lruCache.get(networkKey) || null) || [];
  }

  /**
   * set lru-cache
   * key -> extrinsicKey
   * value -> data
   *
   * @param {*} hash
   * @param {*} from
   * @param {*} nonce
   * @param {*} networkId
   * @param {*} data
   */
  static async cacheExtrinsic(hash, from, nonce, networkId, data) {
    const extrinsicKey = CacheService.generateExtrinsicKey(
      networkId,
      hash,
      from,
      nonce
    );
    //print extrinsicKey and data
    logger.info('#########################cacheExtrinsic#################################')
    logger.info('extrinsicKey -----------------------------> ' + extrinsicKey);
    logger.info('data -----------------------------> ' + JSON.stringify(data));
    lruCache.set(extrinsicKey, JSON.stringify(data));
  }

  static async cacheNetworkExtrinsicKeys(networkId, data) {
    //print extrinsicKey and data
    logger.info('#######################cacheNetworkExtrinsicKeys###################################')
    logger.info('networkId -----------------------------> ' + networkId);
    logger.info('data -----------------------------> ' + JSON.stringify(data));
    const networkKey = CacheService.generateNetworkKey(networkId);
    lruCache.set(networkKey, JSON.stringify(data));
  }

  static async getCachedPendingExtrinsicHashes(networkId) {
    const extrinsics = await CacheService.getCachedExtrinsics(networkId);
    const hashes = [];

    extrinsics.forEach((extrinsic) => {
      if (!extrinsic.finalized) {
        hashes.push(extrinsic.hash);
      }
    });

    return hashes;
  }

  static async cacheTokenSymbol(networkId, tokenSymbol = 'DOT') {
    const tokenSymbolKey = CacheService.getTokenSymbolKey(networkId);

    lruCache.set(tokenSymbolKey, tokenSymbol);
  }

  static async getCachedTokenSymbol(networkId) {
    const tokenSymbolKey = CacheService.getTokenSymbolKey(networkId);

    return lruCache.get(tokenSymbolKey);
  }

  /**
   * extrinsicKey is formed with a combination of
   * hash, from, nonce and networkId
   * in order to save an extrinsic data
   *
   * @param {*} networkId
   * @param {*} hash
   * @param {*} from
   * @param {*} nonce
   * @returns
   */
  static generateExtrinsicKey(networkId, hash, from, nonce) {
    if (!hash || !Number.isInteger(nonce) || !networkId) {
      throw new Error(
        'You must provide a hash, from, nonce and networkId in order to save an extrinsic'
      );
    }

    //if from is null, return without ${from}
    if (from === null) {
      return `${CacheService.generateNetworkKey(
        networkId
      )}.extrinsic.hash-${hash}.nonce-${nonce}.key`;
    }

    return `${CacheService.generateNetworkKey(
      networkId
    )}.extrinsic.hash-${hash}.from-${from}.nonce-${nonce}.key`;
  }

  static generateNetworkKey(networkId) {
    return `network.id-${networkId}.key`;
  }

  static getTokenSymbolKey(networkId) {
    return `${CacheService.generateNetworkKey(networkId)}.token-symbol`;
  }
}

/**
 * Expose CacheService
 */
module.exports = CacheService;
