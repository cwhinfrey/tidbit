pragma solidity ^0.4.24;

interface IOracle {
  function result() public view returns (bytes32);
  function isResultSet() public view returns (bool);
}
