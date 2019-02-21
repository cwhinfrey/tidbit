import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { toAscii, fromAscii, soliditySha3 } = web3.utils

const MultiOracle = artifacts.require('MultiOracle')

const RESULT = soliditySha3('hello oracle1')
const RESULT2 = soliditySha3('hello oracle2')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ORACLE_ID_0 = '0x0'
const ORACLE_ID_1 = '0x1'

contract('MultiOracle', (accounts) => {
  const dataSource1 = accounts[1]
  const dataSource2 = accounts[2]

  let oracle
  beforeEach(async ()=> {
    oracle = await MultiOracle.new()
  })

  it('requires a non-null dataSource', async () => {
    await shouldFail(oracle.newOracle(ORACLE_ID_0, ZERO_ADDRESS))
  })

  it('is initialized with the correct state with unset results', async () => {
    await shouldFail(oracle.resultFor(ORACLE_ID_1))
    const isResultSet = await oracle.isResultSet(ORACLE_ID_1)
    isResultSet.should.equal(false)
  })

  it('is initialized with the correct state with unset oracles', async () => {
    const isOracleSet0 = await oracle.isOracleSet(ORACLE_ID_0)
    isOracleSet0.should.equal(false)

    const isOracleSet1 = await oracle.isOracleSet(ORACLE_ID_1)
    isOracleSet1.should.equal(false)
  })

  it('cannot set result for the same id twice', async () => {
    await oracle.newOracle(ORACLE_ID_0, dataSource1)
    await oracle.setResult(ORACLE_ID_0, RESULT, { from: dataSource1 })
    await shouldFail(oracle.setResult(ORACLE_ID_0, RESULT2, { from: dataSource1 }))
  })

  it('cannot set oracle for the same id twice', async () => {
    await oracle.newOracle(ORACLE_ID_0, dataSource1)
    await shouldFail(oracle.newOracle(ORACLE_ID_0, dataSource2))
  })

  it('can set result only by added dataSource', async () => {
    await oracle.newOracle(ORACLE_ID_1, dataSource1)
    await shouldFail(oracle.setResult(ORACLE_ID_1, RESULT, {from : dataSource2}))
    const isResultSet = await oracle.isResultSet(ORACLE_ID_1)
    isResultSet.should.equal(false)

    await oracle.setResult(ORACLE_ID_1, RESULT, {from : dataSource1})
    const result = await oracle.resultFor(ORACLE_ID_1)
    result.should.equal(RESULT)

    const isResultSetSuccess = await oracle.isResultSet(ORACLE_ID_1)
    isResultSetSuccess.should.equal(true)
  })

  it('should emit ResultSet event', async () => {
    await oracle.newOracle(ORACLE_ID_1, dataSource2)
    const { logs } = await oracle.setResult(ORACLE_ID_1, RESULT, { from: dataSource2 })
    await expectEvent.inLogs(
      logs,
      'ResultSet',
      { _result: RESULT, _sender: dataSource2 }
    )
  })
  
})
