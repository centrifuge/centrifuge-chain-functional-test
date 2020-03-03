# centrifuge-chain-functional-test
Centrifuge chain tests

## Running tests

- `npm install`
- `npm test`

## With docker image locally

- Start centrifuge chain with `--ws-external` flag
- `docker run -e CENTRIFUGE_CHAIN_ENDPOINT='ws://<host ip>:9944' --network="host" centrifuge-chain-functional-tests:latest`

## With docker image against a testnet

- `docker run -e CENTRIFUGE_CHAIN_ENDPOINT='ws://<host ip>:9944' -e FUNDING_ACCOUNT='0x<private seed>' centrifuge-chain-functional-tests:latest`

## Updating the types

1. Run a dev chain locally
2. Run `curl -H "Content-Type: application/json" -d '{"id":"1", "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}' http://localhost:9933 > metadata.json`
3. Run `npm run build`
