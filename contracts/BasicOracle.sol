pragma solidity ^0.4.24;

import './IOracle.sol';

contract BasicOracle is IOracle {

  bytes32 public result;
  bool _isResultSet;

  /*
   *  Public functions
   */

  function resultFor(bytes32 id) external view returns (bytes32) {
    require(id == bytes32(0), "This oracle does not support ids");
    return result;
  }
  
  function isResultSet() external view returns (bool) {
    return _isResultSet;
  }

  /* 
   *  Internal functions
   */

  function _setResult(bytes32 _result) internal {
    require(!_isResultSet);
    result = _result;
    _isResultSet = true;
    _resultWasSet(_result);
  }

  function _resultWasSet(bytes32 _result) internal {
    // optional override
  }

}
