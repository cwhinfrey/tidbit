pragma solidity ^0.4.24;

import "./IOracleHandler.sol";
import "../OracleBase.sol";

/**
 * @title PushOracleBase
 * @dev Extends OracleBase to be a push type oracle by calling an oracle handler
 * when the result is set
 */ 
contract PushOracleBase is OracleBase {

  IOracleHandler public handler;

  /**
   * @dev PushOracleBase constructor
   * @param _handler A contract that implements IOracleHandler and is called when
   * the result has been set.
   */
  constructor(IOracleHandler _handler) public {
    handler = _handler;
  }

  /**
   *  Internal functions
   */

  /**
   * @dev Calls receiveResult(bytes32, bytes32) on the oracle handler when the 
   * result is set
   * @dev Called by _setResult(bytes32) in OracleBase
   * @param _result The result being set in _setResult(bytes32)
   */
  function _resultWasSet(bytes32 _result) internal {
    super._resultWasSet(_result);
    handler.receiveResult(0, _result);
  }

}
