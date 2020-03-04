// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable @typescript-eslint/no-empty-interface */

import { Struct, Vec } from '@polkadot/types/codec';
import { H256 } from '@polkadot/types/interfaces/runtime';

/** @name Proof */
export interface Proof extends Struct {
  readonly leafHash: H256;
  readonly sortedHashes: Vec<H256>;
}
