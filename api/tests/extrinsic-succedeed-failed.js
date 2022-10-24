/**
 * source --->
 * https://polkadot.js.org/docs/api/cookbook/blocks#how-do-i-determine-if-an-extrinsic-succeededfailed
 * 
 * 
 */

// no blockHash is specified, so we retrieve the latest
const signedBlock = await api.rpc.chain.getBlock();

// get the api and events at a specific block
const apiAt = await api.at(signedBlock.block.header.hash);
const allRecords = await apiAt.query.system.events();

// map between the extrinsics and events
signedBlock.block.extrinsics.forEach(({ method: { method, section } }, index) => {
  allRecords
    // filter the specific events based on the phase and then the
    // index of our extrinsic in the block
    .filter(({ phase }) =>
      phase.isApplyExtrinsic &&
      phase.asApplyExtrinsic.eq(index)
    )
    // test the events against the specific types we are looking for
    .forEach(({ event }) => {
      if (api.events.system.ExtrinsicSuccess.is(event)) {
        // extract the data for this event
        // (In TS, because of the guard above, these will be typed)
        const [dispatchInfo] = event.data;

        console.log(`${section}.${method}:: ExtrinsicSuccess:: ${JSON.stringify(dispatchInfo.toHuman())}`);
      } else if (api.events.system.ExtrinsicFailed.is(event)) {
        // extract the data for this event
        const [dispatchError, dispatchInfo] = event.data;
        let errorInfo;

        // decode the error
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          // (For specific known errors, we can also do a check against the
          // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
          const decoded = api.registry.findMetaError(dispatchError.asModule);

          errorInfo = `${decoded.section}.${decoded.name}`;
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          errorInfo = dispatchError.toString();
        }

        console.log(`${section}.${method}:: ExtrinsicFailed:: ${errorInfo}`);
      }
    });
});