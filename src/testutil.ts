import { AnchorParam as AnchorCommitParam, PreAnchorParam as AnchorPreCommitParam } from "./anchoring";
import crypto from 'crypto';
import BN from 'bn.js';
import { blake2AsHex } from '@polkadot/util-crypto';

import { bnToHex, bufferToU8a, u8aConcat, u8aToHex, u8aToString } from '@polkadot/util';

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
    let signingRoot = bufferToU8a(crypto.randomBytes(32));
    let proof = bufferToU8a(crypto.randomBytes(32));
    
    if (u8aToHex(signingRoot) < u8aToHex(proof)) {
        anchorParam.docRoot = blake2AsHex(u8aConcat(signingRoot, proof));
    } else {
        anchorParam.docRoot = blake2AsHex(u8aConcat(proof, signingRoot));
    }
    anchorParam.proof = u8aToHex(proof);
    return new RandomAnchor(new AnchorPreCommitParam(anchorId, u8aToHex(signingRoot)), anchorParam);
}