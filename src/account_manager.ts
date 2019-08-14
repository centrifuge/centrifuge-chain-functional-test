import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Config } from './config';

const DEFAULT_ACCOUNTS_MNEMONIC_PREFIX = 'Test';

// TODO pull these from the env
// const PERMANANT_ACCOUNTS = ['//Bob', '//Charlie', '//Eve'];
// const FUNDING_ACCOUNT = '//Alice';

export class AccountManager {

    private keyring: Keyring;

    private accountMnemonicPrefix: string;

    private config: Config;

    constructor(config: Config) {
        this.keyring = new Keyring({ type: 'sr25519' });
        this.accountMnemonicPrefix = DEFAULT_ACCOUNTS_MNEMONIC_PREFIX;
        this.config = config;
    }

    /**
     * This will create a fixed number of permanant test accounts plus some new accounts(nAdditionalAccounts) when called. 
     * Permanant accounts are maintained with a provided balance if they already exist. All accounts are funded using 'FUNDING_ACCOUNT' test account 
     * which is expected to have some balance at the start of the tests. 
     * @param api api client.
     * @param nAdditionalAccounts number additional accounts to create indexed by some sequence number.
     * @param minBalance minimum balance for the test accounts.
     * @param accountMnemonicPrefix prefix for additional account mnemonics.
     */
    async createTestAccounts(
            api: ApiPromise, 
            nAdditionalAccounts: number, 
            minBalance: number,
            accountMnemonicPrefix: string = DEFAULT_ACCOUNTS_MNEMONIC_PREFIX) {

        this.accountMnemonicPrefix = accountMnemonicPrefix;

        // Add funding account to our keyring
        const funder = this.keyring.addFromUri(this.config.getFundingAccountSURI());
        const fundersBalance = await api.query.balances.freeBalance(funder.address);
        let fundersBalanceRaw = +fundersBalance.toString();

        // funders balance must be higher than the maximum required balance to be transfered to other accounts
        if (fundersBalanceRaw < minBalance * (this.config.getPermanantAccountSURIs().length + nAdditionalAccounts) ) {
            throw new Error('Funder is too poor to pay for the test accounts');
        }

        // execute transfers sequencially so that nonce can be properly updated for funder
        let funderNonce = await api.query.system.accountNonce(funder.address);
        let funderNonceRaw = +funderNonce.toString();

        // generate the prefixes for additional test accounts
        let additionalAccMnemonics: string[] = [];
        for (let i = 0; i < nAdditionalAccounts; i++) {
            // generate accounts of suri format {accountMnemonicPrefix}_i/centrifuge//{accountMnemonicPrefix}_i . Secret key is and hard key is
            // `{accountMnemonicPrefix}_i`. Eg: Test_1/centrifuge//Test_1
            additionalAccMnemonics.push(this.accountMnemonicPrefix + '_' + i + '/centrifuge//' + this.accountMnemonicPrefix + '_' + i);
        }

        let allAccountMnemonics = this.config.getPermanantAccountSURIs().concat(additionalAccMnemonics);

        // make sure the all accounts have enough balance
        console.log('*********** logging account addresses ***********');
        for (let accM in allAccountMnemonics) {
            const acc = this.keyring.addFromUri(allAccountMnemonics[accM]);
            const accBalance = await api.query.balances.freeBalance(acc.address);
            console.log(acc.address);
            const accBalanceRaw = +accBalance.toString();

            if (accBalanceRaw < minBalance) {
                try {
                    await api.tx.balances.transfer(acc.address, minBalance - accBalanceRaw).signAndSend(funder, {nonce: funderNonceRaw});
                } catch (e) {
                    console.log(e);
                }
            }

            // update nonce
            funderNonceRaw++;
        }
        console.log('*********** end logging account addresses ***********');
    }

    getAccount(suri: string): KeyringPair {
        let pair = this.keyring.createFromUri(suri);
        return this.keyring.getPair(pair.address);
    }

    getAccountByIndex(i: number): KeyringPair {
        let pair = this.keyring.createFromUri(this.accountMnemonicPrefix + '_' + i + '/centrifuge//' + this.accountMnemonicPrefix + '_' + i);
        return this.keyring.getPair(pair.address);
    }

}