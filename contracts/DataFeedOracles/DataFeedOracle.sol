pragma solidity ^0.5.0;

import "./DataFeedOracleBase.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "zos-lib/contracts/Initializable.sol";

contract DataFeedOracle is Initializable, DataFeedOracleBase {

  mapping(address => bool) dataSources;
  uint256 lastUpdated;

  /**
   * @dev DataFeedOracle constructor
   * @param _dataFeedSources Valid datafeeds to update price.
   * @param _dataSource The address that is able to set the result
   */
  function initialize(address[] memory _dataFeedSources, address payable _dataSource) public initializer {
     require(_dataFeedSources.length > 0, "Cannot initialize DataFeedOracle without empty data feeds");
     for (uint i = 0; i < _dataFeedSources.length; i++) {
       dataSources[_dataFeedSources[i]] = true;
     }
     DataFeedOracleBase.initialize(_dataSource);
  }
  /**
   * @dev setResult with sorted dataFeeds
   * @param _dataFeeds Valid datafeeds to update price.
   * The assumption here is that the dataFeeds initialized here are already sorted.
   * It could be achieved cheaper off-chain than on-chain.
  */
  function setResult(DataFeedOracleBase[] calldata _dataFeeds) external {
    for (uint i = 0; i < _dataFeeds.length; i++) {

       require(dataSources[address(_dataFeeds[i].dataSource)], "Unauthorized data feed.");

       uint256 date;
       uint256 index;
       (date, index) = _dataFeeds[i].lastUpdated();
       require(date > lastUpdated, "Stale data.");

       if(i != _dataFeeds.length - 1) {
         require(uint256(_dataFeeds[i].lastUpdatedPrice()) <= uint256(_dataFeeds[i+1].lastUpdatedPrice()), "The dataFeeds is not sorted.");
       }
    }

    bytes32 medianValue;
    if(_dataFeeds.length % 2 == 0) {
      uint256 one = uint256(_dataFeeds[(_dataFeeds.length / 2) - 1].lastUpdatedPrice());
      uint256 two = uint256(_dataFeeds[(_dataFeeds.length / 2)].lastUpdatedPrice());
      medianValue = bytes32((one + two) / 2);
    }
    medianValue = _dataFeeds[_dataFeeds.length / 2].lastUpdatedPrice();

    super.setResult(medianValue, uint256(block.timestamp));
  }

}
