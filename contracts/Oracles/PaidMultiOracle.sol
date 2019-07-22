pragma solidity ^0.5.0;

import "./MultiOracle.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "zos-lib/contracts/Initializable.sol";

/**
 * @title PaidMultiOracle
 * @dev Extends MultiOracle to include rewards for dataSources
 */

contract PaidMultiOracle is Initializable, MultiOracle {

  uint256 public reward;
  IERC20 public token;

  function initialize(IERC20 _token, uint256 _reward) public initializer {
    token = _token;
    reward = _reward;
  }

  /**
   * @dev Returns the oracle reward or the contract's balance if it's less than the reward
   */
  function getReward() public view returns (uint256) {
    return Math.min(reward, token.balanceOf(address(this)));
  }

  /*
   *  Internal functions
   */

  function _resultWasSet(bytes32 _id, bytes32 /*_result*/)
    internal
  {
    require(results[_id].resultIsSet, "Result hasn't been set yet.");
    require(results[_id].dataSource != address(0), "Invalid dataSource");
    token.transfer(results[_id].dataSource, getReward());
  }
}
