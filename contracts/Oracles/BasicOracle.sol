pragma solidity ^0.4.24;

import "./OracleBase.sol";
import "../Initializer.sol";

/**
 * @title BasicOracle
 * @dev Extends OracleBase to allow the result to be set by a single data source
 */
contract BasicOracle is Initializer, OracleBase {

  // The address that is able to set the result
  address public dataSource;

  /**
   *  @dev BasicOracle initializer
   *  @param _dataSource The address that is able to set the result
   */
  function initialize(address _dataSource) public initializer {
    require(_dataSource != address(0), "Require a non-null dataSource");
    dataSource = _dataSource;
  }

  /**
   * @dev Sets the result of the oracle
   * @param _result The result being set
   */
  function setResult(bytes32 _result) public {
    require(msg.sender == dataSource, "The caller is not the data source.");
    _setResult(_result);
  }

}
