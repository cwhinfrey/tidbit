pragma solidity ^0.4.24;

import "./PushOracleBase.sol";
import "../Oracles/SignedOracle.sol";
import "../Initializer.sol";

/**
 * @title SignedPushOracle
 * @dev Combines SignedOracle and PushOracleBase to create a push style SignedOracle
 */
contract SignedPushOracle is Initializer, SignedOracle, PushOracleBase {

  /**
   * @dev SignedPushOracle initializer
   * @param _dataSource The address that is able to set the result
   * @param _consumer A contract that implements IOracleConsumer and is called when
   * the result has been set.
   */
  function initialize(
    address _dataSource,
    IOracleConsumer _consumer
  )
    public
    initializer
  {
    SignedOracle.initialize(_dataSource);
    PushOracleBase.initialize(_consumer, 0);
  }

}
