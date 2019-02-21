pragma solidity ^0.5.0;

interface IOracleConsumer {
  function receiveResult(bytes32 id, bytes32 result) external;
}
