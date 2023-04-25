/**
 * Module dependencies
 */
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { BN } = require('@polkadot/util');

const { DEVELOPMENT, FETCH_PENDING_EXTRINSICS_DELAY } = require('../../env');
const {
  LIVE_NETWORKS,
  TEST_NETWORKS,
  LOCAL_NETWORKS,
  DEV_NETWORKS,
  CUSTOM_NETWORKS,
} = require('../../constants/networks');
const logger = require('../../logger');
const { customMethods, customMethodKeys } = require('./custom-rpc-methods');
const CacheService = require('../cache');
const { error } = require('../cache/mocks/logger.mock');

const connections = {};
const extrinsicWatchers = {};
const newHeadWatchers = {};

class PolkadotService {
  static getNetworks() {
    const local = [...LOCAL_NETWORKS];
    let live = [...LIVE_NETWORKS, ...CUSTOM_NETWORKS];

    if (DEVELOPMENT) {
      local.push(...DEV_NETWORKS);
      live = LIVE_NETWORKS;
    }

    return {
      test: TEST_NETWORKS,
      live,
      local,
    };
  }

  static getNetwork(networkId) {
    const { live, test, local } = PolkadotService.getNetworks();
    const networks = [...live, ...test, ...local];
    const network = networks.find((item) => item.id === networkId);

    if (!network) {
      throw new Error('You must provide a valid networkId');
    }

    return network;
  }

  static async setTokenSymbol(networkId, api) {
    const { tokenSymbol } = await api.rpc.system.properties();

    await CacheService.cacheTokenSymbol(networkId, tokenSymbol.toString());
  }

  static async initWatchers() {
    const { test, live, local } = PolkadotService.getNetworks();
    const promises = [...test, ...live, ...local].map((network) =>
      PolkadotService.fetchPendingExtrinsics(network.id)
    );

    return Promise.all(promises);
  }

  /**
   * Connect to Polkadot via WebSocket
   * @param {string} networkId
   */
  static async connect(networkId) {
    const { url: endpoint } = PolkadotService.getNetwork(networkId || '');

    // Store all connection in memory.
    if (!connections[networkId]) {
      try {
        const provider = new WsProvider(endpoint, 100);

        // connect manually to websocket
        if (!provider.isConnected) {
          // Connect to the WebSocket
          await provider.connect();
        }

        let options = { provider };
        let api = await ApiPromise.create(options);
        const { methods } = await api.rpc.rpc.methods();

        customMethodKeys.forEach((methodKey) => {
          if (methods.includes(methodKey)) {
            options = { ...options, ...customMethods[methodKey] };
          }
        });

        // If options contains custom RPC methods.
        if (options.rpc) {
          api = await ApiPromise.create(options);
        }

        connections[networkId] = api.clone();

        await PolkadotService.setTokenSymbol(networkId, api);

        return connections[networkId];
      } catch (error) {
        logger.error({ err: error }, 'Error trying to create Api Provider.');

        return null;
      }
    }

    return connections[networkId];
  }

  /**
   *
   * @param {*} networkId
   */
  static getExtrinsicWatcher(networkId) {
    return extrinsicWatchers[networkId] || null;
  }

  /**
   *
   * @param {*} networkId
   */
  static getNewHeadWatcher(networkId) {
    return newHeadWatchers[networkId] || null;
  }

  /**
   *
   * @param {*} networkId
   */
  static hasTrackExtrinsicMethod(networkId) {
    return (
      connections[networkId] &&
      connections[networkId].rpc.author.trackExtrinsic === 'function'
    );
  }

  /**
   *
   * @param {*} networkId
   */
  static async resetWatchPendingExtrinsics(networkId) {
    PolkadotService.unSubscribeWatchers(networkId);
    await PolkadotService.fetchExtrinsicsInfoAndUpdateCache(networkId);
    return PolkadotService.fetchPendingExtrinsics(networkId);
  }

  static unSubscribeWatchers(networkId) {
    const unsubExtrinsic = PolkadotService.getExtrinsicWatcher(networkId);
    const unsubNewHead = PolkadotService.getNewHeadWatcher(networkId);

    if (unsubExtrinsic) {
      // un subscribe from watchPendingExtrinsics
      clearInterval(unsubExtrinsic);
    }

    if (unsubNewHead) {
      // un subscribe from watchNewHeads
      unsubNewHead();
    }
  }

  /**
   * Watch pending extrinsic until they are finalized.
   * @param {string} networkId
   */
  static async fetchPendingExtrinsics(networkId) {

    if (!PolkadotService.getExtrinsicWatcher(networkId)) {
      logger.info(`Init watcher extrinsics for network: ${networkId}`);

      try {
        const api = await PolkadotService.connect(networkId);

        if (api) {
          // Wait until we are ready and connected
          await api.isReady;

          const tokenSymbol = await CacheService.getCachedTokenSymbol(
            networkId
          );

          // update extrinsics info in cache
          await PolkadotService.fetchExtrinsicsInfoAndUpdateCache(networkId);

          //TODO: faulty implementation of pending extrinsics
          // const unsub = setInterval(async () => {
          //   /**
          //    * https://polkadot.js.org/docs/kusama/rpc#pendingextrinsics-vecextrinsic
          //    * summary: Returns all pending extrinsics, potentially grouped by sender
          //    */

          //   //TODO:remove the pendingExtrinsics API 
          //   await api.rpc.author.pendingExtrinsics(async (extrinsics) => {

          //     if (extrinsics.length > 0) {
          //       const rows = [];

          //       logger.info(
          //         `${extrinsics.toString()} pending extrinsics in network ${networkId}.`
          //       );

          //       extrinsics.forEach((extrinsic) => {
          //         const hash = extrinsic.hash.toString();
          //         const from = extrinsic.signer.toString();
          //         const nonce = parseInt(extrinsic.nonce.toString(), 10);
          //         const tip = parseFloat(extrinsic.tip.toString());
          //         let to = null;
          //         const value = 0;
          //         const symbol = tokenSymbol;
          //         let era = { isMortal: false };
          //         extrinsic.args.forEach((arg) => {
          //           if (arg.toRawType().includes('AccountId')) {
          //             to = arg.toString();
          //           }
          //           /* else if (arg.toRawType().includes('Compact<Balance>')) {
          //             [value, symbol] = arg.toHuman().split(' ');
          //           } */
          //         });

          //         if (extrinsic.era.isMortalEra) {
          //           const { period, phase } = extrinsic.era.asMortalEra;
          //           era = {
          //             isMortal: true,
          //             period: period.toString(),
          //             phase: phase.toString(),
          //           };
          //         }

          //         rows.push({
          //           networkId,
          //           hash,
          //           from,
          //           to,
          //           value,
          //           era,
          //           nonce,
          //           tip,
          //           tokenSymbol: symbol,
          //           section: extrinsic.method.sectionName,
          //           method: extrinsic.method.methodName,
          //           transactionVersion: extrinsic.type,
          //           specVersion: extrinsic.version,
          //           isSigned: extrinsic.isSigned,
          //           signature: extrinsic.signature.toString(),
          //           createAt: Date.now(),
          //           updateAt: Date.now(),
          //         });
          //       });

          //       try {
          //         // Save extrinsics
          //         await Promise.all(
          //           rows.map((row) => CacheService.updateCachedExtrinsics(row))
          //         );
          //       } catch (err) {
          //         logger.error({ err }, 'Error trying to store extrinsis');
          //       }
          //     } else {
          //       logger.debug(
          //         `No pending extrinsics in the pool in network ${networkId}.`
          //       );
          //     }
          //   });
          // }, FETCH_PENDING_EXTRINSICS_DELAY);

          // extrinsicWatchers[networkId] = unsub;
        }
      } catch (error) {
        logger.error({ err: error }, 'Error on watchPendingExtrinsics.');
      }
    }
  }


  /**
   * method to update extrinsic events/info in cache as method,section and transactional data info
   * https://polkadot.js.org/docs/api/cookbook/blocks
   *
   * @param {*} networkId
   * @param {*} hash
   * @param {*} from
   * @param {*} nonce
   */
  static async fetchExtrinsicsInfoAndUpdateCache(networkId) {

    if (!PolkadotService.getNewHeadWatcher(networkId)) {
      logger.info(`Init watcher heads for network: ${networkId}`);

      try {
        const api = await PolkadotService.connect(networkId);

        const tokenSymbol = await CacheService.getCachedTokenSymbol(
          networkId
        );
        if (api) {
          // Wait until we are ready and connected
          await api.isReady;

          /**
           * Query subscriptions
           * https://polkadot.js.org/docs/api/start/api.query.subs
           *
           * */
          const unsub = await api.rpc.chain.subscribeNewHeads(
            async (header) => {
              /*   const pendingExtrinsicHashes = await CacheService.getCachedPendingExtrinsicHashes(
                  networkId
                ); */

              /**
               * filter extrinsics and its events
               * https://polkadot.js.org/docs/api/cookbook/blocks
               *
               */
              const blockHash = await api.rpc.chain.getBlockHash(header.number);
              const { block } = await api.rpc.chain.getBlock(blockHash);
              const blockEvents = await api.query.system.events.at(header.hash);
              const chainDecimals = await api.registry.chainDecimals[0];
              const token = await api.registry.chainTokens[0];

              const rows = [];

              // map between the extrinsics and events
              block.extrinsics.forEach((extrinsic, index) => {
                if (!extrinsic.isSigned)
                  return;

                const hash = extrinsic.hash.toString();

                //   if (pendingExtrinsicHashes.includes(hash)) {
                const data = {
                  hash,
                  networkId,
                  from: extrinsic.signer.toString(),
                  nonce: parseInt(extrinsic.nonce.toString(), 10),
                  tip: parseFloat(extrinsic.tip.toString()),
                  block: {
                    number: header.number.toString(),
                    hash: blockHash.toString(),
                  },
                  events: [],
                  updateAt: Date.now(),
                  era: { isMortal: false },
                  to: '',
                  symbol: tokenSymbol,
                  toUnitAmount : ''
                };
                const { method, signer, nonce } = extrinsic;
                const { method: methodName, section: pallet } = method.registry.findMetaCall(method.callIndex);

                // Check for different types of extrinsics
                if (pallet === 'balances' && methodName === 'transfer') {
                  const [destination, value] = method.args;
                  data.to = destination.toString();
                  data.toUnitAmount = toUnit(
                    value.toString(),
                    chainDecimals,
                    token
                  );
                  logger.info(
                    '################################################################################'
                  );
                  logger.info(
                    `data.toUnitAmount  -- ${data.toUnitAmount}`
                  );
                  logger.info(`Sender: ${signer}, Receiver: ${destination}, Amount: ${value}`);
                }


                if (extrinsic.era && extrinsic.era.isMortalEra) {
                  const { period, phase } = extrinsic.era.asMortalEra;
                  data.era = {
                    isMortal: true,
                    period: period.toString(),
                    phase: phase.toString(),
                  };
                }

                // filter the specific events based on the phase and then the
                // index of our extrinsic in the block
                data.events = blockEvents
                  .filter(
                    ({ phase }) =>
                      phase.isApplyExtrinsic &&
                      phase.asApplyExtrinsic.eq(index)
                  )
                  .map(({ event }) => {
                    if (api.events.system.ExtrinsicSuccess.is(event)) {
                      data.success = true;
                      data.finalized = true;
                    } else if (api.events.system.ExtrinsicFailed.is(event)) {
                      data.success = false;
                      data.finalized = true;
                    }
                    return {
                      method: event.section.toString(),
                      section: event.method.toString(),
                      data: event.data.toHuman(),
                    };
                  });
                rows.push(data);

              });

              try {
                // Update extrinsics in cache
                await Promise.all(
                  rows.map((row) => CacheService.updateCachedExtrinsics(row))
                );
              } catch (err) {
                logger.error({ err }, 'Error trying to update extrinsis');
              }
            }
          );

          newHeadWatchers[networkId] = unsub;
        }
      } catch (error) {
        logger.error({ err: error }, 'Error on watchNewHeads.');
      }
    }
  }
}

function toUnit(balance, decimals, token) {
  const base = new BN(10).pow(new BN(decimals));
  const dm = new BN(balance).divmod(base);
  return `${parseFloat(
    `${dm.div.toString()}.${dm.mod
      .toString()
      .padStart(decimals, '0')
      .slice(0, 2)}`
  )} ${token}`;
}
/**
 * Expose PolkadotService
 */
module.exports = PolkadotService;
