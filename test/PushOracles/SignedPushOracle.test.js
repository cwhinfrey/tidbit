import { web3 } from '../helpers/w3'

const SignedPushOracle = artifacts.require('SignedPushOracle')
const OracleConsumerMock = artifacts.require('OracleConsumerMock')

require('chai').should()

const RESULT = 'hello oracle'
const RESULT_HASH = web3.utils.soliditySha3(RESULT);

contract('SignedPushOracle', (accounts) => {
  const signer = accounts[1]

  it('calls receiveResult() on OracleConsumer', async () => {
    // Deploy contracts
    const oracleConsumer = await OracleConsumerMock.new()
    const oracle = await SignedPushOracle.new(signer, oracleConsumer.address)

    // Sign and set result hash
    let signature = await web3.eth.sign(RESULT_HASH, signer)
    await oracle.setResult(RESULT_HASH, signature)

    // Get result from oracle consumer
    const result = await oracleConsumer.result()
    result.should.equal(RESULT_HASH)
  })
})
