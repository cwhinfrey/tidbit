import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { soliditySha3, toAscii, fromAscii, padRight } = web3.utils

const BasicOracle = artifacts.require('BasicOracle')

require('chai').should()

const RESULT = soliditySha3('hello oracle')

contract('BasicOracle', (accounts) => {
  const dataSource = accounts[1]

  let oracle
  beforeEach(async ()=> {
    oracle = await BasicOracle.new()
    await oracle.initialize(dataSource)
  })

  it('can set result by owner', async () => {
    await oracle.setResult(RESULT, { from: dataSource })

    const result = await oracle.resultFor('0x0')
    result.should.equal(RESULT)

    const isResultSet = await oracle.isResultSet('0x0')
    isResultSet.should.equal(true)
  })

  it('cannot be set by a different data source', async () => {
    await shouldFail(oracle.setResult(RESULT, { from: accounts[2] }))

    const isResultSet = await oracle.isResultSet('0x0')
    isResultSet.should.equal(false)
  })

  it('cannot be set twice', async () => {
    await oracle.setResult(RESULT, { from: dataSource })
    await shouldFail(oracle.setResult(RESULT, { from: dataSource }))
  })

  it('should emit ResultSet event', async () => {
    const { logs } = await oracle.setResult(RESULT, { from: dataSource })
    await expectEvent.inLogs(
      logs,
      'ResultSet',
      { _result: RESULT, _sender: dataSource }
    )
  })
})
