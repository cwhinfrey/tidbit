pragma solidity ^0.5.0;

interface IOracle {
  function resultFor(bytes32 id) external view returns (bytes32);
  function isResultSet(bytes32 id) external view returns (bool);
}
