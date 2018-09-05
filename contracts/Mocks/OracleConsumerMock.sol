pragma solidity ^0.4.24;

import "../PushOracles/IOracleConsumer.sol";

contract OracleConsumerMock is IOracleConsumer {

  bytes32 public result;

  function receiveResult(bytes32 /*id*/, bytes32 _result) external {
    result = _result;
  }
}
