# Tidbit

A library for oracles on Ethereum.

### Setup

Make sure you have the following installed globally:

node 8

TestRPC 6: `npm install -g ethereumjs-testrpc`

Then run `npm install`

`chmod +x ./scripts/**` to grant execute permissions on the scripts directory

### Compile

Recompile contracts and build artifacts.

```
$ npm run compile
```

### Deploy

Deploy contracts to RPC provider at port `8546`.

```
$ npm run testrpc
$ npm run deploy
```

### Test

Run `npm run compile` before first test run, and after any changes to the `.sol` files

```
$ npm test
```

Run `npm run test:coverage` to run with coverage reporting

### Deployment Setup

Add `secrets.json` to the project root

```
// secrets.json
{
  "mnemonic": "<some mnemonic>",
  "infura_apikey": "<your infura key>"
}
```

Go to https://iancoleman.github.io/bip39/, click "Generate". Add `BIP39 Mnemonic` to `"mnemonic"` value in `secrets.json`

Add address from the BIP39 page to MetaMask. Send it some rinkeby Ether, or get it from the faucet on https://www.rinkeby.io

Go to https://infura.io/register.html to register for Infura. Paste your API key into `"infura_apikey"` value in `secrets.json`

`npm run deploy-rinkeby` to deploy to rinkeby
