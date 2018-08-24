import expectRevert from './helpers/expectRevert'

const OracleBase = artifacts.require('OracleBase')

require('chai').should()

contract('OracleBase', (accounts) => {

  it('is initialized with the correct state', async () => {
    const oracle = await OracleBase.new()
    await expectRevert(oracle.resultFor(0))
    const isResultSet = await oracle.isResultSet()
    isResultSet.should.equal(false)
  })

})
