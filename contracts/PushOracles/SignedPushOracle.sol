pragma solidity ^0.4.24;

import "./PushOracle.sol";
import "../SignedOracle.sol";

contract SignedPushOracle is SignedOracle, PushOracle {

  constructor (
    address _signer,
    IOracleHandler _handler
  )
    public
    SignedOracle(_signer)
    PushOracle(_handler)
  {}

}
