pragma solidity ^0.4.24;

import "./IOracle.sol";

contract BasicOracle is IOracle {

  bytes32 result;
  bool resultIsSet;

  /*
   *  Public functions
   */

  function resultFor(bytes32 id) external view returns (bytes32) {
    require(id == bytes32(0), "This oracle does not support ids.");
    require(isResultSet(), "The result has not been set.");
    return result;
  }

  function isResultSet() public view returns (bool) {
    return resultIsSet;
  }

  /*
   *  Internal functions
   */

  function _setResult(bytes32 _result) internal {
    require(!resultIsSet, "Result has already been set.");
    result = _result;
    resultIsSet = true;
    _resultWasSet(_result);
  }

  function _resultWasSet(bytes32 /*_result*/) internal {
    // optional override
  }

}
