const PushOracleBase = artifacts.require('PushOracleBase')

require('chai').should()

contract('PushOracleBase', (accounts) => {
  const consumer = accounts[2]

  it('is initialized with the correct state', async () => {
    const oracle = await PushOracleBase.new(consumer)
    const consumerOnChain = await oracle.consumer()
    consumer.should.equal(consumerOnChain)
  })

})
