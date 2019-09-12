import { Config } from "./config";
import { AccountManager } from "./account_manager";
import { Connection } from "./connect";

export class TestGlobals {
    static testConfig: Config;
    static connection: Connection;
    static  accMan: AccountManager;
}