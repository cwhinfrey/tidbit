pragma solidity ^0.5.0;

import "./IDataFeedOracle.sol";
import "zos-lib/contracts/Initializable.sol";

/**
 * @title DataFeedOracleBase
 * @dev Allows a data source address to set bytes32 result values by date. Result values
 *      can be publicly read by date and by index.
 */
contract DataFeedOracleBase is Initializable, IDataFeedOracle {

  uint256[] dates;

  mapping(uint256 => bytes32) resultsByDate;

  mapping(uint256 => uint256) indicesByDate;

  address public dataSource;

  event ResultSet(bytes32 _result, uint256 _date, uint256 _index, address _sender);

  /**
   * @dev Throws if _date is not current or past.
   * @param _date Date to check against the `now` value.
   */
  modifier onlyBefore(uint256 _date) {
    require(
      _date <= now,
      "Date cannot be in the future"
    );
    _;
  }

  /**
   * @dev Throws if the data source is not the caller.
   * @param _dataSource The address of the data source.
   */
  modifier onlyDataSource(address _dataSource) {
    require(
      msg.sender == _dataSource,
      "The caller is not the data source"
    );
    _;
  }

  /**
   * @dev Throws if the data source is the zero address.
   * @param _dataSource The address of the data source.
   */
  modifier onlyNonZeroDataSource(address _dataSource) {
    require(
      _dataSource != address(0),
      "_dataSource cannot be address(0)"
    );
    _;
  }

  /**
   *  @dev Initializes DataFeedOracleBase.
   *  @param _dataSource The address that is allowed to set results.
   */
  function initialize(address _dataSource)
    public
    onlyNonZeroDataSource(_dataSource) initializer {
    dataSource = _dataSource;
    dates.push(0); // Valid indices have to be greater than 0.
  }

  /**
   * @dev Sets a bytes32 result for the given date.
   * @param _result The result being set.
   * @param _date The date for the result.
   * @return The index of the result.
   */
  function setResult(bytes32 _result, uint256 _date)
    public
    onlyDataSource(dataSource)
    onlyBefore(_date)
    returns (uint256 index)
  {
    if (dates.length > 0) {
      require(_date > dates[dates.length - 1]);
    }
    _setResult(_result, _date);
    return dates.length - 1;
  }

  /**
   * @dev Returns a result and a date, given an index. Throws if no result exists for
   *      the given index.
   * @param _index The index of the result.
   * @return The result value and the date of the result.
   */
  function resultByIndexFor(uint256 _index) external view returns (bytes32, uint256) {
    require(doesIndexExistFor(_index), "The index is not been set yet.");
    return (resultsByDate[dates[_index]], dates[_index]);
  }

  /**
   * @dev Returns a result and an index, given a date. Throws if no result exists for
   *      the given date.
   * @param _date The date of the result.
   * @return The result value and the index of the result.
   */
  function resultByDateFor(uint256 _date) external view returns (bytes32, uint256) {
    require(isResultSetFor(_date), "The date is not been set yet.");
    return (resultsByDate[_date], indicesByDate[_date]);
  }

  /**
   * @notice Throws if no results have been set.
   * @return The date of the last result that was set.
   */
  function lastUpdated() external view returns (uint256 date, uint256 index) {
    require(dates.length > 1, "No results have been set");
    return (dates[dates.length - 1], dates.length - 1);
  }

  /**
   * @notice Throws if no results have been set.
   * @return The last result that was set.
   */
  function lastUpdatedData() external view returns (bytes32) {
    require(dates.length > 1, "No results have been set");
    return resultsByDate[dates[dates.length - 1]];
  }

  /**
   * @param _date The date of the data feed
   * @return `true` if a result has been set for the given date.
   */
  function isResultSetFor(uint256 _date) public view returns (bool) {
    return indicesByDate[_date] > 0;
  }

  /**
   * @param _index The index of a result.
   * @return `true` if a result for the given index exists.
   */
  function doesIndexExistFor(uint256 _index) public view returns (bool) {
    require(_index != 0, "The valid index has to bigger than 0.");
    return dates.length > _index;
  }

  /**
   * @dev Sets a bytes32 result value and a date for the result.
   * @param _result The result to set.
   * @param _date The date of the result.
   */
  function _setResult(bytes32 _result, uint256 _date) internal {
    resultsByDate[_date] = _result;
    dates.push(_date);
    indicesByDate[_date] = dates.length - 1;

    _resultWasSet(_result, _date);

    emit ResultSet(_result, _date, dates.length - 1, msg.sender);
  }

  /**
   * @dev Unimplemented function meant to be overidden in subclasses.
   */
  function _resultWasSet(bytes32 /*_result*/, uint256 /*_date*/) internal {
    // optional override
  }

}
