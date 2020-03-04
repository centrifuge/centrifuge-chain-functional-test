// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable @typescript-eslint/no-empty-interface */

import { Struct } from '@polkadot/types/codec';
import { Balance, Hash } from '@polkadot/types/interfaces/runtime';

/** @name Fee */
export interface Fee extends Struct {
  readonly key: Hash;
  readonly price: Balance;
}
