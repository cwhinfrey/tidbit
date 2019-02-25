import { shouldFail } from 'openzeppelin-test-helpers'

const DataFeedOracleBase = artifacts.require('DataFeedOracleBase')
const ORACLE_INDEX_0 = 0
const ORACLE_INDEX_1 = 1

require('chai').should()

contract('initialize DataFeedOracleBase', (accounts) => {
  const dataSource = accounts[1]
  const date = (new Date()).getTime() / 1000;

  it('is initialized with the correct state', async () => {
    const oracle = await DataFeedOracleBase.new()
    await oracle.initialize(dataSource)
    // The data feed oracle base is not supporting ids.
    await shouldFail(oracle.resultByIndexFor(ORACLE_INDEX_1))
    //Valid indexes is non-zero
    await shouldFail(oracle.resultByIndexFor(ORACLE_INDEX_0))

    await shouldFail(oracle.resultByDateFor(date | 0))
    const isResultSetFor = await oracle.isResultSetFor(date | 0)
    isResultSetFor.should.equal(false)
    const doesIndexExistFor = await oracle.doesIndexExistFor(ORACLE_INDEX_1)
    doesIndexExistFor.should.equal(false)

    await shouldFail(oracle.lastUpdated())
  })
})
