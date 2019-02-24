import { encodeCall } from 'zos-lib'
const { soliditySha3 } = web3.utils
const { sign } = web3.eth

const SignedPushOracle = artifacts.require('SignedPushOracle')
const OracleConsumerMock = artifacts.require('OracleConsumerMock')

require('chai').should()

const RESULT = soliditySha3('hello oracle')

contract('SignedPushOracle', (accounts) => {
  const signer = accounts[1]

  it('calls receiveResult() on OracleConsumer', async () => {
    // Deploy contracts
    const oracleConsumer = await OracleConsumerMock.new()
    const oracle = await SignedPushOracle.new()
    const initializeData = encodeCall("initialize", ['address', 'address'], [signer, oracleConsumer.address])
    // https://forum.zeppelin.solutions/t/revert-when-calling-initialize-manually/314
    // await oracle.sendTransaction({data: initializeData, from: accounts[0]})
    await web3.eth.sendTransaction({data: initializeData, to: oracle.address, from: accounts[0], gasLimit: 500000})

    // Sign and set result hash
    const messageHash = soliditySha3(RESULT, oracle.address)
    let signature = await sign(messageHash, signer)
    await oracle.setResult(RESULT, signature)
    
    // Get result from oracle consumer
    const result = await oracleConsumer.result()
    result.should.equal(RESULT)
  })
})
