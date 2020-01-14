// tslint:disable:max-classes-per-file

import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import { bnToHex, hexToU8a } from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";
import { Connection } from "./connect";

export class PreCommitParam {
    public anchorId: string;
    public signingRoot: string;

    constructor(
        anchorId: string,
        signingRoot: string) {
        this.anchorId = anchorId;
        this.signingRoot = signingRoot;
    }
}

export class AnchorParam {
    public idPreImage: string;
    public docRoot: string;
    public proof: string;
    public storedUntil: Date;

    constructor(idPreImage: string, docRoot: string, proof: string, storedUntil: Date) {
        this.idPreImage = idPreImage;
        this.docRoot = docRoot;
        this.proof = proof;
        this.storedUntil = storedUntil;
    }

    public getAnchorId(): string {
        const pmBn = hexToU8a(this.idPreImage);
        return blake2AsHex(pmBn);
    }
}

export class PreCommitData {
    public signingRoot: string;
    public identity: string;
    public expirationBlock: string;

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
    public id: string;
    public docRoot: string;
    public anchoredBlock: string;

    constructor(id: string,
                docRoot: string,
                anchoredBlock: string) {
            this.id = id;
            this.docRoot = docRoot;
            this.anchoredBlock = anchoredBlock;
    }
}

export class Anchoring {

    private connection: Connection;

    constructor(con: Connection) {
        this.connection = con;
    }

    public preCommit(data: PreCommitParam): SubmittableExtrinsic {
        return this.connection.api.tx.anchor.preCommit(data.anchorId, data.signingRoot);
    }

    public commit(data: AnchorParam): SubmittableExtrinsic {
        return this.connection.api.tx.anchor.commit(
            data.idPreImage, data.docRoot, data.proof, data.storedUntil.getTime());
    }

    public moveAnchor(anchorId: string): SubmittableExtrinsic {
        return this.connection.api.tx.anchor.moveAnchor(anchorId);
    }

    public async findAnchor(anchorId: string): Promise<AnchorData> {
        const anchor = await this.connection.provider.send("anchor_getAnchorById", [anchorId]);
        return new AnchorData(anchor.id, anchor.doc_root, anchor.anchored_block);
    }

    public async findAnchorEvictionDate(anchorId: string): Promise<Date> {
        const storedUntilInDays = await this.connection.api.query.anchor.anchorEvictDates(anchorId);
        return new Date((+storedUntilInDays.toString()) * 86400000);
    }

    public async findPreCommit(anchorId: string): Promise<PreCommitData> {
        const preCommit = await this.connection.api.query.anchor.preCommits(anchorId);
        return new PreCommitData(
                bnToHex((preCommit as any).signing_root),
                bnToHex((preCommit as any).identity),
                bnToHex((preCommit as any).expiration_block));
    }
}
