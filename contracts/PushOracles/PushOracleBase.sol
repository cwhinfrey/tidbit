pragma solidity ^0.4.24;

import "./IOracleConsumer.sol";
import "../Oracles/OracleBase.sol";
import "zos-lib/contracts/migrations/Migratable.sol";

/**
 * @title PushOracleBase
 * @dev Extends OracleBase to be a push type oracle by calling an oracle consumer
 * when the result is set
 */ 
contract PushOracleBase is Migratable, OracleBase {

  IOracleConsumer public consumer;

  /**
   * @dev PushOracleBase constructor
   * @param _consumer A contract that implements IOracleConsumer and is called when
   * the result has been set.
   */
  function initialize(IOracleConsumer _consumer, uint unusedParam) public isInitializer("PushOracleBase", "0.0.0") {
    consumer = _consumer;
  }

  /**
   *  Internal functions
   */

  /**
   * @dev Calls receiveResult(bytes32, bytes) on the oracle consumer when the 
   * result is set
   * @dev Called by _setResult(bytes) in OracleBase
   * @param _result The result being set in _setResult(bytes)
   */
  function _resultWasSet(bytes _result) internal {
    super._resultWasSet(_result);
    consumer.receiveResult(0, _result);
  }

}
