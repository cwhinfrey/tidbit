pragma solidity ^0.4.24;

import "./PushOracle.sol";
import "../SingleSourceOracle.sol";

contract SingleSourcePushOracle is SingleSourceOracle, PushOracle {

  constructor (
    address _dataSource,
    IOracleHandler _handler
  )
    public
    SingleSourceOracle(_dataSource)
    PushOracle(_handler)
  {}

}
