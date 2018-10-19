import { toAscii, fromAscii } from 'web3-utils'
import expectRevert from '../helpers/expectRevert'
import expectEvent from '../helpers/expectEvent'
import { web3 } from '../helpers/w3'

const MultiOracle = artifacts.require('MultiOracle')

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const RESULT = 'hello oracle1'
const RESULT2 = 'hello oracle2'

contract('MultiOracle', (accounts) => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const dataSource1 = accounts[1]
  const dataSource2 = accounts[2]

  let oracle
  beforeEach(async ()=> {
    oracle = await MultiOracle.new()
    oracle.initialize()
  })

  it('requires a non-null dataSource', async () => {
    await expectRevert(oracle.newOracle(0, ZERO_ADDRESS))
  })

  it('is initialized with the correct state with unset results', async () => {
    await expectRevert(oracle.resultFor(1))
    const isResultSet = await oracle.isResultSet(1)
    isResultSet.should.equal(false)
  })

  it('is initialized with the correct state with unset oracles', async () => {
    const isOracleSet0 = await oracle.isOracleSet(0)
    isOracleSet0.should.equal(false)

    const isOracleSet1 = await oracle.isOracleSet(1)
    isOracleSet1.should.equal(false)
  })

  it('cannot set result for the same id twice', async () => {
    await oracle.newOracle(0, dataSource1)
    await oracle.setResult(0, RESULT, { from: dataSource1 })
    await expectRevert(oracle.setResult(0, RESULT2, { from: dataSource1 }))
  })

  it('cannot set oracle for the same id twice', async () => {
    await oracle.newOracle(0, dataSource1)
    await expectRevert(oracle.newOracle(0, dataSource2))
  })

  it('can set result only by added dataSource', async () => {
    await oracle.newOracle(1, dataSource1)
    await expectRevert(oracle.setResult(1, RESULT, {from : dataSource2}))
    const isResultSet = await oracle.isResultSet(1)
    isResultSet.should.equal(false)

    await oracle.setResult(1, RESULT, {from : dataSource1})
    const result = await oracle.resultFor(1)
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)

    const isResultSetSuccess = await oracle.isResultSet(1)
    isResultSetSuccess.should.equal(true)
  })

  it('should emit ResultSet event', async () => {
    const bytes32Result = fromAscii(RESULT)
    await oracle.newOracle(2, dataSource2)
    await expectEvent.inTransaction(
      oracle.setResult(2, RESULT, { from: dataSource2 }),
      'ResultSet',
      { _result: bytes32Result, _sender: dataSource2 }
    )
  })
  
})
