pragma solidity ^0.4.24;

import './BasicOracle.sol';
import "zeppelin-solidity/contracts/ECRecovery.sol";

contract SignedOracle is BasicOracle {

  address public dataSource;

  constructor(address _dataSource) {
    dataSource = _dataSource;
  }

  function getSigner(bytes32 _result, bytes _signature) public pure returns (address) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 prefixedHash = sha3(prefix, _result);

    // Recover signer from the signature with messageSigned
    return ECRecovery.recover(prefixedHash, _signature);
  }

  function setResult(bytes32 _result, bytes _signature) public {
    // Generate message hash
    
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 prefixedHash = sha3(prefix, _result);

    // Recover signer from the signature with messageSigned
    address signer = ECRecovery.recover(prefixedHash, _signature);

    // Check that the signer is the dataSource
    require(signer == dataSource, "Invalid signature");

    _setResult(_result);
  }

}
