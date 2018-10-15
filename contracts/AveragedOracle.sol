pragma solidity ^0.4.24;

import "./Oracles/IOracle.sol";
import "./Oracles/OracleBase.sol";
import "./Utils/OrderStatisticTree.sol";

/**
 * @title AveragedOracle
 */
contract AveragedOracle is OracleBase, OrderStatisticTree {

  IOracle[] oracles;
  /**
   * @dev AveragedOracle constructor
   * @param _oracles The sub oracles array to initilize the AveragedOracle
   */
  constructor(IOracle[] _oracles) public {
    require(_oracles.length > 0, "Cannot initilize AveragedOracle with empty oracle array");
    oracles = _oracles;
  }

   /**
   * @dev Sets the result of the oracle
   * reverts if any of the sub-oracles have not been set yet.
   */
  function setResult() public {
    for(uint i = 0; i < oracles.length; i++) {
      super.insert(bytesToUint(oracles[i].resultFor(0)));
    }
    _setResult(toBytes(median())); // no id needed here
  }

  /**
   *  Internal functions
   */

  /**
   * @param _result The result being set in _setResult(bytes)
   */
  function _resultWasSet(bytes _result) internal {
    super._resultWasSet(_result);
  }

  /**
   *  Private functions
   */

  function bytesToUint(bytes b) private pure returns (uint256){
     uint256 number;
     for(uint i=0;i<b.length;i++){
         number = number + uint(b[i])*(2**(8*(b.length-(i+1))));
     }
     return number;
  }

  function toBytes(uint256 x) private pure returns (bytes b) {
      //TODO: This will return bytes32 instead of dynamic length of bytes.
      //Solidity will store bytes32 more efficiently.
      b = new bytes(32);
      assembly { mstore(add(b, 32), x) }
  }

}