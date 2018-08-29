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
   * @param _handler A contract that implements IOracleHandler and is called when
   * the result has been set.
   */
  constructor (
    address _dataSource,
    IOracleHandler _handler
  )
    public
    BasicOracle(_dataSource)
    PushOracleBase(_handler)
  {}

}
