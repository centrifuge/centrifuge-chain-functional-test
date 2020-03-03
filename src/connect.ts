// We need to import the augmented definitions "somewhere" in our project, however since we have
// it in tsconfig as an override and the api/types has imports, it is not strictly required here.
// Because of the tsconfig override, we could import from '@polkadot/{api, types}/augment'
import './interfaces/augment-api';
import './interfaces/augment-types';

import { ApiPromise, WsProvider } from "@polkadot/api";

import * as definitions from './interfaces/definitions';

export class Connection {

  public provider: WsProvider;

  public api: ApiPromise;

  constructor(provider: WsProvider, api: ApiPromise) {
    this.api = api;
    this.provider = provider;
  }
}

export async function connect(wsURL: string): Promise<Connection> {
  // extract all types from definitions - fast and dirty approach, flatted on 'types'
  const types = Object.values(definitions).reduce((res, { types }): object => ({ ...res, ...types }), {});

    // Initialise the provider to connect to the local node
    const provider = new WsProvider(wsURL);
    // initialise via static create
    // tslint:disable:object-literal-sort-keys
    const api = await ApiPromise.create({
      ...types,
      provider,
    });
    // tslint:enable:object-literal-sort-keys

    return new Connection(provider, api);
}
