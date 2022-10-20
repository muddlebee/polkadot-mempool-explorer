// All code is wrapped within an async closure,
// allowing access to api, hashing, types, util.
// (async ({ api, hashing, types, util }) => {
//   ... any user code is executed here ...
// })();

// subscribe to new headers, printing the full info for 5 Blocks
let count = 0;
const unsub = await api.rpc.chain.subscribeNewHeads(async (header) => {
  console.log(`#${header.number}:`, header);
  const blockHash = await api.rpc.chain.getBlockHash(header.number);
  const { block } = await api.rpc.chain.getBlock(blockHash);
  console.log('block : ' +JSON.stringify(block));

   const blockEvents = await api.query.system.events.at(header.hash);
   console.log('blockEvents    : ' +JSON.stringify(blockEvents));


  if (++count === 5) {
    console.log('5 headers retrieved, unsubscribing');
    unsub();
  }
});