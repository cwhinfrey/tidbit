pragma solidity ^0.5.0;

import "./DataFeedOracleBase.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "zos-lib/contracts/Initializable.sol";

contract MedianDataFeedOracle is Initializable, DataFeedOracleBase {

  mapping(address => bool) public approvedDataFeeds;
  uint public approvedDataFeedsLength;

  event AddedDataFeed(address dataFeed);
  event RemovedDataFeed(address dataFeed);

  /**
   * @dev MedianDataFeedOracle constructor
   * @param _dataFeedSources Valid datafeeds to update price.
   * @param _dataSource The address that is able to set the result
   */
  function initialize(address[] memory _dataFeedSources, address  _dataSource) public initializer {
     require(_dataFeedSources.length > 0, "Cannot initialize MedianDataFeedOracle without data feeds");
     for (uint i = 0; i < _dataFeedSources.length; i++) {
       approvedDataFeeds[_dataFeedSources[i]] = true;
     }
     approvedDataFeedsLength = _dataFeedSources.length;
     DataFeedOracleBase.initialize(_dataSource);
  }

  /**
   * @dev setResult with sorted dataFeeds
   * @param _dataFeeds Valid datafeeds to update price.
   * The assumption here is that the dataFeeds initialized here are already sorted.
   * It could be achieved cheaper off-chain than on-chain.
  */
  function setResult(DataFeedOracleBase[] calldata _dataFeeds) external {
    require(_dataFeeds.length == approvedDataFeedsLength, "Must include every approved data feed without duplicates");

    for (uint i = 0; i < _dataFeeds.length; i++) {
       require(approvedDataFeeds[address(_dataFeeds[i].dataSource)], "Unauthorized data feed.");
       require(_dataFeeds[i].latestResultDate() > latestResultDate(), "Stale data.");

       for (uint j = i + 1; j < _dataFeeds.length; j++) {
         require(_dataFeeds[i] != _dataFeeds[j], "Duplicate data feeds prohibited");
       }

       if(i != _dataFeeds.length - 1) {
         require(uint256(_dataFeeds[i].latestResult()) <= uint256(_dataFeeds[i+1].latestResult()), "The dataFeeds are not sorted.");
       }
    }

    bytes32 medianValue;
    if(_dataFeeds.length % 2 == 0) {
      uint256 one = uint256(_dataFeeds[(_dataFeeds.length / 2) - 1].latestResult());
      uint256 two = uint256(_dataFeeds[(_dataFeeds.length / 2)].latestResult());
      medianValue = bytes32((one + two) / 2);
    } else {
      medianValue = _dataFeeds[_dataFeeds.length / 2].latestResult();
    }
    uint256 now = uint256(block.timestamp);
    super.setResult(medianValue, now);
  }

  /**
   * @dev add new dataFeed to be medianized for each result
   * @param dataFeed dataFeedOracle to add to approvedDataFeeds
  */
  function addDataFeed(address dataFeed) onlyDataSource() public {
    _addDataFeed(dataFeed);
  }

  /**
   * @dev remove existing dataFeed to be medianized for each result
   * @param dataFeed dataFeedOracle to remove from approvedDataFeeds
  */
  function removeDataFeed(address dataFeed) onlyDataSource() public {
    _removeDataFeed(dataFeed);
  }


  // Internal Functions

  function _addDataFeed(address dataFeed) internal {
    require(!approvedDataFeeds[dataFeed]);
    approvedDataFeeds[dataFeed] = true;
    approvedDataFeedsLength++;
    emit AddedDataFeed(dataFeed);
  }

  function _removeDataFeed(address dataFeed) internal {
    require(approvedDataFeeds[dataFeed]);
    approvedDataFeeds[dataFeed] = false;
    approvedDataFeedsLength--;
    emit RemovedDataFeed(dataFeed);
  }

}
