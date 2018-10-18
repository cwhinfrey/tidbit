pragma solidity ^0.4.24;

import "./PushOracleBase.sol";
import "../Oracles/BasicOracle.sol";

/**
 * @title BasicPushOracle
 * @dev Combines BasicOracle and PushOracleBase to create a push style BasicOracle
 */ 
contract BasicPushOracle is BasicOracle, PushOracleBase {

  /**
   * @dev BasicPushOracle constructor
   * @param _dataSource The address that is able to set the result
   * @param _consumer A contract that implements IOracleConsumer and is called when
   * the result has been set.
   */
  function initialize(
    address _dataSource,
    IOracleConsumer _consumer
  )
    isInitializer("BasicPushOracle", "0.0.0")
    public
  {
    BasicOracle.initialize(_dataSource);
    PushOracleBase.initialize(_consumer, 0);
  }

}
