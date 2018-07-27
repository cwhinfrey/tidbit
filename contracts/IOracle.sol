pragma solidity ^0.4.24;

interface IOracle {
  function resultFor(bytes32 id) external view returns (bytes32);
  function isResultSet() external view returns (bool);
}
