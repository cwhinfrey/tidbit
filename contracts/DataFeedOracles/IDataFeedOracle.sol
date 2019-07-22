pragma solidity ^0.4.24;

/**
 * @title DataFeedOracle interface
 */
interface IDataFeedOracle {
    function totalResults() external view returns (uint256);
    function indexHasResult(uint256 index) external view returns (bool);
    function dateHasResult(uint256 date) external view returns (bool);
    function resultByIndex(uint256 index) external view returns (bytes32, uint256);
    function resultByDate(uint256 date) external view returns (bytes32, uint256);
    function latestResultDate() external view returns (uint256);
    function latestResult() external view returns (bytes32);
}
