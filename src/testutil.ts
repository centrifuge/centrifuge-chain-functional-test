import { blake2AsHex } from "@polkadot/util-crypto";
import BN from "bn.js";
import crypto from "crypto";
import { AnchorParam as AnchorCommitParam, PreCommitParam as AnchorPreCommitParam } from "./anchoring";

import { bnToHex, bufferToU8a, u8aConcat, u8aToHex, u8aToString } from "@polkadot/util";

export function newRandomCommitParam(): AnchorCommitParam {
    return new AnchorCommitParam(
        bnToHex(new BN(crypto.randomBytes(32))),
        bnToHex(new BN(crypto.randomBytes(32))),
        bnToHex(new BN(crypto.randomBytes(32))),
        new Date(new Date().getTime() + 200000000),
    );
}

export class RandomAnchor {
    public preCommitParam: AnchorPreCommitParam;
    public anchorParam: AnchorCommitParam;

    constructor(
        preCommitData: AnchorPreCommitParam,
        anchorData: AnchorCommitParam) {
        this.anchorParam = anchorData;
        this.preCommitParam = preCommitData;
    }
}

export function newRandomAnchorParams(): RandomAnchor {
    const anchorParam = newRandomCommitParam();
    const anchorId = anchorParam.getAnchorId();
    const signingRoot = bufferToU8a(crypto.randomBytes(32));
    const proof = bufferToU8a(crypto.randomBytes(32));

    anchorParam.docRoot = blake2AsHex(u8aConcat(signingRoot, proof));
    anchorParam.proof = u8aToHex(proof);
    return new RandomAnchor(new AnchorPreCommitParam(anchorId, u8aToHex(signingRoot)), anchorParam);
}
