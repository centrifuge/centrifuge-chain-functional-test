import 'mocha';
import { expect } from 'chai';

import { Anchoring, AnchorParam } from './anchoring';
import { ApiPromise } from '@polkadot/api';
import { connect } from './connect';
import { AccountManager } from './account_manager';
import { newRandomAnchorParam } from './util';

// TODO read from env
const WS_PROVIDER='ws://127.0.0.1:9944';

describe('Anchoring', async () => {

  let api: ApiPromise;

  let accMan: AccountManager;

  before(async () => {
    api = await connect(WS_PROVIDER);
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // TODO move this to a place at the route of all tests later
    accMan = new AccountManager();
    await accMan.createTestAccounts(api, 3, 1000000);
  });

  describe('Commit', () => {

    it('should commit anchor', (cb) => {
      const anchorer = new Anchoring(api);
      let ancParam = newRandomAnchorParam();
      anchorer.commit(ancParam)
        .signAndSend(accMan.getAccountByIndex(0), ({ events = [], status }) => {
          if (status.isFinalized) {
            events.forEach(async ({ phase, event: { data, method, section } }) => {
              //console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
              let anchor = await anchorer.findAnchor(ancParam.getAnchorId());
              expect(anchor.docRoot).to.equal(ancParam.docRoot)
              expect(anchor.id).to.equal(ancParam.getAnchorId())
              cb();
            });
          }
        });
    });

  });

  after(async () => {
    api.disconnect();
  });

});