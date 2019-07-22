pragma solidity ^0.4.24;

import "./BasicOracle.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "../Initializer.sol";

/**
 * @title SignedOracle
 * @dev Extends BasicOracle to allow any address to resolve the oracle with a
 * signed message from the data source
 */
contract SignedOracle is Initializer, BasicOracle {
  using ECDSA for bytes32;

  /**
   * @dev SignedOracle initializer
   * @param _dataSource The address that is able to set the result
   */
  function initialize(
    address _dataSource
  )
    public
    initializer
  {
    BasicOracle.initialize(_dataSource);
  }

  /**
   * @dev Sets the result of the oracle with a signed message
   * @param _result The result being set
   * @param _signature The hash of the result signed by the data source
   */
  function setResult(bytes32 _result, bytes memory _signature) public {
    // Generate message hash
    bytes32 messageHash = keccak256(abi.encodePacked(_result, address(this)));

    // Recover signer from the signature
    address signer = messageHash.toEthSignedMessageHash().recover(_signature);

    // Check that the signer is the dataSource
    require(signer == dataSource, "Invalid signature");

    _setResult(_result);
  }

}
