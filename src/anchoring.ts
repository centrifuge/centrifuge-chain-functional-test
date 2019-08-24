import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { bnToHex, hexToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

export class PreAnchorParam {
    anchorId: string;
    signingRoot: string;

    constructor(
        anchorId: string,
        signingRoot: string) {
        this.anchorId = anchorId;
        this.signingRoot = signingRoot;
    }
}

export class AnchorParam {
    idPreImage: string;
    docRoot: string;
    proof: string;

    constructor(idPreImage: string, docRoot: string, proof: string) {
        this.idPreImage = idPreImage;
        this.docRoot = docRoot;
        this.proof = proof;
    }

    getAnchorId(): string {
        let pmBn = hexToU8a(this.idPreImage);
        return blake2AsHex(pmBn);
    }
}

export class PreAnchorData {
    signingRoot: string;
    identity: string;
    expirationBlock: string;

    constructor(
        signingRoot: string,
        identity: string,
        expirationBlock: string) {
            this.signingRoot = signingRoot;
            this.identity = identity;
            this.expirationBlock = expirationBlock;
    }
}

export class AnchorData {
    id: string;
    docRoot: string;
    anchoredBlock: string;

    constructor(id: string,
        docRoot: string,
        anchoredBlock: string) {
            this.id = id;
            this.docRoot = docRoot;
            this.anchoredBlock = anchoredBlock;
    }
}

export class Anchoring {

    private api: ApiPromise;

    constructor(api: ApiPromise) {
        this.api = api;
    }

    preCommit(data: PreAnchorParam): SubmittableExtrinsic {
        return this.api.tx.anchorModule.preCommit(data.anchorId, data.signingRoot);
    }

    commit(data: AnchorParam): SubmittableExtrinsic {
        return this.api.tx.anchorModule.commit(data.idPreImage, data.docRoot, data.proof);
    }

    async findAnchor(anchorId: string): Promise<AnchorData> {
        let anchor = await this.api.query.anchorModule.anchors(anchorId);
        return new AnchorData(bnToHex((<any>anchor)['id']), bnToHex((<any>anchor)['doc_root']), bnToHex((<any>anchor)['anchored_block']));
    }

    async findPreAnchor(anchorId: string): Promise<PreAnchorData> {
        let preAnchor = await this.api.query.anchorModule.preAnchors(anchorId);
        return new PreAnchorData(
                bnToHex((<any>preAnchor)['signing_root']), 
                bnToHex((<any>preAnchor)['identity']), 
                bnToHex((<any>preAnchor)['expiration_block']));
    }
}