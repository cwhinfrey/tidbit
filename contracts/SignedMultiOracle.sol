pragma solidity ^0.4.24;

import "./MultiOracle.sol";
import "./Oracles/SignedOracle.sol";

/**
 * @title SignedMultiOracle
 * @dev Extends MultiOracle to use signed messages
 */
contract SignedMultiOracle is MultiOracle {

  /**
   * @dev SignedPushOracle constructor
   */
 
  constructor() public {}

  /**
   * @dev Sets the result of the oracle
   * @param _id The id being set
   * @param _result The result being set
   * @param _signature The hash of the result signed by the data source
   */
   function setResult(
     bytes32 _id,
     bytes _result,
     bytes _signature
   )
     public
   {
     require(msg.sender == results[_id].dataSource, "The caller is not the valid data source with given id.");
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