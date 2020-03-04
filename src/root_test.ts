// set some global initial state for tests
import BN from "bn.js";
import * as config from "../config.json";
import { AccountManager } from "./account_manager";
import { Config } from "./config";
import { connect } from "./connect";
import { TestGlobals } from "./test_globals";

before(async () => {
    TestGlobals.testConfig = new Config(config);

    // api obj
    TestGlobals.connection = await connect(TestGlobals.testConfig.getCentChainEndpoint());

    const [chain, nodeName, nodeVersion] = await Promise.all([
        TestGlobals.connection.api.rpc.system.chain(),
        TestGlobals.connection.api.rpc.system.name(),
        TestGlobals.connection.api.rpc.system.version(),
    ]);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // create test accounts
    TestGlobals.accMan = new AccountManager(TestGlobals.testConfig);
    await TestGlobals.accMan.createTestAccounts(TestGlobals.connection.api, 3, new BN("10000000000000000000"));
});

after(async () => {
    TestGlobals.connection.api.disconnect();
});
