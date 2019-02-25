pragma solidity ^0.5.0;

interface TypedOracle {
  function dataType(uint256 _id) external view returns (uint);
}
