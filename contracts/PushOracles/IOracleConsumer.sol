pragma solidity ^0.4.24;

interface IOracleConsumer {
  function receiveResult(bytes32 id, bytes32 result) external;
}
