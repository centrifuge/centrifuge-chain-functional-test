import { AnchorParam } from "./anchoring";
import crypto from 'crypto';
import BN from 'bn.js';

import { bnToHex } from '@polkadot/util';

export function newRandomAnchorParam(): AnchorParam {
    return new AnchorParam(bnToHex(new BN(crypto.randomBytes(32))), bnToHex(new BN(crypto.randomBytes(32))), bnToHex(new BN(crypto.randomBytes(32))));
}