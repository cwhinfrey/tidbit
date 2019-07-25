import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { bytes32ToNumString, getMedian, numberToBytes32 } = require('./Utils.test')

const MedianDataFeedOracle = artifacts.require('MedianDataFeedOracle')
const DataFeedOracleBase = artifacts.require('DataFeedOracleBase')

require('chai').should()

const now = () => (new Date()).getTime() / 1000

const ORACLE_INDEX_1_DATE = now() - 1 * 60 * 60 | 0
const ORACLE_INDEX_2_DATE = now() | 0

const DATES = [ORACLE_INDEX_1_DATE, ORACLE_INDEX_2_DATE]
const PRICES = [[0, 1.00], [0, 1.36], [0, 1.49], [0, 1.88]]
const ORACLE_RESULT = PRICES.map(
    y => y.map(
      z => [ DATES[y.indexOf(z)], numberToBytes32(z * Math.pow(10, 18) )]
))

contract('initialize MedianDataFeedOracle', (accounts) => {
  let oracles
  const dataFeedOracleDataSource = accounts[0]
  const approvedDataFeeds = [accounts[1], accounts[2], accounts[3], accounts[4]]

  before(async () => {
    oracles = []
    for (var i = 0; i < approvedDataFeeds.length; i++) {
      let oracle = await DataFeedOracleBase.new()
      await oracle.initialize(approvedDataFeeds[i])

      for(var j = 0; j < ORACLE_RESULT[i].length; j++ ){
        await oracle.setResult(ORACLE_RESULT[i][j][1], ORACLE_RESULT[i][j][0], { from: approvedDataFeeds[i]});
      }
      oracles.push(oracle.address)
    }
  })

  it('cannot initilize medianDataFeedOracle with empty oracle array.', async () => {
    let oracle = await MedianDataFeedOracle.new()
    await shouldFail(oracle.initialize([]))
  })

  it('Set medianDataFeed', async () => {
    let dataFeedOracle = await MedianDataFeedOracle.new()
    await dataFeedOracle.initialize(oracles, dataFeedOracleDataSource)
    await dataFeedOracle.setResult(oracles, { from: dataFeedOracleDataSource})
    const latestResult = await dataFeedOracle.latestResult()
    const median = getMedian(PRICES.map(x => x[1] * Math.pow(10, 18)))
    bytes32ToNumString(latestResult).should.equal(median.toString())
    const latestResultDate = await dataFeedOracle.latestResultDate()
    latestResultDate.should.eq.BN(now())
  })

  describe('addDataFeed()', () => {
    let dataFeedOracle

    beforeEach(async () => {
      dataFeedOracle = await MedianDataFeedOracle.new()
      await dataFeedOracle.initialize(oracles, dataFeedOracleDataSource)
    })

    it('adds new dataFeed to approvedDataFeeds', async () => {
      expect(await dataFeedOracle.approvedDataFeeds(accounts[6])).to.equal(false)
      await dataFeedOracle.addDataFeed(accounts[6])
      expect(await dataFeedOracle.approvedDataFeeds(accounts[6])).to.equal(true)
    })

    it('reverts if dataFeed is already a dataSource', async () => {
      expect(await dataFeedOracle.approvedDataFeeds(oracles[0])).to.equal(true)
      await shouldFail(dataFeedOracle.addDataFeed(oracles[0]))
    })

    it('emits an AddedDataFeed event', async () => {
      const { logs } = await dataFeedOracle.addDataFeed(accounts[6])
      expect(logs[0].event).to.equal('AddedDataFeed')
      expect(logs[0].args.dataFeed).to.equal(accounts[6])
    })
  })

  describe('removeDataFeed()', () => {
    let dataFeedOracle

    beforeEach(async () => {
      dataFeedOracle = await MedianDataFeedOracle.new()
      await dataFeedOracle.initialize(oracles, dataFeedOracleDataSource)
    })

    it('removes existing dataFeed from approvedDataFeeds', async () => {
      expect(await dataFeedOracle.approvedDataFeeds(oracles[0])).to.equal(true)
      await dataFeedOracle.removeDataFeed(oracles[0])
      expect(await dataFeedOracle.approvedDataFeeds(oracles[0])).to.equal(false)
    })

    it('reverts if dataFeed is not an existing dataSource', async () => {
      expect(await dataFeedOracle.approvedDataFeeds(accounts[6])).to.equal(false)
      await shouldFail(dataFeedOracle.removeDataFeed(accounts[6]))
    })

    it('emits a RemoveDataFeed event', async () => {
      const { logs } = await dataFeedOracle.removeDataFeed(oracles[0])
      expect(logs[0].event).to.equal('RemovedDataFeed')
      expect(logs[0].args.dataFeed).to.equal(oracles[0])
    })
  })
})
