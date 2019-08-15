import { ApiPromise, WsProvider } from '@polkadot/api';

export async function connect(wsURL: string): Promise<ApiPromise> {
    // Initialise the provider to connect to the local node
    const provider = new WsProvider(wsURL);
    // initialise via static create
    return await ApiPromise.create({
        types: {
          AnchorData: {
            "id": "H256",
            "doc_root": "H256",
            "anchored_block": "u64"
          },
          PreAnchorData: {
            "signing_root": "H256",
            "identity": "H256",
            "expiration_block": "u64",
          }
        },
        provider: provider
      });
}