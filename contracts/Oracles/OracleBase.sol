pragma solidity ^0.4.24;

import "./IOracle.sol";

/**
 * @title OracleBase
 * @dev Lays out generic single-event oracle functionality. It implements 
 * an internal function to set the result that can be called by public
 * functions that extend OracleBase.
 */
 
contract OracleBase is IOracle {

  bytes result;
  bool resultIsSet;

  event ResultSet(bytes _result, address _sender);

  /**
   *  Public functions
   */

  /**
   * @dev Returns the result or reverts if it hasn't been set
   * @param id This is not used in single-event oracles and should be 0
   * @return The result or the oracle's single event
   */
  function resultFor(bytes32 id) external view returns (bytes) {
    require(id == bytes32(0), "This oracle does not support ids.");
    require(isResultSet(id), "The result has not been set.");
    return result;
  }

  /**
   * @dev Checks if the result has been set
   * @return True if the result has been set
   */
  function isResultSet(bytes32 /*id*/) public view returns (bool) {
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
  function _setResult(bytes _result) internal {
    require(!resultIsSet, "Result has already been set.");
    result = _result;
    resultIsSet = true;
    emit ResultSet(_result, msg.sender);
    _resultWasSet(_result);
  }

  /**
   * @dev Empty function meant to be overidden in subclasses
   */
  function _resultWasSet(bytes /*_result*/) internal {
    // optional override
  }

}
