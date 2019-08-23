# centrifuge-chain-functional-test
Centrifuge chain tests

## Running tests

- `npm install`
- `npm test`

## With docker image locally

- Start centrifuge chain with `--ws-external` flag
- `docker run -e CENT_CHAIN_ENDPOINT='ws://<host ip>:9944' --network="host" centrifuge-chain-functional-tests:latest`