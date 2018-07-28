pragma solidity ^0.4.24;

interface IOracleHandler {
  function receiveResult(bytes32 id, bytes32 result) external;
}
