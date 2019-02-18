import { toAscii, fromAscii, padRight } from 'web3-utils'
import expectRevert from '../helpers/expectRevert'

const DataFeedOracleBase = artifacts.require('DataFeedOracleBase')

require('chai').should()

contract('initialize DataFeedOracleBase', (accounts) => {
  const dataSource = accounts[1]
  const date = (new Date()).getTime() / 1000;

  let oracle
  beforeEach(async ()=> {
    oracle = await DataFeedOracleBase.new()
    await oracle.initialize(dataSource)
  })

  it('is initialized with the correct state', async () => {
    // The data feed oracle base is not supporting ids.
    await expectRevert(oracle.resultByIndexFor(1, 1))

    //Valid indexes is non-zero
    await expectRevert(oracle.resultByIndexFor(0, 0))

    //No data feed gets set yet
    await expectRevert(oracle.resultByIndexFor(0, 1))
    await expectRevert(oracle.resultByDateFor(0, date))
    const isResultSetFor = await oracle.isResultSetFor(0, date)
    isResultSetFor.should.equal(false)
    const doesIndexExistFor = await oracle.doesIndexExistFor(0, 1)
    doesIndexExistFor.should.equal(false)

    await expectRevert(oracle.lastUpdated(0))
  })
})
