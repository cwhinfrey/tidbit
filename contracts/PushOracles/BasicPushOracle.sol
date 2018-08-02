pragma solidity ^0.4.24;

import "./PushOracleBase.sol";
import "../BasicOracle.sol";

contract BasicPushOracle is BasicOracle, PushOracleBase {

  constructor (
    address _dataSource,
    IOracleHandler _handler
  )
    public
    BasicOracle(_dataSource)
    PushOracleBase(_handler)
  {}

}
