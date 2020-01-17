export class Config {
    private configJson: any;

    constructor(configJson: any) {
        this.configJson = configJson;
    }

    public get(key: string): any {
        return process.env[key.toUpperCase()] || (this.configJson as any)[key];
    }

    public getFundingAccountSURI(): string {
        return this.get("funding_account");
    }

    public getPermanantAccountSURIs(): string[] {
        return this.get("permanant_accounts");
    }

    public getCentChainEndpoint(): string {
        return this.get("centrifuge_chain_endpoint");
    }
}
