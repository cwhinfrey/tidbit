import { encodeCall } from 'zos-lib'

const PushOracleBase = artifacts.require('PushOracleBase')

require('chai').should()

contract('PushOracleBase', (accounts) => {
  const consumer = accounts[2]

  it('is initialized with the correct state', async () => {
    const oracle = await PushOracleBase.new()
    const callData = encodeCall(
        "initialize", 
        ['address', 'uint'],//TODO, should this be 'address' or 'IOracleConsumer'?
        [consumer, 0]
    )
    await oracle.sendTransaction({data: callData})
    const consumerOnChain = await oracle.consumer()
    consumer.should.equal(consumerOnChain)
  })

})
