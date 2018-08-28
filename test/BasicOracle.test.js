import { toAscii, fromAscii, padRight } from 'web3-utils'
import expectRevert from './helpers/expectRevert'
import expectEvent from './helpers/expectEvent'

const BasicOracle = artifacts.require('BasicOracle')

require('chai').should()

const RESULT = 'hello oracle'

contract('BasicOracle', (accounts) => {
  const dataSource = accounts[1]

  let oracle
  beforeEach(async ()=> {
    oracle = await BasicOracle.new(dataSource)
  })

  it('can set result by owner', async () => {
    await oracle.setResult(RESULT, { from: dataSource })

    const result = await oracle.resultFor(0)
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)

    const isResultSet = await oracle.isResultSet(0)
    isResultSet.should.equal(true)
  })

  it('cannot be set by a different data source', async () => {
    await expectRevert(oracle.setResult(RESULT, { from: accounts[2] }))

    const isResultSet = await oracle.isResultSet(0)
    isResultSet.should.equal(false)
  })

  it('cannot be set twice', async () => {
    await oracle.setResult(RESULT, { from: dataSource })
    await expectRevert(oracle.setResult(RESULT, { from: dataSource }))
  })

  it('should emit ResultSet event', async () => {
    const bytes32Result = padRight(fromAscii(RESULT), 64)
    await expectEvent.inTransaction(
      oracle.setResult(RESULT, { from: dataSource }),
      'ResultSet',
      { _result: bytes32Result, _sender: dataSource }
    )
  })
})
