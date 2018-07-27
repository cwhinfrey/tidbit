pragma solidity ^0.4.24;

import './IOracle.sol';

contract BasicOracle /*is IOracle */{

  bytes32 public result;
  bool public isResultSet;

  /* 
   *  Internal functions
   */

  function _setResult(bytes32 _result) internal {
    require(!isResultSet);
    result = _result;
    isResultSet = true;
    _resultWasSet(_result);
  }

  function _resultWasSet(bytes32 _result) internal {
    // optional override
  }

}
