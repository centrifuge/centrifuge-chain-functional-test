import fs from "fs";

export class Config {
    private configJson: Object;

    constructor(path: string) {
        let content = fs.readFileSync(path);
        let str = new TextDecoder().decode(content); 
        this.configJson = JSON.parse(str);
    }

    get(key: string):any {
        return process.env[key.toUpperCase()] || (<any>this.configJson)[key];
    }

    getFundingAccountSURI(): string {
        return this.get("funding_account");
    }

    getPermanantAccountSURIs(): string[] {
        return this.get("permanant_accounts");
    }

    getCentChainEndpoint(): string {
        return this.get("cent_chain_endpoint");
    }

    // funding_account": "//Alice",
    // "permanant_accounts": ["//Bob", "//Charlie", "//Eve"],
    // "cent_chain_endpoint": "ws://127.0.0.1:9944"
}