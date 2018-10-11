pragma solidity ^0.4.24;

import "./Oracles/IOracle.sol";
import "./Oracles/OracleBase.sol";
import "./Utils/OrderStatisticTree.sol";

/**
 * @title AveragedOracle
 */
contract AveragedOracle is OracleBase {

  OrderStatisticTree private oracles;

  /**
   * @dev AveragedOracle constructor
   * @param _oracles The sub oracles array to initilize the AveragedOracle
   */
  constructor(IOracle[] _oracles) public {
    for(uint i = 0; i < _oracles.length; i++) {
      uint value = bytesToUint(_oracles[i].resultFor(0));
      oracles.insert(value);
    }
  }

   /**
   * @dev Sets the result of the oracle
   * reverts if any of the sub-oracles have not been set yet.
   */
  function setResult() public {
    //TODO
    //require(isAllOraclesSet(), "Some sub-oracles have not been set yet.");
    bytes memory medianValue = toBytes(oracles.median());
    _setResult(medianValue); // no id needed here
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

  function bytesToUint(bytes b) private pure returns (uint256){
     uint256 number;
     for(uint i=0;i<b.length;i++){
         number = number + uint(b[i])*(2**(8*(b.length-(i+1))));
     }
     return number;
  }

  function toBytes(uint256 x) private pure returns (bytes b) {
      b = new bytes(32);
      assembly { mstore(add(b, 32), x) }
  }

}