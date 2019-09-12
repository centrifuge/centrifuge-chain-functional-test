import { ApiPromise, WsProvider } from '@polkadot/api';

export class Connection {

  provider: WsProvider;

  api: ApiPromise;

  constructor(provider: WsProvider, api: ApiPromise) {
    this.api = api;
    this.provider = provider;
  }
}

export async function connect(wsURL: string): Promise<Connection> {
    // Initialise the provider to connect to the local node
    const provider = new WsProvider(wsURL);
    // initialise via static create
    const api = await ApiPromise.create({
      types: {
        AnchorData: {
          "id": "H256",
          "doc_root": "H256",
          "anchored_block": "u64"
        },
        PreCommitData: {
          "signing_root": "H256",
          "identity": "H256",
          "expiration_block": "u64",
        }
      },
      provider: provider
    });
    return new Connection(provider, api);
}