pragma solidity ^0.5.0;

// Optional, DataFeedOraclePrimary must implement DataFeedOracle
interface DataFeedOraclePrimary {
    event ResultSet(bytes32 _result, uint256 _date, uint256 _index);
}
