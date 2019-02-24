import { toAscii, fromAscii, padRight, BN} from 'web3-utils'
import expectRevert from '../helpers/expectRevert'
import expectEvent from '../helpers/expectEvent'

const DataFeedOracleBase = artifacts.require('DataFeedOracleBase')

require('chai').should()

const now = (new Date()).getTime() / 1000;

const DATAFEEDS = new Map([
  [now - 4 * 60 * 60, '4 hours ago'],
  [now - 3 * 60 * 60, '3 hours ago'],
  [now - 2 * 60 * 60, '2 hours ago'],
  [now - 1 * 60 * 60, '1 hour ago'],
  [now, 'now'] // index 5
])

contract('initialize DataFeedOracleBase', (accounts) => {
  const dataSource = accounts[1]

  let oracle
  beforeEach(async ()=> {
    oracle = await DataFeedOracleBase.new()
    await oracle.initialize(dataSource)
  })

  it('can set result by owner', async () => {
    for( var [key, value] of DATAFEEDS ){
      await oracle.setResult(value, key, { from: dataSource });
    }

    const isResultSet = await oracle.isResultSetFor(now)
    isResultSet.should.equal(true)
    const doesIndexExistFor = await oracle.doesIndexExistFor(5)
    doesIndexExistFor.should.equal(true)

    const [resultByIndex, date] = await oracle.resultByIndexFor(5)
    toAscii(resultByIndex).replace(/\u0000/g, '').should.equal('now')
    date.should.be.bignumber.equal(now | 0 )
    const [resultByDate, index] = await oracle.resultByDateFor(now)
    toAscii(resultByDate).replace(/\u0000/g, '').should.equal('now')
    index.should.be.bignumber.equal(5)

    const [lastUpdatedDate, lastUpdatedIndex] = await oracle.lastUpdated()
    lastUpdatedDate.should.be.bignumber.equal(now | 0)
    lastUpdatedIndex.should.be.bignumber.equal(5)
  })

  it('cannot be set by a different data source', async () => {
    await expectRevert(oracle.setResult('now', now, { from: accounts[2] }))

    const isResultSet = await oracle.isResultSetFor(now)
    isResultSet.should.equal(false)
    const doesIndexExistFor = await oracle.doesIndexExistFor(1)
    doesIndexExistFor.should.equal(false)

    await expectRevert(oracle.resultByIndexFor(1))
    await expectRevert(oracle.resultByDateFor(now))
    await expectRevert(oracle.lastUpdated())
  })

  it('cannot be set twice', async () => {
    await oracle.setResult('now', now, { from: dataSource })
    await expectRevert(oracle.setResult('now', now, { from: dataSource }))
  })

  it('cannot set date earlier than last added data feed', async () => {
    await oracle.setResult('now', now, { from: dataSource })
    await expectRevert(oracle.setResult('1 hour ago', now - 1 * 60 * 60, { from: dataSource }))
  })

  it('cannot fetch result with invalid index or date', async () => {
    for( var [key, value] of DATAFEEDS ){
      await oracle.setResult(value, key, { from: dataSource });
    }
    const doesIndexExistFor = await oracle.doesIndexExistFor(7)
    doesIndexExistFor.should.equal(false)
    await expectRevert(oracle.resultByIndexFor(7))

    let isResultSet = await oracle.isResultSetFor(now - 0.5 * 60 * 60)
    isResultSet.should.equal(false)
    await expectRevert(oracle.resultByDateFor(now - 0.5 * 60 * 60))

    isResultSet = await oracle.isResultSetFor(now + 0.5 * 60 * 60)
    isResultSet.should.equal(false)
    await expectRevert(oracle.resultByDateFor(now + 0.5 * 60 * 60))
  })

  it.only('should emit ResultSet event', async () => {
    const bytes32Result = padRight(fromAscii('now'), 64)
    const myValue = now | 0
    console.log(myValue.toString())
    const uint256Result = new BN(padRight(myValue.toString(), 256))
    console.log(uint256Result)
    await expectEvent.inTransaction(
      oracle.setResult('now', now, { from: dataSource }),
      'ResultSet', {
        _result: bytes32Result,
        _date: uint256Result,
        _index: 1,
        _sender: dataSource
      }
    )
  })


})
