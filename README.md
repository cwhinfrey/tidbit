# Tidbit

A library for oracles on Ethereum.

#### Inheritance Tree

```
IOracle
   |
   v
OracleBase --------> BasicOracle ------> SignedOracle
   |                      |                   |
   v                      v                   v
PushOracleBase --> BasicPushOracle --> SingedPushOracle
```

### Setup

Then run `npm install`

`chmod +x ./scripts/**` to grant execute permissions on the scripts directory

### Compile

Recompile contracts and build artifacts.

```
$ npm tun compile
```

### Test

Run `npm run compile` before first test run, and after any changes to the `.sol` files

```
$ npm test
```

Run `npm run test:coverage` to run with coverage reporting
