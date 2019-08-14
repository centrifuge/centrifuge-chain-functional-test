import 'mocha';
import { expect } from 'chai';
import path from 'path';

import { Anchoring } from './anchoring';
import { ApiPromise } from '@polkadot/api';
import { connect } from './connect';
import { AccountManager } from './account_manager';
import { Config } from './config';

describe('Anchoring', async () => {

  let api: ApiPromise;

  before(async () => {
    let conf = new Config(path.resolve(__dirname) + '/../config.json');
    api = await connect(conf.getCentChainEndpoint());
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // TODO move this to a place at the route of all tests later
    let accMan = new AccountManager(conf);
    await accMan.createTestAccounts(api, 3, 1000000);
  });

  describe('Commit', async () => {

    it('should commit anchor', async () => {
      const result = new Anchoring();
      //result.commit();
      expect(result).to.equal('Hello world!');
    });

  });

  after(async () => {
    api.disconnect();
  });

});