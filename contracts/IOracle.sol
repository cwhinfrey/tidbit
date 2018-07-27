pragma solidity ^0.4.24;

interface IOracle {
  function result() external view returns (bytes32);
  function isResultSet() external view returns (bool);
}
