pragma solidity ^0.4.24;

import "./PushOracle.sol";
import "../OwnedOracle.sol";

contract OwnedPushOracle is OwnedOracle, PushOracle {

  constructor (
    IOracleHandler _handler
  )
    public
    PushOracle(_handler)
  {}

}
