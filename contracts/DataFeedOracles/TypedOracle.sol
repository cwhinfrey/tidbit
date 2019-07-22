pragma solidity ^0.4.24;

interface TypedOracle {
  function dataType(uint256 _id) external view returns (uint);
}
