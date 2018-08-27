pragma solidity ^0.4.24;

import "./PushOracleBase.sol";
import "../SignedOracle.sol";

/**
 * @title SignedPushOracle
 * @dev Combines SignedOracle and PushOracleBase to create a push style SignedOracle
 */
contract SignedPushOracle is SignedOracle, PushOracleBase {

  /**
   * @dev SignedPushOracle constructor
   * @param _dataSource The address that is able to set the result
   * @param _handler A contract that implements IOracleHandler and is called when
   * the result has been set.
   */
  constructor (
    address _dataSource,
    IOracleHandler _handler
  )
    public
    SignedOracle(_dataSource)
    PushOracleBase(_handler)
  {}

}
