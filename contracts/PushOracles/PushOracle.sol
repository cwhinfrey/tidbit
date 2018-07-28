pragma solidity ^0.4.24;

import './IOracleHandler.sol';
import '../BasicOracle.sol';

contract PushOracle is BasicOracle {

  IOracleHandler public handler;

  constructor(IOracleHandler _handler) {
    handler = _handler;
  }

  function _resultWasSet(bytes32 _result) internal {
    super._resultWasSet(_result);
    handler.receiveResult(0, _result);
  }

}
