export class Config {
    private configJson: Object;

    constructor(configJson: Object) {
        this.configJson = configJson;
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
        return this.get("centrifuge_chain_endpoint");
    }
}
