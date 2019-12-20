import { ApiPromise, WsProvider } from "@polkadot/api";

export class Connection {

  public provider: WsProvider;

  public api: ApiPromise;

  constructor(provider: WsProvider, api: ApiPromise) {
    this.api = api;
    this.provider = provider;
  }
}

export async function connect(wsURL: string): Promise<Connection> {
    // Initialise the provider to connect to the local node
    const provider = new WsProvider(wsURL);
    // initialise via static create
    // tslint:disable:object-literal-sort-keys
    const api = await ApiPromise.create({
      types: {
        AnchorData: {
          id: "H256",
          doc_root: "H256",
          anchored_block: "u64",
        },
        Fee: {
          key: "Hash",
          price: "Balance",
        },
        PreCommitData: {
          signing_root: "H256",
          identity: "H256",
          expiration_block: "u64",
        },
        Proof: {
          leaf_hash: "H256",
          sorted_hashes: "H256",
        },
      },
      provider,
    });
    // tslint:enable:object-literal-sort-keys

    return new Connection(provider, api);
}
