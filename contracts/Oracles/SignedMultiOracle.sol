pragma solidity ^0.4.24;

import "./MultiOracle.sol";
import "openzeppelin-solidity/contracts/ECRecovery.sol";

/**
 * @title SignedMultiOracle
 * @dev Extends MultiOracle to use signed messages
 */
contract SignedMultiOracle is MultiOracle {
  /**
   * @dev Sets the result of the oracle with a signed message.
   * To resolve the issue that truffle not supporting function overrides,
   * rename `setResult` method to be `setResultWithSignature`.
   * @param _id The id being set
   * @param _result The result being set
   * @param _signature The hash of the result signed by the data source
   */
   function setResultWithSignature(
     bytes32 _id,
     bytes32 _result,
     bytes _signature
   )
     public
   {
     // Generate message hash
     bytes memory prefix = "\x19Ethereum Signed Message:\n32";
     bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, _result));

     // Recover signer from the signature with messageSigned
     address signer = ECRecovery.recover(prefixedHash, _signature);
     // Check that the signer is the dataSource
     require(signer == results[_id].dataSource, "Invalid signature");
     _setResult(_id, _result);
   }

}
