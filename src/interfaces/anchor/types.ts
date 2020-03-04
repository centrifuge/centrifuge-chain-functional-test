// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable @typescript-eslint/no-empty-interface */

import { Struct } from '@polkadot/types/codec';
import { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces/runtime';

/** @name AnchorData */
export interface AnchorData extends Struct {
  readonly id: Hash;
  readonly docRoot: Hash;
  readonly anchoredBlock: BlockNumber;
}

/** @name PreCommitData */
export interface PreCommitData extends Struct {
  readonly signingRoot: Hash;
  readonly identity: AccountId;
  readonly expirationBlock: BlockNumber;
}
