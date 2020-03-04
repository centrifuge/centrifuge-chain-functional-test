// tslint:disable:max-classes-per-file

import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import { bnToHex, hexToU8a } from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";
import { Connection } from "./connect";
import { AnchorData, PreCommitData } from "./interfaces/types";

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

    public async findAnchor(anchorId: string): Promise<AnchorData> {
        const anchor = await this.connection.provider.send("anchor_getAnchorById", [anchorId]);
        return this.connection.api.createType('AnchorData', [anchor.id, anchor.doc_root, anchor.anchored_block])
        // return new AnchorData(anchor.id, anchor.doc_root, anchor.anchored_block);
    }

    public async findAnchorEvictionDate(anchorId: string): Promise<Date> {
        const storedUntilInDays = await this.connection.api.query.anchor.anchorEvictDates(anchorId);
        return new Date((+storedUntilInDays.toString()) * 86400000);
    }

    public async findPreCommit(anchorId: string): Promise<PreCommitData> {
        return await this.connection.api.query.anchor.preCommits(anchorId);
    }
}
