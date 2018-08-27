pragma solidity ^0.4.24;

import "./IOracle.sol";

/**
 * @title OracleBase
 * @dev Lays out generic single-event oracle functionality but doesn't implement 
 * a method to set the result
 */
 
contract OracleBase is IOracle {

  bytes32 result;
  bool resultIsSet;

  event ResultSet(bytes32 _result, address _sender);

  /**
   *  Public functions
   */

  /**
   * @dev Returns the result or reverts if it hasn't been set
   * @param id This is not used in single-event orcles and should be 0
   *  The result or the oracle's single event
   */
  function resultFor(bytes32 id) external view returns (bytes32) {
    require(id == bytes32(0), "This oracle does not support ids.");
    require(isResultSet(), "The result has not been set.");
    return result;
  }

  /**
   * @dev Checks if the result has been set
   *  True if the result has been set
   */
  function isResultSet() public view returns (bool) {
    return resultIsSet;
  }

  /**
   *  Internal functions
   */

   /**
    * @dev Set's the result, emits ResultSet, and calls the _resultWasSet()
    * overridable function
    * @param _result The result of the oracle's single event.
    */
  function _setResult(bytes32 _result) internal {
    require(!resultIsSet, "Result has already been set.");
    result = _result;
    resultIsSet = true;
    emit ResultSet(_result, msg.sender);
    _resultWasSet(_result);
  }

  /**
   * @dev Empty function meant to be overidden in subclasses
   */
  function _resultWasSet(bytes32 /*_result*/) internal {
    // optional override
  }

}
