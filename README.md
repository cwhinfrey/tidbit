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

Then run `yarn install`

`chmod +x ./scripts/**` to grant execute permissions on the scripts directory

### Compile

Recompile contracts and build artifacts.

```
$ yarn compile
```

### Test

Run `yarn compile` before first test run, and after any changes to the `.sol` files

```
$ yarn test
```

Run `yarn test:coverage` to run with coverage reporting
