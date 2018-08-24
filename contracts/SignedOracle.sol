pragma solidity ^0.4.24;

import "./BasicOracle.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";

/**
 * @title SignedOracle
 * @dev Extends BasicOracle to allow any address to resolve the oracle with a
 * signed message from the data source
 */
contract SignedOracle is BasicOracle {

  /**
   * @dev SignedOracle constructor
   * @param _dataSource The address that is able to set the result
   */
  constructor(
    address _dataSource
  )
    BasicOracle(_dataSource)
    public 
  {}

  /**
   * @dev Sets the result of the oracle with a signed message
   * @param _result The result being set
   * @param _signature The hash of the result signed by the data source
   */
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
