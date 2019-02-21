pragma solidity ^0.5.0;

import "./PushOracleBase.sol";
import "../Oracles/BasicOracle.sol";
import "zos-lib/contracts/Initializable.sol";

/**
 * @title BasicPushOracle
 * @dev Combines BasicOracle and PushOracleBase to create a push style BasicOracle
 */ 
contract BasicPushOracle is Initializable, BasicOracle, PushOracleBase {

  /**
   * @dev BasicPushOracle initializer
   * @param _dataSource The address that is able to set the result
   * @param _consumer A contract that implements IOracleConsumer and is called when
   * the result has been set.
   */
  function initialize (
    address payable _dataSource,
    IOracleConsumer _consumer
  )
    public
    initializer
  {
    BasicOracle.initialize(_dataSource);
    PushOracleBase.initialize(_consumer, 0);
  }

}
