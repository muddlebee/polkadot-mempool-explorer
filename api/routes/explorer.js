/**
 * Module dependencies
 */
const express = require('express');
const moment = require('moment');
const PolkadotService = require('../services/polkadot');
const CacheService = require('../services/cache');
const logger = require('../logger');
const { InternalServerErrorResponse } = require('../http-errors');
const { DATE_FORMAT } = require('../env');
const {
  INHERENT,
  SIGNED_TRANSACTION,
  UNSIGNED_TRANSACTION,
} = require('../constants/extrinsic');

const router = express.Router();
const internalServer = new InternalServerErrorResponse();

/**
 * Get Networks
 */
router.get('/networks', (req, res) => {
  try {
    const networks = PolkadotService.getNetworks();

    res.status(200).send(networks);
  } catch (err) {
    logger.error({ err }, 'Error getting networks');

    res.status(internalServer.code).send(internalServer);
  }
});

router.post('/networks/:networkId/reset', async (req, res) => {
  try {
    await PolkadotService.resetWatchPendingExtrinsics(
      req.params.networkId || ''
    );

    res.status(204).send();
  } catch (err) {
    logger.error({ err }, 'Error resetting netwotk');

    res.status(internalServer.code).send(internalServer);
  }
});

router.get('/transactions/:networkId', async (req, res) => {
  try {
    const networkId = req.params.networkId || '';

    const extrinsics = await CacheService.getCachedExtrinsics(networkId);
    const response = extrinsics.map((extrinsic) => {
      let type = '';

      if (extrinsic.from !== '' && extrinsic.to !== '' && extrinsic.isSigned) {
        // Signed transactions contain a signature of the account that issued the transaction
        // and stands to pay a fee to have the transaction included on chain
        type = SIGNED_TRANSACTION;
      } else if (
        extrinsic.from !== '' &&
        extrinsic.to !== '' &&
        !extrinsic.isSigned
      ) {
        // Since the transaction is not signed, there is nobody to pay a fee
        type = UNSIGNED_TRANSACTION;
      } else {
        // Inherents are pieces of information that are not signed
        // and only inserted into a block by the block author.
        type = INHERENT;
      }

      return {
        hash: extrinsic.hash,
        update_at: moment(extrinsic.updateAt).format(DATE_FORMAT),
        create_at: moment(extrinsic.createAt).format(DATE_FORMAT),
        block_number:
          extrinsic.block.number !== 0 ? extrinsic.block.number : '',
        type,
        nonce: extrinsic.nonce,
        tip: extrinsic.tip,
        balance_transfer: `${extrinsic.value} ${extrinsic.tokenSymbol}`,
        isValid: extrinsic.success,
        isFinalized: extrinsic.finalized,
        from: extrinsic.from,
        to: extrinsic.to,
        raw_value: extrinsic,
      };
    });

    res.status(200).send({
      items: response,
      _total: response.length,
    });
  } catch (err) {
    logger.error({ err }, 'Error getting transactions');

    res.status(internalServer.code).send(internalServer);
  }
});

/**
 * Expose Router
 */
module.exports = router;
