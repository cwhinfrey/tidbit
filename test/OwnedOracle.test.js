const { toAscii } = require('web3-utils')
const OwnedOracle = artifacts.require('OwnedOracle')

require('chai').should()

contract('OwnedOracle', (accounts) => {
  it('can set result by owner', async () => {
    const RESULT = 'hello oracle'
    
    const oracle = await OwnedOracle.new()
    await oracle.setResult(RESULT)
    const result = await oracle.result()
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)
  })
})
