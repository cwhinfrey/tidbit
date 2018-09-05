pragma solidity ^0.4.24;

interface IOracle {
  function resultFor(bytes32 id) external view returns (bytes);
  function isResultSet(bytes32 id) external view returns (bool);
}
