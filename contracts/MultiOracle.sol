pragma solidity ^0.4.24;

import "./Oracles/IOracle.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MultiOracle is IOracle, Ownable {

  struct OracleData {
    address dataSource;
    bytes result;
    bool resultIsSet;
  }

  mapping (bytes32 => OracleData) results; // id to result map

  event ResultSet(bytes32 _id, bytes _result, address _sender);

  constructor() public {}

  /**
   * @dev Throws if operator is not dataSource.
   * @param _operator address
   */
  modifier onlyIfValidAddress(address _operator) 
  {
    require(_operator != address(0), "Invalid dataSource.");
    _;
  }

  /*
   *  Public functions
   */

  function resultFor(bytes32 id) 
    external 
    view 
    returns 
    (bytes)
  {
    require(isResultSet(id), "The result has not been set.");
    return results[id].result;
  }

  function isResultSet(bytes32 id)
    public
    view
    returns
    (bool)
  {
    return results[id].resultIsSet;
  }

   /**
   * @dev Only owner could add a new oracle with id and dataSource information
   */
  function newOracle(
    bytes32 _id, 
    address _dataSource
  )
    internal
    onlyOwner
    onlyIfValidAddress(_dataSource)
  {       
    require(!isResultSet(_id), "Result has already been set.");
    results[_id].dataSource = _dataSource;
  }

  /**
   * @dev Set's the result, emits ResultSet, and calls the _resultWasSet()
   * overridable function
   * @param _result The result of the oracle's single event.
   * @param _id The id to identify single oracle.
   */
  function _setResult(
    bytes32 _id, 
    bytes _result
  ) 
    internal
  {
    require(!isResultSet(_id), "Result has already been set.");
    results[_id].result = _result;
    results[_id].resultIsSet = true;
    emit ResultSet(_id, _result, msg.sender);
    _resultWasSet(_id, _result);
  }

  /**
   * @dev Empty function meant to be overidden in subclasses
   */
  function _resultWasSet(bytes32 /*_id*/, bytes /*_result*/)
    internal 
  {
    // optional override
  }
}