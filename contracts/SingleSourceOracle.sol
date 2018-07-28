pragma solidity ^0.4.24;

import "./BasicOracle.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract SingleSourceOracle is BasicOracle, Ownable {

  address public dataSource;

  constructor(address _dataSource) public {
    dataSource = _dataSource;
  }

  function setResult(bytes32 _result) public {
    require(msg.sender == dataSource, "The caller is not the data source.");
    _setResult(_result);
  }

}
