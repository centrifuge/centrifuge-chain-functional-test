import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { bnToHex, hexToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

export class PreAnchorData {}

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

    preCommit(data: PreAnchorData)/*: SubmittableExtrinsic<CodecResult, SubscriptionResult>*/ {
        return this.api.tx.anchor.preCommit();
    }

    commit(data: AnchorParam): SubmittableExtrinsic {
        return this.api.tx.anchor.commit(data.idPreImage, data.docRoot, data.proof);
    }

    async findAnchor(anchorId: string): Promise<AnchorData> {
        let anchor = await this.api.query.anchor.anchors(anchorId);
        return new AnchorData(bnToHex((<any>anchor)['id']), bnToHex((<any>anchor)['doc_root']), bnToHex((<any>anchor)['anchored_block']));
    }
}