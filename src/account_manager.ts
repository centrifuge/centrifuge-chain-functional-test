import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";
import { IKeyringPair } from "@polkadot/types/types";
import BN from "bn.js";
import { Config } from "./config";

const DEFAULT_ACCOUNTS_MNEMONIC_PREFIX = "Test";

export class AccountManager {

    private keyring: Keyring;

    private accountMnemonicPrefix: string;

    private config: Config;

    constructor(config: Config) {
        this.keyring = new Keyring({ type: "sr25519" });
        this.accountMnemonicPrefix = DEFAULT_ACCOUNTS_MNEMONIC_PREFIX;
        this.config = config;
    }

    /**
     * This will create a fixed number of permanant test accounts plus some new accounts(nAdditionalAccounts) when
     * called.
     * Permanant accounts are maintained with a provided balance if they already exist. All accounts are funded using
     * 'FUNDING_ACCOUNT' test account which is expected to have some balance at the start of the tests.
     * @param api api client.
     * @param nAdditionalAccounts number additional accounts to create indexed by some sequence number.
     * @param minBalance minimum balance for the test accounts.
     * @param accountMnemonicPrefix prefix for additional account mnemonics.
     */
    public async createTestAccounts(
            api: ApiPromise,
            nAdditionalAccounts: number,
            minBalance: BN,
            accountMnemonicPrefix: string = DEFAULT_ACCOUNTS_MNEMONIC_PREFIX) {

        this.accountMnemonicPrefix = accountMnemonicPrefix;

        // Add funding account to our keyring
        const funder = this.keyring.addFromUri(this.config.getFundingAccountSURI());
        const fundersBalance = await api.query.balances.freeBalance(funder.address);

        // funders balance must be higher than the maximum required balance to be transfered to other accounts
        if (fundersBalance.lt(minBalance.muln(this.config.getPermanantAccountSURIs().length + nAdditionalAccounts))) {
            throw new Error("Funder is too poor to pay for the test accounts");
        }

        // execute transfers sequencially so that nonce can be properly updated for funder
        const funderNonce = await api.query.system.accountNonce(funder.address);
        funderNonce.isubn(1);

        // generate the prefixes for additional test accounts
        const additionalAccMnemonics: string[] = [];
        for (let i = 0; i < nAdditionalAccounts; i++) {
            // generate accounts of suri format //{accountMnemonicPrefix}_i . Eg: //Test_1
            additionalAccMnemonics.push("//" + this.accountMnemonicPrefix + "_" + i);
        }

        const allAccountMnemonics = this.config.getPermanantAccountSURIs().concat(additionalAccMnemonics);

        // make sure the all accounts have enough balance
        console.log("*********** logging account addresses ***********");
        // tslint:disable-next-line:forin
        for (const accM in allAccountMnemonics) {
            const acc = this.keyring.addFromUri(allAccountMnemonics[accM]);
            // TODO test this when we upgrade substrate for the chain next time. For now it always
            // transfers the min balance to the accounts. Since otherwise it causes an error where `Transaction status:
            // Future`.
            const accBalance = await api.query.balances.freeBalance(acc.address);
            console.log(acc.address);

            if (accBalance.lt(minBalance)) {
                try {
                    console.log("Will transfer with nonce", funderNonce.toString());
                    const res = await this.senderFunction(api, acc.address, funder, minBalance.sub(accBalance),
                    funderNonce);
                    console.log("Did transfer");
                    // console.log(res);
                } catch (e) {
                    console.log(e);
                }
            }

            // update nonce
            funderNonce.iaddn(1);
        }
        console.log("*********** end logging account addresses ***********");
    }

    public getAccount(suri: string): KeyringPair {
        const pair = this.keyring.createFromUri(suri);
        return this.keyring.getPair(pair.address);
    }

    public getAccountByIndex(i: number): KeyringPair {
        const pair = this.keyring.createFromUri("//" + this.accountMnemonicPrefix + "_" + i);
        return this.keyring.getPair(pair.address);
    }

    public senderFunction(api: ApiPromise, receiver: string, sender: IKeyringPair, value: BN|number, nonce: BN|number):
        Promise<any> {
        return new Promise<any>((resolve, reject) => {
          api.tx.balances.transfer(receiver, value).sign(sender, { nonce })
            .send(({ events = [], status }) => {
              console.log("Transaction status:", status.type);

              if (status.isFinalized) {
                console.log("Completed at block hash", status.asFinalized.toHex());
                console.log("Events:");

                events.forEach(({ phase, event: { data, method, section } }) => {
                  console.log("\t", phase.toString(), `: ${section}.${method}`, data.toString());
                });

                resolve(events);

                // cb();

                // process.exit(0);
              }
            });
        });
      }
}
