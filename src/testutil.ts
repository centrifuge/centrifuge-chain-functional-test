import { AnchorParam as AnchorCommitParam, PreAnchorParam as AnchorPreCommitParam } from "./anchoring";
import crypto from 'crypto';
import BN from 'bn.js';
import { blake2AsHex } from '@polkadot/util-crypto';

import { bnToHex } from '@polkadot/util';

export function newRandomCommitParam(): AnchorCommitParam {
    return new AnchorCommitParam(bnToHex(new BN(crypto.randomBytes(32))), bnToHex(new BN(crypto.randomBytes(32))), bnToHex(new BN(crypto.randomBytes(32))));
}

export class RandomAnchor {
    preAnchorParam: AnchorPreCommitParam;
    anchorParam: AnchorCommitParam;

    constructor(
        preAnchorData: AnchorPreCommitParam,
        anchorData: AnchorCommitParam) {
        this.anchorParam = anchorData;
        this.preAnchorParam = preAnchorData;
    }
}

export function newRandomAnchorParams(): RandomAnchor {
    let anchorParam = newRandomCommitParam();
    let anchorId = anchorParam.getAnchorId();
    let signingRoot = new BN(crypto.randomBytes(32));
    let proof = new BN(crypto.randomBytes(32));
    if (signingRoot.gt(proof)) {
        anchorParam.docRoot = blake2AsHex(Buffer.concat([signingRoot.toBuffer(), proof.toBuffer()]));
    } else {
        anchorParam.docRoot = blake2AsHex(Buffer.concat([proof.toBuffer(), signingRoot.toBuffer()]));
    }
    anchorParam.proof = bnToHex(proof);
    return new RandomAnchor(new AnchorPreCommitParam(anchorId, bnToHex(signingRoot)), anchorParam);
}