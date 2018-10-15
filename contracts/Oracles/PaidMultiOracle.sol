pragma solidity ^0.4.24;

import "./MultiOracle.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title PaidMultiOracle
 * @dev Extends MultiOracle to include rewards for dataSources
 */

contract PaidMultiOracle is MultiOracle {

  uint256 public reward;

  constructor(uint256 _reward) public payable
  {
    reward = _reward;
  }

  /**
   * @dev Returns the oracle reward or the contract's balance if it's less than the reward
   */
  function getReward() public view returns (uint256) {
    return Math.min256(reward, address(this).balance);
  }

  /*
   *  Internal functions
   */

  function _resultWasSet(bytes32 _id, bytes /*_result*/)
    internal
  {
    require(results[_id].resultIsSet, "Result hasn't been set yet.");
    require(results[_id].dataSource != address(0), "Invalid dataSource");
    results[_id].dataSource.transfer(getReward());
  }
}
