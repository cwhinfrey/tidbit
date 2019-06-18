import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { bytes32ToNumString, getMeidan, numberToBytes32 } = require('./Utils.test')

const MedianDataFeedOracle = artifacts.require('MedianDataFeedOracle')
const DataFeedOracleBase = artifacts.require('DataFeedOracleBase')

require('chai').should()

const now = (new Date()).getTime() / 1000;

const ORACLE_INDEX_1_DATE = now - 1 * 60 * 60 | 0
const ORACLE_INDEX_2_DATE = now | 0

const DATES = [ORACLE_INDEX_1_DATE, ORACLE_INDEX_2_DATE]
const PRICES = [[0, 1.00], [0, 1.36], [0, 1.49], [0, 1.88]]
const ORACLE_RESULT = PRICES.map(
    y => y.map(
      z => [ DATES[y.indexOf(z)], numberToBytes32(z * Math.pow(10, 18) )]
))

contract('initialize MedianDataFeedOracle', (accounts) => {
  const dataFeedOracleDataSource = accounts[5]
  const dataSources = [accounts[1], accounts[2], accounts[3], accounts[4]]

  it('cannot initilize medianDataFeedOracle with empty oracle array.', async () => {
    let oracle = await MedianDataFeedOracle.new()
    await shouldFail(oracle.initialize([]))
  })

  it('cannot read median value if the dataFeeds data have not been set yet.', async () => {
    let dataFeedOracle = await MedianDataFeedOracle.new()
    await dataFeedOracle.initialize(dataSources, dataFeedOracleDataSource)
    // There is no median value returned if the results hasn't been set yet.
    await shouldFail(dataFeedOracle.lastUpdated())
    await shouldFail(dataFeedOracle.lastUpdatedData())
  })

  it('Set medianDataFeed', async () => {
    let oracles = []
    for (var i = 0; i < dataSources.length; i++) {
      let oracle = await DataFeedOracleBase.new()
      await oracle.initialize(dataSources[i])

      for(var j = 0; j < ORACLE_RESULT[i].length; j++ ){
        await oracle.setResult(ORACLE_RESULT[i][j][1], ORACLE_RESULT[i][j][0], { from: dataSources[i]});
      }
      oracles.push(oracle.address)
    }

    let dataFeedOracle = await MedianDataFeedOracle.new()
    await dataFeedOracle.initialize(oracles, dataFeedOracleDataSource)
    const now = (new Date()).getTime() / 1000 | 0
    await dataFeedOracle.setResult(oracles, { from: dataFeedOracleDataSource})
    const lastUpdatedData = await dataFeedOracle.lastUpdatedData()
    const median = getMeidan(PRICES.map(x => x[1] * Math.pow(10, 18)))
    bytes32ToNumString(lastUpdatedData).should.equal(median.toString())
    const [lastUpdatedDate, lastUpdatedIndex] = Object.values(await dataFeedOracle.lastUpdated())
    lastUpdatedDate.should.eq.BN(now)
  })

})
