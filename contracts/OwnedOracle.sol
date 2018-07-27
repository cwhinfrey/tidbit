pragma solidity ^0.4.24;

import './BasicOracle.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract OwnedOracle is BasicOracle, Ownable {

  function setResult(bytes32 _result) public onlyOwner {
    _setResult(_result);
  }

}
