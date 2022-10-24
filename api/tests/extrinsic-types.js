/**
 *  source  ----> 
 *  https://polkadot.js.org/docs/api/cookbook/blocks
 * 
 */

// no blockHash is specified, so we retrieve the latest
const signedBlock = await api.rpc.chain.getBlock();
const apiAt = await api.at(signedBlock.block.header.hash);
const allRecords = await apiAt.query.system.events();
console.log('signedBlock: ' + JSON.stringify(signedBlock.toHuman(), null, 2));
console.log('allRecords: ' + JSON.stringify(allRecords.toHuman(), null, 2));

// map between the extrinsics and events
signedBlock.block.extrinsics.forEach(({ method: { method, section } }, index) => {
  // filter the specific events based on the phase and then the
  // index of our extrinsic in the block
  const events = allRecords
    .filter(({ phase }) =>
      phase.isApplyExtrinsic &&
      phase.asApplyExtrinsic.eq(index)
    )
    .map(({ event }) => `${event.section}.${event.method}`);

  console.log(`${section}.${method}:: ${events.join(', ') || 'no events'}`);
});