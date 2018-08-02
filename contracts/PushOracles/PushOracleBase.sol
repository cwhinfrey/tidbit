pragma solidity ^0.4.24;

import "./IOracleHandler.sol";
import "../OracleBase.sol";

contract PushOracleBase is OracleBase {

  IOracleHandler public handler;

  constructor(IOracleHandler _handler) public {
    handler = _handler;
  }

  /*
   *  Internal functions
   */

  function _resultWasSet(bytes32 _result) internal {
    super._resultWasSet(_result);
    handler.receiveResult(0, _result);
  }

}
