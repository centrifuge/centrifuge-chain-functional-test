import { AccountManager } from "./account_manager";
import { Config } from "./config";
import { Connection } from "./connect";

export class TestGlobals {
    public static testConfig: Config;
    public static connection: Connection;
    public static  accMan: AccountManager;
}
