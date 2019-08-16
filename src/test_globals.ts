import { Config } from "./config";
import { ApiPromise } from "@polkadot/api";
import { AccountManager } from "./account_manager";

export class TestGlobals {
    static testConfig: Config;
    static api: ApiPromise;
    static  accMan: AccountManager;
}