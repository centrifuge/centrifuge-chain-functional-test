// set some global initial state for tests
import * as config from '../config.json';
import { Config } from './config';
import { connect } from './connect';
import { AccountManager } from './account_manager';
import { TestGlobals } from './test_globals';

before(async () => {
    TestGlobals.testConfig = new Config(config);

    // api obj
    TestGlobals.api = await connect(TestGlobals.testConfig.getCentChainEndpoint());
    const [chain, nodeName, nodeVersion] = await Promise.all([
        TestGlobals.api.rpc.system.chain(),
        TestGlobals.api.rpc.system.name(),
        TestGlobals.api.rpc.system.version()
    ]);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // create test accounts
    TestGlobals.accMan = new AccountManager(TestGlobals.testConfig);
    await TestGlobals.accMan.createTestAccounts(TestGlobals.api, 3, 1000000);
});

after((cb) => {
    TestGlobals.api.disconnect();
    cb();
});