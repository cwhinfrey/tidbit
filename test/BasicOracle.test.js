import expectRevert from './helpers/expectRevert'

const BasicOracle = artifacts.require('BasicOracle')

require('chai').should()

contract('BasicOracle', (accounts) => {

  it('is initialized with the correct state', async () => {
    const oracle = await BasicOracle.new()
    await expectRevert(oracle.resultFor(0))
    const isResultSet = await oracle.isResultSet()
    isResultSet.should.equal(false)
  })

})
