# Tidbit EVM Package

A library for oracles on Ethereum.

### Contracts

For more information on each contract checkout the  [documentation](https://levelkdev.github.io/tidbit/docs/Oracles_OracleBase.html).

##### Partial Inheritance Tree

```
IOracle
   |
   v
OracleBase --------> BasicOracle ------> SignedOracle
   |                      |                   |
   v                      v                   v
PushOracleBase --> BasicPushOracle --> SignedPushOracle

```

### Install

```
npm install tidbit-eth
```

### Pre-deployed contracts

```
- BasicOracle
- BasicPushOracle
- MedianOracle
- MultiOracle
- PaidMultiOracle
- PaidOracle
- SignedMultiOracle
- SignedOracle
- SignedPushOracle
```
