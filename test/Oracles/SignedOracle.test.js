import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { soliditySha3 } = web3.utils
const { sign } = web3.eth

const SignedOracle = artifacts.require('SignedOracle')

require('chai').should()

const RESULT = soliditySha3('hello oracle')

contract('SignedOracle', (accounts) => {
  const dataSource = accounts[1]

  let oracle, messageHash
  beforeEach(async ()=> {
    oracle = await SignedOracle.new()
    await oracle.initialize(dataSource)
    messageHash = soliditySha3(RESULT, oracle.address);
  })

  it('can set result by data source', async () => {
    const signature = await web3.eth.sign(messageHash, dataSource)
    
    await oracle.setResult(RESULT, signature)
    const result = await oracle.resultFor('0x0')
    result.should.equal(RESULT)
  })

  it('cannot be set by a different data source', async () => {
    const signature = await web3.eth.sign(messageHash, accounts[0])
    await shouldFail(oracle.setResult(RESULT, signature))
  })

  it('cannot be set twice', async () => {
    let signature = await web3.eth.sign(messageHash, dataSource)
    await oracle.setResult(RESULT, signature)
    
    const secondHash = web3.utils.soliditySha3('another result');
    signature = await web3.eth.sign(secondHash, dataSource)
    await shouldFail(oracle.setResult(RESULT, signature))
  })
  
  it('should emit ResultSet event', async () => {
    const signature = await web3.eth.sign(messageHash, dataSource)
    const { logs } = await oracle.setResult(RESULT, signature)
    await expectEvent.inLogs(
      logs,
      'ResultSet',
      { _result: RESULT, _sender: accounts[0] }
    )
  })
})
