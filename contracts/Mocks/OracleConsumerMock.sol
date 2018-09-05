pragma solidity ^0.4.24;

import "../PushOracles/IOracleConsumer.sol";

contract OracleConsumerMock is IOracleConsumer {

  bytes public result;

  function receiveResult(bytes32 /*id*/, bytes _result) external {
    result = _result;
  }
}
