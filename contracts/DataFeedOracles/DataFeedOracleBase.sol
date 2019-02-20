pragma solidity ^0.4.24;

import "./IDataFeedOracle.sol";
import "zos-lib/contracts/Initializable.sol";

/**
 * @title DataFeedOracleBase
 * @dev Lays out generic single-event oracle functionality. It implements
 * an internal function to set the result that can be called by public
 * functions that extend DataFeedOracleBase.
 * There is only one date, index and result per data feed.
 */

contract DataFeedOracleBase is Initializable, IDataFeedOracle {

  uint256[] dates; // defaults should be all 0
  mapping(uint256 => bytes32) results;
  mapping(uint256 => uint256) indexes;
  address public dataSource;
  uint256 age;

  event ResultSet(bytes32 _result, uint256 _date, uint256 _age, uint256 _index, address _sender);

  modifier onlyBefore(uint256 _date) {
    require(
      _date <= now,
      "The date has to before now."
    );
    _;
  }

  modifier onlyDataSource(address _dataSource) {
    require(
      msg.sender == _dataSource,
      "The caller is not the data source."
    );
    _;
  }

  modifier notId(uint256 _id) {
    require(
      _id == 0,
      "This oracle does not support ids."
    );
    _;
  }

  modifier onlyNonNullDataSource(address _dataSource) {
    require(
      _dataSource != address(0),
      "Require a non-null dataSource"
    );
    _;
  }

  /**
   *  @dev DataFeedBase initializer
   *  @param _dataSource The address that is able to set the result
   */
  function initialize(address _dataSource) public onlyNonNullDataSource(_dataSource) initializer {
    dataSource = _dataSource;
    dates.push(0); // padding dates array with index 0. The valid index has to be bigger than 0.
  }

  /**
   * @dev Sets the result of the oracle
   * @param _result The result being set
   * @param _date The date of the data feed
   * @return The index of the data feed order by date
   */
  function setResult(bytes32 _result, uint256 _date) public onlyDataSource(dataSource) returns (uint256 index) {
    if (dates.length > 0) {
      require(_date > dates[dates.length - 1]);
    }
    _setResult(_result, _date);
    return dates.length - 1;
  }

  /**
   *  Public functions
   */

    /**
   * @dev Returns the result or reverts if it hasn't been set by index
   * @param id This is not used in single-event oracles and should be 0
   * @param index The index of data feed by date.
   * @return The result or the oracle's single event
   */
  function resultByIndexFor(uint256 id, uint256 index) external view notId(id) returns (bytes32, uint256) {
    require(doesIndexExistFor(id, index), "The index is not been set yet.");
    return (results[dates[index]], dates[index]);
  }

  /**
   * @dev Returns the result or reverts if it hasn't been set by index
   * @param id This is not used in single-event oracles and should be 0
   * @param date The date of data feed
   * @return The result or the oracle's single event
   */
  function resultByDateFor(uint256 id, uint256 date) external view notId(id) returns (bytes32, uint256) {
    require(isResultSetFor(id, date), "The date is not been set yet.");
    return (results[date], indexes[date]);
  }

  /**
   * @dev Return the block timestamp that the data feed last updated
   */
  function lastUpdated(uint256 id) external view notId(id) returns (uint256 date, uint256 index) {
    require(dates.length > 1, "There is no data getting set yet.");
    return (age, dates.length - 1);
  }

  /**
   * @dev Checks if the result has been set with given date
   * @param id This is not used in single-event oracles and should be 0
   * @param date The date of the data feed
   * @return True if the result has been set
   */
  function isResultSetFor(uint256 id, uint256 date) public view notId(id) returns (bool) {
    return indexes[date] > 0;
    //return results[date] > 0; // The assumption here is that there is no 0 value in the results;
    // or we could interate the dates array to check whether it got set,
    // but this would be not efficient.
  }

  /**
   * @dev Checks if the result has been set with given index
   * @param id This is not used in single-event oracles and should be 0
   * @param index The index of the data feed order by date
   * @return True if the result has been set
   */
  function doesIndexExistFor(uint256 id, uint256 index) public view notId(id) returns (bool) {
    require(index != 0, "The valid index has to bigger than 0.");
    return dates.length > index;
  }

  /**
   *  Internal functions
   */

   /**
    * @dev Set's the result, emits ResultSet, and calls the _resultWasSet()
    * overridable function
    * @param _result The result of the oracle's single event.
    * @param _date The date of the result.
    */
  function _setResult(bytes32 _result, uint256 _date) internal {
    results[_date] = _result;
    dates.push(_date);
    indexes[_date] = dates.length - 1;
    age = uint256(block.timestamp);
    emit ResultSet(_result, _date, age, dates.length - 1, msg.sender);
    _resultWasSet(_result, _date);
  }

  /**
   * @dev Empty function meant to be overidden in subclasses
   */
  function _resultWasSet(bytes32 /*_result*/, uint256 /*_date*/) internal {
    // optional override
  }

}
