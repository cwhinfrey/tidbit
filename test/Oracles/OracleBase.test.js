import { shouldFail } from 'openzeppelin-test-helpers'

const OracleBase = artifacts.require('OracleBase')

require('chai').should()

const ORACLE_ID = '0x0'

contract('OracleBase', (accounts) => {

  it('is initialized with the correct state', async () => {
    const oracle = await OracleBase.new()
    await shouldFail(oracle.resultFor(ORACLE_ID))
    const isResultSet = await oracle.isResultSet(ORACLE_ID)
    isResultSet.should.equal(false)
  })

})
