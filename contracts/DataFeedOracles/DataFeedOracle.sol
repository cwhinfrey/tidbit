pragma solidity ^0.5.0;

import "./DataFeedOracleBase.sol";
import "zos-lib/contracts/Initializable.sol";

contract DataFeedOracle is Initializable, DataFeedOracleBase {

  mapping(address => bool) dataSources;
  uint8 minValidFeeds;
  uint256 lastUpdated;

  /**
   * @dev DataFeedOracle constructor
   * @param _dataSources Valid datafeeds to update price.
   */
  function initialize(address[] memory _dataSources) public initializer {
     require(_dataSources.length > 0, "Cannot initialize DataFeedOracle without empty data feeds");
     for (uint i = 0; i < _dataSources.length; i++) {
       dataSources[_dataSources[i]] = true;
     }
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
         require(_dataFeeds[i].lastUpdatedPrice() <= _dataFeeds[i+1].lastUpdatedPrice(), "The dataFeeds is not sorted.");
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
