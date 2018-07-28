pragma solidity ^0.4.24;

import "./SingleSourceOracle.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";

contract SignedOracle is SingleSourceOracle {

  constructor(
    address _dataSource
  )
    SingleSourceOracle(_dataSource)
    public 
  {}

  function setResult(bytes32 _result, bytes _signature) public {
    // Generate message hash
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, _result));

    // Recover signer from the signature with messageSigned
    address signer = ECRecovery.recover(prefixedHash, _signature);

    // Check that the signer is the dataSource
    require(signer == dataSource, "Invalid signature");

    _setResult(_result);
  }

}
