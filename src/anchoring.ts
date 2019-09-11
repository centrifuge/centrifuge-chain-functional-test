import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { bnToHex, hexToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
import { Connection } from './connect';

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
    storedUntil: Date;

    constructor(idPreImage: string, docRoot: string, proof: string, storedUntil: Date) {
        this.idPreImage = idPreImage;
        this.docRoot = docRoot;
        this.proof = proof;
        this.storedUntil = storedUntil;
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

    private connection:  Connection;

    constructor(con: Connection) {
        this.connection = con;
    }

    preCommit(data: PreAnchorParam): SubmittableExtrinsic {
        return this.connection.api.tx.anchorModule.preCommit(data.anchorId, data.signingRoot);
    }

    commit(data: AnchorParam): SubmittableExtrinsic {
        return this.connection.api.tx.anchorModule.commit(data.idPreImage, data.docRoot, data.proof, data.storedUntil.getTime());
    }

    async findAnchor(anchorId: string): Promise<AnchorData> {
        let anchor = await this.connection.provider.send("anchor_getAnchorById", [anchorId]);
        return new AnchorData(anchor['id'], anchor['doc_root'], anchor['anchored_block']);
    }

    async findAnchorEvictionDate(anchorId: string): Promise<Date> {
        let storedUntilInDays = await this.connection.api.query.anchorModule.anchorEvictDates(anchorId);
        return new Date((+storedUntilInDays.toString()) * 86400000);
    }

    async findPreAnchor(anchorId: string): Promise<PreAnchorData> {
        let preAnchor = await this.connection.api.query.anchorModule.preAnchors(anchorId);
        return new PreAnchorData(
                bnToHex((<any>preAnchor)['signing_root']), 
                bnToHex((<any>preAnchor)['identity']), 
                bnToHex((<any>preAnchor)['expiration_block']));
    }
}