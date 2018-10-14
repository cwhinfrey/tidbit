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

 /**
  * @dev Sets the result of the oracle
  * @param id The id being set
  * @param result The result being set
  */
  function setResult(
    bytes32 id,
    bytes result
  )
    public
  {
    require(msg.sender == results[id].dataSource, "The caller is not the valid data source with given id.");
    _setResult(id, result);
  }

  /**
   * @dev Returns the result or reverts if it hasn't been set
   * @param id The id to identify the oracle
   * @return The result or the oracle's single event
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

  /**
   * @dev Checks if the result has been set
   * @param id The id to identify oracle
   * @return True if the result has been set
   */
  function isResultSet(bytes32 id)
    public
    view
    returns
    (bool)
  {
    return results[id].resultIsSet;
  }

  /**
   * @dev Checks if the oracle has been set
   * @param id The id to identify the oracle
   * @return True if the oracle has been set
  */
  function isOracleSet(bytes32 id)
    public
    view
    returns
    (bool)
  {
    return results[id].dataSource != address(0);
  }

  /**
   * @dev Only owner could add a new oracle with id and dataSource information
   */
  function newOracle(
    bytes32 _id,
    address _dataSource
  )
    public
    onlyOwner
    onlyIfValidAddress(_dataSource)
  {
    require(!isOracleSet(_id), "Oracle with the given id has already been set.");
    require(!isResultSet(_id), "Result has already been set.");
    results[_id].dataSource = _dataSource;
  }

  /*
   *  Internal functions
   */

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
