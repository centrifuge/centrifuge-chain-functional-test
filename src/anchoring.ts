import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

export class PreAnchorData {}

export class AnchorData {}

export class Anchoring {

    async preCommit(api: ApiPromise, account: KeyringPair, data: PreAnchorData) {
        // TODO precommit stuff
    }

    async commit(api: ApiPromise, account: KeyringPair, data: AnchorData) {
        // TODO commit stuff
    }
}