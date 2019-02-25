pragma solidity ^0.5.0;

/**
 * @title DataFeedOracle interface
 * @dev see https://gist.github.com/cwhinfrey/9b57e7763f9137d548fe67ba4cb13f0c
 */

interface IDataFeedOracle {
    function isResultSetFor(uint256 date) external view returns (bool);
    function doesIndexExistFor(uint256 index) external view returns (bool);
    function resultByDateFor(uint256 date) external view returns (bytes32, uint256);
    function resultByIndexFor(uint256 index) external view returns (bytes32, uint256);
    function lastUpdated() external view returns (uint256, uint256); // date: latest block timestamp when calculate the Median
}
