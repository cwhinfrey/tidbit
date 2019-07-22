pragma solidity ^0.4.24;

import "./BasicOracle.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "zos-lib/contracts/Initializable.sol";

/**
 * @title PaidOracle
 * @dev BasicOracle with reward set in initializer. The reward is transfered to 
 * dataSource when the result is successfully set.
 */

contract PaidOracle is Initializable, BasicOracle {

  uint256 public reward;
  IERC20 public token;

  function initialize(
    IERC20 _token,
    address _dataSource,
    uint256 _reward
  )
    public
    initializer
  {
    BasicOracle.initialize(_dataSource);
    token = _token;
    reward = _reward;
  }

  /**
   * @dev Returns the oracle reward or the contract's balance if it's less than the reward
   */
  function getReward() 
    public 
    view
    returns 
    (uint256)
  {
    return Math.min(reward, token.balanceOf(address(this)));
  }

  /*
   *  Internal functions
   */
  function _resultWasSet(bytes32 /*_result*/)
    internal
  {
    require(resultIsSet, "Result hasn't been set yet.");
    require(dataSource != address(0));
    token.transfer(dataSource, getReward());
  }
}
