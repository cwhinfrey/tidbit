pragma solidity ^0.4.24;

import "./IOracleConsumer.sol";
import "../Oracles/OracleBase.sol";
import "zos-lib/contracts/Initializable.sol";

/**
 * @title PushOracleBase
 * @dev Extends OracleBase to be a push type oracle by calling an oracle consumer
 * when the result is set
 */ 
contract PushOracleBase is Initializable, OracleBase {

  IOracleConsumer public consumer;

  /**
   * @dev PushOracleBase initializer
   * @param _consumer A contract that implements IOracleConsumer and is called when
   * the result has been set.
   */
  function initialize(IOracleConsumer _consumer, uint unusedParam) initializer public {
    consumer = _consumer;
  }

  /**
   *  Internal functions
   */

  /**
   * @dev Calls receiveResult(bytes32, bytes) on the oracle consumer when the 
   * result is set
   * @dev Called by _setResult(bytes32) in OracleBase
   * @param _result The result being set in _setResult(bytes32)
   */
  function _resultWasSet(bytes32 _result) internal {
    super._resultWasSet(_result);
    consumer.receiveResult(0, _result);
  }

}
