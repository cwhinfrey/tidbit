pragma solidity ^0.4.24;

import "./OracleBase.sol";

/**
 * @title BasicOracle
 * @dev Extends OracleBase to allow the result to be set by a single data source
 */
contract BasicOracle is OracleBase {

  // The address that is able to set the result
  address public dataSource;

  /**
   *  @dev BasicOracle constructor
   *  @param _dataSource The address that is able to set the result
   */
  constructor(address _dataSource) public {
    dataSource = _dataSource;
  }

  /**
   * @dev Sets the result of the oracle
   * @param _result The result being set
   */
  function setResult(bytes _result) public {
    require(msg.sender == dataSource, "The caller is not the data source.");
    _setResult(_result);
  }

}
