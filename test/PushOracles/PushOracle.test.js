const PushOracle = artifacts.require('PushOracle')

require('chai').should()

contract('PushOracle', (accounts) => {
  const handler = accounts[2]

  it('is initialized with the correct state', async () => {
    const oracle = await PushOracle.new(handler)
    const handler = await oracle.handler()
    handler.should.equal(handler)
  })

})
