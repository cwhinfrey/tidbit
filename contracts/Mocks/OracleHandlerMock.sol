pragma solidity ^0.4.24;

import "../PushOracles/IOracleHandler.sol";

contract OracleHandlerMock is IOracleHandler {

  bytes32 public result;

  function receiveResult(bytes32 id, bytes32 _result) external {
    result = _result;
  }
}
