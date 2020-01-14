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