import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';

const DEFAULT_ACCOUNTS_MNEMONIC_PREFIX = 'Test';
const PERMANANT_ACCOUNTS = ['//Bob', '//Charlie', '//Eve'];

export class AccountManager {

    private keyring: Keyring;

    private accountMnemonicPrefix: string;

    constructor() {
        this.keyring = new Keyring({ type: 'sr25519' });
        this.accountMnemonicPrefix = DEFAULT_ACCOUNTS_MNEMONIC_PREFIX;
    }

    /**
     * This will create a fixed number of permanant test accounts plus some new accounts(nAdditionalAccounts) when called. 
     * Permanant accounts are maintained with a provided balance if they already exist. All accounts are funded using '//Alice' test account 
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

        // Add alice to our keyring with a hard-deived path (empty phrase, so uses dev)
        const alice = this.keyring.addFromUri('//Alice');
        const alicesBalance = await api.query.balances.freeBalance(alice.address);
        let alicesBalanceRaw = +alicesBalance.toString();

        // alices balance must be higher than the maximum required balance to be transfered to other accounts
        if (alicesBalanceRaw < minBalance * (PERMANANT_ACCOUNTS.length + nAdditionalAccounts) ) {
            throw new Error('Alice is too poor to pay for the test accounts');
        }

        // execute transfers sequencially so that nonce can be properly updated for Alice
        let aliceNonce = await api.query.system.accountNonce(alice.address);
        let aliceNonceRaw = +aliceNonce.toString();

        // generate the prefixes for additional test accounts
        let additionalAccMnemonics: string[] = [];
        for (let i = 0; i < nAdditionalAccounts; i++) {
            // generate accounts of suri format {accountMnemonicPrefix}_i/centrifuge//{accountMnemonicPrefix}_i . Secret key is and hard key is
            // `{accountMnemonicPrefix}_i`. Eg: Test_1/centrifuge//Test_1
            additionalAccMnemonics.push(this.accountMnemonicPrefix + '_' + i + '/centrifuge//' + this.accountMnemonicPrefix + '_' + i);
        }

        let allAccountMnemonics = PERMANANT_ACCOUNTS.concat(additionalAccMnemonics);

        // make sure the all accounts have enough balance
        console.log('*********** logging account addresses ***********');
        for (let accM in allAccountMnemonics) {
            const acc = this.keyring.addFromUri(allAccountMnemonics[accM]);
            const accBalance = await api.query.balances.freeBalance(acc.address);
            console.log(acc.address);
            const accBalanceRaw = +accBalance.toString();

            if (accBalanceRaw < minBalance) {
                try {
                    await api.tx.balances.transfer(acc.address, minBalance - accBalanceRaw).signAndSend(alice, {nonce: aliceNonceRaw});
                } catch (e) {
                    console.log(e);
                }
            }

            // update nonce
            aliceNonceRaw++;
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