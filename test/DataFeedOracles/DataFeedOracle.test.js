import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { soliditySha3 } = web3.utils

const DataFeedOracle = artifacts.require('DataFeedOracle')
const DataFeedOracleBase = artifacts.require('DataFeedOracleBase')

require('chai').should()

const now = (new Date()).getTime() / 1000;

const ORACLE_INDEX_1_DATE = now - 1 * 60 * 60 | 0
const ORACLE_INDEX_2_DATE = now | 0

const DATES = [ORACLE_INDEX_1_DATE, ORACLE_INDEX_2_DATE]
const ORACLE_RESULT = [[0, 1], [0, 2], [0, 3], [0, 4]].map(
    y => y.map(
      z => [ DATES[y.indexOf(z)], soliditySha3(z)]
))

contract('initialize DataFeedOracle', (accounts) => {
  const dataFeedOracleDataSource = accounts[5]
  const dataSources = [accounts[1], accounts[2], accounts[3], accounts[4]]

  beforeEach(async () => {
    let oracles = []
    for (var i = 0; i < dataSources.length; i++) {
      let oracle = await DataFeedOracleBase.new()
      await oracle.initialize(dataSources[i])

      for(var j = 0; j < ORACLE_RESULT[i].length; j++ ){
        await oracle.setResult(ORACLE_RESULT[i][j][1], ORACLE_RESULT[i][j][0], { from: dataSources[i]});
      }
      oracles.push(oracle.address)
    }
  })

  it('cannot initilize MedianOracle with empty oracle array.', async () => {
    let oracle = await DataFeedOracle.new()
    await shouldFail(oracle.initialize([]))
  })

  it('cannot read median value if the dataFeeds data have not been set yet.', async () => {
    let dataFeedOracle = await DataFeedOracle.new()
    await dataFeedOracle.initialize(dataSources, dataFeedOracleDataSource)
    // There is no median value returned if the results hasn't been set yet.
    await shouldFail(dataFeedOracle.lastUpdated())
    await shouldFail(dataFeedOracle.lastUpdatedPrice())
  })

  // it.only('cannot set result if any of the sub-oracles have not been set yet.', async () => {
  //   let dataFeedOracle = await DataFeedOracle.new()
  //   await dataFeedOracle.initialize(oracles, dataFeedOracleDataSource)
  //   await dataFeedOracle.setResult(oracles, { from: dataFeedOracleDataSource})
  //   // There is no median value returned if the results hasn't been set yet.
  //   const lastUpdatedPrice = await dataFeedOracle.lastUpdatedPrice()
  //   lastUpdatedPrice.should.equal(ORACLE_INDEX_5_RESULT)
  // })


})
